# Retirement Savings Calculator

An interactive compound interest visualizer. Project savings growth over any timeline with a stacked bar chart that breaks down principal, self contributions, employer contributions, and earned interest year by year — then surfaces key financial milestones.

**Live demo:** https://amandarae220.github.io/Calculator2.0/

## Features

- Stacked bar chart (D3.js) with smooth reveal animation and bar-level tooltips
- Five key insights surfaced automatically:

  | Insight | What it means |
  |---|---|
  | **Lift Off** | Year your annual interest first exceeds your own contribution |
  | **Tipping Point** | Year cumulative interest exceeds all contributions combined |
  | **Coast FI** | Year you can stop contributing and still reach FI by your target date |
  | **Skim the Top** | Interest-only annual withdrawal at retirement — principal preserved |
  | **Die with Zero** | Full 30-year drawdown annuity at retirement |

- Scenario saving — compare up to 4 projections overlaid on the same chart
- Coast FI calculation based on a yearly spend target (25× rule)
- Mobile-responsive with a slide-up bottom-sheet input panel
- WCAG 2.1 AA compliant — keyboard navigation, screen reader support, `prefers-reduced-motion`

## Tech

- [D3.js v7](https://d3js.org/) — stacked bar chart, scales, axes, transitions
- Vanilla HTML/CSS/JS — no build step, no bundler
- Deployed via GitHub Pages

## Running locally

No build step required. Open `index.html` directly, or use any static file server:

```sh
npx serve .
```
