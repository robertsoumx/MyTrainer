import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {loadTrackedTexture,disposeObjects} from '../src/fps-resources.mjs';

test('range texture readiness stays pending until the image loads',async()=>{
 const pending=[],texture=new T.Texture();let loaded;
 assert.equal(loadTrackedTexture({load(url,onLoad){assert.equal(url,'floor.webp');loaded=onLoad;return texture;}},'floor.webp',pending),texture);
 let ready=false;const all=Promise.all(pending).then(()=>{ready=true;});await Promise.resolve();assert.equal(ready,false);
 loaded(texture);await all;assert.equal(ready,true);
});
test('a failed room texture rejects readiness with an actionable error',async()=>{
 const pending=[];let failed;
 loadTrackedTexture({load(url,onLoad,onProgress,onError){failed=onError;return new T.Texture();}},'wall.webp',pending);
 failed();await assert.rejects(Promise.all(pending),/wall\.webp.*Check your connection and retry/);
});
test('shared model geometry, materials and texture maps are freed once across scenes',()=>{
 const scene=new T.Scene(),weaponScene=new T.Scene(),geometry=new T.BoxGeometry(),texture=new T.Texture(),material=new T.MeshStandardMaterial({map:texture,normalMap:texture});
 scene.add(new T.Mesh(geometry,material));weaponScene.add(new T.Mesh(geometry,[material,material]));
 const counts={geometry:0,material:0,texture:0};for(const [name,obj]of Object.entries({geometry,material,texture}))obj.addEventListener('dispose',()=>counts[name]++);
 disposeObjects(scene,weaponScene);assert.deepEqual(counts,{geometry:1,material:1,texture:1});
});
test('discarded skinned viewmodel frees a shared bone texture only once',()=>{
 const root=new T.Group(),boneTexture=new T.DataTexture(),skeleton=new T.Skeleton([]),material=new T.MeshBasicMaterial({map:boneTexture});skeleton.boneTexture=boneTexture;
 const mesh=new T.SkinnedMesh(new T.BufferGeometry(),material);mesh.skeleton=skeleton;root.add(mesh);
 let disposed=0;boneTexture.addEventListener('dispose',()=>disposed++);disposeObjects(root);assert.equal(disposed,1);assert.equal(skeleton.boneTexture,null);
});
