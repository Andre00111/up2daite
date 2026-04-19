# up2daite.com – Frontend-Architektur
> Basis: v1-frontend-spec.md + v1-ia.md + v1-domain-model.md | Erstellt: 19. April 2026
> Stack: React + Vite + TypeScript + Material UI + React Router v6

---

## 1. Projektstruktur

```
src/
├── types/
│   └── index.ts              ← Alle TypeScript-Interfaces (Story, Edition, Topic, Source, Subscriber)
│
├── data/
│   ├── topics.ts             ← 5 statische Topic-Objekte
│   ├── stories.ts            ← Alle Story-Objekte (Seed-Daten)
│   ├── editions.ts           ← Alle Edition-Objekte (Seed-Daten, neueste zuerst)
│   └── subscribers.ts        ← Leer in V1, Typ vorbereitet
│
├── theme/
│   └── index.ts              ← MUI-Theme (Farben, Typografie, Komponenten-Overrides)
│
├── components/
│   ├── layout/
│   │   ├── Header.tsx        ← Öffentliche Navigation
│   │   ├── Footer.tsx        ← Minimal
│   │   ├── Layout.tsx        ← Public-Wrapper: Header + Outlet + Footer
│   │   └── AdminLayout.tsx   ← Admin-Wrapper: SideNav + Outlet
│   │
│   ├── ui/                   ← Generische, wiederverwendbare Komponenten
│   │   ├── SignalScoreBadge.tsx
│   │   ├── SourceTypeBadge.tsx
│   │   ├── TopicTag.tsx
│   │   └── TopicFilter.tsx
│   │
│   └── features/             ← Fachlich-spezifische Komponenten
│       ├── StoryCard.tsx
│       ├── EditionCard.tsx
│       └── EditionHeader.tsx
│
├── pages/
│   ├── public/
│   │   ├── LandingPage.tsx
│   │   ├── ArchivPage.tsx
│   │   └── EditionDetailPage.tsx
│   │
│   └── admin/
│       ├── AdminDashboardPage.tsx
│       ├── StoryFormPage.tsx
│       ├── EditionFormPage.tsx
│       └── EditionPreviewPage.tsx
│
├── hooks/
│   ├── useEditions.ts        ← Hilfsfunktionen über Editions (filtern, sortieren, prev/next)
│   └── useStories.ts         ← Hilfsfunktionen über Stories (nach EditionId filtern etc.)
│
├── utils/
│   └── slugify.ts            ← Slug-Generierung aus Titel (für Admin-Formular)
│
├── App.tsx                   ← Router-Setup
└── main.tsx                  ← Einstiegspunkt + ThemeProvider
```

**Begründung der Struktur:**
- `components/ui/` enthält nur dumme, zustandslose Anzeigekomponenten
- `components/features/` enthält domänennahe Komponenten, die mehrere ui/-Elemente kombinieren
- `pages/` enthält nur die Route-Ebene; keine Geschäftslogik direkt in Pages
- `hooks/` kapselt Filterlogik – macht Pages schlank und später austauschbar gegen API-Calls
- `data/` ist der einzige Ort mit Daten; kein Datenzugriff direkt in Komponenten

---

## 2. Routing-Struktur

```
App.tsx
│
├── Layout (öffentlich)
│   ├── /                     → LandingPage
│   ├── /archiv               → ArchivPage
│   └── /ausgabe/:slug        → EditionDetailPage
│
└── AdminLayout
    ├── /admin                → AdminDashboardPage
    ├── /admin/story/neu      → StoryFormPage
    ├── /admin/edition/neu    → EditionFormPage
    └── /admin/edition/:id    → EditionPreviewPage
```

**Hinweise:**
- Zwei Layouts: `Layout` (public) und `AdminLayout` (admin) als Nested Routes in React Router v6
- Admin-Routen sind nicht in der öffentlichen Navigation verlinkt
- Kein `<Navigate>` Guard / kein Auth-Check – bewusst weggelassen in V1
- `:slug` auf der Detailseite – wird gegen `editions`-Array gematcht
- `:id` auf der Admin-Vorschau – wird gegen `editions`-Array gematcht

---

## 3. Komponentenstruktur

### Layout-Komponenten

| Komponente | Aufgabe |
|-----------|---------|
| `Header` | Logo + Nav-Link "Archiv" + CTA-Button "Newsletter abonnieren" |
| `Footer` | Minimal: Copyright, keine weiteren Links in V1 |
| `Layout` | Wrap für alle öffentlichen Seiten; gibt `<Outlet />` weiter |
| `AdminLayout` | Seitliche Navigation für Admin-Bereich (Dashboard / Stories / Ausgaben) |

---

### Generische UI-Komponenten (`components/ui/`)

