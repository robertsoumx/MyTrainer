import {readFile,access} from 'node:fs/promises';
const html=await readFile('dist/index.html','utf8');
if(/src="(?:world3d|graphics|compat-weapon)\.js/.test(html))throw Error('A legacy 3D renderer is included in the 2D page.');
for(const match of html.matchAll(/(?:src|href)="([^"?#]+)(?:\?[^"#]*)?"/g)){
 const path=match[1];if(path.startsWith('data:')||path.startsWith('http')||path.startsWith('#'))continue;
 await access('dist/'+path);
}
console.log('2D static page and entry assets verified. No 3D bundle required.');
