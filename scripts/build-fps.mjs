import {build} from 'esbuild';
await build({entryPoints:['src/fps-engine.js'],bundle:true,format:'iife',globalName:'StratumFPS',outfile:'dist/fps-engine.js',minify:true,legalComments:'eof',target:['es2022']});
console.log('Three.js / Rapier FPS engine built.');
