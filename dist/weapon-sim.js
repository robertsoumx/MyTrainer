(function(root){
 'use strict';
 const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
 class WeaponSimulation {
  constructor(weapon){
   if(!weapon)throw Error('Choose a weapon before starting.');
   this.time=0;this.weapon=weapon;this.mag=weapon.mag;this.reserve=weapon.reserve??weapon.mag*3;this.inventory={};this.nextShot=0;this.equipUntil=0;this.reloadEnd=0;this.reloadStart=0;this.trigger=false;this.ads=false;this.zoom=0;this.altMode=false;this.burst=0;this.burstUntil=0;this.punch={x:0,y:0};this.heat=0;this.shotIndex=0;this.lastShot=-100;this.events=[];this.lastWeapon=null;
  }
  select(weapon){
   if(!weapon||weapon.id===this.weapon.id)return false;
   this.inventory[this.weapon.id]={mag:this.mag,reserve:this.reserve};this.lastWeapon=this.weapon.id;this.weapon=weapon;const saved=this.inventory[weapon.id];this.mag=saved?.mag??weapon.mag;this.reserve=saved?.reserve??weapon.reserve??weapon.mag*3;this.equipUntil=this.time+(weapon.equip||.6);this.nextShot=this.equipUntil;this.reloadEnd=0;this.trigger=false;this.ads=false;this.zoom=0;this.altMode=false;this.burst=0;this.punch={x:0,y:0};this.heat=0;this.shotIndex=0;return true;
  }
  ready(){return this.time+1e-8>=this.equipUntil&&this.time+1e-8>=this.reloadEnd&&this.time+1e-8>=this.nextShot&&this.mag>0;}
  press(state={}){const edge=!this.trigger;this.trigger=true;if(edge&&this.reloadEnd>this.time&&this.weapon.reloadStyle==='shell'&&this.mag>0)this.reloadEnd=0;if(edge)this.shoot(state);return this.drain();}
  release(){this.trigger=false;}
  alternate(state={}){
   if(this.time<this.equipUntil||this.time<this.reloadEnd)return [];
   const type=this.weapon.altFire?.type;
   if(type==='scope'){const steps=this.weapon.scopeZoom||[2.5];this.zoom=(this.zoom+1)%(steps.length+1);this.ads=this.zoom>0;}
   else if(type==='burst'||type==='silencer'){this.altMode=!this.altMode;}
   else if(type==='fan'||type==='shotgun'||type==='airburst'){this.shoot({...state,secondary:true});}
   else if(this.weapon.ads){this.ads=!this.ads;this.zoom=this.ads?1:0;}
   return this.drain();
  }
  reload(){
   if(this.reloadEnd>this.time||this.equipUntil>this.time||this.mag>=this.weapon.mag||this.reserve<=0)return false;
   this.reloadStart=this.time;this.reloadEnd=this.time+(this.weapon.reloadStyle==='shell'?(this.weapon.shellReload||this.weapon.reload):this.weapon.reload||2.5);this.burst=0;this.trigger=false;this.ads=false;this.zoom=0;return true;
  }
  shoot(state={}){
   if(!this.ready())return false;
   const w=this.weapon,alt=w.altFire,burstMode=(this.altMode&&alt?.type==='burst')||(this.ads&&alt?.type==='ads'&&alt.count>1),secondary=state.secondary===true;
   let pellets=w.pellets||1,cost=1;
   if(secondary&&(alt?.type==='fan'||alt?.type==='shotgun')){pellets=alt.pellets||alt.count||3;if(w.category==='pistol'){cost=Math.min(this.mag,pellets);pellets=cost;}}
   this.mag-=cost;
   const rate=this.ads&&w.scopedRate?w.scopedRate:w.rate||5;
   this.nextShot=this.time+1/Math.max(.2,secondary&&alt?.rate?alt.rate:rate);
   if(burstMode&&!state.continuation){this.burst=Math.min(this.mag,(alt?.count||3)-1);this.burstUntil=this.time+(alt?.cycle||1/(alt?.rate||rate));this.nextShot=this.time+1/(alt?.rate||rate);}
   else if(state.continuation){this.nextShot=this.time+1/(alt?.rate||rate);if(this.burst<=1)this.nextShot=Math.max(this.nextShot,this.burstUntil);}
   const previousHeat=this.heat,shotPunch={...this.punch};this.shotIndex=this.time-this.lastShot>.45?0:this.shotIndex+1;this.lastShot=this.time;this.heat=clamp(this.heat+.13,0,1);
   const r=w.recoil||{},pitch=r.pitch||.0045,yaw=r.yaw||.0022;this.punch.y=clamp(this.punch.y+pitch*(.65+Math.min(this.shotIndex,12)*.055),0,.14);this.punch.x=clamp(this.punch.x+Math.sin(this.shotIndex*.75+(w.id.length%4))*yaw,-.08,.08);
   const acc=w.accuracy||{},moving=clamp(state.speedRatio||0,0,1),base=this.ads?(acc.scoped??acc.stand??.002):state.crouched?(acc.crouch??acc.stand??.002):(acc.stand??.003);
   let spread=base+(acc.move??.045)*moving+(state.grounded===false?(acc.jump??.075):0)+(acc.fire??.008)*previousHeat;if(this.ads)spread*=.75;
   this.events.push({type:'shot',weapon:w,time:this.time,pellets,spread:Math.max(0,spread),secondary,punch:shotPunch,index:this.shotIndex,suppressed:alt?.type==='silencer'?!this.altMode:w.silenced===true});
   if(w.unzoomAfterShot&&this.ads){this.ads=false;this.zoom=0;}
   return true;
  }
  advanceTo(at){
   // Recover only over the portion of this interval after the recovery delay.
   const start=Math.max(this.time,this.lastShot+.16),recoverDt=Math.max(0,at-start);
   if(recoverDt){const decay=Math.exp(-3/(this.weapon.recoil?.recover||.3)*recoverDt);this.punch.x*=decay;this.punch.y*=decay;this.heat=Math.max(0,this.heat-recoverDt*1.6);}
   this.time=at;
  }
  update(dt,state={}){
   const end=this.time+Math.max(0,dt);let guard=0;
   while(guard++<512){
    const automatic=this.trigger&&this.weapon.fireMode==='auto'&&!(this.altMode&&this.weapon.altFire?.type==='burst');
    const reloadAt=this.reloadEnd||Infinity,fireAt=(this.burst>0||automatic)&&this.mag>0?Math.max(this.time,this.nextShot,this.equipUntil,this.reloadEnd||0):Infinity;
    const at=Math.min(reloadAt,fireAt);if(at>end+1e-8)break;this.advanceTo(Math.max(this.time,at));
    if(reloadAt<=fireAt){const amount=Math.min(this.weapon.reloadStyle==='shell'?1:this.weapon.mag-this.mag,this.reserve);this.mag+=amount;this.reserve-=amount;this.reloadEnd=0;if(this.weapon.reloadStyle==='shell'&&this.mag<this.weapon.mag&&this.reserve>0){this.reloadStart=this.time;this.reloadEnd=this.time+(this.weapon.shellReload||this.weapon.reload);}}
    else {const pending=this.burst;if(!this.shoot({...state,continuation:pending>0}))break;if(pending>0)this.burst=pending-1;}
   }
   this.advanceTo(Math.max(this.time,end));return this.drain();
  }
  drain(){const e=this.events;this.events=[];return e;}
  get zoomFactor(){if(!this.ads)return 1;if(this.weapon.altFire?.type==='scope')return this.weapon.scopeZoom?.[Math.max(0,this.zoom-1)]||2.5;return this.weapon.scopeZoom?.[0]||1.25;}
  get reloadProgress(){return this.reloadEnd?clamp((this.time-this.reloadStart)/(this.reloadEnd-this.reloadStart),0,1):0;}
  get equipProgress(){return clamp(1-(this.equipUntil-this.time)/(this.weapon.equip||.6),0,1);}
  damage(kind,distance,armor=true){const w=this.weapon,bands=w.damageRanges||[{min:0,max:100,head:140,body:35,leg:28}],band=bands.find(b=>distance>=(b.min??0)&&distance<=(b.max??Infinity))||bands[bands.length-1];let amount=kind==='head'?band.head:kind==='leg'?band.leg:band.body;const m=w.damageModel;if(w.game==='cs2'&&m?.rangeModifier)amount*=Math.pow(m.rangeModifier,distance/12.7);if(armor&&w.game==='cs2'&&kind!=='leg'){const ratio=m?.armorRatio??w.armorRatio??1.55;amount*=Math.min(1,ratio*.5);}return Math.max(0,Math.round(amount));}
 }
 // A single immediate impulse with a monotonic return: no delayed second lift.
 function shotEnvelope(time,lastShot){const age=time-lastShot;return age<0||age>.4?0:Math.exp(-age*24);}
 const api={WeaponSimulation,clamp,shotEnvelope};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.WeaponSim=api;
})(typeof window!=='undefined'?window:globalThis);