| Komponente | Props | Aufgabe |
|-----------|-------|---------|
| `SignalScoreBadge` | `score: SignalScore` | 3 Dimensionen als beschriftete Balken mit Tooltip je Dimension |
| `SourceTypeBadge` | `source: Source` | Icon (🔵/🟡/🔴) + Quellenname als externer Link |
| `TopicTag` | `topicId: string` | Einzelner Chip mit Topic-Label |
| `TopicFilter` | `active: string \| null`, `onChange: fn` | Filter-Leiste: "Alle" + 5 Topic-Chips |

Diese Komponenten:
- empfangen alles über Props
- haben keinen eigenen State
- kennen keine Seiten-Logik
- können auf jeder Seite verwendet werden

---

### Feature-Komponenten (`components/features/`)

| Komponente | Props | Aufgabe |
|-----------|-------|---------|
| `StoryCard` | `story: Story`, `variant?: 'full' \| 'preview'` | Story-Darstellung: Titel, Kommentar, Score, Quelle, Tags |
| `EditionCard` | `edition: Edition`, `storyCount: number`, `topics: Topic[]` | Edition als Listenelement im Archiv |
| `EditionHeader` | `edition: Edition` | Ausgaben-Kopf: Nummer, Datum, Titel, Editor-Note |

`StoryCard` hat zwei Varianten:
- `full` – Detailseite: alles sichtbar, voller Kommentar, voller Score
- `preview` – Landingpage: gekürzter Kommentar, vereinfachter Score

---

### Seiten-spezifische Komponenten (direkt in `pages/`)

Diese werden nicht exportiert oder wiederverwendet – sie existieren nur einmal.

| Seite | Lokale Komponente / Sektion | Zweck |
|-------|----------------------------|-------|
| `LandingPage` | `HeroSection` | Tagline, Wert-Prop, CTA |
| `LandingPage` | `LatestEditionPreview` | Titel + 3 StoryCards der letzten Ausgabe |
| `EditionDetailPage` | `EditionNav` | "← Vorherige" / "Nächste →" Navigation |
| `AdminDashboardPage` | `AdminStats` | Zahlen: Stories gesamt, Entwürfe, Veröffentlicht |
| `AdminDashboardPage` | `StoryTable` | Tabelle aller Stories mit Status und Edition-Zuweisung |
| `AdminDashboardPage` | `EditionTable` | Tabelle aller Ausgaben mit Status |
| `StoryFormPage` | `StoryForm` | Formular: alle Story-Felder inkl. Score-Eingabe |
| `EditionFormPage` | `EditionForm` | Formular: Titel + Story-Auswahl per Checkbox |
| `EditionPreviewPage` | `EditionPreview` | Leseansicht der Ausgabe + "Veröffentlichen"-Button |

---

## 4. Generische Komponenten

Komponenten in `components/ui/` sind generisch, wenn:
- sie keine Kenntnis über Seiten, Routes oder Datenquellen haben
- sie nur über Props gesteuert werden
- sie keinen internen State haben (Ausnahme: Tooltip-Open-State ist erlaubt)
- sie mit einem anderen Datensatz genauso funktionieren würden

**Konkret generisch:**
- `SignalScoreBadge` – kennt nur `SignalScore`, nicht Story oder Edition
- `SourceTypeBadge` – kennt nur `Source`
- `TopicTag` – kennt nur `topicId` und `topicLabels`
- `TopicFilter` – kennt nur den aktiven Filter und die Callback-Funktion

---

## 5. Seiten-spezifische Komponenten

Komponenten in `pages/` oder als lokale Abschnitte innerhalb einer Page-Datei sind seiten-spezifisch, wenn:
- sie genau einmal verwendet werden
- sie Seiten-spezifische Logik oder Layouts enthalten
- eine Extraktion in `components/` keinen Wiederverwendungsvorteil brächte

**Konkret seiten-spezifisch:**
- `HeroSection` auf der Landingpage
- `EditionNav` auf der Detailseite
- `AdminStats` im Admin Dashboard
- `StoryForm` und `EditionForm` in den Admin-Formular-Pages
- `EditionPreview` im Admin-Review-Screen

---

## 6. Zentral geladene Daten

Es gibt kein zentrales Daten-Laden (kein Context, kein Store).  
Jede Page importiert direkt aus `data/` – synchron, kein Fetch, kein Loading-State.

| Seite | Importiert |
|-------|-----------|
| `LandingPage` | `editions` (nur erstes Element) + `stories` (gefiltert nach editionId) |
| `ArchivPage` | `editions` (alle published) + `topics` |
| `EditionDetailPage` | `editions` (slug-Match) + `stories` (nach editionId) |
| `AdminDashboardPage` | `editions` + `stories` |
| `StoryFormPage` | `topics` (für Dropdown) |
| `EditionFormPage` | `stories` (für Auswahl) + `topics` |
| `EditionPreviewPage` | `editions` (id-Match) + `stories` (nach editionId) |

**Warum kein Context?**  
Daten sind statisch und klein. Context würde nur Overhead erzeugen. Später: Ersatz durch API-Calls direkt in `hooks/useEditions.ts` und `hooks/useStories.ts`.

