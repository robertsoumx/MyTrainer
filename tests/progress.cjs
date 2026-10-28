const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const C=require('../dist/core.js');
let checks=0;
function test(name,fn){try{fn();checks++;console.log('PASS',name);}catch(e){console.error('FAIL',name,e.message);process.exitCode=1;}}
test('all 16 skill identities are distinct',()=>assert.equal(new Set(C.skills.map(x=>x.id)).size,16));
test('new profiles contain no fabricated performance',()=>{const s=C.defaults();assert.equal(C.overall(s).value,null);assert.equal(s.sessions.length,0);assert.equal(C.recommendation(s).skill.id,'precision');});
test('scoring bounds and difficulty weighting',()=>{assert.equal(C.score(100,8),100);assert.equal(C.score(100,1),56);assert.equal(C.score(100,3),69);assert.equal(C.score(-20,8),0);assert.equal(C.score(200,8),100);});
test('level promotions and reductions respect all boundaries',()=>{for(let l=1;l<=8;l++){assert.equal(C.nextLevel(l,85),Math.min(8,l+1));assert.equal(C.nextLevel(l,49.9),Math.max(1,l-1));assert.equal(C.nextLevel(l,84),l);}});
function session(overrides={}){return {skill:'precision',context:'cs2:mouse:direct:fpsnative1:cs2-ak47',at:Date.now(),score:50,quality:70,level:3,nextLevel:3,protocol:'benchmark',duration:30,trials:20,success:14,...overrides};}
test('input methods and games keep separate histories',()=>{const s=C.defaults();s.settings.input='mouse';s.sessions=[session()];assert.equal(C.records(s).length,1);s.settings.interaction='look';assert.equal(C.records(s).length,0);s.settings.interaction='direct';s.settings.game='valorant';assert.equal(C.records(s).length,0);s.settings.game='cs2';s.settings.input='touch';assert.equal(C.records(s).length,0);});
test('weighted recent score does not invent evidence',()=>{const s=C.defaults();s.settings.input='mouse';s.sessions=[session({score:10}),session({score:40}),session({score:70})];const summary=C.summarize(s,'precision');assert.equal(summary.value,50);assert.equal(summary.baseline,10);assert.equal(summary.count,3);});
test('single scenario answers cannot establish a full proficiency baseline',()=>{const s=C.defaults();s.settings.input='mouse';s.sessions=[session({protocol:'scenario',trials:1,success:1,quality:100})];assert.equal(C.summarize(s,'precision'),null);assert.equal(C.overall(s).count,0);});
test('import validates all session measurements',()=>{const s=C.defaults();s.sessions=[session()];assert.equal(C.validate(s).sessions.length,1);for(const invalid of [{score:101},{level:0},{success:50},{context:'cs2:other'},{at:Infinity},{quality:NaN}])assert.throws(()=>C.validate({...s,sessions:[session(invalid)]}));});
test('import sanitizes unsafe settings',()=>{const s=C.defaults();s.settings.accent='red;display:none';s.settings.sensitivity=900;s.settings.theme='evil';const out=C.validate(s);assert.equal(out.settings.accent,'#f17a59');assert.equal(out.settings.sensitivity,3);assert.equal(out.settings.theme,'dark');});
test('Wilson intervals are bounded and respond to sample size',()=>{assert.deepEqual(C.wilson(0,0),[0,100]);assert.equal(C.wilson(0,10)[0],0);assert.equal(C.wilson(10,10)[1],100);assert.ok(C.wilson(100,100)[0]>C.wilson(10,10)[0]);});
const contentBox={window:{}};vm.createContext(contentBox);vm.runInContext(fs.readFileSync('dist/content.js','utf8'),contentBox);const TC=contentBox.window.TrainingContent;
test('all tactical skills provide six complete answerable tasks',()=>{for(const game of ['cs2','valorant'])for(const s of C.skills.filter(x=>x.type==='decision')){const qs=TC.questions(s.id,game);assert.equal(qs.length,6);for(const q of qs){assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4);assert.ok(q.answer>=0&&q.answer<4);assert.ok(q.why.length>25);}}});
test('higher tactical levels add combined constraints and numeric variation',()=>{for(const s of C.skills.filter(x=>x.type==='decision'))assert.equal(TC.questions(s.id,'cs2',7).filter(q=>q.advanced).length,2);const prompts=new Set();for(let i=0;i<80;i++)for(const q of TC.questions('clutch','valorant',7))if(q.advanced)prompts.add(q.prompt);assert.ok(prompts.size>20);});
test('every skill has a concrete game follow-through',()=>{for(const game of ['cs2','valorant'])for(const s of C.skills)assert.equal(TC.followThrough(s.id,game).length,3);});

console.log(`${checks} progress checks completed`);
