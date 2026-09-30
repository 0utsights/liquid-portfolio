import { mkdir, writeFile, cp, rm, readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve, join } from 'node:path';
import { createBackground } from '../src/background.mjs';
import { profile, metrics, experience, projects, featuredProjects, inProgress, contributions, education, skills, about } from '../src/content.mjs';

const root = resolve(import.meta.dirname, '..');
const output = join(root, 'dist');
const version = async file => createHash('sha256').update(await readFile(join(root, file))).digest('hex').slice(0, 10);
const v = {css: await version('public/styles.css'), js: await version('public/site.js'), resume: await version('public/John-Surles-Resume.pdf')};
await rm(output, {recursive:true, force:true});
await mkdir(output, {recursive:true});
await cp(join(root, 'public'), output, {recursive:true});
await cp(join(root, 'CNAME'), join(output, 'CNAME'));
await writeFile(join(output, '.nojekyll'), '');
// Static contour field: the no-JavaScript / no-WebGL fallback for the live background.
await writeFile(join(output, 'contours.svg'), createBackground());

const resume = `/John-Surles-Resume.pdf?v=${v.resume}`;
const mail = `mailto:${profile.email}`;

// Inline icons inherit color and stay decorative; every link that uses one also has text or a label.
const svg = (body, view = '0 0 16 16') => `<svg class="icon" viewBox="${view}" aria-hidden="true" focusable="false">${body}</svg>`;
const icon = {
  arrow: svg('<path d="M3 8h9.5M8.5 4 12.5 8l-4 4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>'),
  back: svg('<path d="M13 8H3.5M7.5 4 3.5 8l4 4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>'),
  external: svg('<path d="M5 11 11 5M6.5 5H11v4.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>'),
  file: svg('<path d="M4 1.75h5L12.25 5v9.25H4z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><path d="M8.75 2v3.25H12M6 8.5h4.25M6 11h4.25" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>'),
  mail: svg('<rect x="1.75" y="3.25" width="12.5" height="9.5" rx="1.75" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="m2.5 4.5 5.5 4.25 5.5-4.25" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>'),
  github: svg('<path fill="currentColor" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"/>'),
  linkedin: svg('<path fill="currentColor" d="M1.5 1.5h13v13h-13zM3.6 6.2v6.3h2V6.2zm1-3.1a1.15 1.15 0 1 0 0 2.3 1.15 1.15 0 0 0 0-2.3Zm2.5 3.1v6.3h2V9.4c0-.82.16-1.62 1.18-1.62 1 0 1.02.94 1.02 1.67v3.05h2V9.04c0-1.7-.37-3-2.35-3-.95 0-1.59.52-1.85 1.02h-.03v-.86z" fill-rule="evenodd"/>'),
  merge: svg('<path fill="currentColor" d="M5.45 5.154A4.25 4.25 0 0 0 9.25 7.5h1.378a2.251 2.251 0 1 1 0 1.5H9.25A5.734 5.734 0 0 1 5 7.123v3.505a2.25 2.25 0 1 1-1.5 0V5.372a2.25 2.25 0 1 1 1.95-.218ZM4.25 13.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm8.5-4.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z"/>'),
};

const newTab = '<span class="sr-only"> (opens in a new tab)</span>';
const ext = (label, href, cls = 'link') => `<a class="${cls}" href="${href}" target="_blank" rel="noopener noreferrer">${label}${newTab}${icon.external}</a>`;
const chips = (items, label = 'Technologies') => `<ul class="chips" aria-label="${label}">${items.map(item => `<li>${item}</li>`).join('')}</ul>`;
const kicker = (n, text) => `<p class="kicker"><span>${n}</span>${text}</p>`;
const title = p => p.slug === 'deepwoken-trade' ? 'Deepwoken.<wbr>trade' : p.title;
const outcome = p => `<p class="outcome"><strong>${p.outcome[0]}</strong> ${p.outcome[1]}</p>`;

const preview = (p, eager = false) => p.preview ? `<figure class="shot"><a href="${p.preview.png}" target="_blank" rel="noopener" aria-label="Open full-size ${p.title} screenshot (opens in a new tab)"><picture><source srcset="${p.preview.webp}" type="image/webp"><img src="${p.preview.png}" width="${p.preview.width}" height="${p.preview.height}" ${eager ? '' : 'loading="lazy" '}decoding="async" alt="${p.preview.alt}"></picture></a><figcaption>${p.preview.caption}</figcaption></figure>` : '';
const sketch = p => `<figure class="sketch"><figcaption>System sketch <span>/ ${p.number}</span></figcaption><ol>${p.flow.map(([label, value]) => `<li><span>${label}</span><strong>${value}</strong></li>`).join('')}</ol></figure>`;

