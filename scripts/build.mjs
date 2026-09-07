import { mkdir, readFile, writeFile, cp, readdir } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { projects, contributions } from '../src/content.mjs';

const root = resolve(import.meta.dirname, '..');
const output = join(root, 'dist');
await mkdir(output, {recursive:true});
await cp(join(root, 'public'), output, {recursive:true});
await cp(join(root, 'CNAME'), join(output, 'CNAME'));
await writeFile(join(output,'.nojekyll'),'');
const ext = (label, href) => `<a class="text-link" href="${href}" target="_blank" rel="noopener noreferrer">${label}</a>`;
const tags = items => `<ul class="tags" aria-label="Technologies">${items.map(item=>`<li>${item}</li>`).join('')}</ul>`;
const sectionHead = (n, title, aside='') => `<div class="section-heading"><div><span class="index">${n}</span><h2>${title}</h2></div>${aside}</div>`;
const projectRows = projects.map(p=>`<article class="project-row"><span class="index">${p.number}</span><div><h3><a href="/work/${p.slug}/">${p.title}</a></h3><p>${p.summary}</p><p class="project-stack">${p.stack.join(' · ')}</p><div class="project-evidence"><a class="text-link" href="/work/${p.slug}/">Details</a>${p.links.map(([label,href])=>ext(label,href)).join('')}</div></div></article>`).join('');
const ossRows = contributions.map(c=>`<article class="oss-row"><div><span class="meta">${c.tech}</span><h3>${c.name}</h3><a class="pr-link" href="https://github.com/${c.repo}/pull/${c.number}" target="_blank" rel="noopener noreferrer">Merged PR #${c.number}</a></div><div><p>${c.detail}</p></div></article>`).join('');

const home = `<section class="hero"><div class="hero-copy"><p class="eyebrow">SOFTWARE ENGINEERING</p><h1>John Surles.</h1><p class="hero-description">Computer Science at Virginia Tech.<br>Expected graduation: May 2028.</p><ul class="hero-facts"><li><a href="/work/#experience"><strong>Procentrix</strong> — Software Engineering Intern, June–August 2026</a></li><li><a href="/research/"><strong>VTURCS</strong> — Current Undergraduate Researcher & Group Lead</a></li><li><a href="/work/#open-source"><strong>Open source</strong> — Merged contributions to PowerToys, NASA-AMMOS/MMGIS & more</a></li></ul><div class="hero-actions"><a class="button" href="/John-Surles-Resume.pdf">Resume</a><a class="quiet-link" href="/work/">Work & contributions</a></div><div class="hero-contact">${ext('GitHub','https://github.com/0utsights')}<a class="text-link" href="mailto:surlesjohn@outlook.com">surlesjohn@outlook.com</a></div></div></section>
<section class="content-section home-selection" id="selected">${sectionHead('01','Projects')}<div class="project-list">${projectRows}</div></section>`;

const work = `<section class="page-intro"><h1>Work.</h1><nav class="section-nav" aria-label="Work sections"><a href="#experience">Experience</a><a href="#open-source">Open source</a><a href="#projects">Projects</a></nav></section>
<section class="content-section" id="experience">${sectionHead('01','Experience')}<article class="experience"><div><span class="meta">JUNE — AUGUST 2026</span><h3>Procentrix</h3><p>Software Engineering Intern</p></div><div class="experience-copy"><ul class="detail-list"><li>Built a reusable Node.js / TypeScript backend with SQL Server, including authenticated REST APIs and input validation.</li><li>Developed a React financial risk assessment interface with Dataverse, Fluent UI, and reusable master-detail components.</li><li>Published shared developer tools and guidance for React scaffolding and Dataverse authentication.</li></ul></div></article></section>
<section class="content-section" id="open-source">${sectionHead('02','Open source','<span class="meta">Merged contributions</span>')}<div class="oss-list">${ossRows}</div></section>
<section class="content-section" id="projects">${sectionHead('03','Projects')}<div class="project-list">${projectRows}</div></section>`;

