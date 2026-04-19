# up2daite.com – Umsetzungsplan Frontend-MVP
> Basis: alle bisherigen Outputs | Erstellt: 19. April 2026
> Solo-Developer · React · lokale Daten · kein Backend

---

## Leitprinzip

**Zuerst das bauen, was alles andere sichtbar macht.**  
Typen und Daten zuerst. Dann die kleinsten Bausteine. Dann Seiten von innen nach außen.  
Admin kommt zuletzt – er ist für V1 nützlich, aber nicht das Herzstück des Produkts.

---

## 1. Reihenfolge der Implementierung

### Stufe 0 – Fundament (einmalig, zuerst)
Projekt aufsetzen, Theme konfigurieren, Routing-Grundgerüst legen.  
Nichts ist hier sichtbar außer einer leeren Seite mit korrekter Navigationshülle.

### Stufe 1 – Typen und Daten
TypeScript-Interfaces definieren. Seed-Daten anlegen.  
Ab hier gibt es reale Inhalte zum Rendern.

### Stufe 2 – Generische UI-Komponenten
Die kleinsten, zustandslosen Bausteine: Badges, Tags, Filter.  
Sie werden von allen Feature-Komponenten und Pages genutzt.

### Stufe 3 – Feature-Komponenten
StoryCard, EditionCard, EditionHeader – die domänennahen Bausteine.  
Bauen auf den UI-Komponenten aus Stufe 2 auf.

### Stufe 4 – Öffentliche Seiten
Zuerst die Detailseite, dann Landingpage, dann Archiv.  
Reihenfolge begründet sich durch Komponenten-Bedarf: Detailseite nutzt alles.

### Stufe 5 – Admin-Bereich
Admin Dashboard, dann die Formulare.  
Kommt zuletzt, weil es für den Leser-Flow irrelevant ist.

### Stufe 6 – Feinschliff
Responsive, Edge-Cases, leere Zustände, finale Durchsicht.

---

## 2. Milestones

### Milestone 1 – Projekt läuft, Fundament steht
**Ziel:** Browser zeigt eine funktionierende Seite mit Header, Footer und Routing.

- Vite + React + TypeScript initialisieren
- Material UI installieren und Theme-Datei anlegen (Farben, Typografie)
- React Router v6 einrichten mit allen 7 Routen als Platzhalter-Pages
- `Layout.tsx` und `AdminLayout.tsx` aufbauen
- `Header.tsx` mit Logo, Archiv-Link und CTA-Button
- `Footer.tsx` minimal

**Kriterium:** Alle Routes erreichbar, Header und Footer erscheinen, kein Fehler in der Konsole.

---

### Milestone 2 – Typen definiert, Daten vorhanden
**Ziel:** Seed-Daten importierbar, TypeScript zeigt keine Fehler.

- `types/index.ts` mit allen Interfaces anlegen (Story, Source, Edition, Topic, SignalScore, Subscriber)
- `data/topics.ts` – 5 feste Topic-Objekte
- `data/stories.ts` – mindestens 11 Stories (für 2 vollständige Ausgaben)
- `data/editions.ts` – 3 Ausgaben (2 published, 1 draft)
- `data/subscribers.ts` – leer, Typ vorbereitet
- `hooks/useEditions.ts` – einfache Filterfunktionen
- `hooks/useStories.ts` – Filterfunktionen nach editionId

**Kriterium:** `import { editions } from './data/editions'` funktioniert, TypeScript ist zufrieden.

---

### Milestone 3 – Generische UI-Komponenten fertig
**Ziel:** Isolierte Bausteine existieren und können mit Beispiel-Props gerendert werden.

- `TopicTag.tsx` – Chip mit Topic-Label
- `TopicFilter.tsx` – Filter-Leiste mit "Alle" + 5 Topics
- `SourceTypeBadge.tsx` – Icon + Name + externer Link; drei Varianten (primary, analysis, pr-driven)
- `SignalScoreBadge.tsx` – 3 Balken mit Labels und Tooltips; hypeLevel invertiert

**Kriterium:** Jede Komponente rendert korrekt wenn man sie direkt mit Beispiel-Props einbindet.

---

### Milestone 4 – Feature-Komponenten fertig
**Ziel:** Domänennahe Bausteine existieren, die echte Story- und Edition-Daten rendern.

- `StoryCard.tsx` – beide Varianten (`full` und `preview`)
- `EditionCard.tsx` – für die Archiv-Listenansicht
- `EditionHeader.tsx` – Ausgaben-Kopf mit Nummer, Datum, Titel, optionaler Editor-Note

**Kriterium:** Eine StoryCard mit echten Seed-Daten rendert vollständig: Titel, Kommentar, Score, Quelle, Tags.

---

### Milestone 5 – Detailseite fertig
**Ziel:** `/ausgabe/:slug` zeigt eine vollständige Ausgabe mit allen Stories.

- `EditionDetailPage.tsx` aufbauen
- Slug aus URL lesen, passende Edition aus `editions`-Array laden
- `EditionHeader` einbinden
- Stories der Ausgabe als `StoryCard` (Variante `full`) rendern
- Prev/Next-Navigation zwischen Ausgaben (`EditionNav`)
- 404-Fallback wenn Slug nicht gefunden

