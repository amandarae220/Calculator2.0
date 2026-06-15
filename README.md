# Retirement Savings Calculator

I built this to answer the question I kept asking myself: at what point does my money start working harder than I do? Plug in your numbers and the chart shows you exactly when that crossover happens.

Live: https://amandarae220.github.io/Calculator2.0/

---

## Overview

A compound interest visualizer that projects savings growth year by year and surfaces the key inflection points automatically. It breaks your balance down into principal, self contributions, employer contributions, and earned interest, then flags five milestones: when annual interest first beats your own contribution (Lift Off), when cumulative interest overtakes everything you've put in (Tipping Point), when you can stop contributing and still hit your FI number (Coast FI), and two retirement drawdown scenarios. Built as a zero-dependency single-file app so it stays easy to host and share.

---

## Tech Stack

| Technology | Why I chose it |
|------------|----------------|
| D3.js v7 | Custom stacked bar chart with animation and grouped axes — would've been painful to build from scratch with canvas or native SVG |
| Vanilla JS/CSS | No build step means instant GitHub Pages deployment with no toolchain to maintain |
| GitHub Pages + Actions | Serves two versions (v1 at `/v1/`, current at `/`) from the same repo without a separate hosting account |

---

## Getting Started

No build step required. Open `index.html` directly, or:

```bash
npx serve .
```

The app runs at `http://localhost:3000` by default.

---

## Deployment

Deployed via GitHub Pages. A GitHub Actions workflow builds the `gh-pages` branch on every push, assembling the current version at the root and the previous version at `/v1/`.

---

## Latest Updates

- **Jun 2026** — Full WCAG 2.1 AA audit: focus trapping, aria-live regions, reduced-motion support, contrast fixes
- **Jun 2026** — Added five key financial insight cards with animated chart markers and cross-highlight on hover
- **Jun 2026** — Added scenario saving, mobile bottom-sheet layout, and input validation
