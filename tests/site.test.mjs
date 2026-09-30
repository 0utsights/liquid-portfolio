import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import { resolve, join } from 'node:path';

const dist = resolve(import.meta.dirname, '../dist');
async function files(dir) {
 const entries = await readdir(dir, {withFileTypes: true});
 return (await Promise.all(entries.map(e => e.isDirectory() ? files(join(dir, e.name)) : [join(dir, e.name)]))).flat();
}
const read = p => readFile(join(dist, p), 'utf8');

test('Every internal link, anchor, asset, and redirect target exists', async () => {
 const htmlFiles = (await files(dist)).filter(p => p.endsWith('.html'));
 assert.equal(htmlFiles.length, 11);
 for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  const paths = [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map(m => m[1]);
  const refresh = html.match(/content="0;url=([^"]+)"/);
  if (refresh) paths.push(refresh[1]);
  for (const href of paths) {
   if (!href.startsWith('/') && !href.startsWith('#')) continue;
   const url = new URL(href, 'https://johnsurles.com' + file.slice(dist.length).replaceAll('\\', '/').replace(/index\.html$/, ''));
   let target = join(dist, decodeURIComponent(url.pathname));
   const info = await stat(target).catch(() => null); assert.ok(info, `${file}: missing ${href}`);
   if (info.isDirectory()) target = join(target, 'index.html');
   if (url.hash) assert.ok((await readFile(target, 'utf8')).includes(`id="${url.hash.slice(1)}"`), `${file}: missing anchor ${href}`);
  }
 }
});

test('Both pages are complete static HTML with sharing metadata and no client runtime', async () => {
 const titles = new Set();
 for (const path of ['index.html', 'oss/index.html']) {
  const html = await read(path);
  assert.equal([...html.matchAll(/<h1[ >]/g)].length, 1);
  assert.match(html, /<html lang="en"/);
  assert.match(html, /<main id="main"/);
  assert.match(html, /<link rel="canonical" href="https:\/\/johnsurles.com/);
  assert.match(html, /<meta name="description" content="[^"]{30,}"/);
  assert.match(html, /<meta property="og:image" content="https:\/\/johnsurles.com\/images\/social-card.jpg">/);
  assert.equal([...html.matchAll(/aria-current="page"/g)].length, 1);
  for (const tag of html.matchAll(/<script\b[^>]*>/g)) assert.match(tag[0], /type="application\/ld\+json"/, 'Only inert JSON-LD is allowed');
  for (const m of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)) JSON.parse(m[1]);
  assert.ok(!/lorem ipsum|TODO|placeholder|Loading/i.test(html));
  assert.ok(html.includes('John-Surles-Resume.pdf') && html.includes('mailto:surlesjohn@outlook.com'), 'Resume and email are in the header');
  const title = html.match(/<title>(.*?)<\/title>/)[1]; assert.ok(!titles.has(title)); titles.add(title);
 }
});

test('Recruiter facts and every merged contribution are present and linked', async () => {
 const home = await read('index.html');
 for (const fact of ['Summer 2027', 'May 2028', '1,000+', '3,000+', 'Procentrix', '7 merged pull requests', 'one of three student groups under faculty supervision']) assert.ok(home.includes(fact), `Profile is missing ${fact}`);
 assert.ok(!/sponsorship|authorized to work/i.test(home), 'Work authorization is intentionally not stated');
 const oss = await read('oss/index.html');
 const prs = ['microsoft/PowerToys/pull/49402', 'open-telemetry/opentelemetry-kotlin/pull/1064', 'NASA-AMMOS/MMGIS/pull/1029', 'pingdotgg/t3code/pull/4133', 'omnigent-ai/omnigent/pull/3661', 'unhappychoice/gittype/pull/478', 'libredb/libredb-studio/pull/904'];
 for (const pr of prs) assert.ok(oss.includes(`https://github.com/${pr}`), `Missing ${pr}`);
 assert.equal([...oss.matchAll(/<dt>Verified<\/dt>/g)].length, prs.length);
 assert.ok(!/stars?\b|★/i.test(oss), 'Contributions are judged by the change, not the host repository’s stars');
 assert.ok(!home.includes('github.com/0utsights/issue-proof'), 'Issue Proof is private');
 const pdf = await readFile(join(dist, 'John-Surles-Resume.pdf')); assert.equal(pdf.subarray(0, 4).toString(), '%PDF');
 assert.equal((await readFile(join(dist, 'CNAME'), 'utf8')).trim(), 'johnsurles.com');
});
