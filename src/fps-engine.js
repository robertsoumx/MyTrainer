import * as T from 'three';
import {PointerLockControls} from 'three/addons/controls/PointerLockControls.js';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {UnrealBloomPass} from 'three/addons/postprocessing/UnrealBloomPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';
import {PhysicsStage} from './fps-physics.mjs';
import {disposeObjects} from './fps-resources.mjs';
export {generateTargets} from './vendor/TargetGenerator.js';
export const colors={precision:0x48d9fa,flick:0x9c9bff,tracking:0x55ecc9,stopfire:0xffc278};
export class FPSWorld {
 constructor(canvas,settings,{skill='precision',onUnlock=()=>{}}={}){
  this.canvas=canvas;this.settings=settings;this.dead=false;this.nodes=new Map();this.effects=[];this.aimMode='free';this.color=new T.Color(colors[skill]||colors.precision);
  this.renderer=new T.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance'});this.renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));this.renderer.outputColorSpace=T.SRGBColorSpace;this.renderer.toneMapping=T.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1;
  this.scene=new T.Scene();this.scene.background=new T.Color(0x101b30);this.scene.fog=new T.Fog(0x101b30,32,65);this.camera=new T.PerspectiveCamera(settings.fov||64,1,.05,100);this.camera.position.set(0,1.62,10);this.camera.rotation.order='YXZ';
  this.controls=new PointerLockControls(this.camera,canvas);this.controls.pointerSpeed=settings.sensitivity||1;this.controls.minPolarAngle=.16;this.controls.maxPolarAngle=Math.PI-.16;this.controls.enabled=false;
  this.controls.addEventListener('lock',()=>{this.aimMode='captured';});this.controls.addEventListener('unlock',()=>{this.aimMode='free';if(this.active)onUnlock();});
  this.scene.add(new T.HemisphereLight(0xcce8ff,0x15243d,3));const light=new T.DirectionalLight(0xd3e4ff,2.4);light.position.set(-5,9,10);this.scene.add(light);this.room();
  this.composer=new EffectComposer(this.renderer);this.composer.renderTarget1.samples=this.composer.renderTarget2.samples=Math.min(4,this.renderer.capabilities.maxSamples);this.composer.addPass(new RenderPass(this.scene,this.camera));this.bloom=new UnrealBloomPass(new T.Vector2(1,1),settings.reduced?.12:.32,.5,1);this.composer.addPass(this.bloom);this.composer.addPass(new OutputPass());
  this.ready=PhysicsStage.create().then(physics=>{if(this.dead){physics.dispose();return;}this.physics=physics;});
 }
 room(){
  const wall=new T.MeshStandardMaterial({color:0x263650,roughness:1}),ceiling=new T.MeshStandardMaterial({color:0x17263f,roughness:1});
  const plane=(w,h,x,y,z,rx,ry,material)=>{const mesh=new T.Mesh(new T.PlaneGeometry(w,h),material);mesh.position.set(x,y,z);mesh.rotation.set(rx,ry,0);this.scene.add(mesh);return mesh;};
  const floor=new T.ShaderMaterial({extensions:{derivatives:true},uniforms:{},vertexShader:'varying vec3 vWorld; void main(){vec4 p=modelMatrix*vec4(position,1.);vWorld=p.xyz;gl_Position=projectionMatrix*viewMatrix*p;}',fragmentShader:'varying vec3 vWorld; void main(){vec2 p=vWorld.xz/2.;vec2 g=abs(fract(p-.5)-.5)/fwidth(p);float line=1.-min(min(g.x,g.y),1.);float fade=1.-smoothstep(9.,40.,length(vWorld.xz-vec2(0.,10.)));vec3 base=mix(vec3(.033,.059,.103),vec3(.064,.105,.168),clamp((vWorld.z+20.)/40.,0.,1.));gl_FragColor=vec4(base+vec3(.026,.045,.071)*line*fade,1.);\n#include <tonemapping_fragment>\n#include <colorspace_fragment>\n}'});
  // Measuring grid is a world-space surface, never an overlay on the interface.
  plane(32,40,0,0,0,-Math.PI/2,0,floor);plane(32,8,0,4,-20,0,0,wall);plane(40,8,-16,4,0,0,Math.PI/2,wall);plane(40,8,16,4,0,0,-Math.PI/2,wall);plane(32,8,0,4,20,0,Math.PI,wall);plane(32,40,0,8,0,Math.PI/2,0,ceiling);
  const line=(points,color=0x426181)=>{const geo=new T.BufferGeometry().setFromPoints(points.map(p=>new T.Vector3(...p)));this.scene.add(new T.Line(geo,new T.LineBasicMaterial({color})));};
  for(const z of [-20,-10,0,10,20])line([[-16,0,z],[-16,8,z],[16,8,z],[16,0,z]]);
  const glow=new T.MeshBasicMaterial({color:new T.Color(0x53c8f0).multiplyScalar(1.8)});plane(29,.035,0,.12,-19.98,0,0,glow);plane(28,.035,0,6.3,-19.98,0,0,glow);plane(.035,6.2,-14,3.2,-19.97,0,0,glow);plane(.035,6.2,14,3.2,-19.97,0,0,glow);
  for(const x of [-15.9,15.9])plane(.04,36,x,.008,0,-Math.PI/2,0,glow);
 }
 async prepare(){await this.ready;}
 resize(w,h){this.renderer.setSize(w,h,false);this.composer.setSize(w,h);this.camera.aspect=w/h;this.camera.updateProjectionMatrix();}
 rotate(dx,dy){const s=(this.settings.sensitivity||1)*.002;this.camera.rotation.y-=dx*s;this.camera.rotation.x=T.MathUtils.clamp(this.camera.rotation.x-dy*s,-1.4,1.4);this.camera.updateMatrixWorld();}
 lock(){try{const p=this.canvas.requestPointerLock?.();p?.catch?.(()=>{this.aimMode='free';});}catch{this.aimMode='free';}}
 unlock(){if(document.pointerLockElement===this.canvas)document.exitPointerLock();}
 syncTargets(targets){if(!this.physics)return;const ids=new Set(targets.map(t=>t.id));for(const [id,node]of this.nodes)if(!ids.has(id)){this.scene.remove(node);disposeObjects(node);this.nodes.delete(id);}for(const target of targets){let mesh=this.nodes.get(target.id);if(!mesh){mesh=new T.Mesh(new T.SphereGeometry(target.r,40,28),new T.MeshStandardMaterial({color:this.color,emissive:this.color,emissiveIntensity:.7,roughness:.32,metalness:.05}));this.scene.add(mesh);this.nodes.set(target.id,mesh);}mesh.position.set(target.x,target.y,target.z);const active=target.active!==false;mesh.material.color.copy(active?this.color:new T.Color(0x425c82));mesh.material.emissive.copy(active?this.color:new T.Color(0x102139));mesh.material.emissiveIntensity=active?.7:.15;}this.physics.setTargets(targets);this.scene.updateMatrixWorld(true);}
 impact(target,time){if(this.settings.reduced)return;const mesh=new T.Mesh(new T.RingGeometry(target.r*.75,target.r*.85,48),new T.MeshBasicMaterial({color:this.color,transparent:true,opacity:.8,depthWrite:false,side:T.DoubleSide}));mesh.position.set(target.x,target.y,target.z);mesh.quaternion.copy(this.camera.quaternion);this.scene.add(mesh);this.effects.push({mesh,time});}
 project(t,w,h){this.camera.updateMatrixWorld();const p=new T.Vector3(t.x,t.y,t.z).project(this.camera);return {x:(p.x*.5+.5)*w,y:(-.5*p.y+.5)*h};}
 hit(){this.camera.updateMatrixWorld();return this.physics?.cast(this.camera.position,new T.Vector3(0,0,-1).applyQuaternion(this.camera.quaternion));}
 visible(t){this.camera.updateMatrixWorld();const p=new T.Vector3(t.x,t.y,t.z).project(this.camera);return Math.abs(p.x)<.96&&Math.abs(p.y)<.94&&p.z>0&&p.z<1;}
 move(velocity,dt,jump=false){if(!this.physics)return;const p=this.physics.step(velocity,dt,jump);this.camera.position.set(p.x,p.y+.76,p.z);return {x:p.x,y:p.y-.84,z:p.z};}
 render({active,time=0}={}){this.active=!!active;this.controls.enabled=!!active;for(const effect of [...this.effects]){const age=time-effect.time;if(age>.18){this.scene.remove(effect.mesh);disposeObjects(effect.mesh);this.effects.splice(this.effects.indexOf(effect),1);}else{effect.mesh.scale.setScalar(1+age*3);effect.mesh.material.opacity=Math.max(0,.8*(1-age/.18));}}this.composer.render();}
 destroy(){this.dead=true;this.active=false;this.controls.dispose();this.unlock();this.physics?.dispose();disposeObjects(this.scene);for(const pass of this.composer.passes)pass.dispose?.();this.composer.dispose();this.renderer.dispose();}
}