const research = `<section class="page-intro"><h1>Research.</h1><p>Semantic search and intelligent matching for student research opportunities.</p></section>
<section class="content-section research-overview">${sectionHead('01','VTURCS · Virginia Tech')}<div class="editorial-grid"><div><span class="meta">SEPTEMBER 2026 — PRESENT</span><h3>Undergraduate Researcher<br>& Group Lead</h3></div><div><h4>Matching + Semantic Search</h4><p>I develop the semantic search and matching system and lead one of three student groups under faculty supervision.</p><p><strong>Next:</strong> system testing, evaluation, and preparation for publication. These are planned responsibilities.</p></div></div></section>`;

const about = `<section class="page-intro"><h1>About.</h1><p>Computer Science student at Virginia Tech and current VTURCS undergraduate researcher and group lead. Previously a software engineering intern at Procentrix.</p><div class="inline-links">${ext('GitHub','https://github.com/0utsights')}${ext('LinkedIn','https://www.linkedin.com/in/john-surles-650a16389/')}<a class="text-link" href="/John-Surles-Resume.pdf">Resume</a></div></section>
<section class="content-section">${sectionHead('01','Education')}<div class="education-row"><div><h3>Virginia Tech</h3><p>B.S. Computer Science · College of Engineering</p><p class="meta">Current course: Intro to Computer Organization II (CS 2506)</p></div><span class="meta">August 2026 — Expected May 2028</span></div><div class="education-row"><div><h3>Northern Virginia Community College</h3><p>Computer Science · GPA 3.55 / 4.0</p></div><span class="meta">September 2024 — May 2026</span></div></section>
<section class="content-section">${sectionHead('02','Skills')}<div class="skill-row"><h3>Languages</h3><p>TypeScript, JavaScript, Python, Java, C#, SQL</p></div><div class="skill-row"><h3>Applications & data</h3><p>React, Next.js, Node.js, FastAPI, PostgreSQL, SQL Server, Prisma, Dataverse</p></div><div class="skill-row"><h3>Infrastructure</h3><p>Docker, Terraform, GitHub Actions, Git, Linux, AWS, Oracle Cloud</p></div></section>
<section class="content-section contact-section" id="contact"><h2>Contact.</h2><a class="contact-email" href="mailto:surlesjohn@outlook.com">surlesjohn@outlook.com</a></section>`;

function projectPage(p) {
 const next=projects[(projects.indexOf(p)+1)%projects.length];
 return `<section class="page-intro project-intro"><a class="back-link" href="/work/">All work</a><p class="eyebrow">${p.category.toUpperCase()}</p><h1>${p.title}</h1><p>${p.summary}</p><div class="inline-links">${p.links.map(([label,href])=>ext(label,href)).join('')}</div>${p.sourceNote ? `<p class="source-note">${p.sourceNote}</p>` : ''}</section><section class="project-facts"><div><span class="meta">ROLE</span><span>Developer</span></div><div><span class="meta">TIMELINE</span><span>${p.date}</span></div><div><span class="meta">STACK</span><span>${p.stack.join(' · ')}</span></div></section><section class="content-section">${sectionHead('01','Contributions')}<ul class="detail-list compact-contributions">${p.contribution.map(item=>`<li>${item}</li>`).join('')}</ul></section><a class="next-project" href="/work/${next.slug}/"><span class="meta">NEXT PROJECT</span><span>${next.title}</span></a>`;
}

const routes=[
 {path:'/',key:'home',title:'John Surles — Software & Research',description:'Computer Science at Virginia Tech. Software engineering, independent projects, open-source contributions, and undergraduate research.',body:home},
 {path:'/work/',key:'work',title:'Work — John Surles',description:'Independent software projects, a Procentrix internship, and merged contributions to Microsoft PowerToys, NASA-AMMOS/MMGIS, and more.',body:work},
 {path:'/research/',key:'research',title:'Research — John Surles',description:'Undergraduate research and group leadership in VTURCS Matching + Semantic Search at Virginia Tech.',body:research},
 {path:'/about/',key:'about',title:'About — John Surles',description:'Computer Science student at Virginia Tech, former Procentrix software engineering intern, and open-source contributor.',body:about},
 ...projects.map(p=>({path:`/work/${p.slug}/`,key:'project',title:`${p.title} — John Surles`,description:p.summary,body:projectPage(p)})),
];

