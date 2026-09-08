import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import { resolve, join } from 'node:path';


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
