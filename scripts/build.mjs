import { mkdir, writeFile, cp } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { projects, contributions } from '../src/content.mjs';

const root = resolve(import.meta.dirname, '..');
const output = join(root, 'dist');
await mkdir(output, {recursive:true});
await cp(join(root, 'public'), output, {recursive:true});
await cp(join(root, 'CNAME'), join(output, 'CNAME'));
await writeFile(join(output,'.nojekyll'),'');
const ext = (label, href) => `<a class="text-link" href="${href}" target="_blank" rel="noopener noreferrer">${label}</a>`;
const tags = items => `<ul class="technology-list" aria-label="Technologies">${items.map(item=>`<li>${item}</li>`).join('')}</ul>`;
const displayTitle = p => p.slug === 'deepwoken-trade' ? 'Deepwoken.<wbr>trade' : p.title;
const projectPreview = p => p.slug === 'deepwoken-trade' ? '<figure class="project-preview"><a href="/images/deepwoken-market.png" target="_blank" rel="noopener" aria-label="Open full-size Deepwoken.trade screenshot"><img src="/images/deepwoken-market.png" width="1265" height="712" loading="lazy" decoding="async" alt="Deepwoken.trade item market with search, category filters, and buy and sell offer counts."></a><figcaption>Item market · September 2026</figcaption></figure>' : '';
const sectionHead = (title, aside='') => `<div class="section-heading"><h2>${title}</h2>${aside}</div>`;
const projectRows = projects.map(p=>`<article class="project-row"><div class="project-summary"><h3><a href="/work/${p.slug}/">${displayTitle(p)}</a></h3><p>${p.summary}</p></div><div class="project-support">${tags(p.stack)}<div class="project-evidence">${p.links.slice(0,1).map(([label,href])=>ext(label,href)).join('')}</div></div></article>`).join('');
const ossRows = contributions.map(c=>`<article class="oss-row"><div><span class="meta">${c.tech}</span><h3>${c.name}</h3><a class="pr-link" href="https://github.com/${c.repo}/pull/${c.number}" target="_blank" rel="noopener noreferrer">Merged PR #${c.number}</a></div><div><p>${c.detail}</p></div></article>`).join('');

const home = `<section class="hero" aria-labelledby="intro-name">
 <div class="hero-copy"><h1 id="intro-name">John Surles</h1><p class="hero-description">Virginia Tech · B.S. Computer Science<br><span>Expected graduation · May 2028</span><span>Blacksburg, Virginia</span></p></div>
 <nav class="hero-contact" aria-label="Contact and resume" data-header-source><a class="contact-email" href="mailto:surlesjohn@outlook.com">surlesjohn@outlook.com</a><div class="hero-actions"><a class="button" href="/John-Surles-Resume.pdf">Resume <span class="file-label">PDF</span></a>${ext('LinkedIn','https://www.linkedin.com/in/john-surles-650a16389/')}${ext('GitHub','https://github.com/0utsights')}</div></nav>
</section>
<section class="home-highlights" aria-label="Experience, open source, and research">
 <article><h2>Experience</h2><h3>Procentrix</h3><p class="highlight-role">Software Engineering Intern<span class="meta">June–August 2026</span></p><p>Built TypeScript APIs and a React financial risk assessment interface.</p><div class="highlight-links"><a class="text-link" href="/work/#experience">Internship details</a></div></article>
 <article><h2>Open source</h2><h3>PowerToys & MMGIS</h3><p class="highlight-role">Merged contributions<span class="meta">Microsoft · NASA-AMMOS</span></p><p>Fixed display scaling in PowerToys and preserved startup logs in MMGIS.</p><div class="highlight-links">${ext('PowerToys PR','https://github.com/microsoft/PowerToys/pull/49402')}${ext('MMGIS PR','https://github.com/NASA-AMMOS/MMGIS/pull/1029')}</div></article>
 <article><h2>Research</h2><h3>Virginia Tech · VTURCS</h3><p class="highlight-role">Undergraduate Researcher & Group Lead<span class="meta">September 2026–Present</span></p><p>I develop semantic search and intelligent matching for student research opportunities.</p><div class="highlight-links"><a class="text-link" href="/research/">Research details</a></div></article>
</section>
<section class="content-section home-selection" id="selected">${sectionHead('Projects')}<div class="project-list">${projectRows}</div></section>`;