const header = active => {
 const nav = [['Work', '/work/', 'work'], ['Projects', '/#projects', 'projects'], ['About', '/about/', 'about']]
  .map(([name, url, key]) => `<a href="${url}"${key === active ? ' aria-current="page"' : ''}>${name}</a>`).join('');
 return `<header class="site-header"><div class="header-inner"><a class="brand" href="/" aria-label="John Surles, home"${active === 'home' ? ' aria-current="page"' : ''}><span class="monogram" aria-hidden="true">js.</span><span class="brand-name">John Surles</span></a><nav class="main-nav" aria-label="Main navigation">${nav}</nav><a class="btn btn-small" href="${resume}">Resume<span class="sr-only"> (PDF)</span></a></div></header>`;
};

const footer = `<footer class="site-footer"><div class="footer-inner"><p>© 2026 John Surles · Static HTML; the contour field is a WebGL shader that rests when you do.</p><div class="footer-links">${ext('GitHub', profile.github)}${ext('LinkedIn', profile.linkedin)}<a class="link" href="${mail}">Email</a><a class="link" href="${resume}">Resume PDF</a></div></div></footer>`;

const contactActions = `<div class="actions"><a class="btn btn-primary" href="${mail}">${icon.mail}<span>${profile.email}</span></a><a class="btn btn-ghost" href="${resume}">${icon.file}<span>Resume</span><span class="badge">PDF</span></a><a class="icon-btn" href="${profile.linkedin}" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn (opens in a new tab)">${icon.linkedin}</a><a class="icon-btn" href="${profile.github}" target="_blank" rel="noopener noreferrer" aria-label="GitHub (opens in a new tab)">${icon.github}</a></div>`;

const timeline = (full = false) => `<ol class="timeline">${experience.map(e => `<li class="timeline-item reveal" id="${full ? e.id : `${e.id}-overview`}"><p class="timeline-date">${e.date}</p><div class="timeline-body"><h3>${e.org}</h3><p class="role">${e.role}</p>${full ? `<ul class="points">${e.points.map(x => `<li>${x}</li>`).join('')}</ul>` : `<p>${e.summary}</p>`}${chips(e.stack, 'Focus areas')}</div></li>`).join('')}</ol>`;

const prList = list => `<ol class="pr-list">${list.map(c => `<li class="reveal"><a class="pr" href="https://github.com/${c.repo}/pull/${c.number}" target="_blank" rel="noopener noreferrer"><span class="pr-badge">${icon.merge}Merged</span><span class="pr-repo">${c.repo}<span class="pr-number">#${c.number}</span></span><span class="pr-detail">${c.detail}</span><span class="pr-meta">${c.tech} · ${c.merged}</span>${newTab}</a></li>`).join('')}</ol>`;

const projectCard = (p, i) => `<article class="card project-card${i === 0 ? ' project-card--wide' : ''} reveal"><div class="card-media">${p.preview ? preview(p) : sketch(p)}</div><div class="card-body"><p class="card-kicker">${p.number} · ${p.category}</p><h3><a class="card-link" href="/work/${p.slug}/">${title(p)}${p.subtitle ? ` <span class="subtitle">/ ${p.subtitle}</span>` : ''}</a></h3><p class="pitch">${p.pitch}</p>${outcome(p)}${chips(p.stack)}<div class="card-actions"><a class="link link-strong" href="/work/${p.slug}/">Case study${icon.arrow}</a>${ext(p.links[0][0], p.links[0][1])}</div></div></article>`;

const alsoBuilding = () => {
 const ops = projects.find(p => p.slug === 'opsdeck');
 return `<div class="also"><article class="card mini-card reveal"><p class="card-kicker">${ops.category}</p><h3><a class="card-link" href="/work/${ops.slug}/">${ops.title}</a></h3><p>${ops.pitch} Reconciles live Docker placement and makes stale agent heartbeats explicit, with no metrics database.</p><div class="card-actions"><a class="link link-strong" href="/work/${ops.slug}/">Case study${icon.arrow}</a>${ext('Code on GitHub', ops.links[0][1])}</div></article>${inProgress.map(x => `<article class="card mini-card reveal"><p class="card-kicker">${x.category}</p><h3>${x.title}</h3><p>${x.summary}</p><p class="status status-muted"><span class="status-dot" aria-hidden="true"></span>${x.status}</p></article>`).join('')}</div>`;
};

