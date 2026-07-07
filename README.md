# Retirement Savings Calculator

[![Deploy](https://github.com/amandarae220/Calculator2.0/actions/workflows/deploy.yml/badge.svg)](https://github.com/amandarae220/Calculator2.0/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![GitHub last commit](https://img.shields.io/github/last-commit/amandarae220/Calculator2.0)](https://github.com/amandarae220/Calculator2.0/commits)
[![Built with D3.js](https://img.shields.io/badge/built%20with-D3.js%20v7-f9a03c)](https://d3js.org/)

I built this to answer the question I kept asking myself: at what point does my money start working harder than I do? Plug in your numbers and the chart shows you exactly when that crossover happens.

**Live:** https://amandarae220.github.io/Calculator2.0/ &nbsp;·&nbsp; **Previous version:** [v1](https://amandarae220.github.io/Calculator2.0/v1/)

---

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Deployment](#deployment)
- [Latest Updates](#latest-updates)

---

## Overview

A compound interest visualizer that projects savings growth year by year and surfaces the key inflection points automatically. It breaks your balance down into principal, self contributions, employer contributions, and earned interest, then flags six milestones: Lift Off (annual interest overtakes your contributions), Tipping Point (compounding takes over your balance), Lean FI (retire on a trimmed budget), Coast FI (stop contributing and coast to full FI), plus Skim the Top and Die with Zero as retirement drawdown scenarios. Anonymous usage analytics feed an admin dashboard at [`/admin`](admin.html) to guide improvements. Built as a mostly zero-dependency single-file app so it stays easy to host and share.

> [!NOTE]
> The full architecture rationale is documented in [docs/decisions/2026-06-14-single-file-no-build-architecture.md](docs/decisions/2026-06-14-single-file-no-build-architecture.md).

---

## Tech Stack

| Technology | Why I chose it |
|------------|----------------|
| D3.js v7 | Custom stacked bar chart with animation and grouped axes. Would've been painful to build from scratch with canvas or native SVG. |
| Vanilla JS/CSS | No build step means instant GitHub Pages deployment with no toolchain to maintain. |
| Supabase | Analytics backend + auth for the admin dashboard. Free tier, RLS-protected, no server to run. |
| GitHub Pages + Actions | Serves two versions (v1 at `/v1/`, current at `/`) from the same repo without a separate hosting account. |

---

## Getting Started

No build step required. Open `index.html` directly, or:

```bash
npx serve .
```

The app runs at `http://localhost:3000` by default.

<details>
<summary>Project structure</summary>

```
.
├── index.html                           # the calculator app
├── admin.html                           # analytics dashboard (Supabase-auth gated)
├── privacy.html                         # privacy policy + opt-out
├── assets/
│   ├── analytics.js                     # consent-gated event tracker
│   └── config.js                        # public Supabase URL + anon key
├── docs/
│   ├── calculator_events_schema.sql     # analytics table + RLS policies
│   └── decisions/                       # ADRs
├── robots.txt + sitemap.xml             # SEO
└── .github/
    ├── workflows/deploy.yml             # builds gh-pages from main + feature branches
    └── pull_request_template.md
```
</details>

---

## Deployment

Deployed via GitHub Pages. A GitHub Actions workflow builds the `gh-pages` branch on every push, assembling the current version at the root and the previous version at `/v1/`.

> [!IMPORTANT]
> Pages source must be set to the `gh-pages` branch in repo Settings, not `main`. The workflow writes to `gh-pages`; pointing Pages at `main` will skip the deploy entirely.

---

## Latest Updates

- **Jul 2026** — Privacy policy, first-visit consent banner, and analytics opt-out — nothing tracks until you accept
- **Jun 2026** — Analytics dashboard at [`/admin`](admin.html): daily activity sparkline, event breakdown, day×hour heatmap, top insights focused
- **Jun 2026** — Added Lean FI insight and info tooltips (with screen-reader descriptions) on every FI term and input
- **Jun 2026** — Full WCAG 2.1 AA + Section 508 audit against WAVE and VoiceOver: aria-labelledby fixes, contrast passes, 24×24 touch targets, no-js class replacing `<noscript>`
- **Jun 2026** — SEO pass: structured data, Open Graph + Twitter cards, resource hints, semantic heading hierarchy