**Kriterium:** Alle Stories einer Ausgabe sichtbar, Score und Quellentyp überall korrekt, externe Links öffnen neuen Tab.

---

### Milestone 6 – Landingpage fertig
**Ziel:** `/` zeigt Hero, aktuellste Ausgabe als Vorschau und Signal-Score-Teaser.

- `LandingPage.tsx` aufbauen
- `HeroSection` mit Tagline, Wert-Prop, CTA (Mailto-Link)
- `LatestEditionPreview` – lädt `editions[0]`, zeigt erste 3 Stories als `StoryCard` (Variante `preview`)
- Signal-Score-Teaser mit Link zur Methodik (Methodik-Page existiert in V1 nicht – Link führt zu `/archiv` oder ist deaktiviert)
- Topic-Chips (statisch, 5 Topics als nicht-filterbare Orientierung)

**Kriterium:** Landingpage vermittelt auf einen Blick Produktwert, aktuellste Ausgabe und CTA.

---

### Milestone 7 – Archivseite fertig
**Ziel:** `/archiv` zeigt alle veröffentlichten Ausgaben, filterbar nach Topic.

- `ArchivPage.tsx` aufbauen
- `TopicFilter` einbinden, `useState` für aktiven Filter
- Ausgaben gefiltert per `useEditions`-Hook
- `EditionCard` für jede Ausgabe
- Leerer Zustand wenn Filter kein Ergebnis liefert

**Kriterium:** Filter funktioniert, Ausgaben reduzieren sich korrekt, EditionCard führt zur Detailseite.

---

### Milestone 8 – Admin Dashboard fertig
**Ziel:** `/admin` zeigt Übersicht über Stories und Ausgaben.

- `AdminLayout.tsx` mit seitlicher Navigation
- `AdminDashboardPage.tsx` mit `AdminStats`, `StoryTable`, `EditionTable`
- Tabellen aus lokalen Daten, keine Interaktion außer Links
- Links zu Formular-Seiten und Edition-Preview

**Kriterium:** Admin sieht alle Daten auf einen Blick, kann zu den Unterseiten navigieren.

---

### Milestone 9 – Admin-Formulare fertig
**Ziel:** Story erfassen und Edition zusammenstellen sind bedienbar.

- `StoryFormPage.tsx` mit allen Feldern (inkl. Signal-Score-Eingabe als Slider oder Dropdown)
- `EditionFormPage.tsx` mit Story-Auswahl per Checkbox
- `EditionPreviewPage.tsx` mit Leseansicht + "Veröffentlichen"-Button
- Visuelles Feedback (MUI Snackbar) nach Aktionen
- Kein echtes Speichern – Fake-Persistenz mit Snackbar-Feedback

**Kriterium:** Admin kann einen kompletten Workflow durchspielen ohne Fehler.

---

### Milestone 10 – Feinschliff
**Ziel:** Produkt wirkt fertig und vertrauenswürdig.

- Responsive Check auf Mobile (MUI Grid + Breakpoints)
- Leere Zustände überall sinnvoll (Archiv ohne Ergebnisse, Edition ohne Stories)
- Typografie-Konsistenz prüfen (Kommentar prominent, Score-Labels lesbar)
- hypeLevel-Invertierung visuell eindeutig (Legende prüfen)
- Externe Links alle mit `target="_blank"` und `rel="noopener noreferrer"`
- Keine `console.error` in der Konsole

---

## 3. Welche Seite zuerst

**Detailseite zuerst** – nicht Landingpage.

Begründung: Die Detailseite nutzt alle Feature- und UI-Komponenten gleichzeitig.  
Wer die Detailseite fertig hat, hat automatisch alle Bausteine für Landingpage und Archiv.  
Die Landingpage ist danach nur noch Montage – sie kombiniert bestehende Komponenten.

Reihenfolge der öffentlichen Seiten:
1. Detailseite (alles wird hier gebaut)
2. Landingpage (Montage bestehender Teile)
3. Archiv (einfachste Seite, nur Liste + Filter)

---

## 4. Welche Komponenten zuerst

Reihenfolge folgt der Abhängigkeit von innen nach außen:

1. **`TopicTag`** – kleinste Einheit, keine Abhängigkeiten
2. **`SourceTypeBadge`** – kleine Einheit, keine Abhängigkeiten
3. **`SignalScoreBadge`** – zentrale Komponente; komplex genug um früh zu testen
4. **`TopicFilter`** – baut auf `TopicTag` auf
5. **`StoryCard`** – baut auf 2, 3, 4 auf; ist der Kern des Produkts
6. **`EditionHeader`** – eigenständig, einfach
7. **`EditionCard`** – baut auf `TopicTag` auf

`SignalScoreBadge` sollte früh gebaut werden, weil die hypeLevel-Invertierung  
ein visuelles Konzept ist das sofort überprüft werden muss – nicht am Ende.

---

## 5. Welche Mockdaten zuerst anlegt werden sollten

**In dieser Reihenfolge:**

