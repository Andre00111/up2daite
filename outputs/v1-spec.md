# up2daite.com – V1 Produkt-Spec
## Phasen 1–4: UX-Spec · Informationsarchitektur · Domainmodell · React-Architektur

> Grundlage: Agent-Diskussion `outputs/v1-discussion.md` (19. April 2026)
> Constraints: React Frontend only · Lokale JSON/TS-Daten · Kein Backend · Kein Auth · MVP

---

# Phase 1: Produkt- und UX-Spec

## Zielgruppe (aus V1-Entscheidung)

Tech-affine Professionals und Entscheider – Product Manager, Founders, Engineers, Consultants –  
die AI-Entwicklungen beruflich verfolgen müssen, aber keine Zeit für tägliches News-Monitoring haben.

**Kern-Job-to-be-done:**
> „Hilf mir, in 10 Minuten zu verstehen, was in AI diese Woche wirklich passiert ist – und was ich davon brauche."

**Sekundäres Bedürfnis:**
> „Zeig mir, warum du das zeigst und woher es kommt – ich vertraue keinem Aggregator blind."

---

## UX-Prinzipien (aus Agent-Entscheidung, nicht erfunden)

| Prinzip | Operationalisierung |
|---------|---------------------|
| **Signal über Rauschen** | Jede Meldung hat redaktionellen Kommentar (2–4 Sätze). Keine naked links. |
| **Transparenz ist Pflicht** | Jede Meldung zeigt Quellentyp-Icon + Quellenname + Link. Kein Hidden Curation. |
| **Score ist erklärt, nie Black Box** | Signal-Score immer mit Legende. Jede Dimension hat Tooltip/Erklärung. |
| **Filter sind nutzer-gesteuert** | Themenfilter = statisch, kein implizites Learning. Nutzer wählt, System folgt. |
| **Wiederbesuch durch Nützlichkeit** | Kein Gamification. Keine Streaks. Keine Social-Punkte. Wert = Inhalt. |
| **Kein Overload** | Max. 5–7 Artikel pro Ausgabe. Keine Infinite Scrolls. Pagination nach Ausgabe. |

---

## Was das Frontend darstellt

Der Newsletter selbst ist ein E-Mail-Produkt (kein Backend in V1).  
Das React-Frontend ist die **Website-Companion** mit:

1. **Landing / Home** – Wert-Proposition + letzte Ausgabe preview + Signup-CTA (Mailto-Link)
2. **Archiv-Feed** – Alle Ausgaben, filterbar nach Thema
3. **Ausgaben-Detail** – Einzelne Ausgabe mit allen Artikeln, Scores, Icons
4. **Über uns / Methodik** – Signal-Score-Erklärung, Editorial-Philosophie, Themencluster

---

## Was V1 explizit NICHT zeigt (aus Agent-Diskussion)

- Kein Social Sharing UI
- Keine Kommentarfunktion
- Keine Nutzerprofil-Seite
- Keine Push-Notification-Opt-in
- Kein Personalisierungs-Algorithmus
- Kein Preis-/Subscription-Flow (Preismodell noch offen)

---

# Phase 2: Informationsarchitektur und Screens

## URL-Schema

```
/                        → Home (Landing + Teaser der letzten Ausgabe)
/archiv                  → Alle Ausgaben, filterbar nach Themencluster
/ausgabe/:slug           → Einzelne Ausgabe im Detail
/methodik                → Signal-Score-Erklärung + Editoriale Philosophie
```

Keine weiteren Routes in V1.

---

## Navigation

```
[up2daite]    Archiv    Methodik    [Newsletter abonnieren →]
```

- Logo/Wordmark links
- Drei Links: Archiv, Methodik, CTA-Button
- Mobile: Hamburger-Menü (keine Bottom-Nav)
- Aktiver State sichtbar

---

## Screen 1: Home (/)

