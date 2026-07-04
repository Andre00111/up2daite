# Design: Dark-Tech Card Redesign (Instagram-Style)

**Date:** 2026-07-04
**Status:** Awaiting review

## Goal

Make the web-app cards match the Instagram export cards — the dark-tech look
with glow effects, gradient bars, SVG risk ring, and bold colors seen in
`frontend/instagram-card-preview.html`. Currently the cards render as pale MUI
defaults even though the surrounding app is already dark.

## Key Insight

The theme is **already dark-tech**. `frontend/src/theme/index.ts` defines
`mode: 'dark'`, background `#0a1628`, surface `#0f1f3d`, and brand tokens that
mirror the Instagram cards exactly. Reusable `DarkSection` + `GlowOrbs`
components already exist. The problem is only that the **card components don't
use these effects** — they lean on plain MUI `Card`/`LinearProgress`.

So this is a component-level restyle, not a theming project.

## Scope

Redesign all public content cards + align the page backgrounds that wrap them.
Fold in the English-only cleanup since we're touching these files anyway
(app is English-only per project rule).

### In scope
1. `JobRiskCard.tsx` — full Insta layout
2. `StoryCard.tsx` — colored signal bars, brand pill, dark topic tags
3. `EditionCard.tsx` — dark tile with story-color accents
4. `AIModelsPage` model card styling (same visual family)
5. Page backgrounds: replace hardcoded hero gradients in `AIJobsPage.tsx` and
   `AIModelsPage.tsx` with theme navy / `DarkSection` so cards sit embedded
6. English-only: remove remaining German UI strings in the touched card files

### Out of scope
- Full app dark-mode conversion (already dark)
- Header/Sidebar/Footer German strings (separate cleanup; flagged below)
- Canvas Instagram export cards' German strings (separate task; flagged below)
- Any GitLab/K8s deployment work

## Shared Style Module

Create `frontend/src/theme/cardStyle.ts` (or extend `theme/index.ts` brand
tokens) as the single source of truth for card palette + gradients, so web
cards and canvas cards can't drift:

```
surface:        #0f1f3d
surfaceDeeper:  #111c36
border:         #1a2744
borderStrong:   #2d3f6b
track:          #1e293b
textMuted:      #94a3b8 / #64748b / #475569
brandGradient:  linear-gradient(135deg, #6366f1, #8b5cf6)
riskArc:        #f59e0b → #dc2626
riskBar:        #f59e0b → #ef4444 → #dc2626
signalGreen:    #22c55e → #16a34a
```

Risk thresholds: >=70 critical (#f87171), >=40 medium (#fbbf24), else low (#4ade80).
Trend: rising #ef4444 ↑, declining #22c55e ↓, stable #f59e0b →.

## Component Designs

### JobRiskCard
- Dark card (`background.paper`), red-tinted `GlowOrbs` variant, subtle red border.
- Header row: category chip (dark) left, "⚠ JOB RISK" pill right.
- Body: **SVG risk ring** (radius ~56px web-scaled) with gradient arc filling to
  `score%`, big score number centered; job title (h6, bold) beside it; colored
  trend line; muted category line.
- "AUTOMATION RISK" label + risk-level word (colored) + gradient risk bar.
- Reasoning text (muted), shown **once** (fixes the canvas duplicate-reasoning bug).
- Affected-task pills (dark, bordered).

### StoryCard
- Dark card; "AI NEWS" pill with brand gradient.
- Dark topic tags (bg #1a2744, border #2d3f6b, violet text).
- Title white/bold; editorial comment as primary content.
- Signal-score bars: Impact/Hype green gradient, Source violet/indigo gradient,
  with numeric values — replacing the plain text row.
- Source badge in dark style.

### EditionCard
- Dark clickable tile; edition-number chip; date + story count.
- Title bold; topic tags dark; keep the story-color accent family for icons.

### Page backgrounds
- `AIJobsPage`: replace `linear-gradient(135deg,#0f172a...#0d47a1)` hero with a
  `DarkSection glow` (or theme navy). Cards grid stays on `#0a1628`.
- `AIModelsPage`: replace the three hardcoded gradients with `DarkSection`.

## English-only Cleanup (touched files only)
- JobRiskCard: Kritisch/Mittel/Niedrig → Critical/Medium/Low; Steigend/Sinkend/
  Stabil → Rising/Declining/Stable; Automatisierungsrisiko → Automation Risk;
  Betroffene Aufgaben → Affected Tasks.
- StoryCard: Quelle → Source.
- EditionCard: `toLocaleDateString('de-DE')` → `'en-US'`.
- AIJobsPage hero German copy → English.

## Flagged (separate follow-up tasks, NOT this change)
- Canvas export cards still German (drawJobRiskCard/drawModelCard/
  drawEditionCover) — "KW", "Ausgabe", "EINSCHÄTZUNG", etc.
- Header/Sidebar/Footer nav labels still German.

## Testing / Verification
- Run the Vite dev server, open AIJobsPage / LandingPage / ArchivPage /
  AIModelsPage / an EditionDetail page.
- Visually confirm cards match the Instagram preview look (glow, ring, gradient
  bars, dark tiles) and read as one system.
- Confirm no German strings remain in the touched card files.
- `tsc` / build passes.

## Implementation Note
Design/planning by Opus; code written by a cheaper model (Sonnet) via subagents
per user request.
