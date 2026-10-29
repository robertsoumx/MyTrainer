const PROTOCOLS=['v5','2d1','fps1','focus4'];
const FOCUS=['precision','flick','tracking','stopfire'];
const SKILLS=['precision','flick','tracking','switching','placement','stopfire','burst','peek'];
const ORIGINS=new Set(['https://robertsoumx.github.io','http://terminal.local:4173','http://localhost:4173']);
const hex=buffer=>[...new Uint8Array(buffer)].map(x=>x.toString(16).padStart(2,'0')).join('');
const hash=async value=>hex(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value)));
const fail=(message,status=400)=>{throw Object.assign(Error(message),{status});};
function validGroup(game,input){return ['cs2','valorant'].includes(game)&&['mouse','trackpad','touch'].includes(input);}
export function focusQuality(skill,success,trials){if(!trials)return 0;const accuracy=success/trials,rate=skill==='precision'?1.34:skill==='flick'?1.9:.415;return 100*accuracy*(skill==='tracking'?1:.5+.5*Math.min(1,success/(30*rate)));}
export function composite(rows,protocol='v5'){const scores=new Map();for(const row of [...rows].sort((a,b)=>b.created_at-a.created_at)){if(protocol==='focus4'&&!FOCUS.includes(row.skill))continue;const a=scores.get(row.skill)||[];if(a.length<3){a.push(protocol==='focus4'?focusQuality(row.skill,row.success,row.trials):row.success/row.trials*100);scores.set(row.skill,a);}}return {score:Math.round([...scores.values()].reduce((n,a)=>n+a.reduce((s,x)=>s+x,0)/a.length,0)*10/(protocol==='focus4'?4:8)),coverage:scores.size};}
export function validateResult(body,skill,protocol='v5'){const {success,trials,duration}=body,focus=protocol==='focus4',min=skill==='tracking'?(focus?280:50):8,max=skill==='tracking'?(focus?310:330):(focus?401:780);if(!Number.isInteger(trials)||trials<min||trials>max||!Number.isInteger(success)||success<0||success>trials||!Number.isFinite(duration)||duration<29||duration>32)fail('This benchmark needs 30 seconds and '+(skill==='tracking'?'continuous tracking samples.':'at least 8 shots.'));}
const recentRegistrations=new Map();
export default {async fetch(request,env){const url=new URL(request.url),origin=request.headers.get('Origin'),allowed=origin&&ORIGINS.has(origin),cors=allowed?{'Access-Control-Allow-Origin':origin,'Access-Control-Allow-Headers':'Content-Type, Authorization','Access-Control-Allow-Methods':'GET, POST, DELETE, OPTIONS','Vary':'Origin'}:{};
 const respond=(value,status=200)=>new Response(JSON.stringify(value),{status,headers:{'Content-Type':'application/json','Cache-Control':'no-store','X-Content-Type-Options':'nosniff',...cors}});
 try{
  if(origin&&!allowed)return respond({error:'This origin is not allowed.'},403);
  if(request.method==='OPTIONS')return new Response(null,{status:204,headers:{...cors,'Access-Control-Max-Age':'600'}});
  if(url.pathname==='/health')return respond({ok:true,protocol:'focus4',protocols:PROTOCOLS,database:!!env.DB});
  if(url.pathname==='/')return new Response('MyTrainer public leaderboard API. Browser benchmark results are unverified.',{headers:{'Content-Type':'text/plain','Cache-Control':'no-store',...cors}});
  if(!env.DB)fail('Leaderboard storage is unavailable. Try again later.',503);
  if(request.method==='GET'&&url.pathname==='/api/leaderboard'){
   const game=url.searchParams.get('game'),input=url.searchParams.get('input'),protocol=url.searchParams.get('protocol')||'v5';if(!PROTOCOLS.includes(protocol))fail('Choose a supported benchmark protocol.');if(!validGroup(game,input))fail('Choose a game and input profile.');
   const focus=protocol==='focus4',denominator=focus?4:8,minimum=focus?4:3;
   const quality=focus?"CASE WHEN skill='tracking' THEN success*100.0/trials ELSE success*100.0/trials*(0.5+0.5*MIN(1.0,success*1.0/(30*CASE WHEN skill='precision' THEN 1.34 WHEN skill='flick' THEN 1.9 ELSE 0.415 END))) END":"success*100.0/trials";
   const result=await env.DB.prepare(`WITH recent AS (SELECT *,ROW_NUMBER() OVER (PARTITION BY player_id,skill ORDER BY created_at DESC,id DESC) AS rn FROM benchmarks WHERE game=? AND input=? AND protocol=? ${focus?"AND skill IN ('precision','flick','tracking','stopfire')":""}),skill_scores AS (SELECT player_id,skill,AVG(${quality}) AS quality,MAX(created_at) AS updated FROM recent WHERE rn<=3 GROUP BY player_id,skill) SELECT p.username,ROUND(SUM(s.quality)*10.0/${denominator}) AS score,COUNT(*) AS coverage,MAX(s.updated) AS updated FROM skill_scores s JOIN players p ON p.id=s.player_id GROUP BY p.id HAVING COUNT(*)>=${minimum} ORDER BY score DESC,coverage DESC,updated ASC,p.name_key ASC LIMIT 50`).bind(game,input,protocol).all();
   return respond({players:result.results||[],game,input,protocol,updated:Date.now()});
  }
  if(request.method==='POST'&&!request.headers.get('content-type')?.includes('application/json'))fail('Send a JSON request.',415);
  let body={};if(request.method==='POST'){const raw=await request.text();if(raw.length>4096)fail('Request is too large.',413);try{body=JSON.parse(raw);}catch{fail('Invalid JSON.');}}
  if(request.method==='POST'&&url.pathname==='/api/register'){
   const name=String(body.username||'').trim();if(!/^[A-Za-z0-9_]{3,20}$/.test(name))fail('Use 3–20 letters, numbers or underscores.');if(body.publicConsent!==true)fail('Confirm that your username and benchmark scores will be public.');if(!/^[a-f0-9]{64}$/.test(body.token||''))fail('Create a valid device key.');
   const tokenHash=await hash(body.token),existing=await env.DB.prepare('SELECT id FROM players WHERE token_hash=?').bind(tokenHash).first();
   const nameTaken=await env.DB.prepare('SELECT id FROM players WHERE name_key=?').bind(name.toLowerCase()).first();if(nameTaken&&nameTaken.id!==existing?.id)fail('That username is taken. Choose another.',409);
   if(existing){await env.DB.prepare('UPDATE players SET username=?,name_key=? WHERE id=?').bind(name,name.toLowerCase(),existing.id).run();return respond({id:existing.id,username:name});}
   // In-memory abuse throttle uses a transient hash, never a persisted address.
   const address=request.headers.get('CF-Connecting-IP');if(address){const key=await hash(address),now=Date.now(),a=recentRegistrations.get(key)||{since:now,count:0};if(now-a.since>3600000){a.since=now;a.count=0;}if(a.count>=10)fail('Too many new profiles. Try again later.',429);a.count++;recentRegistrations.set(key,a);if(recentRegistrations.size>2048)recentRegistrations.clear();}
   const id=crypto.randomUUID();await env.DB.prepare('INSERT INTO players (id,username,name_key,token_hash,created_at) VALUES (?,?,?,?,?)').bind(id,name,name.toLowerCase(),tokenHash,Date.now()).run();return respond({id,username:name},201);
  }
  const bearer=request.headers.get('Authorization')?.replace(/^Bearer /,'');if(!/^[a-f0-9]{64}$/.test(bearer||''))fail('Set up your public profile first.',401);
  const player=await env.DB.prepare('SELECT id FROM players WHERE token_hash=?').bind(await hash(bearer)).first();if(!player)fail('This public profile is no longer available. Set it up again.',401);
  if(request.method==='DELETE'&&url.pathname==='/api/me'){await env.DB.batch([env.DB.prepare('DELETE FROM benchmarks WHERE player_id=?').bind(player.id),env.DB.prepare('DELETE FROM attempts WHERE player_id=?').bind(player.id),env.DB.prepare('DELETE FROM players WHERE id=?').bind(player.id)]);return respond({removed:true});}
  if(request.method==='POST'&&url.pathname==='/api/attempts'){
   if(!validGroup(body.game,body.input)||!PROTOCOLS.includes(body.protocol)||(body.protocol==='focus4'?(!FOCUS.includes(body.skill)||body.weapon!=='trainer'):(!SKILLS.includes(body.skill)||body.weapon!==(body.game==='cs2'?'cs2-ak47':'valorant-vandal'))))fail('Choose a supported standard benchmark.');
   const prior=await env.DB.prepare('SELECT created_at FROM attempts WHERE player_id=? ORDER BY created_at DESC LIMIT 1').bind(player.id).first();if(prior&&Date.now()-prior.created_at<28000)fail('Finish the current benchmark before starting another public attempt.',429);
   const id=crypto.randomUUID();await env.DB.prepare('INSERT INTO attempts (id,player_id,game,input,skill,protocol,created_at,completed) VALUES (?,?,?,?,?,?,?,0)').bind(id,player.id,body.game,body.input,body.skill,body.protocol,Date.now()).run();return respond({id,startedAt:Date.now()},201);
  }
  if(request.method==='POST'&&url.pathname==='/api/results'){
   const a=await env.DB.prepare('SELECT * FROM attempts WHERE id=? AND player_id=?').bind(String(body.attemptId),player.id).first();if(!a||a.completed)fail('This benchmark is missing or was already submitted.',409);const age=Date.now()-a.created_at;if(age<28000||age>240000)fail('The benchmark timing is invalid. Start a new attempt.');validateResult(body,a.skill,a.protocol);
   await env.DB.batch([env.DB.prepare('INSERT INTO benchmarks (id,attempt_id,player_id,game,input,skill,protocol,success,trials,created_at) VALUES (?,?,?,?,?,?,?,?,?,?)').bind(crypto.randomUUID(),a.id,player.id,a.game,a.input,a.skill,a.protocol,body.success,body.trials,Date.now()),env.DB.prepare('UPDATE attempts SET completed=1 WHERE id=?').bind(a.id)]);return respond({saved:true});
  }
  return respond({error:'Not found.'},404);
 }catch(error){if(String(error.message).includes('UNIQUE constraint'))return respond({error:'This name or attempt was already used.'},409);return respond({error:error.status?error.message:'Leaderboard unavailable. Try again.'},error.status||503);}
}};
