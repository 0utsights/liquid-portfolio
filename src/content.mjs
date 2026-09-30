// Every fact here is sourced from the résumé, project READMEs, GitHub, Modrinth, or John directly.
export const profile = {
  name: 'John Surles',
  email: 'surlesjohn@outlook.com',
  phone: '(727) 331-0916',
  phoneHref: 'tel:+17273310916',
  github: 'https://github.com/0utsights',
  linkedin: 'https://www.linkedin.com/in/john-surles-650a16389/',
  school: 'Virginia Tech',
  degree: 'B.S. Computer Science',
  graduation: 'May 2028',
  seeking: 'Summer 2027 software engineering internships',
  location: 'Northern Virginia / Washington, DC',
  relocation: 'Open to relocation across the U.S.',
  authorization: 'Authorized to work in the U.S. No sponsorship required, now or in the future.',
};

// Lower bounds, not live counters. LegendWatch: 2,948 on Modrinth alone (2026-09-30) plus CurseForge.
export const metrics = [
  {value: '1,000+', label: 'users on Deepwoken.trade, a marketplace I built and deployed', href: '/work/deepwoken-trade/'},
  {value: '3,000+', label: 'downloads of LegendWatch across Modrinth and CurseForge', href: '/work/legendwatch/'},
  {value: '5', label: 'merged open-source PRs, including Microsoft PowerToys and NASA-AMMOS', href: '/work/#open-source'},
  {value: '1 of 3', label: 'student research groups I lead at Virginia Tech’s VTURCS lab', href: '/work/#research'},
];

export const experience = [
  {
    id: 'experience', org: 'Procentrix', role: 'Software Engineering Intern', date: 'June–August 2026',
    summary: 'Built authenticated REST APIs and a reusable backend template with Node.js, TypeScript, and SQL Server.',
    points: [
      'Built a reusable Node.js / TypeScript backend template with SQL Server and separate data-access and service layers.',
      'Implemented REST APIs with authentication, authorization, input validation, and database access safeguards.',
      'Developed a React financial risk assessment interface with Dataverse, Fluent UI, and reusable master-detail components.',
      'Published a Claude Code plugin marketplace for the engineering team, sharing React/TypeScript scaffolding and Dataverse authentication guidance.',
    ],
    stack: ['Node.js', 'TypeScript', 'SQL Server', 'React', 'Dataverse'],
  },
  {
    id: 'research', org: 'Virginia Tech · VTURCS', role: 'Undergraduate Researcher & Group Lead', date: 'September 2026–Present',
    summary: 'Developing a semantic search and matching system for student research opportunities; leading one of three student groups under faculty supervision.',
    points: [
      'Developed the semantic search and matching system for student research opportunities.',
      'Lead one of three student groups under faculty supervision.',
      'Planned work: system testing, evaluation, and preparation for publication.',
    ],
    stack: ['Semantic search', 'Matching'],
  },
];

