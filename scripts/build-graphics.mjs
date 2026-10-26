import { build } from 'esbuild';
await build({entryPoints:['src/realistic-renderer.js'],bundle:true,format:'iife',globalName:'StratumGraphics',outfile:'dist/graphics.js',minify:true,legalComments:'eof',target:['es2020'],sourcemap:false});