1. **`topics.ts`** – 5 Zeilen, sofort fertig, sofort nutzbar
2. **Eine vollständige Edition mit 6–7 Stories** – für die Detailseite; ohne das kann nichts getestet werden
3. **Zweite Edition** – für prev/next-Navigation und Archiv-Mindestinhalt
4. **Dritte Edition als Entwurf** – für Admin-Ansicht (Entwurf vs. veröffentlicht)

**Was an den Seed-Daten wichtig ist:**
- Alle 5 Topics müssen mindestens einmal vorkommen (Filter muss zeigen, dass er funktioniert)
- Alle 3 Quellentypen müssen vorkommen (Transparenz-Layer muss alle Varianten zeigen)
- Score-Werte sollen variieren (nicht alle Stories haben denselben Score)
- hypeLevel sollte einmal 1 (kein Hype) und einmal 4–5 (viel Hype) vorkommen

---

## 6. Was erst ganz am Ende gebaut werden sollte

| Was | Warum am Ende |
|-----|---------------|
| Admin-Formulare (Story + Edition) | Nützlich, aber nicht das Herzstück; Detailseite ist wichtiger |
| Responsive-Optimierungen | Erst wenn Inhalt und Layout stehen |
| Leere Zustände (Empty States) | Nur sinnvoll wenn die gefüllten Zustände fertig sind |
| Prev/Next-Navigation in EditionDetail | Funktioniert erst wenn ≥ 2 Ausgaben vorhanden |
| Admin "Veröffentlichen"-Feedback (Snackbar) | Feinschliff, nicht Kernfunktion |
| Slug-Generierung im Admin-Formular | Slugs in Seed-Daten sind hardcodiert; Generator erst wenn Formular fertig ist |
| Footer (über Minimal hinaus) | Kein Mehrwert für V1-Demo |
| Methodik-Teaser auf Landingpage | Erst wenn alle anderen Sektionen stehen |

---

## 7. Risiken bei der Umsetzung

### Risiko 1: SignalScore-Darstellung kommuniziert sich falsch
**Was:** hypeLevel = 1 ist gut, 5 ist schlecht. Das ist kontraintuitiv.  
**Symptom:** Nutzer oder Reviewer liest Score falsch; "hoher Hype" wirkt wie Qualität.  
**Gegenmaßnahme:** Legende direkt neben dem Balken, nicht nur im Tooltip. Tooltip-Text lautet: "Niedrig ist besser – je weniger Hype, desto solider die Meldung."

### Risiko 2: Seed-Daten zu dünn – Produkt wirkt leer
**Was:** Wenige Ausgaben, generische Titel, keine echten Kommentare.  
**Symptom:** Präsentation wirkt wie ein Template, nicht wie ein echtes Produkt.  
**Gegenmaßnahme:** Mindestens 2 vollständige Ausgaben mit echten AI-News-Inhalten; redaktionelle Kommentare inhaltlich schreiben, nicht placeholder-mäßig.

### Risiko 3: MUI-Theme zu spät entschieden – visueller Umbau kostet Zeit
**Was:** Theme-Entscheidungen (Farben, Typografie, Spacing) nach Milestone 5 ändern.  
**Symptom:** Alle Komponenten sehen nach Farbwechsel falsch aus.  
**Gegenmaßnahme:** Theme in Milestone 1 anlegen und sofort auf Detailseite testen – nicht "später noch anpassen".

### Risiko 4: Admin-Bereich saugt unverhältnismäßig viel Zeit
**Was:** Formulare, Tabellen, Fake-Persistenz, Snackbars – das ist viel Arbeit für geringen Nutzen im MVP.  
**Symptom:** Admin ist nach 3 Milestones noch nicht fertig, öffentliche Seiten sind bereits stabil.  
**Gegenmaßnahme:** Admin-Formulare sind optional für den MVP-Nachweis. Wenn Zeit knapp ist, reicht das Admin Dashboard ohne funktionierende Formulare für eine erste Präsentation.

### Risiko 5: Slug-Routing bricht bei Sonderzeichen
**Was:** Edition-Slugs aus Titeln mit Umlauten oder Satzzeichen.  
**Symptom:** URL `/ausgabe/ausgabe-12-gpt-5-eu-ai-act` funktioniert, `/ausgabe/ausgabe-12-gpt5-–-eu` nicht.  
**Gegenmaßnahme:** Alle Slugs in Seed-Daten manuell definieren (keine Auto-Generierung in V1); nur ASCII, keine Umlaute, keine Sonderzeichen.

### Risiko 6: Fehlende Empty States machen das Produkt unfertig wirken
**Was:** Archiv-Filter zeigt keine Ausgaben → leere Seite ohne Erklärung.  
**Symptom:** Nutzer denkt, etwas ist kaputt.  
**Gegenmaßnahme:** Für jeden gefilterten Zustand ein einfaches "Keine Ausgaben zu diesem Thema"-Element einplanen. Kann in Milestone 10 erledigt werden, aber nicht vergessen.

---

*Bauplan-Status: Vollständig. Bereit für Implementierungsstart.*
*Empfohlener Einstieg: Milestone 1 → Projekt initialisieren, Theme und Routing aufsetzen.*
