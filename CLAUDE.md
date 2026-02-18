# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Crestway Global is a static marketing website for a concierge guardianship service supporting international students studying in Canada. It targets Chinese students/families and serves content in English (`/`) and Simplified Chinese (`/zh/`).

## Tech Stack

- **No frameworks** — vanilla TypeScript, HTML, CSS
- **Bun** for building and dev server (no package.json or npm)
- **Vercel** for deployment (static hosting)

## Development Commands

```bash
# Start dev server (port 8085, or set PORT env var)
bun dev-server.ts
```

The dev server auto-builds `client.ts` → `.dev/client.js` and serves all static assets. There are no test, lint, or other build commands.

## Architecture

**Static site with two locales sharing one stylesheet and one JS bundle:**

- `index.html` — English page
- `zh/index.html` — Simplified Chinese page
- `styles.css` — shared CSS with custom properties for theming
- `client.ts` — all client interactivity (compiled by Bun to `client.js`)
- `dev-server.ts` — Bun HTTP server that builds and serves the site locally

**client.ts** handles: access gate (password: `crestway101` stored in sessionStorage), hamburger menu, tab switching, IntersectionObserver-based scroll reveals, active nav tracking, and a 30-second auto-switch on the parents hero panel.

**HTML uses data attributes** as JS hooks (`data-gate`, `data-menu-toggle`, `data-reveal`, `data-tab-group`, etc.) rather than classes or IDs.

## Design Tokens (CSS Custom Properties)

- Colors: `--ink` (#1d1c1a), `--forest` (#0b6f52), `--clay` (#b42625), `--sand` (#f2e8d8), `--cream` (#f8f4ec)
- Fonts: "Fraunces" (serif headings), "Space Grotesk" (sans body)
- Radii: `--radius-lg` (28px), `--radius-md` (18px), `--radius-sm` (10px)

## Key Patterns

- **No external dependencies** — keep the zero-dependency approach
- **Progressive enhancement** — HTML works without JS; JS adds interactivity
- **Accessibility-first** — semantic HTML, ARIA attributes, proper roles
- **i18n via separate HTML files** — both pages share CSS/JS but have fully separate markup
- **Build output in `.dev/`** — gitignored; `client.js` in root is the static production bundle committed to git
