// Texture loading participates in drill readiness; retain the synchronous texture
// handle that Three.js materials need while tracking its actual completion.
export function loadTrackedTexture(loader,url,pending){
 let resolve,reject;const ready=new Promise((yes,no)=>{resolve=yes;reject=no;});
 pending.push(ready);ready.catch(()=>{});
 try{return loader.load(url,resolve,undefined,()=>reject(new Error('Could not load range texture: '+url+'. Check your connection and retry.')));}
 catch(error){reject(error);throw error;}
}

// Viewmodels may share resources within a GLTF. Dispose each resource once,
// including material maps and skeleton textures, across all supplied scenes.
export function disposeObjects(...roots){
 const geometries=new Set(),materials=new Set(),textures=new Set(),skeletons=new Set();
 for(const root of roots)root?.traverse(o=>{
  if(o.geometry)geometries.add(o.geometry);
  if(o.skeleton)skeletons.add(o.skeleton);
  for(const material of Array.isArray(o.material)?o.material:o.material?[o.material]:[]){
   materials.add(material);for(const value of Object.values(material))if(value?.isTexture)textures.add(value);
  }
 });
 for(const skeleton of skeletons)if(skeleton.boneTexture)textures.add(skeleton.boneTexture);
 for(const texture of textures)texture.dispose();
 for(const skeleton of skeletons){skeleton.boneTexture=null;skeleton.dispose();}
 for(const material of materials)material.dispose();
 for(const geometry of geometries)geometry.dispose();
}