const work = `<section class="page-intro"><h1>Work</h1><nav class="section-nav" aria-label="Work sections"><a href="#experience">Experience</a><a href="#open-source">Open source</a><a id="projects" href="/#selected">Projects</a></nav></section>
<section class="content-section" id="experience">${sectionHead('Experience')}<article class="experience"><div><span class="meta">June–August 2026</span><h3>Procentrix</h3><p>Software Engineering Intern</p></div><div class="experience-copy"><ul class="detail-list"><li>Built a reusable Node.js / TypeScript backend with SQL Server, including authenticated REST APIs and input validation.</li><li>Developed a React financial risk assessment interface with Dataverse, Fluent UI, and reusable master-detail components.</li><li>Published shared developer tools and guidance for React scaffolding and Dataverse authentication.</li></ul></div></article></section>
<section class="content-section" id="open-source">${sectionHead('Open source','<span class="meta">Merged contributions</span>')}<div class="oss-list">${ossRows}</div></section>`;

const research = `<section class="page-intro"><h1>Research</h1><p>Semantic search and intelligent matching for student research opportunities.</p></section>
<section class="content-section research-overview"><div class="research-meta"><p>VTURCS Undergraduate Research Lab · Virginia Tech</p><span class="meta">September 2026–Present</span></div><h2>Undergraduate Researcher & Group Lead</h2><div class="research-copy"><p>I develop the semantic search and matching system and lead one of three student groups under faculty supervision.</p><p><strong>Planned work:</strong> system testing, evaluation, and preparation for publication.</p></div></section>`;

const about = `<section class="page-intro"><h1>About</h1></section>
<section class="content-section">${sectionHead('Education')}<div class="education-row"><div><h3>Virginia Tech</h3><p>B.S. Computer Science · College of Engineering</p><p class="meta">Current course: Intro to Computer Organization II (CS 2506)</p></div><div class="education-date meta"><span>August 2026–Present</span><span>Expected graduation · May 2028</span></div></div><div class="education-row"><div><h3>Northern Virginia Community College</h3><p>Computer Science · GPA 3.55 / 4.0</p></div><div class="education-date meta"><span>September 2024–May 2026</span></div></div></section>
<section class="content-section">${sectionHead('Skills')}<div class="skill-row"><h3>Languages</h3><p>TypeScript, JavaScript, Python, Java, C#, SQL</p></div><div class="skill-row"><h3>Applications & data</h3><p>React, Next.js, Node.js, FastAPI, PostgreSQL, SQL Server, Prisma, Dataverse</p></div><div class="skill-row"><h3>Infrastructure</h3><p>Docker, Terraform, GitHub Actions, Git, Linux, AWS, Oracle Cloud</p></div></section>`;

function projectPage(p) {
 const next=projects[(projects.indexOf(p)+1)%projects.length];
 return `<section class="page-intro project-intro"><a class="back-link" href="/#selected">All projects</a><p class="eyebrow">${p.category}</p><h1>${displayTitle(p)}</h1><p>${p.summary}</p><div class="inline-links">${p.links.map(([label,href])=>ext(label,href)).join('')}</div>${p.sourceNote ? `<p class="source-note">${p.sourceNote}</p>` : ''}</section><section class="project-facts"><div><span class="meta">Timeline</span><span>${p.date}</span></div><div><span class="meta">Technologies</span>${tags(p.stack)}</div></section><section class="content-section">${sectionHead('Contributions')}<div class="project-detail-grid"><ul class="detail-list compact-contributions">${p.contribution.map(item=>`<li>${item}</li>`).join('')}</ul>${projectPreview(p)}</div></section><a class="next-project" href="/work/${next.slug}/"><span class="meta">Next project</span><span>${displayTitle(next)}</span></a>`;
}

