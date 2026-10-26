const assert=require('node:assert/strict'),M=require('../dist/movement.js');let n=0;const test=(name,fn)=>{fn();console.log('PASS',name);n++;};
const run=(v,wish,seconds,game='cs2')=>{for(let t=0;t<seconds;t+=1/120)v=M.step(v,wish,5.4,true,1/120,game);return v;};
test('acceleration approaches the weapon speed without instant teleporting',()=>{const a=M.step({x:0,z:0},{x:0,z:-1},5.4,true,1/120,'cs2');assert.ok(-a.z>0&&-a.z<1);const b=run(a,{x:0,z:-1},1);assert.ok(Math.abs(b.z+5.4)<.01);});
test('ground friction settles a released movement input',()=>{const v=run({x:0,z:-5.4},{x:0,z:0},.5);assert.equal(v.z,0);});
test('counter input arrests movement before continuing in reverse',()=>{const v=run({x:0,z:-5.4},{x:0,z:1},.2);assert.ok(v.z>0);});
test('air input is constrained and game profiles remain distinct',()=>{const v=M.step({x:0,z:0},{x:1,z:0},5.4,false,.1,'cs2');assert.ok(v.x<=M.profiles.cs2.airCap);const a=run({x:0,z:0},{x:1,z:0},.05),b=run({x:0,z:0},{x:1,z:0},.05,'valorant');assert.ok(b.x>a.x);});
console.log(n+' movement checks completed');
