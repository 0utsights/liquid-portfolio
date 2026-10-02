// Every fact here comes from the resume, project READMEs, GitHub's API, Modrinth, or John directly.
// **double asterisks** mark resume-style emphasis. Bold only what a recruiter scans for: technologies,
// technical concepts, and hard numbers. Never feature lists or generic phrases.
export const profile = {
  name: 'John Surles',
  title: 'Computer Science Student · Virginia Tech',
  email: 'surlesjohn@outlook.com',
  phone: '(727) 331-0916',
  phoneHref: 'tel:+17273310916',
  github: 'https://github.com/0utsights',
  linkedin: 'https://www.linkedin.com/in/john-surles-650a16389/',
};

export const about = 'I’m a Computer Science student at Virginia Tech, graduating in May 2028, focused on **backend and full-stack development**. I currently lead one of three student groups in Virginia Tech’s VTURCS undergraduate research lab.';

// First-screen proof points; each links to its evidence further down.
export const highlights = [
  ['Software engineering intern at Procentrix, summer 2026', '/#procentrix'],
  // {count} and {others} are filled in from the contributions list at build time.
  ['**{count} merged pull requests** to Microsoft PowerToys, OpenTelemetry, NASA-AMMOS MMGIS, and {others} other projects', '/oss/'],
  ['Built Deepwoken.trade (**1,000+ users**) and LegendWatch (**3,000+ downloads**)', '/#projects'],
];

export const lookingFor = [
  'Software engineering internships for winter, spring, or summer terms.',
  'Remote or in-person. For in-person roles, Northern Virginia / Washington, DC preferred; open to relocation across the U.S.',
];

export const experience = [
  {
    id: 'procentrix', role: 'Software Engineering Intern', org: 'Procentrix', date: 'June–August 2026',
    points: [
      'Built a reusable **Node.js / TypeScript** backend template with **SQL Server** and separate data-access and service layers.',
      'Implemented **REST APIs** with **authentication, authorization**, input validation, and database access safeguards.',
      'Developed a **React** financial risk assessment interface with **Dataverse**, Fluent UI, and reusable master-detail components.',
      'Published a **Claude Code** plugin marketplace for the engineering team, sharing **React/TypeScript** scaffolding and Dataverse authentication guidance.',
    ],
  },
  {
    id: 'research', role: 'Undergraduate Researcher & Group Lead', org: 'Virginia Tech · VTURCS Undergraduate Research Lab', date: 'September 2026–Present',
    points: [
      'Developing a **semantic search** and matching system for student research opportunities.',
      'Leading one of three student groups under faculty supervision.',
      'Planned work: system testing, evaluation, and preparation for publication.',
    ],
  },
];

