export const projects = [
  {
    slug: 'deepwoken-trade', number: '01', title: 'Deepwoken.trade', category: 'Full-stack application', date: 'June 2026 — Present',
    summary: 'Trading marketplace serving 1,000+ users, with verified accounts, trade requests, and reputation.',
    stack: ['Next.js', 'TypeScript', 'PostgreSQL', 'Prisma', 'Docker'],
    contribution: ['Built trade listings, item markets, reputation profiles, and trade requests.', 'Added Discord OAuth, Roblox verification, and PostgreSQL persistence through Prisma.', 'Deployed with Docker, AWS, Terraform, and GitHub Actions; later migrated to Oracle Cloud and Supabase PostgreSQL.'],
    links: [['Live site', 'https://deepwoken.trade']],
    sourceNote: 'Source code is private.',
  },
  {
    slug: 'aeyori', number: '02', title: 'Aeyori / KarutaBot', category: 'OCR & automation', date: 'March 2026 — Present',
    summary: 'Open-source OCR and scheduling client for the Karuta card game.',
    stack: ['Python', 'FastAPI', 'EasyOCR', 'Selenium', 'PostgreSQL'],
    contribution: ['Built the OCR pipeline with Python, EasyOCR, and Selenium.', 'Built a FastAPI backend and dashboard with authentication and license-key management for an earlier hosted version.', 'Worked with contributors to improve recognition reliability and processing options.'],
    links: [['Code on GitHub', 'https://github.com/0utsights/KarutaBot']],
  },
  {
    slug: 'legendwatch', number: '03', title: 'LegendWatch', category: 'Real-time systems · Game mod', date: 'March 2026 — Present',
    summary: 'Java/Fabric mod with 2,000+ downloads across Modrinth and CurseForge, with event-driven match and item tracking.',
    stack: ['Java', 'Fabric API', 'Gradle'],
    contribution: ['Built the client-side mod in Java with the Fabric API.', 'Parsed public events, maintained match state, and rendered item-tracking indicators.', 'Published the mod on GitHub, Modrinth, and CurseForge.'],
    links: [['Code on GitHub', 'https://github.com/0utsights/LegendWatch'], ['Modrinth', 'https://modrinth.com/mod/legendwatch'], ['CurseForge', 'https://www.curseforge.com/minecraft/mc-mods/legendwatch']],
  },
];

projects.sort((a, b) => ['deepwoken-trade', 'legendwatch', 'aeyori'].indexOf(a.slug) - ['deepwoken-trade', 'legendwatch', 'aeyori'].indexOf(b.slug));

export const contributions = [
  {name:'Microsoft PowerToys', repo:'microsoft/PowerToys', number:'49402', detail:'Fixed Quick Accent sizing and character clipping at fractional display scaling.', tech:'C# / WinUI'},
  {name:'NASA-AMMOS / MMGIS', repo:'NASA-AMMOS/MMGIS', number:'1029', detail:'Preserved development startup logs by removing a terminal clear; added regression tests.', tech:'Developer tooling'},
  {name:'GitType', repo:'unhappychoice/gittype', number:'478', detail:'Fixed redraws after terminal resizing; added regression tests.', tech:'Rust / TUI'},
  {name:'T3 Code', repo:'pingdotgg/t3code', number:'4133', detail:'Fixed HTML/XML-like user message rendering while retaining assistant sanitization; added tests.', tech:'Message rendering'},
  {name:'Omnigent', repo:'omnigent-ai/omnigent', number:'3661', detail:'Added RS384, RS512, ES384, and ES512 signing algorithm support with regression tests.', tech:'Authentication / OIDC'},
];
