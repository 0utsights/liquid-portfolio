import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import { resolve, join } from 'node:path';

const dist = resolve(import.meta.dirname, '../dist');
async function files(dir) {
 const entries = await readdir(dir, {withFileTypes: true});
 return (await Promise.all(entries.map(e => e.isDirectory() ? files(join(dir, e.name)) : [join(dir, e.name)]))).flat();
}
const pages = async () => (await files(dist)).filter(p => p.endsWith('index.html') && !/[\\/](personal|research)[\\/]/.test(p));

test('Every generated internal link, anchor, and asset has a destination', async () => {
 const htmlFiles = (await files(dist)).filter(p => p.endsWith('.html'));
 assert.equal(htmlFiles.length, 10);
 for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  const paths = [...html.matchAll(/(?:href|src|srcset)="([^"]+)"/g)].map(m => m[1]);
  const refresh = html.match(/content="0;url=([^"]+)"/);
  if (refresh) paths.push(refresh[1]);
  for (const href of paths) {
   if (!href.startsWith('/') && !href.startsWith('#')) continue;
   const url = new URL(href, 'https://johnsurles.com' + file.slice(dist.length).replaceAll('\\', '/').replace(/index\.html$/, ''));
   let target = join(dist, decodeURIComponent(url.pathname));
   const info = await stat(target).catch(() => null); assert.ok(info, `${file}: missing ${href}`);
   if (info.isDirectory()) target = join(target, 'index.html');
   await stat(target);
   if (url.hash) { const page = await readFile(target, 'utf8'); assert.ok(page.includes(`id="${url.hash.slice(1)}"`), `Missing anchor ${href}`); }
  }
 }
});

test('Pages carry complete content without JavaScript, with unique titles and sharing metadata', async () => {
 const titles = new Set();
 for (const file of await pages()) {
  const html = await readFile(file, 'utf8');
  assert.equal([...html.matchAll(/<h1[ >]/g)].length, 1);
  assert.match(html, /<main id="main"/);
  assert.match(html, /<html lang="en"/);
  assert.match(html, /<link rel="canonical" href="https:\/\/johnsurles.com/);
  assert.match(html, /<meta name="description" content="[^"]{30,}"/);
  assert.match(html, /<meta property="og:image" content="https:\/\/johnsurles.com\/images\/social-card.jpg">/);
  const title = html.match(/<title>(.*?)<\/title>/)[1]; assert.ok(!titles.has(title)); titles.add(title);
  assert.ok(!html.includes('href="#"'));
  assert.ok(!/lorem ipsum|TODO|placeholder/i.test(html));
  assert.equal([...html.matchAll(/aria-current="page"/g)].length, 1);
  // Scripts are limited to the class toggle, inert JSON-LD, and the deferred enhancement module.
  const scripts = [...html.matchAll(/<script\b[^>]*>/g)].map(m => m[0]);
  for (const tag of scripts) assert.ok(/^<script>$|type="application\/ld\+json"|type="module" src="\/site\.js\?v=/.test(tag), `Unexpected script ${tag}`);
  assert.ok(!/<canvas\b/.test(html), 'The canvas is created by the enhancement script, never required by the page');
  for (const m of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)) JSON.parse(m[1]);
  const text = html.replace(/<script[\s\S]*?<\/script>|<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  assert.ok(text.length > 800, `${file} has too little server-rendered text`);
 }
 assert.equal(titles.size, 7);
});

test('Recruiter facts, merged PR links, and retired routes stay intact', async () => {
 const home = await readFile(join(dist, 'index.html'), 'utf8');
 for (const fact of ['Summer 2027', 'May 2028', '1,000+', '3,000+', 'surlesjohn@outlook.com', 'No sponsorship required']) assert.ok(home.includes(fact), `Home is missing ${fact}`);
 const work = await readFile(join(dist, 'work/index.html'), 'utf8');
 assert.match(work, /one of three student groups under faculty supervision/);
 assert.match(work, /Planned work: system testing, evaluation, and preparation for publication/);
 for (const reference of ['microsoft/PowerToys/pull/49402', 'NASA-AMMOS/MMGIS/pull/1029', 'unhappychoice/gittype/pull/478', 'pingdotgg/t3code/pull/4133', 'omnigent-ai/omnigent/pull/3661']) assert.ok(work.includes(reference));
 assert.ok(!home.includes('github.com/0utsights/issue-proof'), 'Issue Proof is private; do not link to it');
 assert.match(await readFile(join(dist, 'research/index.html'), 'utf8'), /url=\/work\/#research/);
 assert.match(await readFile(join(dist, 'personal/index.html'), 'utf8'), /url=\/about\//);
 const pdf = await readFile(join(dist, 'John-Surles-Resume.pdf')); assert.equal(pdf.subarray(0, 4).toString(), '%PDF');
 assert.equal((await readFile(join(dist, 'CNAME'), 'utf8')).trim(), 'johnsurles.com');
});

test('The page stays lightweight', async () => {
 const size = async f => (await stat(join(dist, f))).size;
 assert.ok(await size('site.js') < 14 * 1024, 'site.js budget: 14 KB');
 assert.ok(await size('styles.css') < 32 * 1024, 'styles.css budget: 32 KB');
 assert.ok(await size('index.html') < 40 * 1024, 'home HTML budget: 40 KB');
 const js = await readFile(join(dist, 'site.js'), 'utf8');
 assert.match(js, /prefers-reduced-motion: reduce/, 'The field must honor reduced motion');
 assert.match(js, /running = false; return;/, 'The render loop must stop when idle');
});