export const projects = [
  {
    slug: 'deepwoken-trade', number: '01', title: 'Deepwoken.trade', category: 'Backend & production infrastructure', date: 'June 2026–Present',
    pitch: 'A trading marketplace for the Roblox game Deepwoken, built and deployed end to end.',
    summary: 'Built and deployed a trading marketplace for players of the Roblox game Deepwoken, serving 1,000+ users. It connects account verification, trade requests, and reputation with PostgreSQL persistence.',
    outcome: ['1,000+', 'users'],
    stack: ['Next.js', 'TypeScript', 'PostgreSQL', 'Prisma', 'Docker', 'Terraform'],
    contribution: ['Built trade listings, item markets, reputation profiles, and trade requests.', 'Added Discord OAuth, Roblox verification, and PostgreSQL persistence through Prisma.', 'Deployed with Docker, AWS, Terraform, and GitHub Actions; later migrated to Oracle Cloud and Supabase PostgreSQL.'],
    links: [['Live site', 'https://deepwoken.trade']],
    sourceNote: 'Source code is private.',
    preview: {webp: '/images/deepwoken-market.webp', png: '/images/deepwoken-market.png', width: 1265, height: 712, alt: 'Deepwoken.trade item market with search, category filters, and buy and sell offer counts.', caption: 'Item market · September 2026'},
    notes: {
      problem: 'A trade listing needs context: who posted it, how their account was verified, and how other players rate them.',
      decision: 'Connected Discord OAuth and Roblox verification to trade requests and reputation profiles, backed by PostgreSQL through Prisma.',
      detail: 'The application was deployed with Docker, Terraform, and GitHub Actions on AWS, then migrated to Oracle Cloud and Supabase PostgreSQL.',
      proof: ['Explore the live marketplace', 'https://deepwoken.trade'],
    },
    flow: [['Identity', 'Discord + Roblox'], ['Application', 'Next.js + Prisma'], ['Persistence', 'PostgreSQL']],
  },
  {
    slug: 'aeyori', number: '02', title: 'Aeyori', subtitle: 'KarutaBot', category: 'Python workflows & OCR', date: 'March 2026–Present',
    pitch: 'An open-source Python client that pairs card-image OCR with scheduled, user-controlled workflows.',
    summary: 'Built an open-source Python client for the Discord card game Karuta that coordinates card-image OCR and scheduled workflows, with configurable profiles, cooldown handling, and activity logs.',
    outcome: ['Open source', 'Windows build'],
    stack: ['Python', 'FastAPI', 'EasyOCR', 'Selenium', 'PostgreSQL'],
    contribution: ['Built the OCR pipeline with Python, EasyOCR, and Selenium.', 'Built a FastAPI backend and dashboard with authentication and license-key management for an earlier hosted version.', 'Worked with contributors to improve recognition reliability and processing options.'],
    links: [['Code on GitHub', 'https://github.com/0utsights/KarutaBot'], ['Project website', 'https://aeyori.com']],
    notes: {
      problem: 'Card-image recognition and scheduled routines need to work together while giving the user clear configuration, activity feedback, and stop controls.',
      decision: 'Built a local EasyOCR pipeline and workflow coordinator with cooldown handling, configurable routines, independent profiles, and activity logs.',
      detail: 'Packaged the client for Windows with PyInstaller. A bundle-check command validates OCR and Selenium dependencies, including Selenium Manager, without opening the interface or logging in.',
      proof: ['Inspect the source and Windows packaging', 'https://github.com/0utsights/KarutaBot#build-a-windows-executable'],
    },
    flow: [['Recognize', 'EasyOCR image pipeline'], ['Coordinate', 'Routines + cooldowns'], ['Operate', 'Profiles + activity logs']],
  },
  {
    slug: 'legendwatch', number: '03', title: 'LegendWatch', category: 'Event-driven software · Java', date: 'March 2026–Present',
    pitch: 'A Minecraft mod that turns live chat events into match state for the Hoplite server.',
    summary: 'Built a Java/Fabric Minecraft mod for the Hoplite server that turns public chat events into match state and shows which players hold legendary items. 3,000+ downloads across Modrinth and CurseForge.',
    outcome: ['3,000+', 'downloads'],
    stack: ['Java', 'Fabric API', 'Gradle'],
    contribution: ['Built the client-side mod in Java with the Fabric API.', 'Parsed public events, maintained match state, and rendered item-tracking indicators.', 'Published the mod on GitHub, Modrinth, and CurseForge.'],
    links: [['Code on GitHub', 'https://github.com/0utsights/LegendWatch'], ['Modrinth', 'https://modrinth.com/mod/legendwatch'], ['CurseForge', 'https://www.curseforge.com/minecraft/mc-mods/legendwatch']],
    notes: {
      problem: 'Players need to track crafted legendary items as a match changes, including possible transfers after an elimination.',
      decision: 'Parsed public chat events into match state and rendered item indicators in player nametags and the tab list.',
      detail: 'Predicted transfers are marked with a question mark, separating inference from observed crafting events. Match state clears automatically when the match ends.',
      proof: ['Read how the mod works', 'https://github.com/0utsights/LegendWatch#how-it-works'],
    },
    flow: [['Observe', 'Public chat events'], ['Track', 'Match + item state'], ['Render', 'Nametags + tab list']],
  },
  {
    slug: 'opsdeck', number: '04', title: 'OpsDeck', category: 'Systems & developer tooling · Go', date: 'August 2026–Present', supporting: true,
    pitch: 'A terminal dashboard and SSH probe for Linux servers, in one native Go binary.',
    summary: 'Built a Go dashboard and SSH metrics probe for Linux servers, with Docker health checks, live container placement, and explicit handling of stale agent heartbeats.',
    outcome: ['1', 'native Go binary'],
    stack: ['Go', 'Linux', 'SSH', 'Docker'],
    contribution: ['Built local and SSH-based probes for CPU, memory, disk, network, and container health.', 'Derived site placement and migration states from live Docker observations rather than maintaining a second placement database.', 'Used file-based agent heartbeats with explicit stale-state handling; kept the dashboard independent of any particular AI framework.'],
    links: [['Code on GitHub', 'https://github.com/0utsights/opsdeck']],
    notes: {
      problem: 'Server health, container placement, and agent progress are spread across different machines and processes.',
      decision: 'Combined a terminal interface and on-demand metrics probe in one Go binary. Remote collection uses SSH; the system needs no web server or metrics database.',
      detail: 'Migration states come from live container placement. Agent heartbeats use a small JSON contract and become stale after 90 seconds, so old progress is visibly distinguishable from current activity.',
      proof: ['Read the architecture and setup', 'https://github.com/0utsights/opsdeck#remote-probes'],
    },
    flow: [['Collect', 'Local + SSH probes'], ['Reconcile', 'Live host state'], ['Inspect', 'Terminal dashboard']],
  },
];
export const featuredProjects = projects.filter(p => !p.supporting);