```
┌─────────────────────────────────────────────────────────────┐
│  HEADER: Logo | Archiv | Methodik | [Abonnieren →]          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  HERO                                                       │
│  ┌───────────────────────────────────────────────────┐     │
│  │  up2daite.com                                      │     │
│  │  AI-Signal. Kein Rauschen.                         │     │
│  │  3× pro Woche. Kuratiert. Transparent.             │     │
│  │                                                    │     │
│  │  [Newsletter abonnieren →]  [Archiv ansehen →]     │     │
│  └───────────────────────────────────────────────────┘     │
│                                                             │
│  LETZTE AUSGABE                                             │
│  ──────────────────────────────────────                     │
│  Ausgabe #12 · 17. April 2026                              │
│                                                             │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐        │
│  │ ARTIKEL-CARD │ │ ARTIKEL-CARD │ │ ARTIKEL-CARD │        │
│  │              │ │              │ │              │        │
│  │ [Score]      │ │ [Score]      │ │ [Score]      │        │
│  │ Titel...     │ │ Titel...     │ │ Titel...     │        │
│  │ Kommentar... │ │ Kommentar... │ │ Kommentar... │        │
│  │ [🔵 Quelle]  │ │ [🟡 Quelle]  │ │ [🔴 Quelle]  │        │
│  └──────────────┘ └──────────────┘ └──────────────┘        │
│                                                             │
│  [→ Gesamte Ausgabe lesen]                                  │
│                                                             │
│  ÜBER DEN SIGNAL-SCORE (Teaser)                             │
│  ──────────────────────────────                             │
│  Wir bewerten jede Meldung nach 3 Dimensionen:             │
│  Impact · Hype-Level · Quellenqualität                      │
│  [→ Methodik lesen]                                         │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  FOOTER: Impressum | © 2026 up2daite.com                    │
└─────────────────────────────────────────────────────────────┘
```

---

## Screen 2: Archiv (/archiv)

```
┌─────────────────────────────────────────────────────────────┐
│  HEADER                                                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Archiv                                                     │
│  Alle Ausgaben · 3× pro Woche seit [Startdatum]            │
│                                                             │
│  THEMENFILTER                                               │
│  [Alle] [AI Research] [AI Products] [AI Policy]            │
│         [AI Business] [AI Tools]                           │
│                                                             │
│  ────────────────────────────────────────────              │
│                                                             │
│  AUSGABEN-LISTE (gefiltert)                                 │
│                                                             │
│  ┌─────────────────────────────────────────────┐           │
│  │ Ausgabe #12 · 17. April 2026                │           │
│  │ "GPT-5, EU AI Act, drei Tools die zählen"   │           │
│  │ 7 Artikel · AI Research · AI Policy · ...   │           │
│  │                              [→ Lesen]       │           │
│  └─────────────────────────────────────────────┘           │
│                                                             │
│  ┌─────────────────────────────────────────────┐           │
│  │ Ausgabe #11 · 14. April 2026                │           │
│  │ "...Titel..."                               │           │
│  │ 6 Artikel · AI Products · AI Business       │           │
│  │                              [→ Lesen]       │           │
│  └─────────────────────────────────────────────┘           │
│                                                             │
│  [ weitere Ausgaben laden ] (oder Pagination)               │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  FOOTER                                                     │
└─────────────────────────────────────────────────────────────┘
```

**Filter-Verhalten:**
- Klick auf Topic-Filter zeigt nur Ausgaben, die mindestens einen Artikel zu diesem Thema enthalten
- "Alle" = kein Filter aktiv
- Filter-State: lokales useState in der ArchivPage, kein URL-State in V1

---

## Screen 3: Ausgaben-Detail (/ausgabe/:slug)

