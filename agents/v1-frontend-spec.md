# up2daite.com – Frontend-MVP-Spec
> Erstellt: 19. April 2026 | Basis: v1-discussion.md + v1-spec.md

---

## 1. Produktziel

up2daite.com bündelt kuratierte AI-News zu einem klaren Signal-Produkt.  
V1 beweist, dass manuell kuratierte Inhalte mit redaktionellem Kommentar und sichtbarer Einordnungslogik einen echten Mehrwert gegenüber reinen Aggregatoren bieten.

Das Frontend macht diesen Wert sichtbar und erlebbar – für Leser, die schnell verstehen wollen, was wirklich wichtig ist.

---

## 2. Zielgruppe

**Primär:** Tech-affine Professionals (Product Manager, Founders, Engineers, Consultants), die AI-Entwicklungen beruflich verfolgen müssen, aber keine Zeit für tägliches News-Monitoring haben.

**Sekundär:** Redaktion / Admin – eine einzelne Person, die Inhalte manuell erfasst, strukturiert und veröffentlicht.

---

## 3. Kernnutzen

> **AI-Rauschen zu verifizierbarem Signal verdichten – mit redaktionellem Kommentar, sichtbarer Quellenqualität und klarer Einordnung.**

Der Unterschied zu Aggregatoren: Wir erklären, *warum* eine Meldung relevant ist – und zeigen offen, woher sie kommt.

---

## 4. Nutzerrollen

| Rolle | Beschreibung | Zugang |
|-------|-------------|--------|
| **Leser** | Besucht die öffentliche Website, liest Ausgaben, filtert nach Thema | Public (kein Login) |
| **Admin** | Erfasst Stories, erstellt Ausgaben, veröffentlicht | Admin-Bereich (kein Login in V1 – kein Auth-Overhead) |

**Hinweis:** Kein Login-System in V1. Der Admin-Bereich ist eine separate Route, die nur bekannt ist. Kein Passwortschutz.

---

## 5. V1-Screens

### Öffentliche Seiten (Leser)

| Screen | Route | Zweck |
|--------|-------|-------|
| Landingpage | `/` | Ersteindruck, Wert-Proposition, aktuellste Ausgabe |
| Archivseite | `/archiv` | Alle Ausgaben, filterbar nach Thema |
| Ausgaben-Detail | `/ausgabe/:slug` | Eine Ausgabe mit allen Stories, Scores, Quellen |

### Admin-Bereich (Redaktion)

| Screen | Route | Zweck |
|--------|-------|-------|
| Admin-Übersicht | `/admin` | Dashboard: Übersicht Stories, Ausgaben, Status |
| Story erfassen | `/admin/story/neu` | Neue Story anlegen |
| Edition erstellen | `/admin/edition/neu` | Stories zu Ausgabe zusammenstellen |
| Edition veröffentlichen | `/admin/edition/:id` | Ausgabe reviewen und Status setzen |

**Gesamt: 7 Screens.**

---

## 6. Inhalte pro Screen

### Landingpage (`/`)

- **Hero:** Produktname, Tagline, kurze Wert-Proposition (1–2 Sätze), CTA "Newsletter abonnieren" (Mailto-Link oder statisches Formular ohne Backend)
- **Aktuellste Ausgabe:** Ausgaben-Titel + Datum + 3 Story-Cards als Vorschau
- **Story-Card-Vorschau:** Titel, erster Satz des redaktionellen Kommentars, Quellentyp-Icon, Signal-Score-Zusammenfassung
- **Signal-Score-Teaser:** Kurze Erklärung der 3 Dimensionen (Impact / Hype-Level / Quellenqualität) mit Link zur Methodik
- **Themencluster:** 5 Topic-Pills als visuelle Orientierung (nicht klickbar auf Home, oder: führen zu /archiv?topic=X)

---

### Archivseite (`/archiv`)

- **Seitentitel + Beschreibung** (eine Zeile)
- **Themenfilter:** Alle | AI Research | AI Products | AI Policy | AI Business | AI Tools
- **Ausgaben-Liste** (gefiltert): Pro Ausgabe: Nummer, Datum, Titel, enthaltene Topics als Tags, Anzahl Stories, Link zur Detail-Seite
- **Hinweis bei leerem Filter-Ergebnis** (z.B. "Keine Ausgaben zu diesem Thema")

---

### Ausgaben-Detail (`/ausgabe/:slug`)

- **Ausgaben-Header:** Nummer, Datum, Titel der Ausgabe
- **Editor-Note** (optional): Kurze redaktionelle Einleitung zur Ausgabe
- **Story-Liste** (5–7 Stories), pro Story:
  - Titel
  - Redaktioneller Kommentar (2–4 Sätze – das ist das Produkt)
  - Topic-Tags
  - **Signal-Score:** 3 Dimensionen mit Label, Balken/Rating und Tooltip-Erklärung
  - **Quellenangabe:** Icon für Quellentyp (Primärquelle / Analyse / PR-getrieben) + Quellenname + externer Link
- **Navigation:** "← Vorherige Ausgabe" / "Nächste Ausgabe →"

---

### Admin-Übersicht (`/admin`)

- **Statistik-Zeile:** Anzahl Stories gesamt, Ausgaben gesamt, letzte Veröffentlichung
- **Aktuelle Ausgaben:** Tabelle mit Ausgaben (Titel, Datum, Status: Entwurf / Veröffentlicht), Link zur Ausgabe
- **Letzte Stories:** Tabelle mit Stories (Titel, Quelle, Datum, zugeordnete Ausgabe oder "nicht zugeordnet")
- **CTAs:** "Neue Story anlegen", "Neue Ausgabe erstellen"