const home = `<section class="hero" aria-labelledby="hero-title">
<p class="status"><span class="status-dot" aria-hidden="true"></span><span class="long">Open to ${profile.seeking}</span><span class="short">Open to Summer 2027 SWE internships</span></p>
<h1 id="hero-title" class="hero-name">John Surles<span class="hero-dot" aria-hidden="true">.</span></h1>
<p class="hero-lead">I build backend systems and full&#8209;stack products, and I ship them to real users.</p>
<p class="hero-sub">Computer Science at Virginia Tech, graduating ${profile.graduation}. Software engineering intern at Procentrix in summer 2026; now an undergraduate researcher and group lead at Virginia Tech.</p>
<div class="actions"><a class="btn btn-primary" href="${resume}">${icon.file}<span>View resume</span><span class="badge">PDF</span></a><a class="btn btn-ghost" href="${mail}">${icon.mail}<span>Email me</span></a><a class="icon-btn" href="${profile.github}" target="_blank" rel="noopener noreferrer" aria-label="GitHub (opens in a new tab)">${icon.github}</a><a class="icon-btn" href="${profile.linkedin}" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn (opens in a new tab)">${icon.linkedin}</a></div>
<ul class="hero-facts" aria-label="Availability"><li>${profile.location} · open to relocation</li><li>U.S. work authorized · no sponsorship needed</li></ul>
</section>
<section class="metrics" aria-label="At a glance"><ul>${metrics.map(m => `<li><a href="${m.href}"><strong>${m.value}</strong><span>${m.label}</span></a></li>`).join('')}</ul></section>
<section class="section" aria-labelledby="experience-title"><div class="section-head">${kicker('01', 'Experience')}<h2 id="experience-title">Where I’ve worked</h2></div>${timeline()}<a class="link link-strong section-more" href="/work/">Full experience and research${icon.arrow}</a></section>
<section class="section" id="projects" aria-labelledby="projects-title"><div class="section-head" id="selected">${kicker('02', 'Projects')}<h2 id="projects-title">Things I’ve built and shipped</h2><p class="section-lead">Production software with real users, open-source tools, and the engineering decisions behind them.</p></div><div class="project-grid">${featuredProjects.map(projectCard).join('')}</div><h3 class="subhead">Also building</h3>${alsoBuilding()}</section>
<section class="section" aria-labelledby="oss-title"><div class="section-head">${kicker('03', 'Open source')}<h2 id="oss-title">Merged upstream</h2><p class="section-lead">${contributions.length} pull requests merged into projects maintained by Microsoft, NASA-AMMOS, and others. Four of the five include regression tests.</p></div>${prList(contributions)}<a class="link link-strong section-more" href="/work/#open-source">All contributions${icon.arrow}</a></section>
<section class="section contact reveal" id="contact" aria-labelledby="contact-title">${kicker('04', 'Contact')}<h2 id="contact-title">Hiring for Summer 2027?</h2><p class="contact-lead">I’m looking for a paid software engineering internship. ${profile.location} preferred; open to relocation across the U.S. ${profile.authorization}</p>${contactActions}<p class="contact-phone">Or call <a class="link" href="${profile.phoneHref}">${profile.phone}</a></p></section>`;

const pageIntro = (k, h, lead) => `<section class="page-hero">${k}<h1>${h}</h1><p class="page-lead">${lead}</p></section>`;

const work = `${pageIntro('<p class="kicker">Work</p>', 'Experience & open source', 'Backend APIs in a production codebase, research leadership, and fixes merged into other people’s software, most with regression tests.')}
<nav class="section-nav" aria-label="On this page"><a href="#experience">Experience</a><a href="#research">Research</a><a href="#open-source">Open source</a><a href="#projects">Projects</a></nav>
<section class="section" aria-labelledby="work-experience-title"><div class="section-head">${kicker('01', 'Experience & research')}<h2 id="work-experience-title">Roles</h2></div>${timeline(true)}</section>
<section class="section" id="open-source" aria-labelledby="work-oss-title"><div class="section-head">${kicker('02', 'Open source')}<h2 id="work-oss-title">Merged pull requests</h2><p class="section-lead">Every row links to the merged PR on GitHub. Merge months come from GitHub’s records.</p></div>${prList(contributions)}</section>
<section class="section" id="projects" aria-labelledby="work-projects-title"><div class="section-head">${kicker('03', 'Projects')}<h2 id="work-projects-title">Case studies</h2></div><ul class="case-list">${projects.map(p => `<li class="reveal"><a href="/work/${p.slug}/"><span class="case-number">${p.number}</span><span class="case-title">${p.title}</span><span class="case-pitch">${p.pitch}</span>${icon.arrow}</a></li>`).join('')}</ul></section>`;

