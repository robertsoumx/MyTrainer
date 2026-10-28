// Adapted from RandomCubeGenerator.ts, MIT ©2025 Freddy Saez.
// freddysae0/threejs-aim-trainer e28148a4de56809a1c0a6fbb7b3f6492fc85e3cb
// Keep the original rejection/non-overlap algorithm; use sphere targets and standard -Z forward.
import {Box3,Vector3} from 'three';
export function generateTargets(count,radius,bounds){
 const targets=[];
 for(let n=0;n<count;n++){
  let target=null;
  for(let attempt=0;attempt<50;attempt++){
   const x=bounds.x[0]+Math.random()*(bounds.x[1]-bounds.x[0]),y=bounds.y[0]+Math.random()*(bounds.y[1]-bounds.y[0]),z=bounds.z[0]+Math.random()*(bounds.z[1]-bounds.z[0]);
   const box=new Box3(new Vector3(x-radius*1.5,y-radius*1.5,z-radius*1.5),new Vector3(x+radius*1.5,y+radius*1.5,z+radius*1.5));
   if(!targets.some(existing=>existing.box.intersectsBox(box))){target={x,y,z,r:radius,box};break;}
  }
  if(target)targets.push(target);
 }
 return targets.map(({box,...target})=>target);
}
