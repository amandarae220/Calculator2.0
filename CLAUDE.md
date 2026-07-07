# CLAUDE.md

Instructions and context for Claude when working in this repo. Assume the global `~/.claude/CLAUDE.md` conventions (concise, direct, WCAG 2.1 AA everywhere, atomic commits) already apply — this file is only for project-specific things.

## What this is

An interactive retirement calculator with a D3 stacked bar chart, six financial-milestone insights, saved-scenario comparison, and a consent-gated analytics pipeline into Supabase. Deployed to GitHub Pages at https://amandarae220.github.io/Calculator2.0/. Public source of truth; the [live README](README.md) covers the user-facing story.

## Architecture

Single-page, mostly single-file, no build step. Two supporting HTML files and a tiny `assets/` bundle sit alongside `index.html`. The **why** is documented in [docs/decisions/2026-06-14-single-file-no-build-architecture.md](docs/decisions/2026-06-14-single-file-no-build-architecture.md) — read that ADR before proposing any structural change (Vite, TypeScript, framework migration).

```
index.html            # the calculator app; ~2500 lines of HTML/CSS/JS inline
admin.html            # analytics dashboard, Supabase-auth gated, robots-noindexed
privacy.html          # privacy policy + client-side opt-out button
assets/analytics.js   # consent-gated event tracker (window.CalcAnalytics API)
assets/config.js      # Supabase URL + anon key (public by design, RLS-protected)
docs/calculator_events_schema.sql   # analytics table + RLS policies
```

## Where things live in index.html

| Concern | Function |
|---|---|
| Chart draw + refresh | `lineChartUpdate` (~200 lines, the biggest function) |
| Insight computation | `computeInsights` — Lift Off, Tipping Point, Lean FI, Coast FI, Skim the Top, Die with Zero |
| Chart-marker rendering | `drawMilestoneMarkers` |
| Legend layout (row-wraps to fit) | `computeLegendLayout` + `renderLegend` |
| Insight card DOM | `buildInsightCard` |
| Info tooltip infrastructure | `showInfoTooltip` / `hideInfoTooltip` + `INFO_DEFINITIONS` map |
| Input label info icons | `wireInputInfoButtons` |
| Mobile bottom-sheet inputs | `setupMobileInputs` + `openSheet` / `closeSheet` |

## Style conventions

- **ES5 syntax** (`var`, function declarations, `Object.assign`). No `let`/`const`/arrow/`import` — no build to transpile them.
- **No new dependencies** without discussion. Supabase + D3 are pinned via CDN; adding a third external needs a real reason.
- **CSS custom properties are the source of truth** for brand colors. Chart colors read via `readCssVar()` at init.
- **Design tokens for text-safe colors:** `--tag-text-purple` / `--tag-text-blue` for small text; `--brand-accent` for badges/UI-only elements. Small text needs ≥ 4.5:1 contrast, so the vivid brand colors fail on light backgrounds.

## Deploy flow

Three branches matter:
- `feature/angular-makeover` — active working branch. Push here for v2 changes.
- `main` — also deploys as v2 (merges of `feature/angular-makeover`).
- `v1` — frozen at commit `eb814cd`. This is what gets served at `/v1/`. Don't push commits here.

`.github/workflows/deploy.yml` checks out both v2 and v1, assembles them into a single tree, and writes to `gh-pages`. **GitHub Pages source must be `gh-pages` branch**, not `main`.

## Testing conventions

No unit test runner (no build step). Verification is:
- Manual browser test (Chrome + Safari + mobile viewport) after every meaningful change
- **WAVE** (wave.webaim.org) for contrast + very-small-text alerts
- **axe DevTools** for rule-based a11y scan
- **VoiceOver** (Cmd+F5) for screen-reader announcements — check for **duplicate announcements** on focusable containers with interactive children (this bit us multiple times)
- **Lighthouse** for Core Web Vitals

## Working with the user

- **Never autocommit or autopush.** Stage changes only. The user reviews all diffs before committing.
- **No Claude co-author lines** in commit messages if you're asked to draft one.
- **Global skills apply** (accessibility, security, anti-patterns, code-quality, commit-review, PR template). Reference them.
- User tests on iPhone 11 Safari, so iOS-specific quirks matter (see gotchas).

## Gotchas already discovered

Please don't rediscover these the hard way.

1. **iOS Safari `100vh` clips content**. Always pair with `100dvh` fallback:
   ```css
   height: 100vh; height: 100dvh;
   ```
2. **Oswald cap-height overflows `line-height: 1`** on the hero result. Needs `line-height: 1.15` + `padding-top: 0.12em`.
3. **Info buttons inside `<label>` leak into the input's accessible name.** Fix: wrap the label text in `<span id="lbl-x">`, add `aria-labelledby="lbl-x"` on the input.
4. **`.sr-only` description spans inside focusable containers get read twice.** Give the container an explicit `aria-label` to suppress the child walk.
5. **WAVE flags any text at 10px or below.** 11px is the safe floor.
6. **`title` attribute is ignored by most screen readers.** Use `aria-label` for non-text elements (heatmap cells, etc.).
7. **`<noscript>` triggers WAVE alerts regardless of content.** Use the `no-js` class pattern instead (see `<html class="no-js">` + the head script that removes it).
8. **iOS Safari's flexbox collapses whitespace-only text nodes.** A `tag: ' '` (regular space) has zero height while `tag: ' '` (NBSP) has line-height. Use NBSP for blank tag areas.
9. **PostgREST caches the schema aggressively.** After running SQL that creates a new table, run `notify pgrst, 'reload schema';` or the client will get PGRST205 for ~30 seconds.
10. **The two Supabase projects the user has access to are `ctohybdnobylnlhpbajt` (amanda-repository) and `bkkcwlpkgwqobfdtcomx` (this project).** If the SQL editor is open in the wrong one, tables silently get created where nothing will use them.

## Supabase specifics

- Project ref: `bkkcwlpkgwqobfdtcomx`
- The anon key in `assets/config.js` is *intentionally* public. Security boundary is Row Level Security, not key secrecy.
- RLS policies: anon can INSERT, authenticated can SELECT. Anything else is denied.
- **Email sign-ups should be disabled** in the Supabase auth provider settings — otherwise anyone with the anon key can register and read events via the authenticated-role SELECT policy.
- Admin login uses `client.auth.signInWithPassword({...})` — no raw SQL, so no injection surface.

## Consent flow (analytics)

`assets/analytics.js` reads `localStorage.calc_analytics_consent`:

| Value | Behavior |
|---|---|
| `'accepted'` | Track everything |
| `'declined'` | Track nothing — no visitor UUID ever generated |
| `null` (undecided) | Queue events in `pendingEvents`; flush on accept, drop on decline |

The consent banner in `index.html` dispatches a `calc:consent` CustomEvent when the user picks — analytics listens for it and flushes/drops the queue accordingly.

## Skills applied to this repo

The user runs with these global skills active (`~/.claude/skills/global/`):

- `accessibility.md` — WCAG 2.1 AA + Section 508
- `code-quality.md`, `anti-patterns.md`, `security.md`
- `commit-review.md` — every staged diff gets scored
- `pr-template.md`, `decision-log-template.md` — use these when drafting PRs / ADRs
- `readme-personal.md` — the README follows this format

Recent lessons from this project (esp. VoiceOver + WAVE testing) fed back into `accessibility.md`; treat that file as the current source of truth for a11y rules.