const aboutPage = `${pageIntro('<p class="kicker">About</p>', 'About John', about[0])}
<section class="section about-grid" aria-label="Background and availability"><div class="prose">${about.slice(1).map(x => `<p>${x}</p>`).join('')}</div><aside class="card contact-card" aria-label="Contact"><p class="status"><span class="status-dot" aria-hidden="true"></span>Open to ${profile.seeking}</p><dl class="facts"><div><dt>Email</dt><dd><a class="link" href="${mail}">${profile.email}</a></dd></div><div><dt>Phone</dt><dd><a class="link" href="${profile.phoneHref}">${profile.phone}</a></dd></div><div><dt>Location</dt><dd>${profile.location}. ${profile.relocation}</dd></div><div><dt>Work authorization</dt><dd>${profile.authorization}</dd></div></dl><div class="actions"><a class="btn btn-primary btn-small" href="${resume}">${icon.file}<span>Resume</span><span class="badge">PDF</span></a>${ext('LinkedIn', profile.linkedin)}${ext('GitHub', profile.github)}</div></aside></section>
<section class="section" aria-labelledby="education-title"><div class="section-head">${kicker('01', 'Education')}<h2 id="education-title">Education</h2></div><ul class="rows">${education.map(e => `<li class="row reveal"><div><h3>${e.school}</h3><p>${e.detail}</p></div><p class="row-meta">${e.dates.join('<br>')}</p></li>`).join('')}</ul></section>
<section class="section" aria-labelledby="skills-title"><div class="section-head">${kicker('02', 'Skills')}<h2 id="skills-title">Tools I work with</h2></div><div class="skills">${skills.map(([group, items]) => `<div class="skill-group reveal"><h3>${group}</h3>${chips(items, group)}</div>`).join('')}</div></section>`;

function projectPage(p) {
 const next = projects[(projects.indexOf(p) + 1) % projects.length];
 return `<section class="page-hero project-hero"><a class="back-link" href="/#projects">${icon.back}All projects</a><p class="kicker"><span>${p.number}</span>${p.category}</p><h1>${title(p)}${p.subtitle ? ` <span class="subtitle">/ ${p.subtitle}</span>` : ''}</h1><p class="page-lead">${p.summary}</p><div class="actions">${p.links.map(([label, href], i) => ext(label, href, i === 0 ? 'btn btn-primary' : 'btn btn-ghost')).join('')}</div>${p.sourceNote ? `<p class="source-note">${p.sourceNote}</p>` : ''}</section>
<section class="facts-strip" aria-label="Project facts"><div><span class="facts-label">Outcome</span><p><strong>${p.outcome[0]}</strong> ${p.outcome[1]}</p></div><div><span class="facts-label">Timeline</span><p>${p.date}</p></div><div><span class="facts-label">Stack</span>${chips(p.stack)}</div></section>
${p.preview ? `<section class="section project-media reveal" aria-label="Screenshot">${preview(p, true)}</section>` : ''}
<section class="section" aria-labelledby="built-title"><div class="section-head">${kicker('01', 'What I built')}<h2 id="built-title">Contributions</h2></div><ul class="points points-large">${p.contribution.map(x => `<li class="reveal">${x}</li>`).join('')}</ul></section>
<section class="section" aria-labelledby="inside-title"><div class="section-head">${kicker('02', 'How it works')}<h2 id="inside-title">Inside the project</h2></div>${sketch(p)}<div class="notes"><article class="reveal"><h3>Problem</h3><p>${p.notes.problem}</p></article><article class="reveal"><h3>Implementation</h3><p>${p.notes.decision}</p></article><article class="reveal"><h3>System behavior</h3><p>${p.notes.detail}</p></article></div><p>${ext(p.notes.proof[0], p.notes.proof[1], 'link link-strong')}</p></section>
<a class="card next-project reveal" href="/work/${next.slug}/"><span class="kicker">Next project</span><span class="next-title">${next.title}${icon.arrow}</span><span class="next-pitch">${next.pitch}</span></a>`;
}

// Structured identity for search engines; every value is also stated on the page.
const profileData = {
 '@context': 'https://schema.org', '@type': 'ProfilePage', url: 'https://johnsurles.com/',
 mainEntity: {'@type': 'Person', name: profile.name, url: 'https://johnsurles.com/', description: `Computer Science student at Virginia Tech seeking ${profile.seeking}.`,
  affiliation: {'@type': 'CollegeOrUniversity', name: 'Virginia Tech'}, alumniOf: {'@type': 'CollegeOrUniversity', name: 'Northern Virginia Community College'},
  knowsAbout: ['TypeScript', 'Python', 'Java', 'Go', 'PostgreSQL', 'Node.js', 'REST APIs'], sameAs: [profile.github, profile.linkedin]},
};