---

### Story erfassen (`/admin/story/neu`)

Felder:
- Titel (Pflicht)
- URL zur Originalquelle (Pflicht)
- Quellenname (Pflicht)
- Quellentyp: Dropdown (Primärquelle / Analyse / PR-getrieben)
- Topics: Multi-Select (AI Research / AI Products / AI Policy / AI Business / AI Tools)
- Redaktioneller Kommentar (Textarea, Pflicht)
- Signal-Score: 3 Felder je 1–5 (Impact, Hype-Level, Quellenqualität)
- Veröffentlichungsdatum (Datepicker, Default: heute)

Aktionen: "Speichern" / "Abbrechen"

---

### Edition erstellen (`/admin/edition/neu`)

Felder:
- Ausgaben-Nummer (auto-increment oder manuell)
- Titel der Ausgabe
- Editor-Note (optional, Textarea)
- Stories zuordnen: Liste aller gespeicherten Stories (nicht bereits in anderer Ausgabe), per Checkbox auswählen
- Veröffentlichungsdatum

Aktionen: "Als Entwurf speichern" / "Abbrechen"

---

### Edition veröffentlichen (`/admin/edition/:id`)

- Vorschau der Ausgabe (wie die öffentliche Detail-Seite, aber im Admin-Layout)
- Status-Anzeige: "Entwurf" / "Veröffentlicht"
- Aktion: "Veröffentlichen" (setzt Status auf "Veröffentlicht")
- Aktion: "Bearbeiten" (zurück zu Edit-Modus)

---

## 7. Nicht-Ziele (V1)

| Was | Warum nicht |
|-----|-------------|
| Algorithmische Personalisierung | Cold-Start-Problem, kein Mehrwert ohne Nutzerdaten |
| User-Login / Auth | Kein Backend, kein Overhead |
| Community / Kommentare | Braucht kritische Masse und Moderation |
| Push Notifications | Öffnet Mobile-Plattform-Fragen |
| Native App | Overhead ohne bewiesenen Nutzerwert |
| Subscriber-Management | Kein Backend; Subscriber bleibt im Datenmodell, aber ohne UI-Workflow |
| Preisseite / Subscription-Flow | Preis-Modell noch nicht entschieden |
| Methodik-Unterseite | Inhalt erscheint als Teaser auf Home und als Tooltip im Score; eigene Seite ist V2 |
| Suchfunktion | V2; Filter reichen für MVP |
| SEO-Optimierung | V2; MVP testet zuerst redaktionellen Wert |

---

## 8. Annahmen / offene Fragen

| # | Annahme / Frage | Entscheidung / Status |
|---|-----------------|----------------------|
| 1 | Admin-Bereich ohne Auth – ist das für V1 akzeptabel? | **Ja** – Route ist unverlinkt, kein Sicherheitsrisiko bei lokalem MVP |
| 2 | Subscriber-Datenmodell vorhanden, aber kein UI-Workflow | Subscriber-Daten werden im Modell angelegt, aber in V1 nicht angezeigt oder verwaltet |
| 3 | "Newsletter abonnieren" CTA ohne Backend | **Mailto-Link** oder statisches Beitelformular (UI only, kein Submit) |
| 4 | Slug-Generierung für Ausgaben | Manuell im Admin oder automatisch aus Titel (simpel: lowercase + Bindestriche) |
| 5 | Wie viele Mock-Ausgaben für den Start? | Mindestens 3 vollständige Ausgaben für ein glaubwürdiges Archiv |
| 6 | Score-Skala 1–5: hypeLevel niedrig = gut | Anzeige invertiert: grün bei 1, rot bei 5 – Legende immer sichtbar |
| 7 | Mobile Responsive? | Ja – Material UI ist responsive by default; kein separates Mobile-Design nötig |

---

## 9. Was im Frontend bewusst "fake" oder statisch bleiben darf

| Element | Warum fake OK ist |
|---------|------------------|
| **Newsletter-Signup** | Mailto-Link oder UI-only Formular; kein Backend nötig um das UX-Versprechen zu zeigen |
| **Subscriber-Anzahl** | Kann als statische Zahl dargestellt werden (z.B. "127 Leser") wenn gewünscht – reines UX-Element |
| **Admin-Auth** | Kein Login in V1; Route ist einfach bekannt aber nicht verlinkt |
| **"Veröffentlichen"-Aktion** | Setzt nur einen Status-Flag im lokalen Zustand; kein echter Publish-Mechanismus nötig |
| **Pagination / "Mehr laden"** | Kann als Button existieren, der noch keine Funktion hat, wenn alle Mock-Daten bereits geladen sind |
| **Slug-Routing** | Slugs können hardcodiert in den Mock-Daten stehen; kein Slug-Generator nötig |
| **Datum/Uhrzeit** | Alle Daten sind statisch in den Mock-Daten; keine echte Timestamp-Logik |
| **Story-Import** | Im Admin-Screen als Feld vorgesehen, in V1 aber plain Texteingabe – kein URL-Scraping |

---

*Spec-Status: Bereit für Implementierung*
*Tech-Stack: React + Vite + TypeScript + Material UI + React Router v6*
*Daten: Lokale TS/JSON-Dateien, kein Backend*