```
┌─────────────────────────────────────────────────────────────┐
│  HEADER                                                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ← Zurück zum Archiv                                        │
│                                                             │
│  AUSGABEN-HEADER                                            │
│  ─────────────────────────────────                          │
│  Ausgabe #12 · Montag, 17. April 2026                      │
│  "GPT-5, EU AI Act, drei Tools die zählen"                 │
│                                                             │
│  EDITOR-NOTE (optional)                                     │
│  "Diese Woche dominiert GPT-5 die Schlagzeilen,            │
│   aber das Wichtigste ist woanders passiert..."             │
│                                                             │
│  ────────────────────────────────────────────              │
│                                                             │
│  ARTIKEL #1                                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  [AI Research]  [AI Products]          ← Topic-Tags │   │
│  │                                                     │   │
│  │  GPT-5 ist da – was das wirklich bedeutet           │   │
│  │  ─────────────────────────────────────              │   │
│  │  OpenAI hat heute GPT-5 offiziell veröffentlicht.   │   │
│  │  Die Benchmarks sind eindrucksvoll, aber das        │   │
│  │  eigentlich Relevante ist die Preisstruktur: ...    │   │
│  │                                                     │   │
│  │  SIGNAL-SCORE                                       │   │
│  │  Impact      ████░  4/5                             │   │
│  │  Hype-Level  ███░░  3/5  ← niedrig = gut            │   │
│  │  Qu-Qualität █████  5/5                             │   │
│  │                                                     │   │
│  │  🔵 Primärquelle · OpenAI Blog  [→ Artikel lesen]   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ARTIKEL #2                                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  ...                                                │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  [← Vorherige Ausgabe]          [Nächste Ausgabe →]        │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  FOOTER                                                     │
└─────────────────────────────────────────────────────────────┘
```

---

## Screen 4: Methodik (/methodik)

```
┌─────────────────────────────────────────────────────────────┐
│  HEADER                                                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Wie wir arbeiten                                           │
│  ─────────────────                                          │
│                                                             │
│  SIGNAL-SCORE                                               │
│  ─────────────────────────────────────────────              │
│  Jede Meldung bewerten wir manuell nach drei Dimensionen:  │
│                                                             │
│  Impact (1–5)                                               │
│  Hat diese Entwicklung kurz- oder mittelfristige            │
│  Konsequenzen für die AI-Industrie oder für                │
│  Professionals, die AI einsetzen?                          │
│                                                             │
│  Hype-Level (1–5)                                           │
│  Wie viel davon ist PR, Spekulation oder Wiederholung       │
│  bereits bekannter Fakten? Niedrig = wenig Hype = gut.      │
│                                                             │
│  Quellenqualität (1–5)                                      │
│  Tier-1-Publikation oder Primärquelle = 5.                 │
│  Aggregiertes Rauschen ohne Quellenangabe = 1.             │
│                                                             │
│  QUELLENTYPEN                                               │
│  ─────────────────────────────────────────────              │
│  🔵 Primärquelle    – Direkter Output der Quelle           │
│                       (Blogpost, Paper, Announcement)       │
│  🟡 Analyse         – Einordnung durch Dritte              │
│                       (Journalist, Analyst, Researcher)     │
│  🔴 PR-getrieben    – Pressemitteilung, Paid Content,      │
│                       oder stark subjektiv/spekulativ       │
│                                                             │
│  THEMENCLUSTER                                              │
│  ─────────────────────────────────────────────              │
│  AI Research · AI Products · AI Policy                     │
│  AI Business · AI Tools                                    │
│                                                             │
│  EDITORIAL-PHILOSOPHIE                                      │
│  ─────────────────────────────────────────────              │
│  "Wir zeigen 5–7 Meldungen pro Ausgabe. Wir sagen auch,    │
│   was wir nicht gebracht haben und warum."                 │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  FOOTER                                                     │
└─────────────────────────────────────────────────────────────┘
```

---

# Phase 3: Domainmodell und JSON-Struktur

## TypeScript-Typen

### Enums / Literal Types

```typescript
// Themencluster (aus V1-Entscheidung: 5 Cluster)
type Topic =
  | 'ai-research'
  | 'ai-products'
  | 'ai-policy'
  | 'ai-business'
  | 'ai-tools'

// Quellentyp (Trust-Layer: 3 Kategorien)
type SourceType = 'primary' | 'analysis' | 'pr-driven'

// Score-Werte: 1–5 Skala (granularer als 1-3, bleibt manuell handhabbar)
type ScoreValue = 1 | 2 | 3 | 4 | 5
```

