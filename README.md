# John Surles — Software Engineering Portfolio

A fast, static portfolio for [johnsurles.com](https://johnsurles.com), with a live WebGL contour field behind it.

Seven pre-rendered pages: an overview, Work (experience, research, merged pull requests, and case studies), About (background, education, skills, and contact), and four project case studies (Deepwoken.trade, Aeyori, LegendWatch, OpsDeck). The overview is built for a recruiter's first minute: availability, a one-line pitch, resume and email actions, a proof strip, experience, projects, merged PRs, and a closing contact block.

## Local development

Requires Node.js 22 or later. There are no third-party dependencies.

```sh
npm ci
npm run dev      # builds, then serves dist/ at http://127.0.0.1:4173/
npm run build    # rebuild after editing; refresh the preview
npm test
```

The build recreates `dist/`. Content lives in `src/content.mjs`, templates in `scripts/build.mjs`, and styles, the enhancement script, and assets in `public/`. The resume is `public/John-Surles-Resume.pdf`.

## The contour field

`public/site.js` (about 10 KB, no dependencies) is progressive enhancement. Every page is complete without it.

- A WebGL2 fragment shader draws domain-warped simplex-noise contours, with an index line every fifth contour. The cursor raises a hill, drags a wake, and lights nearby lines; clicks and taps send ripples; scrolling adds parallax.
- It renders at a reduced internal resolution (0.75× on desktop, 0.55× on touch devices, times the device pixel ratio up to 2) and lowers that further if frames run long.
- It stops rendering entirely once the pointer, ripples, and load-in have settled (about three seconds after the last movement), so an idle page costs nothing. This is why there is no pause control.
- With `prefers-reduced-motion: reduce`, it draws one still frame and does not react to the pointer.
- Without JavaScript or WebGL2, the page shows `contours.svg`, a static contour field generated at build time by `src/background.mjs`.

The same script adds cursor-following spotlights to cards (fine pointers only) and a reveal-on-scroll for sections (skipped with reduced motion). The only other scripts are an inline class toggle (`no-js` → `js`) and JSON-LD profile data on the overview. Tests enforce this, and they cap `site.js` at 14 KB, the stylesheet at 32 KB, and the home HTML at 40 KB.

## Deployment

The GitHub Actions workflow builds, tests, and deploys `dist/` to GitHub Pages on pushes to `main`. Actions are pinned to commit SHAs. The repository's Pages source is **GitHub Actions** and its custom domain is **johnsurles.com**. The retained CNAME records the intended domain.

DNS uses the existing GitHub Pages apex A records and a `www` CNAME pointing to `0utsights.github.io`.

## Accessibility

- Real HTML routes and links; navigation and PDF opening use native browser behavior.
- A skip link, visible focus on every control, a logical tab order (resume first), and landmarks. axe-core reports no WCAG 2.1 AA violations on any page.
- Links that open a new tab show an arrow and announce "(opens in a new tab)".
- The dark palette keeps body text at 5.7:1 contrast or better. Print uses a light, ink-friendly palette with every section visible. Forced-colors mode hides the decorative field.
- `/personal/` redirects to `/about/` and `/research/` to `/work/#research`. A custom 404 provides recovery links.

## Sharing and search metadata

Every page has a canonical URL, a description, Open Graph and large-image card tags, and an Apple touch icon. The overview includes ProfilePage/Person JSON-LD.

`public/images/social-card.jpg` (1200×630) and `public/apple-touch-icon.png` are rendered from `scripts/social-card.html`:

1. Capture a 1200×630 frame of the live field: the site with its content hidden.
2. Open the template with `?bg=<that image>` at 1200×630 in a Chromium browser, and save a screenshot.
3. Append `#icon` at 180×180 for the touch icon.

Regenerate the card when the headline facts change.

## Sources for facts

- Engineering notes are grounded in the project READMEs and the PowerToys PR #49402 description.
- Merge months come from each pull request's `merged_at` date on GitHub.
- "1,000+ users" matches the resume.
- "3,000+ downloads" combines Modrinth (2,948 on September 30, 2026) and CurseForge.
- Issue Proof is described from its private repository's README; its source is private and it is not linked.

These are lower bounds, not live counters.

The project screenshot in `public/images/deepwoken-market.png` (with a WebP copy) was captured from the public [Deepwoken.trade item market](https://deepwoken.trade/items) on September 7, 2026.

The local EB Garamond font is distributed under the SIL Open Font License; see `public/fonts/OFL.txt`. Simplex noise in `site.js` is by Ian McEwan, Ashima Arts (MIT License).