// Own projects. Lower bounds, not live counters: LegendWatch has 2,948 downloads on Modrinth alone
// (2026-09-30) plus CurseForge.
export const projects = [
  {
    id: 'deepwoken-trade', name: 'Deepwoken.trade', date: 'June 2026–Present', stack: 'Next.js, TypeScript, PostgreSQL, Prisma, Docker, Terraform',
    summary: 'A trading marketplace for players of the Roblox game Deepwoken, serving **1,000+ users**.',
    points: [
      'Built trade listings, item markets, reputation profiles, and trade requests, with **Discord OAuth** and Roblox account verification.',
      'Deployed with **Docker, AWS, Terraform, and GitHub Actions**; later migrated to **Oracle Cloud and Supabase PostgreSQL**.',
    ],
    links: [['Live site', 'https://deepwoken.trade']], note: 'Source code is private.',
  },
  {
    id: 'legendwatch', name: 'LegendWatch', date: 'March 2026–Present', stack: 'Java, Fabric API, Gradle',
    summary: 'A **Java** Minecraft client mod for the Hoplite server with **3,000+ downloads** across Modrinth and CurseForge.',
    points: [
      'Parses public chat events into match state and shows which players hold legendary items in nametags and the tab list.',
      'Marks predicted item transfers separately from observed crafting events, and clears state when a match ends.',
    ],
    links: [['GitHub', 'https://github.com/0utsights/LegendWatch'], ['Modrinth', 'https://modrinth.com/mod/legendwatch'], ['CurseForge', 'https://www.curseforge.com/minecraft/mc-mods/legendwatch']],
  },
  {
    id: 'aeyori', name: 'Aeyori', date: 'March 2026–Present', stack: 'Python, FastAPI, EasyOCR, Selenium, PostgreSQL',
    summary: 'An experimental, open-source **Python** automation client for the Discord card game Karuta, combining card-image **OCR** with scheduled user-account actions.',
    points: [
      'Built the **EasyOCR** pipeline and workflow coordinator with cooldown handling, independent profiles, and activity logs.',
      'Packaged it for Windows with **PyInstaller**; an earlier hosted version had a **FastAPI** backend with authentication and license keys.',
    ],
    links: [['GitHub', 'https://github.com/0utsights/KarutaBot'], ['Website', 'https://aeyori.com']],
  },
  {
    id: 'opsdeck', name: 'OpsDeck', date: 'August 2026–Present', stack: 'Go, Linux, SSH, Docker',
    summary: 'A terminal dashboard and SSH metrics probe for **Linux** servers, in one native **Go** binary.',
    points: [
      'Collects CPU, memory, disk, network, and container health locally or over **SSH**, with no web server or metrics database.',
      'Derives container placement from live **Docker** state and flags agent heartbeats older than 90 seconds as stale.',
    ],
    links: [['GitHub', 'https://github.com/0utsights/opsdeck']],
  },
  {
    id: 'slime-physics-sandbox', name: 'Slime Physics Sandbox', date: 'April 2026', stack: 'Unity, C#, Rigidbody2D, procedural mesh',
    summary: 'A **Unity / C#** soft-body physics prototype focused on slime deformation and movement through a 2D environment.',
    points: [
      'Developed the body using **Rigidbody2D, distance joints, and springs**, with shape recovery, compression pressure, and a procedural mesh for deformation.',
      'Implemented buffered jumping, coyote time, full-body reset, and contact-aware force handling; built a sandbox for slopes, landings, and tight spaces.',
    ],
    links: [['GitHub', 'https://github.com/0utsights/slime-physics-sandbox']], note: 'A playable build has not yet been published.',
  },
];

// Merged pull requests to projects John does not maintain. Titles, dates, diff sizes, linked issues, and
// validation details come from GitHub (API and PR descriptions), checked 2026-09-30.
export const contributions = [
  {
    repo: 'microsoft/PowerToys', about: 'Microsoft’s Windows productivity utilities', number: 49402,
    title: '[Quick Accent] Fix window width when descriptions are disabled', merged: 'July 22, 2026', lang: 'C# / WinUI',
    diff: '+19 −7 in 2 files', issue: 49346,
    problem: 'Quick Accent clipped or shifted the last character when descriptions were off. The window width ignored the selector’s margins and border, and **fractional display scaling** could round the viewport a pixel short.',
    fix: 'The width is now computed from the surface’s live margin and border thickness, plus a **1-DIP layout-rounding** allowance.',
    verified: 'Runtime-tested at **150% and 175% scaling**. The PR explains why a unit test duplicating the XAML dimensions would not catch this regression.',
  },
  {
    repo: 'open-telemetry/opentelemetry-kotlin', about: 'OpenTelemetry for Kotlin Multiplatform (CNCF)', number: 1064,
    title: 'Fix concurrent span mutation during OnEnding', merged: 'September 18, 2026', lang: 'Kotlin',
    diff: '+119 −26 in 2 files', issue: 1059,
    problem: 'While a span was in its OnEnding callback, another thread could overwrite span data before it was exported (a **race condition**).',
    fix: 'Restricted mutations in the ENDING state to the callback thread using the library’s multiplatform **ThreadLocal**, initialized lazily and kept outside the write lock to avoid **deadlocks**.',
    verified: 'Reproduced the cross-thread overwrite first. After a revision for maintainer review, five cross-thread tests and the **JVM (563) and JS (548) test suites** pass.',
  },
  {
    repo: 'NASA-AMMOS/MMGIS', about: 'NASA-AMMOS web mapping system for planetary science', number: 1029,
    title: 'fix: preserve development startup logs in terminal scrollback', merged: 'August 5, 2026', lang: 'JavaScript',
    diff: '+32 −7 in 4 files', issue: 144,
    problem: 'The development server called console.clear() on startup, wiping earlier logs from the terminal.',
    fix: 'Removed the clear while keeping the startup message, and added a **regression test**.',
    verified: 'Reproduced the original behavior first; the focused test and **all 907 unit tests** pass.',
  },
  {
    repo: 'pingdotgg/t3code', about: 'Web interface for coding agents', number: 4133,
    title: 'fix(web): preserve XML-like tags in user messages', merged: 'August 15, 2026', lang: 'TypeScript',
    diff: '+163 −3 in 3 files', issue: 4059,
    problem: 'User messages containing XML-like tags, such as <global-agent-instructions>, were parsed as **HTML** and silently removed from the chat.',
    fix: 'User messages now render literally, while assistant messages keep **sanitized HTML** rendering.',
    verified: '**Regression tests** cover literal tags, **XSS** rendered as text, and sanitized assistant HTML.',
  },
  {
    repo: 'omnigent-ai/omnigent', about: 'Open-source AI agent framework', number: 3661,
    title: 'Fix #3550: support additional OIDC signing algorithms', merged: 'August 4, 2026', lang: 'Python',
    diff: '+42 −9 in 2 files', issue: 3550,
    problem: 'The **JWT** decoder only allowed RS256 and ES256, rejecting tokens signed with other standard **OIDC** algorithms.',
    fix: 'Added **RS384, RS512, ES384, and ES512** to the allowlist.',
    verified: 'Added an **ES384 regression test**; **114 related OIDC tests** and Ruff pass.',
  },
  {
    repo: 'unhappychoice/gittype', about: 'Rust CLI typing game', number: 478,
    title: 'fix: redraw TUI after terminal resize', merged: 'August 5, 2026', lang: 'Rust',
    diff: '+104 −24 in 2 files',
    problem: 'Resizing the terminal left the interface stale until the next keypress, because resize events were consumed without scheduling a redraw.',
    fix: 'Separated terminal **event dispatch** from key handling and redraw on resize events.',
    verified: '**Regression tests** for resize and keypress redraws using a render-counting test backend; the full suite (**2,769 tests**) passes.',
  },
  {
    repo: 'libredb/libredb-studio', about: 'Open-source browser SQL IDE', number: 904, docs: true,
    title: 'docs: fix Keycloak ID-token role mapping setup', merged: 'September 16, 2026', lang: 'Documentation · OIDC',
    diff: '+5 −1 in 1 file', issue: 850,
    problem: 'The **Keycloak** setup guide left realm roles out of the **ID token**, so administrators signed in with the ordinary user role.',
    fix: 'Documented the required “Add to ID token” mapper setting and made it the first troubleshooting check for a missing admin role.',
    verified: 'Reproduced against a local **Keycloak 26.4** server, then confirmed admin and user accounts mapped correctly through **PKCE** logins; the full test suite (17,537 tests) passes.',
  },
];

