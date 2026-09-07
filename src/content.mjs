export const projects = [
  {
    slug: 'deepwoken-trade', number: '01', title: 'Deepwoken.trade', category: 'Full-stack application', date: 'June 2026 — Present',
    intro: 'A marketplace built around the way a community trades.',
    summary: 'Player-to-player marketplace with verified accounts, trade requests, and reputation.',
    stack: ['Next.js', 'TypeScript', 'PostgreSQL', 'Prisma', 'Docker'],
    problem: 'Player-to-player trading needs more than a list of items. People need a way to find a match, establish identity, and decide who to trust.',
    contribution: ['Built trade listings, item markets, reputation profiles, and trade requests.', 'Added Discord OAuth, Roblox verification, and PostgreSQL persistence through Prisma.', 'Deployed with Docker, AWS, Terraform, and GitHub Actions; later migrated to Oracle Cloud and Supabase PostgreSQL.'],
    decision: 'The application brings identity, discovery, and reputation into the same workflow. Keeping the data model in PostgreSQL and Prisma supports the connected relationships between users, listings, and requests.',
    links: [['Visit marketplace', 'https://deepwoken.trade'], ['View source', 'https://github.com/0utsights/DeepwokenTrade']],
    flow: ['Verify identity', 'Discover a trade', 'Build reputation'],
  },
  {
    slug: 'aeyori', number: '02', title: 'Aeyori / KarutaBot', category: 'OCR & automation', date: 'March 2026 — Present',
    intro: 'Turning visual information into useful automation.',
    summary: 'Open-source card recognition and automation tool with a hosted dashboard.',
    stack: ['Python', 'FastAPI', 'EasyOCR', 'Selenium', 'PostgreSQL'],
    problem: 'Card-game automation depends on reliably understanding information displayed on screen. That makes recognition quality and the processing pipeline central to the tool.',
    contribution: ['Built the OCR pipeline with Python, EasyOCR, and Selenium.', 'Built a FastAPI backend and dashboard with authentication and license-key management.', 'Worked with contributors to improve recognition reliability and processing options.'],
    decision: 'The desktop tool and hosted dashboard serve different parts of the experience. The recognition pipeline handles visual input, while the backend supports account and license management.',
    links: [['View source', 'https://github.com/0utsights/KarutaBot']],
    flow: ['Visual input', 'OCR recognition', 'Automated action'],
  },
  {
    slug: 'legendwatch', number: '03', title: 'LegendWatch', category: 'Real-time systems · Game mod', date: 'March 2026 — Present',
    intro: 'Making a changing match easier to read.',
    summary: 'Minecraft mod for real-time match and item tracking.',
    stack: ['Java', 'Fabric API', 'Gradle'],
    problem: 'A live match produces a stream of public events. Useful tracking requires converting that stream into current state and presenting it clearly while the game continues.',
    contribution: ['Built the client-side mod in Java with the Fabric API.', 'Parsed public events, maintained match state, and rendered item-tracking indicators.', 'Published the mod on GitHub, Modrinth, and CurseForge.'],
    decision: 'Event parsing, match state, and the interface form a small real-time pipeline. Separating those responsibilities keeps the display focused on the current match.',
    links: [['View source', 'https://github.com/0utsights/LegendWatch'], ['Modrinth', 'https://modrinth.com/mod/legendwatch'], ['CurseForge', 'https://www.curseforge.com/minecraft/mc-mods/legendwatch']],
    flow: ['Public events', 'Match state', 'Live indicators'],
  },
];

export const contributions = [
  {name:'Microsoft PowerToys', repo:'microsoft/PowerToys', number:'49402', title:'A small sizing fix with a visible difference.', detail:'Fixed Quick Accent sizing and character clipping at fractional display scaling.', tech:'C# / WinUI'},
  {name:'NASA-AMMOS / MMGIS', repo:'NASA-AMMOS/MMGIS', number:'1029', title:'Keep the logs that developers need.', detail:'Preserved development startup logs by removing a terminal clear; added regression tests.', tech:'Developer tooling'},
  {name:'GitType', repo:'unhappychoice/gittype', number:'478', title:'Redraw when the terminal changes.', detail:'Fixed redraws after terminal resizing; added regression tests.', tech:'Rust / TUI'},
  {name:'T3 Code', repo:'pingdotgg/t3code', number:'4133', title:'Preserve what a user actually typed.', detail:'Fixed HTML/XML-like user message rendering while retaining assistant sanitization; added tests.', tech:'Message rendering'},
  {name:'Omnigent', repo:'omnigent-ai/omnigent', number:'3661', title:'Broader compatibility for sign-in.', detail:'Added RS384, RS512, ES384, and ES512 signing algorithm support with regression tests.', tech:'Authentication / OIDC'},
];
