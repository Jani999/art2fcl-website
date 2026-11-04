# ART2FCL / Claude portfolio integration

Production release: `release/claude-portfolio`, copied from the approved Claude preview (`1317dfa`) onto production main without V2/V3 history. Site: https://art2fcl.my.id.

This branch faithfully integrates the supplied Claude `index.html` as a standalone static portfolio: neon Tokyo city, five sections, three projects, animated HUD, and persistent music controls. The original production Next.js code remains in `src/` and `public/`; its commands are prefixed with `legacy:`. The two presentations are not layered together.

## Local review

```sh
npm ci
npm run build:preview
npm run preview
```

Open http://127.0.0.1:4173. The supplied recording is bundled at `portfolio/assets/audio/demons-shot.mp3` for both preview and production. A review server may also be running at http://127.0.0.1:4174.

To review the production artifact:

```sh
npm run build
node scripts/serve-portfolio.mjs dist 4175
```

The player loads the supplied MP3 after metadata preload and attempts playback on load, falling back to the first page click/touch or Enter/Space if browser autoplay policy blocks it. Missing-file errors still disable unavailable controls gracefully.

## Validation

```sh
npm run check
npm run lint
npm run build
npm run build:preview
npm test
npm run typecheck
```

Playwright uses installed Edge locally, Chromium in CI, or Firefox with `TEST_ENGINE=firefox`. Set `PORTFOLIO_PUBLISH=1` to test `dist/` on port 4175 including real audio playback tests. Screenshots and measurements are under `.local/claude/`.

## Files and deployment

- `portfolio/`: HTML, CSS, application JS, local pinned libraries and fonts.
- `references/claude-design/index.html`: unmodified canonical visual reference.
- `scripts/build-portfolio.mjs`: separate preview and public build outputs using the same audio asset.
- `dist/`: GitHub Pages artifact; never includes legacy `public/` assets.
- `.github/workflows/deploy.yml`: deploys only from `main`, including manual runs. Owner approval is required before merging this branch.

The existing Pages custom-domain configuration is retained. DNS and registrar settings were not changed. The workflow does not use a repository-name base path or attempt to replace Pages settings with a CNAME file.

See [integration and QA notes](docs/CLAUDE-INTEGRATION.md). V2/V3 experiments remain on their own branches; their source changes are excluded from this release.
