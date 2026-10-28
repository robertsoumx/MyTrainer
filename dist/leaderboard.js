(function(root){
 'use strict';
 const API=location.hostname==='terminal.local'?location.origin:'https://mytrainer-public-board.qiuchitching.chatgpt.site',KEY='stratum-public-profile-v1';
 function profile(){try{return JSON.parse(localStorage.getItem(KEY))||null;}catch{return null;}}
 function store(value){localStorage.setItem(KEY,JSON.stringify(value));return value;}
 function token(){return [...crypto.getRandomValues(new Uint8Array(32))].map(x=>x.toString(16).padStart(2,'0')).join('');}
 async function request(path,body,method){const p=profile(),control=new AbortController(),timer=setTimeout(()=>control.abort(),12000);try{const response=await fetch(API+path,{method:method||(body?'POST':'GET'),mode:'cors',credentials:'omit',signal:control.signal,headers:{...(body?{'Content-Type':'application/json'}:{}),...(p?.token?{Authorization:'Bearer '+p.token}:{})},body:body?JSON.stringify(body):undefined});const data=await response.json();if(!response.ok)throw Error(data.error||'Leaderboard unavailable. Try again.');return data;}catch(e){if(e.name==='AbortError')throw Error('The leaderboard took too long. Try again.');throw e;}finally{clearTimeout(timer);}}
 async function register(username,consent){if(!consent)throw Error('Confirm that your username and scores will be public.');const prior=profile(),key=prior?.token||token();try{store(prior||{token:key,setupComplete:false,consent:false});}catch{throw Error('Enable device storage before creating a public profile.');}const data=await request('/api/register',{username,publicConsent:true,token:key});return store({id:data.id,username:data.username,token:key,consent:true,setupComplete:true});}
 function device(s){return Stratum.inputMode(s)==='touch'?'touch':s.device==='trackpad'?'trackpad':'mouse';}
 function eligible(s,a){return a.protocol==='benchmark'&&!a.round&&!a.explore&&a.skill.type!=='decision'&&a.level===3&&(s.loadout?.[s.game]||WeaponData.defaults[s.game])===WeaponData.defaults[s.game];}
 function begin(s,a){if(!profile()?.consent||!eligible(s,a))return null;return request('/api/attempts',{game:s.game,input:device(s),skill:a.skill.id,weapon:WeaponData.defaults[s.game],protocol:'2d1'}).catch(error=>({error:error.message}));}
 async function submit(attempt,row){if(!attempt)return null;const issued=await attempt;if(issued.error)throw Error(issued.error);return request('/api/results',{attemptId:issued.id,success:row.success,trials:row.trials,duration:row.duration});}
 async function withdraw(){await request('/api/me',null,'DELETE');const p=profile();store({...p,token:null,id:null,consent:false});}
 const api={API,profile,register,device,eligible,begin,submit,withdraw,board:(game,input)=>request('/api/leaderboard?game='+encodeURIComponent(game)+'&input='+encodeURIComponent(input)+'&protocol=2d1')};root.TrainerBoard=api;
})(window);
