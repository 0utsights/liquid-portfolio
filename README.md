# John Surles — Software Engineering Portfolio

A lightweight, fully static portfolio for [johnsurles.com](https://johnsurles.com).

Eight pre-rendered pages cover an overview, work, research, about, three featured project case studies, and a supporting OpsDeck page. The overview emphasizes backend engineering and features Deepwoken.trade, Aeyori, and LegendWatch, with OpsDeck and Issue Proof in the supporting GitHub section. Every page works with zero client JavaScript, and the downloadable résumé reflects current Virginia Tech attendance.

The overview owns the project index. Work expands the internship and open-source contributions; About contains education and skills. Project titles open the case studies, whose return links lead back to the overview's project section.

## Local development

Requires Node.js 22 or later. There are no third-party JavaScript dependencies.

```sh
npm ci
npm run dev
```

Open the local address printed by the server. Run `npm run build` after editing source files; refresh the preview to see changes.

```sh
npm run build
npm test
```

The build recreates `dist/` to prevent obsolete assets from surviving a rebuild. Content is in `src/content.mjs` and `scripts/build.mjs`; styles and assets are in `public/`. The résumé is `public/John-Surles-Resume.pdf`.

## Deployment

The GitHub Actions workflow builds, validates internal destinations and metadata, and deploys `dist/` to GitHub Pages on pushes to `main`. Actions are pinned to commit SHAs. Set the repository's Pages source to **GitHub Actions** and its custom domain to **johnsurles.com**. With an Actions deployment, the Pages setting is authoritative; the retained CNAME records the intended domain.

DNS uses the existing GitHub Pages apex A records and `www` CNAME pointing to `0utsights.github.io`. HTTPS is enabled in repository Pages settings after the certificate is available.

## Interaction and accessibility

- Real HTML routes and links work without JavaScript.
- Navigation, browser history, and PDF opening use native browser behavior.
- Keyboard navigation, a skip link, visible focus, print styles, and reduced-motion support are included.
- Header identity and contact links are always visible; the header wraps on small screens.
- Engineering notes use native HTML disclosures, open by default on project pages. System diagrams are semantic HTML; the marketplace screenshot is local and lazy-loaded. The blue-ink visual system uses the existing local font and one shared contour SVG.
- A decorative SVG contour field is generated at build time. Desktop motion uses only a slow CSS transform with a native pause checkbox; reduced-motion, touch devices, and small screens stay static. The background is hidden in print and forced-colors modes.
- Colors are theme tokens in `public/styles.css`. A dark palette follows the visitor's system setting; print always uses the light palette. Both palettes pass axe WCAG 2.1 AA checks.
- Links that open a new tab show a small arrow and announce "opens in a new tab" to screen readers.
- No canvas, JavaScript animation loop, audio, client routing, trackers, cookies, or third-party runtime scripts. The only `<script>` is inert JSON-LD profile data on the overview.
- The marketplace screenshot is served as WebP with a PNG fallback.
- `/personal/` redirects to `/about/`. A custom 404 provides recovery links.

## Sharing and search metadata

Every page has a canonical URL, description, Open Graph and large-image card tags, and an Apple touch icon. `public/images/social-card.jpg` (1200×630) and `public/apple-touch-icon.png` are rendered from `scripts/social-card.html`: run `npm run build`, open that file in a Chromium browser at 1200×630 (append `#icon` at 180×180 for the icon), and save a screenshot. Regenerate the card if the headline facts change.

The local EB Garamond font is distributed under the SIL Open Font License; see `public/fonts/OFL.txt`.

The project screenshot in `public/images/deepwoken-market.png` was captured from the public [Deepwoken.trade item market](https://deepwoken.trade/items) on September 7, 2026. It is served locally, with a dated caption and a full-size link on the project page.

Engineering notes are grounded in the project READMEs and the PowerToys PR #49402 description. Usage and download lower bounds match the September 9 resume; they are not live counters. Merge months on the Work page come from each pull request's `merged_at` date. All project pages retain their original URLs.