export const education = [
  {school: 'Virginia Tech', detail: 'B.S. Computer Science · College of Engineering', date: 'August 2026–May 2028 (expected)'},
  {school: 'Northern Virginia Community College', detail: 'Computer Science · GPA 3.55 / 4.0', date: 'September 2024–May 2026'},
];

// Each skill points to where it was actually used; C++ appears on the resume without a public example.
export const skills = [
  ['TypeScript', [['Procentrix', '/#procentrix'], ['Deepwoken.trade', '/#deepwoken-trade'], ['T3 Code PR', '/oss/#t3code']]],
  ['Python', [['Aeyori', '/#aeyori'], ['Omnigent PR', '/oss/#omnigent']]],
  ['Java', [['LegendWatch', '/#legendwatch']]],
  ['Go', [['OpsDeck', '/#opsdeck']]],
  ['Unity', [['Slime Physics Sandbox', '/#slime-physics-sandbox']]],
  ['SQL & PostgreSQL', [['Procentrix (SQL Server)', '/#procentrix'], ['Deepwoken.trade', '/#deepwoken-trade']]],
  ['Kotlin, C#, Rust, JavaScript', [['OpenTelemetry PR', '/oss/#opentelemetry-kotlin'], ['PowerToys PR', '/oss/#powertoys'], ['GitType PR', '/oss/#gittype'], ['MMGIS PR', '/oss/#mmgis']]],
  ['React, Next.js, Node.js, FastAPI', [['Procentrix', '/#procentrix'], ['Deepwoken.trade', '/#deepwoken-trade'], ['Aeyori', '/#aeyori']]],
  ['Docker, Terraform, AWS, Linux', [['Deepwoken.trade', '/#deepwoken-trade'], ['OpsDeck', '/#opsdeck']]],
];
export const alsoFamiliar = 'C++, Prisma, Fluent UI, Dataverse, GitHub Actions, Oracle Cloud, Git';
