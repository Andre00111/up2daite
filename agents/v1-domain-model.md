# up2daite.com – Frontend-Domainmodell
> Basis: v1-frontend-spec.md + v1-ia.md | Erstellt: 19. April 2026

---

## 1. Objektbeschreibungen

### Topic
Definiert die fünf Themencluster, nach denen Inhalte kategorisiert und gefiltert werden.  
Statisch – ändert sich in V1 nicht. Kein eigenes Formular, keine Admin-Verwaltung.

### Source
Beschreibt, woher eine Story stammt: Name der Publikation, URL zur Originalquelle und Quellentyp.  
Source ist kein eigenständiges Objekt mit eigenem Datensatz – sie ist direkt in Story eingebettet.  
Begründung: Es gibt keine Quellen-Verwaltung, keine Deduplizierung, kein Quellen-Archiv in V1.

### Story
Die kleinste inhaltliche Einheit des Produkts. Eine Story ist eine einzelne kuratierte Meldung mit Titel, redaktionellem Kommentar, Quellenangabe, Themenzuordnung und Signal-Score.  
Stories existieren unabhängig von Ausgaben und werden erst nachträglich einer Edition zugeordnet.

### Edition
Eine Ausgabe des Newsletters, bestehend aus 5–7 Stories. Die Edition hat einen eigenen Titel, ein Datum, eine laufende Nummer und einen optionalen Editor-Kommentar. Sie hat einen Status (Entwurf oder veröffentlicht) und referenziert Stories über ihre IDs.

### Subscriber
Speichert E-Mail-Adresse und optionale Themenauswahl eines Abonnenten.  
In V1 gibt es keinen UI-Workflow für Subscriber. Das Objekt ist im Datenmodell definiert, aber die Datei bleibt leer oder enthält Beispieldaten. Kein Formular, kein Speichern, kein Backend.

---

## 2. Felder je Objekt

### Topic

| Feld | Typ | Beschreibung |
|------|-----|-------------|
| `id` | string (Slug) | Eindeutiger Bezeichner, z.B. `ai-research` |
| `label` | string | Anzeigename, z.B. `AI Research` |

Fünf feste Werte: `ai-research`, `ai-products`, `ai-policy`, `ai-business`, `ai-tools`.  
Kein weiteres Feld nötig.

---

### Source (eingebettet in Story)

| Feld | Typ | Beschreibung |
|------|-----|-------------|
| `name` | string | Name der Publikation, z.B. `OpenAI Blog` |
| `url` | string | Link zur Originalquelle |
| `type` | Enum | Einer von drei Werten: `primary`, `analysis`, `pr-driven` |

Enum-Bedeutungen:
- `primary` – Direkter Output der Quelle (Blogpost, Paper, Announcement)
- `analysis` – Einordnung durch Dritte (Journalist, Analyst, Researcher)
- `pr-driven` – Pressemitteilung, Paid Content oder stark spekulativ

---

### Story

| Feld | Typ | Pflicht | Beschreibung |
|------|-----|---------|-------------|
| `id` | string | Ja | Eindeutige ID, z.B. `story-gpt5-launch` |
| `title` | string | Ja | Überschrift der Meldung |
| `editorialComment` | string | Ja | Redaktioneller Kommentar, 2–4 Sätze – das ist das Kernprodukt |
| `source` | Source | Ja | Eingebettetes Source-Objekt (name, url, type) |
| `topics` | string[] | Ja | Array von Topic-IDs, min. 1, max. 3 |
| `signalScore` | Objekt | Ja | 3 Felder: impact, hypeLevel, sourceQuality (je 1–5) |
| `publishedAt` | string | Ja | ISO-Datum der Meldung, z.B. `2026-04-17` |
| `editionId` | string | Nein | ID der zugeordneten Ausgabe; null wenn noch nicht zugeordnet |

**Signal-Score-Unterfelder:**

| Feld | Typ | Bedeutung |
|------|-----|-----------|
| `impact` | 1–5 | Relevanz / Konsequenz für AI-Industrie (5 = hoch) |
| `hypeLevel` | 1–5 | PR- und Hype-Anteil (1 = kein Hype = gut, 5 = reiner Hype) |
| `sourceQuality` | 1–5 | Qualität der Quelle (5 = Primärquelle / Tier-1) |

---

### Edition

| Feld | Typ | Pflicht | Beschreibung |
|------|-----|---------|-------------|
| `id` | string | Ja | Eindeutige ID, z.B. `edition-12` |
| `slug` | string | Ja | URL-Segment, z.B. `ausgabe-12-gpt5-eu-ai-act` |
| `number` | number | Ja | Laufende Ausgaben-Nummer |
| `title` | string | Ja | Titel der Ausgabe |
| `publishedAt` | string | Ja | ISO-Datum der Veröffentlichung |
| `status` | Enum | Ja | `draft` oder `published` |
| `editorNote` | string | Nein | Optionale redaktionelle Einleitung zur Ausgabe |
| `storyIds` | string[] | Ja | Geordnete Liste von Story-IDs (5–7 Einträge) |

---

### Subscriber

| Feld | Typ | Pflicht | Beschreibung |
|------|-----|---------|-------------|
| `id` | string | Ja | Eindeutige ID |
| `email` | string | Ja | E-Mail-Adresse |
| `topics` | string[] | Nein | Ausgewählte Topic-IDs beim Onboarding (kann leer sein) |
| `subscribedAt` | string | Ja | ISO-Datum der Anmeldung |

**Hinweis:** Diese Datei ist in V1 leer oder enthält Dummy-Einträge. Kein UI-Workflow, kein echter Submit.

---

## 3. Beziehungen zwischen Objekten