function page(route) {
 const active=route.key==='project'?'work':route.key;
 const nav=[['Overview','/','home'],['Work','/work/','work'],['Research','/research/','research'],['About','/about/','about']].map(([name,url,key])=>`<a href="${url}"${key===active?' aria-current="page"':''}>${name}</a>`).join('');
 return `<!doctype html>
<html lang="en" data-page="${route.key}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="#e9e7e0"><title>${route.title}</title><meta name="description" content="${route.description}"><link rel="canonical" href="https://johnsurles.com${route.path}"><meta property="og:type" content="website"><meta property="og:title" content="${route.title}"><meta property="og:description" content="${route.description}"><meta property="og:url" content="https://johnsurles.com${route.path}"><meta name="twitter:card" content="summary"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="preload" href="/fonts/editorial.woff2" as="font" type="font/woff2" crossorigin><link rel="stylesheet" href="/styles.css"><script type="module" src="/app.js"></script></head>
<body><a class="skip-link" href="#main">Skip to content</a><div class="ambient" aria-hidden="true"><canvas id="sculpture"></canvas><div class="ambient-shade"></div></div><header class="site-header"><a class="wordmark" href="/" aria-label="John Surles, home">john surles<span>/</span></a><nav class="main-nav" aria-label="Main navigation">${nav}</nav><a class="header-contact" href="mailto:surlesjohn@outlook.com">Email</a></header><main id="main" tabindex="-1">${route.body}</main><footer class="site-footer"><div class="footer-top"><a class="wordmark" href="/">john surles<span>/</span></a><div class="footer-links">${ext('GitHub','https://github.com/0utsights')}${ext('LinkedIn','https://www.linkedin.com/in/john-surles-650a16389/')}<a class="text-link" href="mailto:surlesjohn@outlook.com">Email</a><a class="text-link" href="/John-Surles-Resume.pdf">Resume</a></div></div><div class="footer-bottom"><span>© 2026 John Surles · Blacksburg, Virginia</span><div class="preferences" hidden><button id="motion-toggle" type="button" aria-pressed="false">Pause motion</button><span aria-hidden="true">/</span><button id="sound-toggle" type="button" aria-pressed="false">Sound off</button></div></div></footer><noscript><style>.ambient{background:radial-gradient(ellipse at 85% 25%,#b1b4ac55,transparent 60%)}.sculpture-caption{display:none}</style></noscript></body></html>`;
}
for (const route of routes) {
 const dir=join(output,route.path);await mkdir(dir,{recursive:true});await writeFile(join(dir,'index.html'),page(route));
}
// Preserve the old personal route without perpetuating outdated personal copy.
await mkdir(join(output,'personal'),{recursive:true});
await writeFile(join(output,'personal/index.html'),`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=/about/"><link rel="canonical" href="https://johnsurles.com/about/"><title>About — John Surles</title></head><body><a href="/about/">Continue to About John Surles</a></body></html>`);
await writeFile(join(output,'404.html'),page({path:'/404.html',key:'about',title:'Page not found — John Surles',description:'This page could not be found.',body:'<section class="page-intro"><p class="eyebrow">404</p><h1>Page not found.</h1><p>This page isn’t available.</p><div class="inline-links"><a class="button" href="/">Return home</a><a class="text-link" href="/work/">View work</a></div></section>'}));
await writeFile(join(output,'robots.txt'),'User-agent: *\nAllow: /\nSitemap: https://johnsurles.com/sitemap.xml\n');
await writeFile(join(output,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.map(r=>`<url><loc>https://johnsurles.com${r.path}</loc></url>`).join('')}</urlset>`);
console.log(`Built ${routes.length} static pages, legacy redirect, 404, and public assets.`);
