import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const source=(await readFile(new URL('../dist/sculpture.js',import.meta.url),'utf8')).replace('export function','function')+'\nglobalThis.createSculpture = createSculpture;';

function setup({seed=12345,width=1440,height=900,ratio=3,paused=false}={}) {
 const events=new Map(),timers=new Map();
 let timerId=0,draws=0,frames=0,trig=0,points=[];
 const finite=(...values)=>values.forEach(value=>assert.ok(Number.isFinite(value)));
 const context={
  clearRect(){draws++;points=[]},save(){},restore(){},translate:finite,rotate:finite,scale:finite,setTransform:finite,beginPath(){},
  moveTo(x,y){finite(x,y);points.push(x,y)},lineTo(x,y){finite(x,y);points.push(x,y)},stroke(){},
 };
 const canvas={getContext:()=>context,clientWidth:width,clientHeight:height,style:{}};
 const surface={addEventListener:(name,fn)=>events.set(name,fn),removeEventListener:name=>events.delete(name)};
 const window={...surface,innerWidth:width,innerHeight:height,devicePixelRatio:ratio,scrollY:0,
  setTimeout(fn){timers.set(++timerId,fn);return timerId},clearTimeout(id){timers.delete(id)},
 };
 const document={...surface,hidden:false,documentElement:{...surface,scrollHeight:3000}};
 const math=Object.create(Math);
 for(const method of ['sin','cos'])math[method]=(...args)=>{trig++;return Math[method](...args)};
 const sandbox={window,document,Math:math,Float32Array,requestAnimationFrame(){frames++;return frames},cancelAnimationFrame(){}};
 vm.createContext(sandbox);vm.runInContext(source,sandbox);
 const api=sandbox.createSculpture(canvas,{seed,reducedMotion:paused});
 return {api,canvas,window,document,events,timers,
  stats:()=>({draws,frames,trig}),points:()=>points,
  flush(){const pending=[...timers.values()];timers.clear();pending.forEach(fn=>fn())},
 };
}

test('Cached sculpture performs no animation-frame work or input-triggered redraws',()=>{
 const site=setup(); const initial=site.stats();
 assert.equal(initial.draws,1);
 assert.equal(initial.frames,0);
 assert.equal(site.timers.size,0);
 assert.equal(site.canvas.style.animationPlayState,'running');
 for(let i=0;i<1000;i++) {
  site.window.scrollY=i;
  site.events.get('scroll')?.();
  site.events.get('pointermove')?.({clientX:i,clientY:i,pointerType:'mouse'});
 }
 assert.deepEqual(site.stats(),initial);
 assert.equal(site.events.has('scroll'),false);
 assert.equal(site.events.has('pointermove'),false);
 site.api.destroy();
});

test('Pause, hidden tabs, resume, and cleanup do not redraw the background',()=>{
 const site=setup({paused:true});const initial=site.stats();
 assert.equal(site.canvas.style.animationPlayState,'paused');
 site.api.setPaused(false);assert.equal(site.canvas.style.animationPlayState,'running');
 site.document.hidden=true;site.events.get('visibilitychange')();
 assert.equal(site.canvas.style.animationPlayState,'paused');
 site.document.hidden=false;site.events.get('visibilitychange')();
 assert.equal(site.canvas.style.animationPlayState,'running');
 site.api.setPaused(true);site.events.get('visibilitychange')();
 assert.equal(site.canvas.style.animationPlayState,'paused');
 assert.deepEqual(site.stats(),initial);
 site.events.get('resize')();assert.equal(site.timers.size,1);
 site.api.destroy();site.api.setPaused(false);site.flush();
 assert.equal(site.events.size,0);assert.equal(site.timers.size,0);
 assert.equal(site.canvas.style.animationPlayState,'paused');
 assert.deepEqual(site.stats(),initial);
});

test('Resize bursts draw once after settling and reuse the calculated geometry',()=>{
 const site=setup();const initial=site.stats();const original=site.points();
 site.canvas.clientWidth=320;site.canvas.clientHeight=780;
 for(let i=0;i<100;i++)site.events.get('resize')();
 assert.equal(site.timers.size,1);assert.equal(site.stats().draws,1);
 site.flush();
 assert.equal(site.stats().draws,2);assert.equal(site.stats().trig,initial.trig);
 assert.ok(site.points().length<original.length);
 site.events.get('resize')();site.flush();assert.equal(site.stats().draws,2);
 site.canvas.clientWidth=1440;site.canvas.clientHeight=900;
 site.events.get('resize')();site.flush();
 assert.deepEqual(site.points(),original);assert.equal(site.stats().trig,initial.trig);
 site.api.destroy();
});

test('Random seeds remain reproducible and large displays respect the pixel budget',()=>{
 const first=setup(),same=setup(),other=setup({seed:98765});
 assert.deepEqual(first.points(),same.points());assert.notDeepEqual(first.points(),other.points());
 for(const [width,height] of [[320,780],[1440,900],[3840,2160],[7680,4320]]) {
  const site=setup({width,height});
  assert.ok(site.canvas.width*site.canvas.height<=1600000);
  assert.ok(site.canvas.width>0 && site.canvas.height>0);
  site.api.destroy();
 }
 for(const site of [first,same,other])site.api.destroy();
});

test('Motion defaults prioritize reduced motion, touch, and data saving while respecting explicit choices',async()=>{
 const app=await readFile(new URL('../public/app.js',import.meta.url),'utf8');
 const startup=app.slice(app.indexOf('const root ='),app.indexOf('const sculpture ='))+'\nglobalThis.paused = motionPaused;';
 function initial({reduce=false,touch=false,saveData=false,saved=null}={}) {
  const sandbox={document:{documentElement:{}},navigator:{connection:{saveData}},localStorage:{getItem:()=>saved},matchMedia:query=>({matches:query.includes('reduced-motion')?reduce:touch})};
  vm.createContext(sandbox);vm.runInContext(startup,sandbox);return sandbox.paused;
 }
 assert.equal(initial(),false);
 assert.equal(initial({touch:true}),true);
 assert.equal(initial({saveData:true}),true);
 assert.equal(initial({reduce:true,saved:'playing'}),true);
 assert.equal(initial({touch:true,saved:'playing'}),false);
 assert.equal(initial({saved:'paused'}),true);
});
