import { mkdir, writeFile, cp, rm, readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve, join } from 'node:path';
import { profile, about, highlights, lookingFor, experience, projects, contributions, education, skills, alsoFamiliar } from '../src/content.mjs';

const root = resolve(import.meta.dirname, '..');
const output = join(root, 'dist');
const version = async file => createHash('sha256').update(await readFile(join(root, file))).digest('hex').slice(0, 10);
const v = {css: await version('public/styles.css'), js: await version('public/copy.js'), resume: await version('public/John-Surles-Resume.pdf')};
await rm(output, {recursive: true, force: true});
await mkdir(output, {recursive: true});
await cp(join(root, 'public'), output, {recursive: true});
await cp(join(root, 'CNAME'), join(output, 'CNAME'));
await writeFile(join(output, '.nojekyll'), '');

const resume = `/John-Surles-Resume.pdf?v=${v.resume}`;
const mail = `mailto:${profile.email}`;
const esc = s => String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const ext = (label, href) => `<a href="${href}" target="_blank" rel="noopener noreferrer">${label}<span class="sr-only"> (opens in a new tab)</span></a>`;
const card = (id, heading, body) => `<section class="card"${id ? ` id="${id}"` : ''} aria-labelledby="${id || heading.toLowerCase().replace(/\W+/g, '-')}-title"><h2 id="${id || heading.toLowerCase().replace(/\W+/g, '-')}-title">${heading}</h2><div class="card-body">${body}</div></section>`;
// **text** in content becomes <strong>, resume-style emphasis on the key phrase of a line.
const md = s => String(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
const list = items => `<ul>${items.map(x => `<li>${md(x)}</li>`).join('')}</ul>`;
// Contact links get a copy button; it stays hidden unless /copy.js runs, so the link alone still works.
const copyIcon = '<svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><rect x="5.5" y="5.5" width="8.5" height="8.5" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M10.5 5.5V3.5A1.5 1.5 0 0 0 9 2H3.5A1.5 1.5 0 0 0 2 3.5V9a1.5 1.5 0 0 0 1.5 1.5h2" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>';
const copyable = (link, value, what) => `<span class="copyable">${link}<button type="button" class="copy" data-copy="${value}" aria-label="Copy ${what}" title="Copy ${what}" hidden>${copyIcon}</button></span>`;
const contacts = {
 email: label => copyable(`<a href="${mail}">${label}</a>`, profile.email, 'email address'),
 github: label => copyable(ext(label, profile.github), profile.github, 'GitHub link'),
 linkedin: label => copyable(ext(label, profile.linkedin), profile.linkedin, 'LinkedIn link'),
};
const words = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
const count = contributions.length;
const fill = text => text.replace('{count}', count).replace('{others}', words[count - 3] ?? count - 3);
const series = items => items.length < 2 ? items.join('') : `${items.slice(0, -1).join(', ')}, and ${items.at(-1)}`;
const codePRs = contributions.filter(c => !c.docs);
const docPRs = contributions.length - codePRs.length;
const languages = [...new Set(codePRs.map(c => c.lang.split(' /')[0]))];

const profilePage = [
 card('about', 'About', `<p>${md(about)}</p><ul class="highlights">${highlights.map(([text, href]) => `<li><a href="${href}">${md(fill(text))}</a></li>`).join('')}</ul>`),
 card('looking-for', 'Looking for', list(lookingFor)),
 card('experience', 'Experience', experience.map(e => `<article class="entry" id="${e.id}"><div class="entry-head"><h3>${e.role}</h3><p class="entry-date">${e.date}</p></div><p class="entry-org">${e.org}</p>${list(e.points)}</article>`).join('')),
 card('open-source-summary', 'Open source', `<p>${count} pull requests merged into projects maintained by others, including Microsoft PowerToys, OpenTelemetry, and NASA-AMMOS MMGIS. <a href="/oss/">See each contribution</a>: what broke, what I changed, and how it was verified.</p>`),
 card('projects', 'Projects', projects.map(p => `<article class="entry" id="${p.id}"><div class="entry-head"><h3>${p.name}</h3><p class="entry-date">${p.date}</p></div><p>${md(p.summary)}</p>${list(p.points)}<p class="meta">${p.stack}</p><p class="entry-links">${p.links.map(([l, h]) => ext(l, h)).join('')}${p.note ? `<span class="meta">${p.note}</span>` : ''}</p></article>`).join('')),
 card('education', 'Education', education.map(e => `<div class="entry entry-compact"><div class="entry-head"><h3>${e.school}</h3><p class="entry-date">${e.date}</p></div><p class="entry-org">${e.detail}</p></div>`).join('')),
 card('skills', 'Skills', `<p class="meta">Each skill links to where I’ve used it.</p><ul class="skills">${skills.map(([k, used]) => `<li><strong>${k}</strong><span>${used.map(([l, h]) => `<a href="${h}">${l}</a>`).join(', ')}</span></li>`).join('')}</ul><p class="meta">Also: ${alsoFamiliar}.</p>`),
 card('links', 'Links', `<ul class="link-list"><li>${contacts.email(profile.email)}</li><li>${contacts.github(profile.github.replace('https://', ''))}</li><li>${contacts.linkedin(profile.linkedin.replace('https://www.', '').replace(/\/$/, ''))}</li><li><a href="${profile.phoneHref}">${profile.phone}</a></li><li><a href="${resume}">Resume (PDF)</a></li></ul>`),
].join('');

const ossPage = [
 card('contributions', 'Contributions', `<p>${count} merged pull requests to projects I don’t maintain: ${words[codePRs.length] ?? codePRs.length} code fixes (${languages.join(', ')})${docPRs ? ` and ${words[docPRs] ?? docPRs} documentation fix${docPRs > 1 ? 'es' : ''}` : ''}. Each one fixes a reproducible bug or a reported issue, and every entry links to the PR on GitHub.</p>`),
 card('merged', 'Merged pull requests', contributions.map(c => `<article class="entry pr" id="${c.repo.split('/')[1].toLowerCase()}"><p class="pr-repo"><strong>${c.repo}</strong> · ${c.about}</p><h3>${ext(`${esc(c.title)} <span class="pr-number">#${c.number}</span>`, `https://github.com/${c.repo}/pull/${c.number}`)}</h3><p class="meta">Merged ${c.merged} · ${c.lang} · ${c.diff}${c.issue ? ` · Fixes ${ext(`#${c.issue}`, `https://github.com/${c.repo}/issues/${c.issue}`)}` : ''}</p><dl class="pr-detail"><dt>Problem</dt><dd>${md(esc(c.problem))}</dd><dt>Change</dt><dd>${md(esc(c.fix))}</dd><dt>Verified</dt><dd>${md(esc(c.verified))}</dd></dl></article>`).join('')),
 card('own-projects', 'My open-source projects', `<ul class="link-list">${projects.filter(p => p.links.some(([l]) => l === 'GitHub')).map(p => `<li>${ext(p.name, p.links.find(([l]) => l === 'GitHub')[1])} <span class="meta">— ${md(p.summary)}</span></li>`).join('')}</ul>`),
].join('');

// Structured identity for search engines; every value is also stated on the page.
const profileData = {
 '@context': 'https://schema.org', '@type': 'ProfilePage', url: 'https://johnsurles.com/',
 mainEntity: {'@type': 'Person', name: profile.name, url: 'https://johnsurles.com/', description: 'Computer Science student at Virginia Tech seeking software engineering internships.',
  affiliation: {'@type': 'CollegeOrUniversity', name: 'Virginia Tech'}, alumniOf: {'@type': 'CollegeOrUniversity', name: 'Northern Virginia Community College'},
  sameAs: [profile.github, profile.linkedin]},
};

const routes = [
 {path: '/', key: 'profile', title: 'John Surles — Computer Science Student', description: 'Virginia Tech CS student (May 2028) seeking software engineering internships for winter, spring, or summer terms, remote or in-person.', body: profilePage},
 {path: '/oss/', key: 'oss', title: 'Open Source — John Surles', description: `${count} merged pull requests to Microsoft PowerToys, OpenTelemetry, NASA-AMMOS MMGIS, and ${count - 3} other projects: the problem, the change, and how each was verified.`, body: ossPage},
];

function page(route) {
 const url = `https://johnsurles.com${route.path}`;
 const tab = (label, href, key) => `<a href="${href}"${route.key === key ? ' aria-current="page"' : ''}>${label}</a>`;
 return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="#f7f5f2"><title>${route.title}</title><meta name="description" content="${route.description}"><link rel="canonical" href="${url}"><meta property="og:type" content="website"><meta property="og:title" content="${route.title}"><meta property="og:description" content="${route.description}"><meta property="og:url" content="${url}"><meta property="og:site_name" content="John Surles"><meta property="og:locale" content="en_US"><meta property="og:image" content="https://johnsurles.com/images/social-card.jpg"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="John Surles — Computer Science Student, Virginia Tech"><meta name="twitter:card" content="summary_large_image"><meta name="author" content="John Surles"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="apple-touch-icon" href="/apple-touch-icon.png"><link rel="stylesheet" href="/styles.css?v=${v.css}">${route.key === 'profile' ? `<script type="application/ld+json">${JSON.stringify(profileData)}</script>` : ''}</head>
<body><a class="skip-link" href="#main">Skip to content</a><div class="page"><header class="card masthead"><picture><source srcset="/images/profile.webp" type="image/webp"><img class="photo" src="/images/profile.jpg" width="192" height="192" alt="John Surles" decoding="async"></picture><h1>${profile.name}</h1><p class="subtitle">${profile.title}</p><p class="status">Seeking software engineering internships · Graduating May 2028</p><p class="masthead-links"><a href="${resume}">Resume (PDF)</a>${contacts.email('Email')}${contacts.github('GitHub')}${contacts.linkedin('LinkedIn')}</p></header><nav class="tabs" aria-label="Sections">${tab('Profile', '/', 'profile')}${tab('Open Source', '/oss/', 'oss')}</nav><main id="main" tabindex="-1">${route.body}</main><footer class="card footer"><p>© 2026 John Surles</p></footer></div><p id="copy-status" class="sr-only" aria-live="polite"></p><script src="/copy.js?v=${v.js}" defer></script></body></html>`;
}

for (const route of routes) {
 const dir = join(output, route.path);
 await mkdir(dir, {recursive: true});
 await writeFile(join(dir, 'index.html'), page(route));
}

// Earlier URLs keep working.
const redirect = (to, label) => `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=${to}"><link rel="canonical" href="https://johnsurles.com${to.split('#')[0]}"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><meta name="robots" content="noindex"><title>${label} — John Surles</title></head><body><a href="${to}">Continue to ${label}</a></body></html>`;
const redirects = [
 ['about', '/', 'Profile'], ['personal', '/', 'Profile'], ['research', '/#research', 'Research'], ['work', '/#experience', 'Experience'],
 ...projects.map(p => [`work/${p.id}`, `/#${p.id}`, p.name]),
];
for (const [from, to, label] of redirects) {
 await mkdir(join(output, from), {recursive: true});
 await writeFile(join(output, from, 'index.html'), redirect(to, label));
}
await writeFile(join(output, '404.html'), page({path: '/404.html', key: 'none', title: 'Page not found — John Surles', description: 'This page could not be found. Return to John Surles’s profile.', body: card('not-found', 'Page not found', '<p>This page isn’t available. It may have moved when the site was simplified.</p><p class="actions"><a class="button" href="/">Go to profile</a><a class="button button-quiet" href="/oss/">Open source</a></p>')}));
await writeFile(join(output, 'robots.txt'), 'User-agent: *\nAllow: /\nSitemap: https://johnsurles.com/sitemap.xml\n');
await writeFile(join(output, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.map(r => `<url><loc>https://johnsurles.com${r.path}</loc></url>`).join('')}</urlset>`);
console.log(`Built ${routes.length} pages, ${redirects.length} redirects, and 404.`);
