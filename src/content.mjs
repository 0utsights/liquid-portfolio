export const projects = [
  {
    slug: 'deepwoken-trade', number: '01', title: 'Deepwoken.trade', category: 'Full-stack application', date: 'June 2026 — Present',
    intro: 'A marketplace built around the way a community trades.',
    summary: 'Trade posts, item markets, reputation, and player verification in one place.',
    stack: ['Next.js', 'TypeScript', 'PostgreSQL', 'Prisma', 'Docker'],
    problem: 'Player-to-player trading needs more than a list of items. People need a way to find a match, establish identity, and decide who to trust.',
    contribution: ['Built trade posts, item-specific markets, reputation profiles, and trade requests.', 'Integrated Discord OAuth and Roblox verification, with PostgreSQL persistence through Prisma.', 'Deployed with Docker, AWS, Terraform, and GitHub Actions, then migrated to Oracle Cloud hosting and Supabase PostgreSQL.'],
    decision: 'The application brings identity, discovery, and reputation into the same workflow. Keeping the data model in PostgreSQL and Prisma supports the connected relationships between users, listings, and requests.',
    links: [['Visit marketplace', 'https://deepwoken.trade'], ['View source', 'https://github.com/0utsights/DeepwokenTrade']],
    flow: ['Verify identity', 'Discover a trade', 'Build reputation'],
  },
  {
    slug: 'aeyori', number: '02', title: 'Aeyori / KarutaBot', category: 'OCR & automation', date: 'March 2026 — Present',
    intro: 'Turning visual information into useful automation.',
    summary: 'An open-source OCR tool, supported by a hosted dashboard and backend.',
    stack: ['Python', 'FastAPI', 'EasyOCR', 'Selenium', 'PostgreSQL'],
    problem: 'Card-game automation depends on reliably understanding information displayed on screen. That makes recognition quality and the processing pipeline central to the tool.',
    contribution: ['Developed an open-source OCR automation tool using Python, EasyOCR, and Selenium.', 'Built a FastAPI backend and a hosted dashboard with authentication and license-key management.', 'Collaborated with community developers to improve OCR reliability and processing options.'],
    decision: 'The desktop tool and hosted dashboard serve different parts of the experience. The recognition pipeline handles visual input, while the backend supports account and license management.',
    links: [['View source', 'https://github.com/0utsights/KarutaBot']],
    flow: ['Visual input', 'OCR recognition', 'Automated action'],
  },
  {
    slug: 'legendwatch', number: '03', title: 'LegendWatch', category: 'Real-time systems · Game mod', date: 'March 2026 — Present',
    intro: 'Making a changing match easier to read.',
    summary: 'A Java / Fabric mod that turns public match events into item-tracking indicators.',
    stack: ['Java', 'Fabric API', 'Gradle'],
    problem: 'A live match produces a stream of public events. Useful tracking requires converting that stream into current state and presenting it clearly while the game continues.',
    contribution: ['Created an open-source client-side Minecraft mod using Java and the Fabric API.', 'Parsed public event data, maintained real-time match state, and rendered item-tracking indicators.', 'Published the mod on GitHub, Modrinth, and CurseForge.'],
    decision: 'Event parsing, match state, and the interface form a small real-time pipeline. Separating those responsibilities keeps the display focused on the current match.',
    links: [['View source', 'https://github.com/0utsights/LegendWatch'], ['Modrinth', 'https://modrinth.com/mod/legendwatch'], ['CurseForge', 'https://www.curseforge.com/minecraft/mc-mods/legendwatch']],
    flow: ['Public events', 'Match state', 'Live indicators'],
  },
];

export const contributions = [
  {name:'Microsoft PowerToys', repo:'microsoft/PowerToys', number:'49402', title:'A small sizing fix with a visible difference.', detail:'Corrected Quick Accent window sizing to prevent clipped characters and one-pixel shifts at fractional display scaling.', tech:'C# / WinUI'},
  {name:'NASA-AMMOS / MMGIS', repo:'NASA-AMMOS/MMGIS', number:'1029', title:'Keep the logs that developers need.', detail:'Removed a terminal clear during development startup and added regression coverage, preserving useful logs in terminal scrollback.', tech:'Developer tooling'},
  {name:'GitType', repo:'unhappychoice/gittype', number:'478', title:'Redraw when the terminal changes.', detail:'Handled terminal resize events and added regression tests so the active interface redraws without waiting for another keypress.', tech:'Rust / TUI'},
  {name:'T3 Code', repo:'pingdotgg/t3code', number:'4133', title:'Preserve what a user actually typed.', detail:'Fixed rendering of HTML- and XML-like text in user messages while preserving sanitized assistant output, with regression coverage.', tech:'Message rendering'},
  {name:'Omnigent', repo:'omnigent-ai/omnigent', number:'3661', title:'Broader compatibility for sign-in.', detail:'Added support for additional OIDC signing algorithms, including RS384, RS512, ES384, and ES512, with regression tests.', tech:'Authentication / OIDC'},
];
