(function(root){
 'use strict';
 const distance=(p,q)=>Math.hypot(p.x-q.x,p.z-q.z);
 const packs=[
  {id:'retake',name:'The retake',description:'Clear the defenders. Reach the objective. Finish the defuse.',skills:['positioning','stopfire','clutch'],duration:55,steps:['Clear both marked defenders from cover.','Reach the objective without chasing another fight.','Hold Use to defuse: 5s with a CS2 kit, 7s in VALORANT.']},
  {id:'entry',name:'Trade the entry',description:'Take a supporting angle and act on your teammate’s contact.',skills:['trading','positioning','stopfire'],duration:45,steps:['Reach the support marker. Your teammate will advance.','Wait for the contact cue, then eliminate the defender within 2 seconds.','If the trade window closes, clear the extra defender to recover.']},
  {id:'anchor',name:'Hold, then rotate',description:'Report contact. Keep your site until the objective is confirmed.',skills:['communication','information','positioning'],duration:55,steps:['Stay inside the hold area; report the visible contact with Call.','Wait for “Objective confirmed at B.” Do not rotate on the first contact.','Move through the route marker, then clear the defender at B.']}
 ];
 class RoundSimulation{
  constructor(id,game='cs2'){
   this.pack=packs.find(x=>x.id===id)||packs[0];this.id=this.pack.id;this.game=game;this.time=0;this.stage=this.id==='entry'?'support':this.id==='anchor'?'hold':'clear';this.stageAt=0;this.events=[];this.review=[];this.judged=new Set();this.metrics={};this.finished=false;this.won=false;this.hold=0;this.checkpoint=0;this.objective={x:0,z:-8};this.route={x:5,z:2};this.support={x:-2,z:5};this.ally={x:-1,z:6};this.defuseSeconds=game==='valorant'?7:5;
   this.setTargets(this.id==='entry'?[{id:'entry',x:-3,z:-3}]:this.id==='anchor'?[{id:'contact',x:-3,z:-3}]:[{id:'left',x:-3,z:-3},{id:'right',x:5,z:-5}]);
  }
  setTargets(targets){this.targets=targets;this.events.push({type:'targets',targets:targets.map(x=>({...x}))});}
  drain(){const e=this.events;this.events=[];return e;}
  judge(key,skill,ok,title,detail){if(this.judged.has(key))return;this.judged.add(key);this.review.push({skill,ok,title,detail,at:this.time});const m=this.metrics[skill]||(this.metrics[skill]={success:0,trials:0});m.trials++;m.success+=Number(ok);}
  transition(stage){this.stage=stage;this.stageAt=this.time;}
  finish(won,reason){if(this.finished)return;this.finished=true;this.won=won;this.reason=reason;this.events.push({type:'finish'});}
  recover(reason){this.transition('recover');this.setTargets([...this.targets.filter(x=>x.id!=='contact'),{id:'recovery',x:5,z:-5}]);this.notice=reason;}
  signal(visible){if(this.finished||this.id!=='anchor'||this.stage!=='hold')return;this.judge('call','communication',visible,'Report contact',visible?'You reported a defender while it was visible.':'The call was not supported by a visible defender.');this.called=visible;}
  shot({hit=false,killed=false,targetId,killedIds=[],settled=false}={}){
   if(this.finished)return;
   const m=this.metrics.stopfire||(this.metrics.stopfire={success:0,trials:0});m.trials++;m.success+=Number(hit&&settled);
   if(this.id==='entry'&&['support','advance'].includes(this.stage)){this.judge('trade','trading',false,'Trade timing','You fired before your teammate made contact. A second defender joined the fight.');this.recover('Early shot · clear the second defender.');}
   if(killed){const ids=new Set(killedIds.length?killedIds:[targetId]);this.targets=this.targets.filter(x=>!ids.has(x.id));if(this.id==='entry'&&this.stage==='trade'){this.judge('trade','trading',this.time-this.stageAt<=2,'Trade timing',`You answered contact in ${(this.time-this.stageAt).toFixed(1)}s.`);}
    if(!this.targets.length){if(this.id==='retake'){this.judge('clear','positioning',true,'Clear before committing','Both defenders were cleared before the defuse.');this.transition('defuse');}else if(this.id==='entry'){this.finish(true,'Site cleared.');}else if(this.stage==='fight'||this.stage==='recover'){this.finish(true,'Rotation recovered and site cleared.');}}
   }
  }
  step(dt,input={}){
   if(this.finished)return;dt=Math.max(0,dt);this.time+=dt;const p=input.player||{x:0,z:12};
   if(this.time>=this.pack.duration){this.judge('clock','clutch',false,'Finish within the clock','The round clock expired before the objective was completed.');this.finish(false,'Time expired.');return;}
   if(this.id==='retake'){
    const near=distance(p,this.objective)<1.8;
    if(this.stage==='clear'&&near){this.judge('commit','positioning',false,'Clear the site first','You entered the objective area while a defender remained.');}
    if(input.interact&&this.stage==='clear')this.notice='Clear the defenders before using the objective.';
    if(this.stage==='defuse'){
     if(near&&input.interact&&input.speed<.3){this.hold=Math.min(this.defuseSeconds,this.hold+dt);if(this.game==='valorant'&&this.hold>=3.5)this.checkpoint=3.5;if(this.hold>=this.defuseSeconds){this.judge('defuse','clutch',true,'Use the objective clock','You completed the defuse before time expired.');this.finish(true,'Objective defused.');}}
     else this.hold=this.checkpoint;
    }
   }else if(this.id==='entry'){
    if(this.stage==='support'&&distance(p,this.support)<1.6){this.judge('support','positioning',true,'Find a supporting line','You took the support position before contact.');this.transition('advance');}
    if(this.stage==='advance'){this.ally.z=6-Math.min(1,(this.time-this.stageAt)/2)*4;if(this.time-this.stageAt>=2){this.transition('trade');this.notice='Contact! Trade now.';}}
    if(this.stage==='trade'&&this.time-this.stageAt>2){this.judge('trade','trading',false,'Trade timing','The 2-second contact window closed. A second defender joined.');this.recover('Trade missed · clear the second defender.');}
   }else{
    if(this.stage==='hold'){
     if(distance(p,{x:0,z:12})>3){this.judge('hold','information',false,'Wait for confirmation','You left the hold area before the objective was confirmed.');this.recover('Early rotation · recover the new angle.');}
     else if(this.time>=8){if(!this.judged.has('call'))this.judge('call','communication',false,'Report contact','The visible contact was not reported.');this.judge('hold','information',true,'Wait for confirmation','You kept site coverage until the objective was confirmed.');this.transition('rotate');this.setTargets([{id:'b',x:5,z:-5}]);this.notice='Objective confirmed at B · rotate through the route marker.';}
    }else if(this.stage==='rotate'&&distance(p,this.route)<1.8){this.judge('route','positioning',true,'Clear the rotation route','You used the marked approach before committing to B.');this.transition('fight');if(!this.targets.length)this.finish(true,'Route secured.');}
   }
  }
  objectiveText(){const text={clear:'Clear both defenders',defuse:'Reach the objective · hold Use',support:'Move to the support marker',advance:'Hold fire · teammate advancing',trade:'Contact! Eliminate the defender',hold:'Hold this area · Call visible contact',rotate:'Objective confirmed at B · use the route marker',fight:'Clear the defender at B',recover:'Recover · clear the remaining defenders'};return text[this.stage]||'Round complete';}
  result(){return {won:this.won,reason:this.reason,duration:this.time,review:this.review,metrics:this.metrics,engine:'round2d-v1'};}
 }
 const api={packs,RoundSimulation,distance};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.RoundRules=api;
})(typeof window!=='undefined'?window:globalThis);