### Signal-Score

```typescript
interface SignalScore {
  impact: ScoreValue        // Konsequenz für AI-Industrie (hoch = gut)
  hypeLevel: ScoreValue     // Hype/PR-Anteil (niedrig = gut)
  sourceQuality: ScoreValue // Qualität der Quelle (hoch = gut)
}
```

### Quelle einer Meldung

```typescript
interface NewsSource {
  name: string        // z.B. "OpenAI Blog", "MIT Technology Review"
  type: SourceType    // primary | analysis | pr-driven
  url: string         // Link zur Originalquelle
}
```

### Einzelne Meldung (NewsItem)

```typescript
interface NewsItem {
  id: string            // Eindeutige ID, z.B. "item-gpt5-launch-2026-04"
  title: string         // Überschrift
  editorialComment: string  // 2–4 Sätze redaktioneller Kommentar (Kernprodukt!)
  source: NewsSource
  topics: Topic[]       // Eine Meldung kann mehrere Themen haben
  signalScore: SignalScore
  publishedAt: string   // ISO-8601, z.B. "2026-04-17"
}
```

### Newsletter-Ausgabe (Edition)

```typescript
interface Edition {
  id: string            // Eindeutige ID, z.B. "edition-12"
  slug: string          // URL-Segment, z.B. "ausgabe-12-gpt5-eu-ai-act"
  number: number        // Ausgabe-Nummer (#12)
  title: string         // Titel der Ausgabe
  publishedAt: string   // ISO-8601
  editorNote?: string   // Optionale Einleitung des Editors
  items: NewsItem[]     // 5–7 NewsItems
}
```

### Top-Level Datenstruktur

```typescript
// src/data/editions.ts exportiert:
const editions: Edition[]  // sortiert: neueste zuerst

// src/data/topics.ts exportiert:
const topicLabels: Record<Topic, string> = {
  'ai-research':  'AI Research',
  'ai-products':  'AI Products',
  'ai-policy':    'AI Policy',
  'ai-business':  'AI Business',
  'ai-tools':     'AI Tools',
}

const sourceTypeConfig: Record<SourceType, { label: string; icon: string; color: string }> = {
  'primary':    { label: 'Primärquelle',  icon: '🔵', color: 'blue'  },
  'analysis':   { label: 'Analyse',       icon: '🟡', color: 'amber' },
  'pr-driven':  { label: 'PR-getrieben',  icon: '🔴', color: 'red'   },
}
```

---

## Beispiel-Datensatz (1 Ausgabe, 2 Artikel)

```json
{
  "id": "edition-12",
  "slug": "ausgabe-12-gpt5-eu-ai-act",
  "number": 12,
  "title": "GPT-5, EU AI Act, drei Tools die zählen",
  "publishedAt": "2026-04-17",
  "editorNote": "Diese Woche dominiert GPT-5 die Schlagzeilen. Wir zeigen, warum das Wichtigste woanders passiert ist.",
  "items": [
    {
      "id": "item-gpt5-launch",
      "title": "GPT-5 ist da – was das für Professionals bedeutet",
      "editorialComment": "OpenAI hat GPT-5 mit neuer Preisstruktur gestartet. Relevant nicht wegen der Benchmarks, sondern wegen des API-Pricing-Modells das erstmals nutzungsbasiert skaliert. Für Entwickler ändert das die Build-vs-Buy-Kalkulation.",
      "source": {
        "name": "OpenAI Blog",
        "type": "primary",
        "url": "https://openai.com/blog/gpt-5"
      },
      "topics": ["ai-products", "ai-research"],
      "signalScore": {
        "impact": 4,
        "hypeLevel": 3,
        "sourceQuality": 5
      },
      "publishedAt": "2026-04-17"
    },
    {
      "id": "item-eu-ai-act-enforcement",
      "title": "EU AI Act: Erste Enforcement-Fälle werden bekannt",
      "editorialComment": "Zwei Monate nach Inkrafttreten der GPAI-Regeln: Erste Verstöße dokumentiert, aber noch keine Bußgelder. Das Muster zeigt, dass Compliance-Aufwand für kleine Teams unterschätzt wird.",
      "source": {
        "name": "Politico EU Tech",
        "type": "analysis",
        "url": "https://politico.eu/article/eu-ai-act-enforcement"
      },
      "topics": ["ai-policy", "ai-business"],
      "signalScore": {
        "impact": 5,
        "hypeLevel": 1,
        "sourceQuality": 4
      },
      "publishedAt": "2026-04-16"
    }
  ]
}
```

