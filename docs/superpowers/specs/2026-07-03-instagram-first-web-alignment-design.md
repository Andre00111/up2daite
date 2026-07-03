# Instagram-First Web-Alignment — Design

**Datum:** 2026-07-03
**Status:** Genehmigt (Design), bereit für Implementierungsplan

## Ziel

Die öffentliche Web-Oberfläche von up2daite an das Styling der generierten
Instagram-Posts angleichen — „Insta first". Die Instagram-Cards sind die
gestalterische Leitlinie (Single Source of Truth), das Web folgt ihr.

## Entscheidungen (aus dem Brainstorming)

| Frage | Entscheidung |
|---|---|
| Grundton | **Vollflächig dunkel** (Instagram-Navy `#0a1628`), kein Light/Dark-Toggle |
| Umfang | **Nur öffentliche Seite.** Admin-Panel bleibt hell & unangetastet |
| Tiefe | **Visuelles Re-Skin + gezielter Layout-Feinschliff** |

## Design-Fundament: Tokens & Theme-Architektur

Farb-Tokens 1:1 aus den Cards (`brandColors` in `frontend/src/theme/index.ts`,
gespiegelt in `frontend/src/utils/instagramCards/canvasUtils.ts`):

| Rolle | Wert |
|---|---|
| Seiten-Hintergrund | `#0a1628` (inverseBg) |
| Karten-/Surface-Flächen | `#0f1f3d` (inverseSurface) |
| Rahmen / Hover-Rahmen | `#1a2744` (inverseBorder) / `#2d3f6b` |
| Akzent-Gradient | `#6366f1` → `#8b5cf6` (nur Hero / Primär-CTA) |
| Akzent flach | Indigo `#6366f1`, Violett `#8b5cf6` |
| Text primär / sekundär | `#f1f5f9` / `#94a3b8` (kein reines Weiß) |
| Score-Grün / Score-Indigo | `#22c55e` / `#6366f1` |
| Bar-Track | `#1e293b` |

**Typografie:** Inter; Headings 800–900 mit negativem Letter-Spacing (wie Cards).

**Theme-Architektur (kritisch für Admin-Isolation):**
- Das gemeinsame Dark-Fundament wird als `sharedDarkTheme` extrahiert (Basis der
  bestehenden `DarkSection`-Werte).
- Das **öffentliche Layout** setzt `sharedDarkTheme` global via `ThemeProvider`.
- Das **Admin-Layout** behält das bestehende Light-Theme über einen eigenen,
  lokalen `ThemeProvider`-Scope. Admin erhält dadurch keinerlei Änderungen.
- `DarkSection` wird auf `sharedDarkTheme` umgestellt bzw. überflüssig, sobald
  das öffentliche Theme global dunkel ist (Verwendung prüfen, nicht duplizieren).

## Komponenten-Mapping (Re-Skin)

Struktur bleibt; nur die visuelle Sprache wird an die Card angeglichen.

| Komponente | Angleichung |
|---|---|
| Header (`components/layout/Header.tsx`) | Navy-Bar `#0a1628`, „UP2DAITE" Indigo/800, Border-bottom `#1a2744` |
| Sidebar/Nav (`components/layout/Sidebar.tsx`) | inverse-Palette, aktive Items Indigo-Akzent |
| StoryCard (`components/features/StoryCard.tsx`) | Surface `#0f1f3d`, Border `#1a2744`, Titel weiß/800, Kommentar `#94a3b8` — wie `drawStoryCard` |
| TopicTag (`components/ui/TopicTag.tsx`) | Chip `#1a2744` + Border `#2d3f6b`, violetter Punkt + Text `#8b5cf6`, uppercase |
| SignalScoreBadge (`components/ui/SignalScoreBadge.tsx`) | Progress-Bars: Track `#1e293b`, Grün-/Indigo-Gradient, Score-Zahl rechts — wie Card-Bars |
| SourceTypeBadge (`components/ui/SourceTypeBadge.tsx`) | inverse-Palette, Farbcodes beibehalten |
| Buttons (global via Theme) | Primär = Indigo→Violett-Gradient (Hover `brightness(1.08)`); sekundär = Outline auf `divider` |
| EditionCard / JobRiskCard | inverse Surface + Border, Akzente wie zugehörige Card-Zeichner |
| Glow-Orbs | Radial-Glows aus `DarkSection` als eigenständige, wiederverwendbare `GlowOrbs`-Komponente |

## Layout-Feinschliff (gezielt)

1. **LandingPage-Hero** → komponiert wie `drawEditionCover`: violettes „DIESE
   WOCHE"-Label, großer 900er-Titel, Gradient-Trennlinie, Gradient-CTA
   „Jetzt lesen →". Baut auf dem bestehenden `DarkSection`-Hero auf.
2. **Story-Feed** (Landing „Letzte Ausgabe" + `EditionDetailPage`) → dunkles
   Card-Grid der StoryCards, wie ein Post-Karussell.
3. **Signal-Score-Teaser** (LandingPage) → eigenes dunkles Band mit echten
   Score-Bars als Live-Demo statt der Emoji-Reihe.

Langtext-Flächen (Story-Detail-Fließtext, About, Archiv-Listen) bleiben
strukturell unverändert — nur eingefärbt, damit die Lesbarkeit bei langen
Texten erhalten bleibt.

## Betroffene Seiten (öffentlich)

`LandingPage`, `EditionDetailPage`, `ArchivPage`, `AIJobsPage`, `AIModelsPage`,
`AboutPage`, `ConfirmPage`, `UnsubscribePage`, `LoginPage` sowie das öffentliche
Layout/Header/Sidebar.

## Barrierefreiheit

- Text sekundär `#94a3b8` auf `#0a1628` / `#0f1f3d` → Kontrast prüfen (Ziel WCAG AA
  für Body-Text; ggf. auf `#a8b3c7` anheben).
- Kein reines Weiß für Fließtext (Halation vermeiden), `#f1f5f9` für Titel.
- Fokus-States sichtbar (Indigo-Ring) auf dunklem Grund.

## Nicht im Scope (YAGNI)

- Admin-Panel (Dashboard, Formulare, Listen) — bleibt hell.
- Kein Light/Dark-Toggle — fest dunkel.
- Keine neuen Seiten, kein Content-Rewrite (außer Layout-bedingte Labels wie
  Hero-„DIESE WOCHE").
- Keine Änderung an der Instagram-Card-Generierung selbst (sie ist die Quelle).

## Erfolgskriterien

- Öffentliche Seiten erscheinen vollflächig im Navy-Card-Look; Feed wirkt wie die
  Instagram-Posts.
- Admin-Panel visuell unverändert (Light).
- Keine harten Kontrast-/Lesbarkeitsregressionen bei Langtext.
- `npm run build` / Lint fehlerfrei; keine doppelten Theme-Definitionen.

## Umsetzung

Die Implementierung übernimmt ein spezialisierter UI/UX-Agent auf Basis des aus
dieser Spec abgeleiteten Implementierungsplans.