```
Topic (statisch, 5 Einträge)
  ↑ referenziert von
  │
Story
  ├── enthält eingebettete Source (kein separater Datensatz)
  ├── referenziert 1–3 Topics via topics: string[]
  └── gehört zu 0–1 Edition via editionId: string | null
  
Edition
  └── referenziert 5–7 Stories via storyIds: string[]

Subscriber
  └── referenziert 0–5 Topics via topics: string[]
      (kein direkter Bezug zu Stories oder Editions)
```

**Wichtige Regel:** Edition und Story referenzieren sich gegenseitig (`storyIds` in Edition, `editionId` in Story). Das ist bewusste Redundanz für einfaches Lesen ohne Join-Logik. Im Frontend wird immer nur eine Richtung aktiv gelesen.

---

## 4. Dateistruktur im Frontend

```
src/
└── data/
    ├── topics.ts        → Statische Liste der 5 Topic-Objekte
    ├── stories.ts       → Array aller Story-Objekte
    ├── editions.ts      → Array aller Edition-Objekte (sortiert: neueste zuerst)
    └── subscribers.ts   → Array von Subscriber-Objekten (V1: leer oder Dummy)
```

**Keine separate `sources.ts`** – Source ist in Story eingebettet.  
**Keine `index.ts`** als Re-Export – direkte Imports sind in V1 klarer.  
**Alle Dateien als `.ts`**, nicht `.json` – TypeScript-Typen sind direkt nutzbar, kein separater Import-Step.

---

## 5. Seed-Daten (inhaltlich beschrieben, noch kein Code)

### topics.ts
Fünf feste Einträge:
- `ai-research` → "AI Research"
- `ai-products` → "AI Products"
- `ai-policy` → "AI Policy"
- `ai-business` → "AI Business"
- `ai-tools` → "AI Tools"

---

### editions.ts
Drei Ausgaben, um ein glaubwürdiges Archiv zu zeigen:

**Ausgabe #3 (aktuellste, status: published)**
- Titel z.B.: "GPT-5, EU AI Act und ein Tool das wirklich zählt"
- Datum: letzte Woche
- Editor-Note: kurze Einleitung zu den Highlights
- Enthält 6 Stories aus verschiedenen Topics

**Ausgabe #2 (status: published)**
- Titel z.B.: "Googles Gemini-Update und warum Open Source diesmal gewinnt"
- Datum: vor zwei Wochen
- Keine Editor-Note
- Enthält 5 Stories

**Ausgabe #1 (status: draft)**
- Titel z.B.: "In Arbeit – AI Policy Schwerpunkt"
- Keine Stories zugeordnet noch
- Nur im Admin sichtbar, nicht öffentlich

---

### stories.ts
11 Stories für Ausgaben #2 und #3. Jede Story enthält:
- Einen realistischen Titel (AI/Tech-Bezug)
- Einen 2–4-Satz-Kommentar der erklärt, warum die Meldung relevant ist
- Eine Source (je nach Story: primary, analysis oder pr-driven)
- 1–2 Topics
- Einen Signal-Score (alle drei Dimensionen je 1–5)
- publishedAt und editionId gesetzt

Verteilung der Quellentypen: ca. 5× primary, 4× analysis, 2× pr-driven (realistisches Verhältnis).  
Verteilung der Topics: alle 5 Topics mind. 1× vertreten.  
Verteilung der Scores: variiert bewusst, damit der Score nicht immer gleich aussieht.

---

### subscribers.ts
Leer in V1. Datei existiert damit Typescript-Typ und Import-Pfad schon vorbereitet sind.  
Optional: 2–3 Dummy-Einträge um die Datei nicht komplett leer zu lassen.

---

## 6. Pflichtfelder aus der Agenten-Diskussion

Diese Felder wurden in der Agenten-Diskussion als nicht verhandelbar eingestuft.  
Sie müssen im Datenmodell vorhanden **und** im Frontend sichtbar sein.

| Element | Quelle in Diskussion | Feld im Modell | Sichtbar auf |
|---------|---------------------|---------------|-------------|
| Redaktioneller Kommentar | News Editor: "Das ist das Produkt selbst" | `story.editorialComment` | Detailseite (voll), Landingpage (Auszug) |
| Quellenname + Link | Trust Analyst: "Transparenz ist das Produkt" | `story.source.name` + `story.source.url` | Detailseite, Landingpage (verkürzt) |
| Quellentyp-Icon | Trust & Analyst + Founder: nur wenn erklärt | `story.source.type` | Detailseite (Icon + Label), Landingpage (nur Icon) |
| Signal-Score: Impact | News Editor: "Impact als erste Dimension" | `story.signalScore.impact` | Detailseite (Balken + Tooltip) |
| Signal-Score: Hype-Level | Founder: "nur wenn erklärt, nie Black Box" | `story.signalScore.hypeLevel` | Detailseite (Balken + Tooltip, invertiert) |
| Signal-Score: Quellenqualität | News Editor + Trust Analyst | `story.signalScore.sourceQuality` | Detailseite (Balken + Tooltip) |
| Themenzuordnung | Product Strategist + Trust Analyst | `story.topics[]` | Detailseite (Tags), Archiv (Filter), Landingpage (statische Chips) |
| Ausgaben-Nummer + Datum | Moderator: "Orientierung und Wiederbesuch" | `edition.number` + `edition.publishedAt` | Überall wo Edition angezeigt wird |
| Editor-Note | Moderator: "editorisches Urteil sichtbar machen" | `edition.editorNote` | Detailseite (wenn vorhanden) |

---

*Dokument-Status: Bereit für React-Projektstruktur und Komponentenarchitektur*