---

# Phase 4: React-Projektstruktur und Komponentenarchitektur

## Tech-Stack (MVP-minimal)

| Entscheidung | Wahl | Begründung |
|---|---|---|
| Framework | React + Vite | Standard, schnell, kein CRA-Overhead |
| Sprache | TypeScript | Typen aus Domain-Modell direkt nutzbar |
| Routing | React Router v6 | 4 Routes, keine Komplexität |
| Styling | Tailwind CSS | Utility-first, kein Design-System-Overhead |
| State | useState (lokal) | Nur Filter-State in ArchivPage, kein globaler State |
| Daten | TS-Dateien als Datenquelle | `import editions from './data/editions'` |
| Icons | Lucide React | Leichtgewichtig, konsistent |

**Kein Redux. Kein Zustand/Jotai. Kein React Query. Kein Next.js.**  
Kein Backend. Kein Fetch. Alle Daten sind statische Imports.

---

## Ordnerstruktur

```
src/
├── types/
│   └── index.ts                  ← Alle TypeScript-Interfaces (Edition, NewsItem, etc.)
│
├── data/
│   ├── editions.ts               ← Mock-Daten: Edition[] (alle Ausgaben)
│   └── topics.ts                 ← topicLabels, sourceTypeConfig
│
├── components/
│   ├── layout/
│   │   ├── Header.tsx            ← Navigation + CTA-Button
│   │   ├── Footer.tsx            ← Minimal
│   │   └── Layout.tsx            ← Wrapper: Header + {children} + Footer
│   │
│   ├── ui/
│   │   ├── SignalScoreBadge.tsx  ← 3 Score-Dimensionen mit Erklärung (Tooltip)
│   │   ├── SourceTypeBadge.tsx   ← Icon + Label (🔵/🟡/🔴 + Quellenname)
│   │   ├── TopicTag.tsx          ← Einzelner Topic-Chip
│   │   └── TopicFilter.tsx       ← Filter-Leiste (Alle + 5 Topics)
│   │
│   └── news/
│       ├── NewsCard.tsx          ← Eine Meldung (title + comment + score + source)
│       ├── EditionCard.tsx       ← Ausgabe als Listenitem im Archiv
│       └── EditionHeader.tsx     ← Ausgaben-Kopf (Nr. + Datum + Titel + EditorNote)
│
├── pages/
│   ├── HomePage.tsx              ← Hero + letzte Ausgabe (3 NewsCards) + Score-Teaser
│   ├── ArchivePage.tsx           ← TopicFilter + EditionCard-Liste
│   ├── EditionDetailPage.tsx     ← EditionHeader + NewsCard-Liste + Prev/Next-Nav
│   └── MethodikPage.tsx          ← Statischer Content: Score + Quellentypen + Cluster
│
├── App.tsx                       ← Router-Setup (4 Routes)
└── main.tsx                      ← Einstiegspunkt
```

---

## Komponentenhierarchie