// In-progress work without a public page. Facts from the private repository README.
export const inProgress = [
  {title: 'Issue Proof', category: 'Developer tooling · TypeScript', status: 'In progress · private source',
    summary: 'A TypeScript pipeline that uses Codex to triage GitHub issues, reproduce the reported failure, and prepare evidence-backed pull requests. Discovery, implementation, independent review, and publication are separate stages, and nothing is published without a human.'},
];

// Merge months come from each pull request's merged_at date on GitHub.
export const contributions = [
  {name:'Microsoft PowerToys', org:'microsoft', repo:'microsoft/PowerToys', number:'49402', merged:'July 2026', detail:'Fixed Quick Accent sizing and character clipping at fractional display scaling.', tech:'C# / WinUI'},
  {name:'NASA-AMMOS / MMGIS', org:'NASA-AMMOS', repo:'NASA-AMMOS/MMGIS', number:'1029', merged:'August 2026', detail:'Preserved development startup logs by removing a terminal clear; added regression tests.', tech:'Developer tooling'},
  {name:'GitType', org:'unhappychoice', repo:'unhappychoice/gittype', number:'478', merged:'August 2026', detail:'Fixed redraws after terminal resizing; added regression tests.', tech:'Rust / TUI'},
  {name:'T3 Code', org:'pingdotgg', repo:'pingdotgg/t3code', number:'4133', merged:'August 2026', detail:'Fixed HTML/XML-like user message rendering while retaining assistant sanitization; added tests.', tech:'Message rendering'},
  {name:'Omnigent', org:'omnigent-ai', repo:'omnigent-ai/omnigent', number:'3661', merged:'August 2026', detail:'Added RS384, RS512, ES384, and ES512 signing algorithm support with regression tests.', tech:'Authentication / OIDC'},
];

export const education = [
  {school: 'Virginia Tech', detail: 'B.S. Computer Science · College of Engineering', dates: ['August 2026–Present', 'Expected graduation · May 2028']},
  {school: 'Northern Virginia Community College', detail: 'Computer Science · GPA 3.55 / 4.0', dates: ['September 2024–May 2026']},
];

export const skills = [
  ['Languages', ['Python', 'TypeScript', 'Java', 'Go', 'C++', 'SQL']],
  ['Backend & data', ['Node.js', 'FastAPI', 'REST APIs', 'PostgreSQL', 'SQL Server', 'Prisma', 'Authentication']],
  ['Frontend & apps', ['React', 'Next.js', 'Fluent UI', 'Dataverse', 'Fabric API']],
  ['Infrastructure', ['Linux', 'Docker', 'Terraform', 'GitHub Actions', 'AWS', 'Oracle Cloud', 'SSH', 'Git']],
];

export const about = [
  'I’m a Computer Science student at Virginia Tech. I enjoy learning a wide range of technologies and keeping up with the latest developments in software engineering.',
  'At Procentrix, I built authenticated REST APIs with TypeScript and SQL Server. My independent work spans a deployed PostgreSQL marketplace, Python OCR workflows, Go tooling for Linux servers, and event-driven Java software.',
  'I’m seeking a paid Summer 2027 software engineering internship and expect to graduate in May 2028. My preferred work area is Northern Virginia / Washington, DC. I’m also open to relocation across the U.S.',
  'I’m authorized to work in the U.S. and do not need sponsorship now or in the future.',
];
