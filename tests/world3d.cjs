const assert=require('node:assert/strict');const W=require('../dist/world3d.js');let total=0;function test(name,fn){fn();console.log('PASS',name);total++;}
const map=W.makeMap();
test('camera forward vectors rotate in full 3D',()=>{assert.ok(W.direction(0,0)[2]<-.99);assert.ok(W.direction(Math.PI/2,0)[0]>.99);assert.ok(W.direction(0,.5)[1]>.47);});
test('wall collision stops a swept move, including large steps',()=>{const p={x:0,y:0,z:14,height:1.7};const next=W.movePlayer(map,p,-20,0);assert.ok(next.x>-3.6&&next.x<-3.3);});
test('main doorway and side passage form actual connected routes',()=>{let p={x:0,y:0,z:14,height:1.7};p={...p,...W.movePlayer(map,p,0,-9)};assert.ok(p.z<5.1);const side=W.movePlayer(map,{x:0,y:0,z:11,height:1.7},9,0);assert.ok(side.x>8.8);});
test('ramp is continuous and reaches the raised catwalk without teleporting',()=>{let p={x:9,y:0,z:11.1,height:1.7};for(let i=0;i<90;i++){p={...p,...W.movePlayer(map,p,0,-.1)};p.y=W.groundHeight(p.x,p.z);}assert.ok(p.z<2.3);assert.ok(Math.abs(p.y-2)<.01);assert.equal(W.groundHeight(9,-8),2);assert.equal(W.canOccupy(map,7,0,0,1.7),false);});
test('central cover blocks a shot and a real side step opens the sight line',()=>{const head=[0,1.6,-10];assert.equal(W.clearLine(map,[0,1.62,1],head),false);assert.equal(W.clearLine(map,[-2.8,1.62,-1],head),true);});
test('ray hit tests distinguish a head from a miss and reject geometry behind the player',()=>{assert.ok(Math.abs(W.raySphere([0,1.6,5],[0,0,-1],[0,1.6,0],.2)-4.8)<.001);assert.equal(W.raySphere([1,1.6,5],[0,0,-1],[0,1.6,0],.2),Infinity);assert.equal(W.rayBox([0,1,2],[0,0,1],{min:[-1,0,-2],max:[1,2,-1]}),Infinity);});
test('camera view matrices change translation while retaining a perspective projection',()=>{const a=W.view([0,1.6,14],0,0),b=W.view([0,1.6,8],0,0);assert.notEqual(a[14],b[14]);assert.equal(W.perspective(1,16/9)[11],-1);});
console.log(total+' 3D geometry checks completed');