```
App
└── Layout
    ├── Header
    └── [Route]
        ├── HomePage
        │   ├── [Hero-Section: statisches JSX]
        │   ├── [Letzte Ausgabe: editions[0].items.slice(0,3)]
        │   │   └── NewsCard (×3)
        │   └── [Signal-Score-Teaser: statisches JSX]
        │
        ├── ArchivePage
        │   ├── TopicFilter (activeTopic, onTopicChange)
        │   └── [gefilterte editions]
        │       └── EditionCard (×n)
        │
        ├── EditionDetailPage
        │   ├── EditionHeader (edition)
        │   └── [edition.items]
        │       └── NewsCard (×5–7)
        │           ├── TopicTag (×n)
        │           ├── SignalScoreBadge (signalScore)
        │           └── SourceTypeBadge (source)
        │
        └── MethodikPage
            └── [statischer Content]
```

---

## Komponentenverantwortung (kurz)

### `NewsCard`
Empfängt: `item: NewsItem`  
Zeigt: Titel, editorialComment, TopicTags, SignalScoreBadge, SourceTypeBadge + Link  
Kein eigener State.

### `SignalScoreBadge`
Empfängt: `score: SignalScore`  
Zeigt: 3 Balken (impact / hypeLevel / sourceQuality) mit Label + Tooltip-Erklärung  
Wichtig: hypeLevel-Balken invertiert kennzeichnen (niedrig = grün = gut)

### `SourceTypeBadge`
Empfängt: `source: NewsSource`  
Zeigt: Icon (🔵/🟡/🔴) + `source.name` + externer Link  
Nutzt `sourceTypeConfig` aus `data/topics.ts`

### `TopicFilter`
Empfängt: `activeTopic: Topic | null`, `onChange: (topic: Topic | null) => void`  
Zeigt: "Alle" + 5 Topic-Chips  
State-Owner: ArchivePage (nicht TopicFilter selbst)

### `EditionCard`
Empfängt: `edition: Edition`  
Zeigt: Ausgabe-Nr., Datum, Titel, Topic-Tags der enthaltenen Artikel, Link zur Detail-Seite  
Keine Score-Details (nur Übersicht)

---

## Routing (App.tsx)

```typescript
<Routes>
  <Route path="/"              element={<HomePage />} />
  <Route path="/archiv"        element={<ArchivePage />} />
  <Route path="/ausgabe/:slug" element={<EditionDetailPage />} />
  <Route path="/methodik"      element={<MethodikPage />} />
</Routes>
```

Kein Lazy Loading in V1. Alle 4 Pages direkt importiert.

---

## Filter-Logik (ArchivePage – kein Backend)

```typescript
// ArchivePage.tsx
const [activeTopic, setActiveTopic] = useState<Topic | null>(null)

const filteredEditions = activeTopic
  ? editions.filter(edition =>
      edition.items.some(item => item.topics.includes(activeTopic))
    )
  : editions
```

Einfach, lesbar, keine Abstraktion nötig.

---

## Datenfluss (Übersicht)

```
src/data/editions.ts (statisch)
        ↓ import
App.tsx / Pages
        ↓ props
Components (keine eigenen Datenzugriffe)
```

Keine Context-Provider. Keine globalen Stores. Daten werden von Pages zu Components per Props weitergegeben.

---

# Entscheidungs-Zusammenfassung

| Frage | Entscheidung | Begründung |
|-------|-------------|------------|
| State-Management | useState lokal | Nur Filter-State, kein globaler Bedarf |
| URL-State für Filter | Nein | V1-Simplicity, kein Bookmark-Use-Case |
| Score-Skala | 1–5 | Granularer als 1-3, noch manuell handhabbar |
| hypeLevel-Anzeige | Invertiert (niedrig=gut) | Muss in UI klar kommuniziert sein |
| Lazy Loading | Nein | 4 Pages, kein Performance-Problem |
| Design-System | Tailwind direkt | Kein Overhead, kein Storybook für MVP |
| Icons | Lucide React | Konsistent, tree-shakeable |
| Externe Links | target="_blank" + rel="noopener" | Sicherheit, UX-Standard |

---

*Spec erstellt: 19. April 2026*
*Nächster Schritt: Code-Generierung auf Basis dieser Spec*
