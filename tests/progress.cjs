const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const C=require('../dist/core.js');
let checks=0;
function test(name,fn){try{fn();checks++;console.log('PASS',name);}catch(e){console.error('FAIL',name,e.message);process.exitCode=1;}}
test('exactly four physical drills have distinct identities',()=>assert.equal(new Set(C.skills.map(x=>x.id)).size,4));
test('new profiles contain no fabricated performance',()=>{const s=C.defaults();assert.equal(C.overall(s).value,null);assert.equal(s.sessions.length,0);assert.equal(C.recommendation(s).skill.id,'precision');});
test('scoring bounds and difficulty weighting',()=>{assert.equal(C.score(100,8),100);assert.equal(C.score(100,1),56);assert.equal(C.score(100,3),69);assert.equal(C.score(-20,8),0);assert.equal(C.score(200,8),100);});
test('level promotions and reductions respect all boundaries',()=>{for(let l=1;l<=8;l++){assert.equal(C.nextLevel(l,85),Math.min(8,l+1));assert.equal(C.nextLevel(l,49.9),Math.max(1,l-1));assert.equal(C.nextLevel(l,84),l);}});
function session(overrides={}){return {skill:'precision',context:'cs2:mouse:standard:focus4',at:Date.now(),score:50,quality:70,level:3,nextLevel:3,protocol:'benchmark',duration:30,trials:20,success:14,...overrides};}
test('input methods and games keep separate histories',()=>{const s=C.defaults();s.settings.input='mouse';s.sessions=[session()];assert.equal(C.records(s).length,1);s.settings.device='trackpad';assert.equal(C.records(s).length,0);s.settings.device='mouse';s.settings.game='valorant';assert.equal(C.records(s).length,0);s.settings.game='cs2';s.settings.input='touch';assert.equal(C.records(s).length,0);});
test('weighted recent score does not invent evidence',()=>{const s=C.defaults();s.settings.input='mouse';s.sessions=[session({score:10}),session({score:40}),session({score:70})];const summary=C.summarize(s,'precision');assert.equal(summary.value,50);assert.equal(summary.baseline,10);assert.equal(summary.count,3);});
test('single scenario answers cannot establish a full proficiency baseline',()=>{const s=C.defaults();s.settings.input='mouse';s.sessions=[session({protocol:'scenario',trials:1,success:1,quality:100})];assert.equal(C.summarize(s,'precision'),null);assert.equal(C.overall(s).count,0);});
test('import validates all session measurements',()=>{const s=C.defaults();s.sessions=[session()];assert.equal(C.validate(s).sessions.length,1);for(const invalid of [{score:101},{level:0},{success:50},{context:'cs2:other'},{at:Infinity},{quality:NaN}])assert.throws(()=>C.validate({...s,sessions:[session(invalid)]}));});
test('import sanitizes unsafe settings',()=>{const s=C.defaults();s.settings.accent='red;display:none';s.settings.sensitivity=900;s.settings.theme='evil';const out=C.validate(s);assert.equal(out.settings.accent,'#f17a59');assert.equal(out.settings.sensitivity,3);assert.equal(out.settings.theme,'dark');});
test('Wilson intervals are bounded and respond to sample size',()=>{assert.deepEqual(C.wilson(0,0),[0,100]);assert.equal(C.wilson(0,10)[0],0);assert.equal(C.wilson(10,10)[1],100);assert.ok(C.wilson(100,100)[0]>C.wilson(10,10)[0]);});
test('all four drills are playable and decision skills are not selectable',()=>{assert.deepEqual(C.skills.map(s=>s.id),['precision','flick','tracking','stopfire']);assert.ok(C.skills.every(s=>s.type!=='decision'));});
test('accuracy and pace both contribute to aim quality',()=>{assert.ok(C.quality('precision',20,20,30)>C.quality('precision',5,5,30));assert.ok(C.quality('flick',30,30,30)>C.quality('flick',30,60,30));assert.equal(C.quality('tracking',240,300,30),80);});
test('earlier histories stay importable but never mix with the new protocol',()=>{const s=C.defaults();s.sessions=[session({context:'cs2:mouse:direct:fpsnative1:cs2-ak47'}),session({skill:'economy',context:'cs2:mouse:direct'})];assert.equal(C.validate(s).sessions.length,2);assert.equal(C.records(s).length,0);});
console.log(`${checks} progress checks completed`);
