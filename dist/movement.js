(function(root){
 'use strict';
 // Independently implemented friction/acceleration model; not Source 2 or Riot engine code.
 const profiles={cs2:{friction:5.2,stopSpeed:2.032,accelerate:5.5,airAccelerate:12,airCap:.762,gravity:20.32,jump:7.67},valorant:{friction:9,stopSpeed:2.5,accelerate:12,airAccelerate:6,airCap:1.1,gravity:20,jump:6.5}};
 function step(velocity,wish,topSpeed,grounded,dt,game){const p=profiles[game]||profiles.cs2;let x=velocity.x,z=velocity.z;const speed=Math.hypot(x,z);if(grounded&&speed>0){const next=Math.max(0,speed-Math.max(speed,p.stopSpeed)*p.friction*dt);x*=next/speed;z*=next/speed;}const mag=Math.hypot(wish.x,wish.z);if(mag>.001){const dx=wish.x/mag,dz=wish.z/mag,wanted=topSpeed*Math.min(1,mag),cap=grounded?wanted:Math.min(p.airCap,wanted),add=cap-(x*dx+z*dz);if(add>0){const amount=Math.min(add,(grounded?p.accelerate:p.airAccelerate)*wanted*dt);x+=dx*amount;z+=dz*amount;}}if(Math.abs(x)<.001)x=0;if(Math.abs(z)<.001)z=0;return {x,z};}
 const api={step,profiles};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.TrainerMovement=api;
})(typeof window!=='undefined'?window:globalThis);
