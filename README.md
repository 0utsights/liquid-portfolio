# John Surles — Liquid Architecture

A lightweight, fully static portfolio for [johnsurles.com](https://johnsurles.com).

Seven pre-rendered pages cover an overview, work, research, about, and three project case studies. The site includes an original continuous Canvas line sculpture, progressively enhanced navigation, optional synthesized selection tones, and a downloadable résumé.

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

The build generates `dist/`. Content is in `src/content.mjs` and `scripts/build.mjs`; styles and browser enhancements are in `public/`. The résumé is `public/John-Surles-Resume.pdf`.

## Deployment

The GitHub Actions workflow builds, validates internal destinations and metadata, tests the motion renderer, and deploys `dist/` to GitHub Pages on pushes to `main`. Actions are pinned to commit SHAs. Set the repository's Pages source to **GitHub Actions** and its custom domain to **johnsurles.com**. With an Actions deployment, the Pages setting is authoritative; the retained CNAME records the intended domain.

DNS uses the existing GitHub Pages apex A records and `www` CNAME pointing to `0utsights.github.io`. HTTPS is enabled in repository Pages settings after the certificate is available.

## Interaction and accessibility

- Real HTML routes and links work without JavaScript.
- Browser Back and Forward restore route and scroll position.
- Keyboard navigation, a skip link, focus handling, and reduced-motion support are included.
- The full-viewport line sculpture uses a fresh bounded random seed on each page load and keeps the same form across enhanced navigation.
- Curve geometry is calculated once and cached. The canvas draws once initially and after a debounced size change; scrolling, pointer movement, and navigation do not redraw it or recalculate geometry.
- Gentle motion uses only a CSS transform of the cached canvas. There is no JavaScript animation loop. Motion pauses in hidden tabs and respects the pause control and reduced-motion preference. Touch devices and data-saving connections start still unless a visitor has enabled motion.
- The background bitmap is capped at 1.6 million pixels and device pixel ratio at 1.25; small screens draw fewer curves.
- Sound is off by default and starts only after a visitor explicitly enables it. No autoplay music, trackers, cookies, or third-party runtime scripts.
- `/personal/` redirects to `/about/`. A custom 404 provides recovery links.

The local EB Garamond font is distributed under the SIL Open Font License; see `public/fonts/OFL.txt`.

The project screenshot in `public/images/deepwoken-market.png` was captured from the public [Deepwoken.trade item market](https://deepwoken.trade/items) on September 7, 2026. It is served locally, with a dated caption and a full-size link on the project page.