const routes = [
 {path: '/', key: 'home', title: 'John Surles — Software Engineer · Summer 2027', description: 'Virginia Tech CS student (May 2028) seeking paid Summer 2027 SWE internships in Northern Virginia / Washington, DC; open to U.S. relocation.', body: home},
 {path: '/work/', key: 'work', title: 'Work — John Surles', description: 'A Procentrix software engineering internship, research leadership at Virginia Tech, and merged contributions to Microsoft PowerToys, NASA-AMMOS/MMGIS, and more.', body: work},
 {path: '/about/', key: 'about', title: 'About — John Surles', description: 'Virginia Tech CS student graduating May 2028, seeking paid Summer 2027 SWE internships. Education, skills, and contact details.', body: aboutPage},
 ...projects.map(p => ({path: `/work/${p.slug}/`, key: 'project', title: `${p.title} — John Surles`, description: p.summary, body: projectPage(p)})),
];

function page(route) {
 const active = route.key === 'project' ? 'work' : route.key;
 const url = `https://johnsurles.com${route.path}`;
 return `<!doctype html>
<html lang="en" class="no-js" data-page="${route.key}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><script>document.documentElement.className='js'</script><meta name="theme-color" content="#060a13"><meta name="color-scheme" content="dark"><title>${route.title}</title><meta name="description" content="${route.description}"><link rel="canonical" href="${url}"><meta property="og:type" content="website"><meta property="og:title" content="${route.title}"><meta property="og:description" content="${route.description}"><meta property="og:url" content="${url}"><meta property="og:site_name" content="John Surles"><meta property="og:locale" content="en_US"><meta property="og:image" content="https://johnsurles.com/images/social-card.jpg"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="John Surles — B.S. Computer Science, Virginia Tech. Seeking Summer 2027 software engineering internships."><meta name="twitter:card" content="summary_large_image"><meta name="author" content="John Surles"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="apple-touch-icon" href="/apple-touch-icon.png"><link rel="preload" href="/fonts/editorial.woff2" as="font" type="font/woff2" crossorigin><link rel="stylesheet" href="/styles.css?v=${v.css}">${route.key === 'home' ? `<script type="application/ld+json">${JSON.stringify(profileData)}</script>` : ''}</head>
<body><div class="field" aria-hidden="true"></div><a class="skip-link" href="#main">Skip to content</a>${header(active)}<main id="main" tabindex="-1">${route.body}</main>${footer}<script type="module" src="/site.js?v=${v.js}"></script></body></html>`;
}

for (const route of routes) {
 const dir = join(output, route.path);
 await mkdir(dir, {recursive: true});
 await writeFile(join(dir, 'index.html'), page(route));
}
// Retired routes keep working: /personal/ → About, /research/ → the research entry on Work.
const redirect = (to, label) => `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=${to}"><link rel="canonical" href="https://johnsurles.com${to.split('#')[0]}"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><meta name="robots" content="noindex"><title>${label} — John Surles</title></head><body><a href="${to}">Continue to ${label}</a></body></html>`;
for (const [from, to, label] of [['personal', '/about/', 'About John Surles'], ['research', '/work/#research', 'Research']]) {
 await mkdir(join(output, from), {recursive: true});
 await writeFile(join(output, from, 'index.html'), redirect(to, label));
}
await writeFile(join(output, '404.html'), page({path: '/404.html', key: 'not-found', title: 'Page not found — John Surles', description: 'This page could not be found. Return to John Surles’s portfolio.', body: `<section class="page-hero not-found"><p class="kicker">404</p><h1>Off the map.</h1><p class="page-lead">This page isn’t available. It may have moved when the site was reorganized.</p><div class="actions"><a class="btn btn-primary" href="/">Return home</a><a class="btn btn-ghost" href="/work/">View work</a><a class="btn btn-ghost" href="/#projects">See projects</a></div></section>`}));
await writeFile(join(output, 'robots.txt'), 'User-agent: *\nAllow: /\nSitemap: https://johnsurles.com/sitemap.xml\n');
await writeFile(join(output, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.map(r => `<url><loc>https://johnsurles.com${r.path}</loc></url>`).join('')}</urlset>`);
console.log(`Built ${routes.length} static pages, 2 redirects, 404, and public assets.`);