**Warum Custom Hooks?**  
`useEditions` und `useStories` kapseln Filterlogik (z.B. "alle published Editions, sortiert") und sind der einzige Ort der später auf einen API-Call umgestellt werden muss.

---

## 7. Interaktionen, die lokal im State bleiben können

Diese Interaktionen brauchen keinen globalen State und keine Persistenz:

| Interaktion | State in | Typ |
|-------------|---------|-----|
| Topic-Filter auf Archivseite | `ArchivPage` | `useState<string \| null>` |
| Story-Checkbox-Auswahl in EditionForm | `EditionFormPage` | `useState<string[]>` |
| Formularfelder in StoryForm | `StoryFormPage` | `useState<Partial<Story>>` |
| Formularfelder in EditionForm | `EditionFormPage` | `useState<Partial<Edition>>` |
| "Veröffentlichen"-Status im Admin | `EditionPreviewPage` | `useState<'draft' \| 'published'>` |
| Tooltip-Sichtbarkeit im SignalScoreBadge | `SignalScoreBadge` | Intern via MUI Tooltip |

**Kein `useReducer`, kein Zustand, kein Jotai** – alle States passen in einfaches `useState`.

---

## 8. UI-Patterns aus der Agenten-Diskussion

### Redaktioneller Kommentar ist das Produkt
- `editorialComment` ist in `StoryCard` typografisch der dominante Element (größte Font-Size, kein Icon davor)
- Nie abschneiden in der `full`-Variante
- In der `preview`-Variante: erste 2 Sätze, kein "..." ohne Grund

### Signal-Score: immer erklärt, nie Black Box
- `SignalScoreBadge` zeigt alle 3 Dimensionen mit Beschriftung
- Jede Dimension hat einen MUI Tooltip mit 1-Satz-Erklärung
- `hypeLevel`: Balken-Farbe **invertiert** – 1 = grün (kein Hype), 5 = rot (reiner Hype)
- Kein einziger numerischer Score ohne Label

### Quellentyp-Transparenz ist immer sichtbar
- `SourceTypeBadge` erscheint auf jeder Story, immer
- Niemals ausblenden, niemals optional
- Icon-Farbe ist konsistent: blau / amber / rot (MUI-Palette)

### Themenfilter: statisch und nutzergesteuert
- `TopicFilter` verändert nur lokalen State
- Kein URL-State in V1 (kein `?topic=X` in der URL)
- Kein "Smart"-Verhalten, keine automatische Vorauswahl

### Kein Gamification, kein Social-Druck
- Keine Likes, keine Shares, keine Zählerstände
- Keine "127 Leser"-Badges
- Keine Streak-Anzeigen

---

## 9. Was in V1 bewusst "fake" sein darf

| Aktion | Warum fake OK | Verhalten |
|--------|---------------|-----------|
| "Veröffentlichen" im Admin | Kein Backend vorhanden | Setzt nur lokalen `useState` auf `published`; nach Reload wieder `draft` |
| "Story speichern" | Kein Backend vorhanden | Gibt optisches Feedback (Snackbar), schreibt aber nichts dauerhaft; Daten nur in `data/stories.ts` vorhanden |
| "Ausgabe speichern" | Kein Backend vorhanden | Identisch zu Story speichern |
| Newsletter-CTA | Kein E-Mail-Backend | `mailto:`-Link; öffnet lokales Mail-Programm |
| Slug-Generierung | Keine URL-Persistenz nötig | Einfache Hilfsfunktion aus Titel; Slugs in Mock-Daten sind hardcodiert |
| Ausgaben-Navigation (prev/next) | Lokale Daten reichen | Berechnet aus sortiertem `editions`-Array |
| Admin-Auth | Kein Sicherheitsbedarf im MVP | Route `/admin` ist unverlinkt; kein Passwortschutz |
| "Story importieren via URL" | Kein Scraping möglich | Feld im Formular vorhanden, aber plain Texteingabe ohne Fetch |

---

## Vorbereitung für spätere Backend-Anbindung

Folgende Konventionen halten die spätere Migration zu einem echten Backend einfach:

| Maßnahme | Jetzt | Später |
|----------|-------|--------|
| Datenzugriff nur in `hooks/` | `import editions from '../data/editions'` | `fetch('/api/editions')` |
| TypeScript-Typen in `types/index.ts` | Identisch mit lokalen Daten | Identisch mit API-Response-Shape |
| Keine Geschäftslogik in Komponenten | Filter + Sort in `hooks/` | Hooks bleiben gleich, nur Datenquelle wechselt |
| `status`-Feld auf Edition | Vorhanden, nur lokal gefiltert | Backend kann Status setzen, Frontend filtert identisch |
| `id`-Felder als strings | Kompatibel mit UUID/ULID | Direkt verwendbar als DB-Keys |

---

*Dokument-Status: Bereit für Code-Generierung*
*Nächster Schritt: Vite-Projekt aufsetzen, Typen und Seed-Daten anlegen, dann Komponenten*
