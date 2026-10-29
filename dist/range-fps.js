(function(){
 'use strict';
 const clamp=(n,a,b)=>Math.max(a,Math.min(b,n)),TAU=Math.PI*2;
 class RangeTrainer{
  constructor(canvas,settings,skill,level,duration,callbacks={}){
   if(!Stratum.skills.some(s=>s.id===skill))throw Error('Choose one of the four drills.');
   this.canvas=canvas;this.hud=canvas.parentElement.querySelector('.world-hud');this.ctx=this.hud?.getContext('2d');this.settings={...settings};this.skill=skill;this.level=level;this.duration=duration;this.cb=callbacks;
   this.running=false;this.paused=false;this.dead=false;this.elapsed=0;this.shots=0;this.hits=0;this.trials=0;this.trackSamples=0;this.trackSuccess=0;this.trackAccumulator=0;this.sampleAccumulator=0;this.reaction=[];this.lastShot=-Infinity;this.feedbackUntil=0;this.keys={};this.touch={x:0,y:0};this.fireSources=new Set();this.listeners=[];this.targets=[];this.spawnIndex=0;this.velocity={x:0,z:0};this.player={x:0,y:0,z:10};this.grounded=true;this.moveDistance=0;this.totalDistance=0;this.settled=0;this.pointerId=null;this.autoAccumulator=0;
   this.view=new StratumFPS.FPSWorld(canvas,settings,{skill,onUnlock:()=>this.pause()});this.camera=this.view.camera;
   this.add(canvas,'pointermove',e=>this.look(e));this.add(canvas,'pointerdown',e=>this.down(e));this.add(document,'pointerup',e=>this.up(e));this.add(document,'pointercancel',e=>this.cancelPointer(e));this.add(canvas,'lostpointercapture',e=>this.cancelPointer(e));this.add(canvas,'contextmenu',e=>e.preventDefault());
   this.add(canvas,'webglcontextlost',e=>{e.preventDefault();this.contextLost=true;this.pause();this.cb.error?.('Graphics were interrupted. Restart this drill.');});
   this.add(document,'keydown',e=>this.key(e,true));this.add(document,'keyup',e=>this.key(e,false));this.add(window,'blur',()=>this.pause());this.add(document,'visibilitychange',()=>{if(document.hidden)this.pause();});
   this.resize=()=>{const box=canvas.getBoundingClientRect();this.width=Math.max(2,box.width);this.height=Math.max(2,box.height);this.view.resize(this.width,this.height);this.dpr=Math.min(window.devicePixelRatio||1,2);if(this.hud){this.hud.width=this.width*this.dpr;this.hud.height=this.height*this.dpr;}this.draw();};
   this.observer=new ResizeObserver(this.resize);this.resize();this.observer.observe(canvas);this.spawn();
  }
  add(el,type,fn){el.addEventListener(type,fn,{passive:false});this.listeners.push([el,type,fn]);}
  isTouch(){return Stratum.inputMode(this.settings)==='touch';}
  async prepare(){await this.view.prepare();if(!this.dead){this.view.syncTargets(this.targets);this.draw();}}
  lock(){if(!this.isTouch())this.view.lock();}
  start(){if(this.running||this.dead)return;this.running=true;this.last=performance.now();this.canvas.focus();this.frame=requestAnimationFrame(t=>this.tick(t));this.draw();}
  radius(){return this.skill==='precision'?Math.max(.14,.34-this.level*.022):this.skill==='tracking'?Math.max(.3,.75-this.level*.04):Math.max(.24,.55-this.level*.025);}
  newTarget(last){
   const halfWidth=Math.min(5.7,this.width/this.height*7),r=this.radius();let point;
   for(let attempt=0;attempt<50;attempt++){point=StratumFPS.generateTargets(1,r,{x:[-halfWidth,halfWidth],y:this.skill==='stopfire'?[1.62,1.62]:[1.25,4.4],z:[-7,-7]})[0];if((!last||Math.hypot(point.x-last.x,point.y-last.y)>Math.min(2.4,halfWidth))&&!this.targets.some(t=>t!==last&&Math.hypot(t.x-point.x,t.y-point.y)<r*3))break;}
   if(this.skill==='stopfire'){const limit=15.8-r-.1;point.x=clamp(this.player.x+(this.spawnIndex%2?-1:1)*Math.min(2.3,halfWidth),-limit,limit);}
   return {...point,id:'target-'+this.spawnIndex++,active:true,born:this.elapsed,anchorX:point.x,anchorY:point.y};
  }
  spawn(){this.targets=[];const count=this.skill==='precision'?6:this.skill==='flick'?3:1;for(let i=0;i<count;i++)this.targets.push(this.newTarget());if(this.skill==='flick')this.targets.forEach((t,i)=>t.active=i===0);if(this.skill==='tracking'){Object.assign(this.targets[0],{x:0,y:2.6,anchorX:0,anchorY:2.6});}this.view.syncTargets(this.targets);}
  look(e){if(!this.running||this.paused||document.pointerLockElement===this.canvas)return;
   if(e.pointerType==='touch'){if(e.pointerId!==this.pointerId)return;const dx=e.clientX-this.prevX,dy=e.clientY-this.prevY;this.prevX=e.clientX;this.prevY=e.clientY;this.dragDistance+=Math.hypot(dx,dy);this.view.rotate(dx,dy);e.preventDefault();}
   else{const dx=this.hoverX===undefined?0:e.clientX-this.hoverX,dy=this.hoverY===undefined?0:e.clientY-this.hoverY;this.hoverX=e.clientX;this.hoverY=e.clientY;this.view.rotate(dx,dy);}this.draw();
  }
  down(e){if(!this.running||this.paused||e.button>0)return;e.preventDefault();this.canvas.focus();if(e.pointerType==='touch'){if(this.pointerId!==null)return;this.pointerId=e.pointerId;this.prevX=e.clientX;this.prevY=e.clientY;this.dragDistance=0;try{this.canvas.setPointerCapture(e.pointerId);}catch{}return;}this.advanceTo(this.eventTime(e));if(!this.running)return;this.pressFire(e,'canvas:'+e.pointerId);this.lock();}
  up(e){this.releasePointer(e);if(e.pointerId!==this.pointerId)return;if(this.dragDistance<6&&this.running&&!this.paused){this.fire(e);}this.pointerId=null;}
  cancelPointer(e){this.releasePointer(e);if(e.pointerId===this.pointerId)this.pointerId=null;}
  key(e,down){if(!this.running||/INPUT|SELECT|TEXTAREA/.test(e.target?.tagName))return;const allowed=['KeyW','KeyA','KeyS','KeyD','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','KeyF','Space','Escape'];if(!allowed.includes(e.code))return;e.preventDefault();if(!down){this.keys[e.code]=false;if(e.code==='KeyF')this.releaseFire(e,'keyboard');return;}if(e.code==='Escape'){this.pause();return;}if(this.paused||e.repeat)return;this.advanceTo(this.eventTime(e));this.keys[e.code]=true;if(e.code==='KeyF')this.pressFire(e,'keyboard');if(e.code==='Space'&&this.skill==='stopfire')this.jumpQueued=true;}
  eventTime(e){const now=performance.now();return Number.isFinite(e?.timeStamp)&&Math.abs(e.timeStamp-now)<60000?e.timeStamp:now;}
  pressFire(e,source='keyboard'){if(!this.running||this.paused||this.fireSources.has(source))return;this.advanceTo(this.eventTime(e));const wasHeld=this.fireSources.size>0;this.fireSources.add(source);if(!wasHeld){this.autoAccumulator=0;if(this.skill!=='tracking')this.resolveShot();}this.draw();}
  releaseFire(e,source='keyboard'){if(!this.fireSources.has(source))return;this.advanceTo(this.eventTime(e));this.fireSources.delete(source);if(!this.fireSources.size)this.autoAccumulator=0;}
  releasePointer(e){for(const prefix of ['canvas:','pad:'])this.releaseFire(e,prefix+e.pointerId);}
  cancelFire(){this.fireSources.clear();this.autoAccumulator=0;}
  fire(e){this.pressFire(e,'tap');this.releaseFire(e,'tap');}
  readyToFire(){return this.moveDistance>=.65&&Math.hypot(this.velocity.x,this.velocity.z)<.18&&this.settled>=.065&&this.grounded;}
  resolveShot(){if(!this.running||this.paused||this.skill==='tracking'||this.elapsed>=this.duration||this.elapsed-this.lastShot<.075-1e-7)return false;
   this.shots++;this.trials++;this.lastShot=this.elapsed;const hit=this.view.hit(),index=hit?.id?this.targets.findIndex(t=>t.id===hit.id):-1,target=this.targets[index],valid=!!target&&target.active!==false&&(this.skill!=='stopfire'||this.readyToFire());
   if(valid){this.hits++;this.reaction.push((this.elapsed-target.born)*1000);this.view.impact?.(target,this.elapsed);this.feedback='hit';if(this.skill==='flick'){const old=this.targets.splice(index,1)[0];this.targets.push(this.newTarget(old));this.targets.forEach((t,i)=>{t.active=i===0;if(i===0)t.born=this.elapsed;});}else this.targets[index]=this.newTarget(target);if(this.skill==='stopfire'){this.moveDistance=0;this.settled=0;}this.audio(true);}
   else{this.feedback=this.skill==='stopfire'&&!this.readyToFire()?'Settle first':'miss';this.audio(false);}this.feedbackUntil=this.elapsed+.14;this.view.syncTargets(this.targets);this.cb.update?.(this.stats());this.draw();return valid;
  }
  step(dt){
   if(this.skill==='stopfire'){const forward=(this.keys.KeyW||this.keys.ArrowUp?1:0)-(this.keys.KeyS||this.keys.ArrowDown?1:0)-this.touch.y,strafe=(this.keys.KeyD||this.keys.ArrowRight?1:0)-(this.keys.KeyA||this.keys.ArrowLeft?1:0)+this.touch.x,yaw=this.camera.rotation.y,wish={x:-Math.sin(yaw)*forward+Math.cos(yaw)*strafe,z:-Math.cos(yaw)*forward-Math.sin(yaw)*strafe};this.velocity=TrainerMovement.step(this.velocity,wish,5.2,this.grounded,dt,this.settings.game);}
   const old={...this.player},next=this.view.move(this.velocity,dt,this.jumpQueued);this.jumpQueued=false;if(next)this.player=next;this.grounded=this.view.physics?.grounded===true;const distance=Math.hypot(this.player.x-old.x,this.player.z-old.z);this.moveDistance+=distance;this.totalDistance+=distance;if(Math.hypot(this.velocity.x,this.velocity.z)<.18&&this.grounded)this.settled+=dt;else this.settled=0;
   if(this.skill==='tracking'){const target=this.targets[0],speed=.7+this.level*.16,span=Math.min(4.3,this.width/this.height*4);target.x=Math.sin(this.elapsed*speed)*span;target.y=2.7+Math.sin(this.elapsed*speed*.73)*(.35+this.level*.04);this.view.syncTargets(this.targets);this.sampleAccumulator+=dt;while(this.sampleAccumulator>=.1-1e-9){this.sampleAccumulator-=.1;this.trackSamples++;if(this.fireSources.size&&this.view.hit()?.id===target.id)this.trackSuccess++;}}
   else if(this.settings.triggerMode==='auto'&&this.fireSources.size){this.autoAccumulator+=dt;while(this.autoAccumulator>=.1-1e-9){this.autoAccumulator-=.1;this.resolveShot();}}
  }
  advanceTo(now){if(!this.running||this.paused||this.dead)return;let dt=Math.max(0,(now-this.last)/1000);this.last=Math.max(now,this.last);dt=Math.min(dt,Math.max(0,this.duration-this.elapsed));for(let left=dt;left>1e-8;){const step=Math.min(left,1/120);this.elapsed+=step;this.step(step);left-=step;}if(this.elapsed>=this.duration-1e-7){this.elapsed=this.duration;this.finish();}}
  tick(now){if(!this.running||this.dead)return;this.advanceTo(now);if(!this.running)return;this.draw();if(!this.paused)this.cb.update?.(this.stats());this.frame=requestAnimationFrame(t=>this.tick(t));}
  stats(){const tracking=this.skill==='tracking',success=tracking?this.trackSuccess:this.hits,trials=tracking?this.trackSamples:this.trials,quality=Stratum.quality(this.skill,success,trials,this.elapsed,this.level);return {success,trials,hits:this.hits,shots:this.shots,quality,accuracy:trials?Math.round(success/trials*100):0,duration:this.elapsed,level:this.level,meanMs:this.reaction.length?Math.round(this.reaction.reduce((a,b)=>a+b,0)/this.reaction.length):null,distance:this.totalDistance,engine:'focus4-v1'};}
  draw(){if(this.dead||!this.width)return;this.view.render({active:this.running&&!this.paused,time:this.elapsed});const c=this.ctx,w=this.width,h=this.height;if(c){c.setTransform(this.dpr,0,0,this.dpr,0,0);c.clearRect(0,0,w,h);this.crosshair(c,w/2,h/2);if(this.feedback==='hit'&&this.feedbackUntil>this.elapsed){c.strokeStyle='#d7faff';c.lineWidth=1.4;for(let i=0;i<4;i++){const angle=Math.PI/4+i*Math.PI/2;c.beginPath();c.moveTo(w/2+Math.cos(angle)*14,h/2+Math.sin(angle)*14);c.lineTo(w/2+Math.cos(angle)*19,h/2+Math.sin(angle)*19);c.stroke();}}}
   const cue=this.canvas.parentElement.querySelector('.movement-cue');if(cue){cue.hidden=this.skill!=='stopfire';cue.textContent=this.moveDistance<.65?'Move':this.readyToFire()?'Shoot':'Settle';cue.dataset.ready=String(this.readyToFire());}Object.assign(this.canvas.dataset,{engine:'focus4-v1',renderer:'three-webgl',physics:'rapier-0.21',yaw:this.camera.rotation.y.toFixed(4),pitch:this.camera.rotation.x.toFixed(4),shots:String(this.shots),trials:String(this.trials),elapsed:this.elapsed.toFixed(2),position:[this.player.x,this.player.y,this.player.z].map(n=>n.toFixed(3)).join(','),targets:JSON.stringify(this.targets.map(t=>({id:t.id,...this.view.project(t,w,h),wx:t.x,wy:t.y,wz:t.z,r:t.r,active:t.active})))});
  }
  crosshair(c,x,y){const s=this.settings,n=s.crossSize||5,g=s.crossGap??2,t=s.crossWidth||1.5;c.save();c.strokeStyle=s.crosshair||'#ecf8ff';c.fillStyle=c.strokeStyle;c.lineWidth=t;if(s.crossStyle==='dot'){c.beginPath();c.arc(x,y,t,0,TAU);c.fill();}else if(s.crossStyle==='circle'){c.beginPath();c.arc(x,y,n,0,TAU);c.stroke();}else{c.beginPath();c.moveTo(x-n-g,y);c.lineTo(x-g,y);c.moveTo(x+g,y);c.lineTo(x+n+g,y);c.moveTo(x,y-n-g);c.lineTo(x,y-g);c.moveTo(x,y+g);c.lineTo(x,y+n+g);c.stroke();}c.restore();}
  audio(hit){if(!this.settings.sound)return;try{this.audioContext||=new(window.AudioContext||window.webkitAudioContext)();const c=this.audioContext,o=c.createOscillator(),gain=c.createGain();o.type='sine';o.frequency.setValueAtTime(hit?840:240,c.currentTime);o.frequency.exponentialRampToValueAtTime(hit?560:140,c.currentTime+.035);gain.gain.setValueAtTime(.035,c.currentTime);gain.gain.exponentialRampToValueAtTime(.001,c.currentTime+.045);o.connect(gain);gain.connect(c.destination);o.start();o.stop(c.currentTime+.05);}catch{}}
  pause(){if(!this.running||this.paused)return;this.paused=true;this.cancelFire();this.keys={};this.touch={x:0,y:0};this.pointerId=null;this.view.active=false;this.view.controls.enabled=false;this.view.unlock();this.cb.pause?.();this.draw();}
  resume(){if(!this.running||this.contextLost)return;this.paused=false;this.last=performance.now();this.hoverX=undefined;this.hoverY=undefined;this.canvas.focus();this.lock();this.draw();}
  finish(){if(!this.running)return;this.running=false;this.cancelFire();this.view.active=false;this.view.controls.enabled=false;this.view.unlock();cancelAnimationFrame(this.frame);this.cb.finish?.(this.stats());}
  destroy(){this.dead=true;this.running=false;this.cancelFire();cancelAnimationFrame(this.frame);for(const [el,type,fn]of this.listeners)el.removeEventListener(type,fn);this.observer.disconnect();this.view.destroy();this.audioContext?.close();}
 }
 window.RangeTrainer=RangeTrainer;
})();
