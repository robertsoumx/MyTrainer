(function(root){
 'use strict';
 // Predictable trainer kinematics. These are independent profiles, not native game engines.
 const profiles={cs2:{accelerate:34,brake:42,counter:58,airAccelerate:3,airCap:.762,gravity:20.32,jump:7.67},valorant:{accelerate:46,brake:56,counter:56,airAccelerate:2.5,airCap:1.1,gravity:20,jump:6.5}};
 function step(velocity,wish,topSpeed,grounded,dt,game){const p=profiles[game]||profiles.cs2,mag=Math.hypot(wish.x,wish.z),length=Math.max(1,mag),desired={x:wish.x/length*topSpeed,z:wish.z/length*topSpeed};let x=velocity.x,z=velocity.z;
  if(grounded){const dx=desired.x-x,dz=desired.z-z,distance=Math.hypot(dx,dz),opposed=x*desired.x+z*desired.z<0,rate=mag<.001?p.brake:opposed?p.counter:p.accelerate,amount=Math.min(distance,rate*Math.max(0,dt));if(distance>0){x+=dx/distance*amount;z+=dz/distance*amount;}}
  else if(mag>.001){const nx=wish.x/mag,nz=wish.z/mag,add=Math.min(p.airCap,topSpeed)-(x*nx+z*nz),amount=Math.min(Math.max(0,add),p.airAccelerate*Math.max(0,dt));x+=nx*amount;z+=nz*amount;}
  if(Math.abs(x)<.001)x=0;if(Math.abs(z)<.001)z=0;return {x,z};
 }
 const api={step,profiles};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.TrainerMovement=api;
})(typeof window!=='undefined'?window:globalThis);
