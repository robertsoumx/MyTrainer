// Rapier's maintained kinematic character controller owns contact resolution.
// https://rapier.rs/docs/user_guides/javascript/character_controller/
import RAPIER from '@dimforge/rapier3d-compat';
let initialized;
export async function loadPhysics(){initialized ||=RAPIER.init();await initialized;return RAPIER;}
export class PhysicsStage {
 static async create(options={}){await loadPhysics();return new PhysicsStage(options);}
 constructor({start={x:0,y:.86,z:10},peek=false}={}){
  this.world=new RAPIER.World({x:0,y:-20,z:0});this.world.timestep=1/120;this.targets=new Map();this.solids=[];
  const solid=(x,y,z,hx,hy,hz)=>{const c=this.world.createCollider(RAPIER.ColliderDesc.cuboid(hx,hy,hz).setTranslation(x,y,z));this.solids.push(c);return c;};
  solid(0,-.2,0,16,.2,20);solid(-16,4,0,.2,4,20);solid(16,4,0,.2,4,20);solid(0,4,-20,16,4,.2);solid(0,4,20,16,4,.2);solid(0,8,0,16,.2,20);
  if(peek)solid(0,1.8,4,1.3,1.8,.12);
  this.body=this.world.createRigidBody(RAPIER.RigidBodyDesc.kinematicPositionBased().setTranslation(start.x,start.y,start.z));this.collider=this.world.createCollider(RAPIER.ColliderDesc.capsule(.56,.28),this.body);
  this.controller=this.world.createCharacterController(.015);this.controller.setSlideEnabled(true);this.controller.enableSnapToGround(.12);this.controller.enableAutostep(.22,.3,false);this.controller.setMaxSlopeClimbAngle(Math.PI/4);this.vertical=0;this.grounded=false;this.world.step();
 }
 get position(){return this.body.translation();}
 step(velocity,dt=1/120,jump=false){this.world.timestep=dt;if(jump&&this.grounded)this.vertical=6.6;this.vertical-=20*dt;
  this.controller.computeColliderMovement(this.collider,{x:velocity.x*dt,y:this.vertical*dt,z:velocity.z*dt},undefined,undefined,c=>!this.targets.has(c.handle));const move=this.controller.computedMovement(),p=this.position;this.grounded=this.controller.computedGrounded();if(this.grounded&&this.vertical<0)this.vertical=0;this.body.setNextKinematicTranslation({x:p.x+move.x,y:p.y+move.y,z:p.z+move.z});this.world.step();return this.position;
 }
 setTargets(targets){const ids=new Set(targets.map(t=>t.id));for(const [handle,t]of this.targets)if(!ids.has(t.id)){this.world.removeCollider(t.collider,true);this.targets.delete(handle);}for(const t of targets){let item=[...this.targets.values()].find(x=>x.id===t.id);if(!item){const c=this.world.createCollider(RAPIER.ColliderDesc.ball(t.r).setTranslation(t.x,t.y,t.z));item={id:t.id,collider:c};this.targets.set(c.handle,item);}else item.collider.setTranslation({x:t.x,y:t.y,z:t.z});}this.world.propagateModifiedBodyPositionsToColliders();this.world.step();}
 cast(origin,direction){const hit=this.world.castRayAndGetNormal(new RAPIER.Ray(origin,direction),100,true,undefined,undefined,this.collider);if(!hit)return null;return {id:this.targets.get(hit.collider.handle)?.id||null,distance:hit.timeOfImpact,point:{x:origin.x+direction.x*hit.timeOfImpact,y:origin.y+direction.y*hit.timeOfImpact,z:origin.z+direction.z*hit.timeOfImpact},normal:hit.normal};}
 dispose(){this.world.free();}
}
