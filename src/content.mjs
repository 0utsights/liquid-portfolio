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
    slug: 'aeyori', number: '04', title: 'Aeyori / KarutaBot', category: 'OCR & automation', date: 'March 2026 — Present', archived: true,
    summary: 'Open-source OCR and scheduling client for the Karuta card game.',
    stack: ['Python', 'FastAPI', 'EasyOCR', 'Selenium', 'PostgreSQL'],
    contribution: ['Built the OCR pipeline with Python, EasyOCR, and Selenium.', 'Built a FastAPI backend and dashboard with authentication and license-key management for an earlier hosted version.', 'Worked with contributors to improve recognition reliability and processing options.'],
    links: [['Code on GitHub', 'https://github.com/0utsights/KarutaBot']],
  },
  {
    slug: 'opsdeck', number: '02', title: 'OpsDeck', category: 'Systems & developer tooling', date: 'August 2026 — Present',
    summary: 'A Go terminal dashboard for Linux servers, container health, and agent heartbeats. One binary provides the interface and remote metrics probe.',
    stack: ['Go', 'Linux', 'SSH', 'Docker'],
    contribution: ['Built local and SSH-based probes for CPU, memory, disk, network, and container health.', 'Derived site placement and migration states from live Docker observations rather than maintaining a second placement database.', 'Used file-based agent heartbeats with explicit stale-state handling; kept the dashboard independent of any particular AI framework.'],
    links: [['Code on GitHub', 'https://github.com/0utsights/opsdeck']],
  },
  {
    slug: 'legendwatch', number: '03', title: 'LegendWatch', category: 'Real-time systems · Game mod', date: 'March 2026 — Present',
    summary: 'Java/Fabric mod with 2,000+ downloads across Modrinth and CurseForge, with event-driven match and item tracking.',
    stack: ['Java', 'Fabric API', 'Gradle'],
    contribution: ['Built the client-side mod in Java with the Fabric API.', 'Parsed public events, maintained match state, and rendered item-tracking indicators.', 'Published the mod on GitHub, Modrinth, and CurseForge.'],
    links: [['Code on GitHub', 'https://github.com/0utsights/LegendWatch'], ['Modrinth', 'https://modrinth.com/mod/legendwatch'], ['CurseForge', 'https://www.curseforge.com/minecraft/mc-mods/legendwatch']],
  },
];

projects.sort((a, b) => Number(a.number) - Number(b.number));
export const featuredProjects = projects.filter(p => !p.archived);

export const engineeringNotes = {
  'deepwoken-trade': {
    label: '01 / Production application', outcome: '1,000+ users',
    problem: 'A trade listing needs context: who posted it, how their account was verified, and how other players rate them.',
    decision: 'Connected Discord OAuth and Roblox verification to trade requests and reputation profiles, backed by PostgreSQL through Prisma.',
    detail: 'The application was deployed with Docker, Terraform, and GitHub Actions on AWS, then migrated to Oracle Cloud and Supabase PostgreSQL.',
    proof: ['Explore the live marketplace', 'https://deepwoken.trade'],
    flow: [['Identity', 'Discord + Roblox'], ['Application', 'Next.js + Prisma'], ['Persistence', 'PostgreSQL']],
  },
  opsdeck: {
    label: '02 / Systems tooling', outcome: 'One native Go binary',
    problem: 'Server health, container placement, and agent progress are spread across different machines and processes.',
    decision: 'Combined a terminal interface and on-demand metrics probe in one Go binary. Remote collection uses SSH; the system needs no web server or metrics database.',
    detail: 'Migration states come from live container placement. Agent heartbeats use a small JSON contract and become stale after 90 seconds, so old progress is visibly distinguishable from current activity.',
    proof: ['Read the architecture and setup', 'https://github.com/0utsights/opsdeck#remote-probes'],
    flow: [['Collect', 'Local + SSH probes'], ['Reconcile', 'Live host state'], ['Inspect', 'Terminal dashboard']],
  },
  legendwatch: {
    label: '03 / Event-driven software', outcome: '2,000+ downloads',
    problem: 'Players need to track crafted legendary items as a match changes, including possible transfers after an elimination.',
    decision: 'Parsed public chat events into match state and rendered item indicators in player nametags and the tab list.',
    detail: 'Predicted transfers are marked with a question mark, separating inference from observed crafting events. Match state clears automatically when the match ends.',
    proof: ['Read how the mod works', 'https://github.com/0utsights/LegendWatch#how-it-works'],
    flow: [['Observe', 'Public chat events'], ['Track', 'Match + item state'], ['Render', 'Nametags + tab list']],
  },
};

export const contributions = [
  {name:'Microsoft PowerToys', repo:'microsoft/PowerToys', number:'49402', detail:'Fixed Quick Accent sizing and character clipping at fractional display scaling.', tech:'C# / WinUI'},
  {name:'NASA-AMMOS / MMGIS', repo:'NASA-AMMOS/MMGIS', number:'1029', detail:'Preserved development startup logs by removing a terminal clear; added regression tests.', tech:'Developer tooling'},
  {name:'GitType', repo:'unhappychoice/gittype', number:'478', detail:'Fixed redraws after terminal resizing; added regression tests.', tech:'Rust / TUI'},
  {name:'T3 Code', repo:'pingdotgg/t3code', number:'4133', detail:'Fixed HTML/XML-like user message rendering while retaining assistant sanitization; added tests.', tech:'Message rendering'},
  {name:'Omnigent', repo:'omnigent-ai/omnigent', number:'3661', detail:'Added RS384, RS512, ES384, and ES512 signing algorithm support with regression tests.', tech:'Authentication / OIDC'},
];