const routes=[
 {path:'/',key:'home',title:'John Surles — Software & Research',description:'Computer Science at Virginia Tech. Software engineering, independent projects, open-source contributions, and undergraduate research.',body:home},
 {path:'/work/',key:'work',title:'Work — John Surles',description:'A Procentrix software engineering internship and merged contributions to Microsoft PowerToys, NASA-AMMOS/MMGIS, and more.',body:work},
 {path:'/research/',key:'research',title:'Research — John Surles',description:'Undergraduate research and group leadership in VTURCS Matching + Semantic Search at Virginia Tech.',body:research},
 {path:'/about/',key:'about',title:'About — John Surles',description:'Computer Science student at Virginia Tech, former Procentrix software engineering intern, and open-source contributor.',body:about},
 ...projects.map(p=>({path:`/work/${p.slug}/`,key:'project',title:`${p.title} — John Surles`,description:p.summary,body:projectPage(p)})),
];

function page(route) {
 const active=route.key==='project'?'work':route.key;
 const nav=[['Overview','/','home'],['Work','/work/','work'],['Research','/research/','research'],['About','/about/','about']].map(([name,url,key])=>`<a href="${url}"${key===active?' aria-current="page"':''}>${name}</a>`).join('');
 return `<!doctype html>
<html lang="en" data-page="${route.key}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="#e9e7e0"><title>${route.title}</title><meta name="description" content="${route.description}"><link rel="canonical" href="https://johnsurles.com${route.path}"><meta property="og:type" content="website"><meta property="og:title" content="${route.title}"><meta property="og:description" content="${route.description}"><meta property="og:url" content="https://johnsurles.com${route.path}"><meta name="twitter:card" content="summary"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="preload" href="/fonts/editorial.woff2" as="font" type="font/woff2" crossorigin><link rel="stylesheet" href="/styles.css"><script type="module" src="/app.js"></script></head>
<body><a class="skip-link" href="#main">Skip to content</a><div class="ambient" aria-hidden="true"><canvas id="sculpture"></canvas><div class="ambient-shade"></div></div><header class="site-header" data-identity="${route.key === 'home' ? 'hidden' : 'visible'}"><nav class="main-nav" aria-label="Main navigation">${nav}</nav><div class="header-identity"><a class="wordmark" href="/" aria-label="John Surles, home">John Surles</a><div class="header-actions" id="contact"><a class="text-link" href="mailto:surlesjohn@outlook.com">Email</a><a class="text-link" href="/John-Surles-Resume.pdf" aria-label="Resume (PDF)">Resume</a></div></div></header><main id="main" tabindex="-1">${route.body}</main><footer class="site-footer"><div class="footer-bottom"><span>© 2026 John Surles</span><div class="footer-links">${ext('GitHub','https://github.com/0utsights')}${ext('LinkedIn','https://www.linkedin.com/in/john-surles-650a16389/')}</div><div class="preferences" hidden><button id="motion-toggle" type="button" aria-pressed="false">Pause motion</button><button id="sound-toggle" type="button" aria-pressed="false">Sound off</button></div></div></footer><noscript><style>.ambient{background:radial-gradient(ellipse at 85% 25%,#b1b4ac55,transparent 60%)}.site-header[data-identity=hidden] .header-identity{opacity:1;visibility:visible;transform:none}.site-header[data-identity=hidden] .header-identity a{pointer-events:auto}</style></noscript></body></html>`;
}
for (const route of routes) {
 const dir=join(output,route.path);await mkdir(dir,{recursive:true});await writeFile(join(dir,'index.html'),page(route));
}
// Preserve the old personal route without perpetuating outdated personal copy.
await mkdir(join(output,'personal'),{recursive:true});
await writeFile(join(output,'personal/index.html'),`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=/about/"><link rel="canonical" href="https://johnsurles.com/about/"><title>About — John Surles</title></head><body><a href="/about/">Continue to About John Surles</a></body></html>`);
await writeFile(join(output,'404.html'),page({path:'/404.html',key:'about',title:'Page not found — John Surles',description:'This page could not be found.',body:'<section class="page-intro"><p class="eyebrow">404</p><h1>Page not found</h1><p>This page isn’t available.</p><div class="inline-links"><a class="button" href="/">Return home</a><a class="text-link" href="/work/">View work</a></div></section>'}));
await writeFile(join(output,'robots.txt'),'User-agent: *\nAllow: /\nSitemap: https://johnsurles.com/sitemap.xml\n');
await writeFile(join(output,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.map(r=>`<url><loc>https://johnsurles.com${r.path}</loc></url>`).join('')}</urlset>`);
console.log(`Built ${routes.length} static pages, legacy redirect, 404, and public assets.`);
