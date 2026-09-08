import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import { resolve, join, dirname } from 'node:path';
import vm from 'node:vm';

const dist = resolve(import.meta.dirname, '../dist');
async function files(dir) {
 const entries=await readdir(dir,{withFileTypes:true});
 return (await Promise.all(entries.map(e=>e.isDirectory()?files(join(dir,e.name)):[join(dir,e.name)]))).flat();
}
test('Every generated internal link, anchor, and asset has a destination', async()=>{
 const all=await files(dist);const htmlFiles=all.filter(p=>p.endsWith('.html'));
 assert.equal(htmlFiles.length,9);
 for(const file of htmlFiles){
  const html=await readFile(file,'utf8');
  const paths=[...html.matchAll(/(?:href|src)="([^"]+)"/g)].map(m=>m[1]);
  for(const href of paths){
   if(!href.startsWith('/')&&!href.startsWith('#'))continue;
   const url=new URL(href,'https://johnsurles.com'+file.slice(dist.length).replaceAll('\\','/').replace(/index\.html$/,''));
   let target=join(dist,decodeURIComponent(url.pathname));
   const info=await stat(target).catch(()=>null);assert.ok(info,`${file}: missing ${href}`);
   if(info.isDirectory())target=join(target,'index.html');
   await stat(target);
   if(url.hash){const page=await readFile(target,'utf8');assert.ok(page.includes(`id="${url.hash.slice(1)}"`),`Missing anchor ${href}`);}
  }
 }
});
test('Pages carry usable content, unique titles, canonical URLs, and a single main heading without JavaScript', async()=>{
 const all=(await files(dist)).filter(p=>p.endsWith('index.html')&&!p.includes(`${join('personal','index.html')}`));
 const titles=new Set();
 for(const file of all){
  const html=await readFile(file,'utf8');
  assert.equal([...html.matchAll(/<h1[ >]/g)].length,1);
  assert.match(html,/<main id="main"/);
  assert.match(html,/<html lang="en"/);
  assert.match(html,/<link rel="canonical" href="https:\/\/johnsurles.com/);
  assert.match(html,/<meta name="description" content="[^"]{30,}"/);
  const title=html.match(/<title>(.*?)<\/title>/)[1];assert.ok(!titles.has(title));titles.add(title);
  assert.ok(!html.includes('href="#"'));
  assert.ok(!/lorem ipsum|TODO|placeholder/i.test(html));
  assert.equal([...html.matchAll(/aria-current="page"/g)].length,1);
 }
 assert.equal(titles.size,7);
});
test('Research plans remain explicit, and every external contribution links to a merged PR',async()=>{
 const research=await readFile(join(dist,'research/index.html'),'utf8');
 assert.match(research,/one of three student groups under faculty supervision/);
 assert.match(research,/<strong>Planned work:<\/strong> system testing, evaluation, and preparation for publication/);
 const work=await readFile(join(dist,'work/index.html'),'utf8');
 for(const reference of ['microsoft/PowerToys/pull/49402','NASA-AMMOS/MMGIS/pull/1029','unhappychoice/gittype/pull/478','pingdotgg/t3code/pull/4133','omnigent-ai/omnigent/pull/3661'])assert.ok(work.includes(reference));
 const pdf=await readFile(join(dist,'John-Surles-Resume.pdf'));assert.equal(pdf.subarray(0,4).toString(),'%PDF');
 assert.equal((await readFile(join(dist,'CNAME'),'utf8')).trim(),'johnsurles.com');
});
test('Line sculpture respects reduced motion, caps resolution, renders finite geometry, and cleans up',async()=>{
 const source=(await readFile(join(dist,'sculpture.js'),'utf8')).replace('export function','function')+'\nglobalThis.createSculpture = createSculpture;';
 let scheduled=0,cancelled=0,draws=0;const listeners=new Map();
 const check=(...values)=>{for(const value of values)assert.ok(Number.isFinite(value));};
 const context={clearRect:check,save(){},restore(){},translate:check,rotate:check,scale:check,setTransform:check,beginPath(){},moveTo:check,lineTo:check,stroke(){draws++;}};
 const canvas={getContext:()=>context,width:0,height:0};
 const surface={addEventListener:(n,f)=>listeners.set(n,f),removeEventListener:n=>listeners.delete(n)};
 const window={...surface,innerWidth:1440,innerHeight:900,devicePixelRatio:3};
 const document={...surface,hidden:false,documentElement:surface};
 const sandbox={window,document,performance:{now:()=>0},requestAnimationFrame(){scheduled++;return scheduled},cancelAnimationFrame(){cancelled++}};
 vm.createContext(sandbox);vm.runInContext(source,sandbox);
 const sculpture=sandbox.createSculpture(canvas,{reducedMotion:true});
 assert.equal(scheduled,0);assert.equal(canvas.width,2160);assert.ok(draws>100);
 for(const page of ['home','work','project','research','about'])sculpture.setPage(page);
 sculpture.setPaused(false);assert.equal(scheduled,1);
 document.hidden=true;listeners.get('visibilitychange')();assert.ok(cancelled>0);
 sculpture.setPaused(true);window.innerWidth=360;window.innerHeight=780;listeners.get('resize')();assert.equal(canvas.width,540);
 sculpture.destroy();assert.equal(listeners.size,0);
});

test('Sculpture seeds vary the form while remaining stable across routes, resizing, and paused scroll',async()=>{
 const source=(await readFile(join(dist,'sculpture.js'),'utf8')).replace('export function','function')+'\nglobalThis.createSculpture = createSculpture;';
 function setup(seed) {
  let points=[],scheduled=0; const listeners=new Map();
  const context={clearRect(){points=[]},save(){},restore(){},translate(){},rotate(){},scale(){},setTransform(){},beginPath(){},moveTo(x,y){points.push(x,y)},lineTo(x,y){points.push(x,y)},stroke(){}};
  const canvas={getContext:()=>context,clientWidth:1440,clientHeight:900};
  const surface={addEventListener:(n,f)=>listeners.set(n,f),removeEventListener:n=>listeners.delete(n)};
  const window={...surface,innerWidth:1440,innerHeight:900,devicePixelRatio:1,scrollY:0};
  const document={...surface,hidden:false,documentElement:{...surface,scrollHeight:3000}};
  const sandbox={window,document,performance:{now:()=>0},requestAnimationFrame(){scheduled++;return scheduled},cancelAnimationFrame(){}};
  vm.createContext(sandbox); vm.runInContext(source,sandbox);
  return {api:sandbox.createSculpture(canvas,{reducedMotion:true,seed}),canvas,window,listeners,points:()=>points,schedules:()=>scheduled};
 }
 const first=setup(12345),same=setup(12345),other=setup(98765);
 const initial=first.points();
 assert.deepEqual(initial,same.points(),'A fixed seed should reproduce the same form');
 assert.notDeepEqual(initial,other.points(),'Different seeds should produce different forms');
 first.api.setPage('research'); first.api.setPage('home');
 assert.deepEqual(first.points(),initial,'Navigation must not pick a new random form');
 first.window.scrollY=1200; first.listeners.get('scroll')();
 assert.deepEqual(first.points(),initial,'Paused scroll must not move the sculpture');
 assert.equal(first.schedules(),0);
 first.canvas.clientWidth=320; first.canvas.clientHeight=780; first.listeners.get('resize')();
 assert.equal(first.canvas.width,320); assert.equal(first.canvas.height,780);
 assert.ok(first.points().every(Number.isFinite));
 assert.ok(first.points().length<initial.length,'Small screens should draw fewer curves');
 first.canvas.clientWidth=1440; first.canvas.clientHeight=900; first.listeners.get('resize')();
 assert.deepEqual(first.points(),initial,'Resizing must preserve the seed');
 for(const instance of [first,same,other]) { instance.api.destroy(); assert.equal(instance.listeners.size,0); }
});
