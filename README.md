# John Surles — Portfolio

A plain, static portfolio for [johnsurles.com](https://johnsurles.com), modeled on the layout of [unhappychoice.com](https://unhappychoice.com/): one narrow column of white cards on teal, with Profile and Open Source tabs.

- **Profile** (`/`) has About with first-screen highlights, Looking for, Experience, an Open source summary, Projects, Education, Skills (each linked to where it was used), and Links.
- **Open Source** (`/oss/`) covers merged pull requests to projects John does not maintain. Each shows the problem, the change, how it was verified, the diff size, the linked issue, and the merge date. It deliberately omits the host repositories' star counts, which measure those projects, not the contribution. His own open-source projects follow in a short list.

All content is rendered at build time. There is no client-side JavaScript and no "Loading…" state; the only `<script>` is inert JSON-LD profile data. There are no web fonts; the font stack prefers Rubik if installed, then the system UI font.

## Local development

Requires Node.js 22 or later. There are no third-party dependencies.

```sh
npm ci
npm run dev      # builds, then serves dist/ at http://127.0.0.1:4173/
npm run build    # rebuild after editing; refresh the preview
npm test
```

Content lives in `src/content.mjs`, templates in `scripts/build.mjs`, and styles and assets in `public/`. The resume is `public/John-Surles-Resume.pdf`.

Older URLs redirect:

| Old URL | Now goes to |
| --- | --- |
| `/about/`, `/personal/` | `/` |
| `/work/` | `/#experience` |
| `/research/` | `/#research` |
| `/work/<project>/` | that project on the Profile |

## Deployment

The GitHub Actions workflow builds, tests, and deploys `dist/` to GitHub Pages on pushes to `main`. Actions are pinned to commit SHAs. The Pages source is **GitHub Actions** and the custom domain is **johnsurles.com**. DNS uses the GitHub Pages apex A records and a `www` CNAME to `0utsights.github.io`.

## Sharing metadata

Each page has a canonical URL, a description, Open Graph and large-image card tags, and an Apple touch icon. `public/images/social-card.jpg` (1200×630) and `public/apple-touch-icon.png` are rendered from `scripts/social-card.html`: open it at 1200×630 in a Chromium browser and screenshot it, or append `#icon` at 180×180 for the icon.

## Sources for facts

- PR titles, merge dates, diff sizes, linked issues, and verification details come from GitHub's API and the PR descriptions, checked September 30, 2026.
- "1,000+ users" matches the resume.
- "3,000+ downloads" combines Modrinth (2,948 on September 30, 2026) and CurseForge.
- Project details come from each project's README.

These are lower bounds, not live counters.
