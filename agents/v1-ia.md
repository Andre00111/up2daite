# up2daite.com – Informationsarchitektur & Seitenstruktur
> Basis: v1-frontend-spec.md | Erstellt: 19. April 2026

---

## 1. Sitemap

```
up2daite.com
│
├── /                          Landingpage
├── /archiv                    Archivseite
├── /ausgabe/:slug             Ausgaben-Detailseite
│
└── /admin                     Admin Dashboard
    ├── /admin/story/neu       Story erfassen
    ├── /admin/edition/neu     Edition zusammenstellen
    └── /admin/edition/:id     Edition reviewen & veröffentlichen
```

**Tiefe:** Maximal 2 Ebenen. Keine verschachtelten Unter-Unter-Seiten.  
**Admin-Route:** Nicht in der öffentlichen Navigation verlinkt. Nur durch direkte URL erreichbar.

---

## 2. Hauptnavigation

### Öffentliche Navigation (Leser-Sicht)

| Position | Element | Ziel | Anmerkung |
|----------|---------|------|-----------|
| Links | Logo / Wordmark "up2daite" | `/` | Immer klickbar, führt zu Home |
| Mitte | Archiv | `/archiv` | Einziger regulärer Nav-Link |
| Rechts | "Newsletter abonnieren" | Mailto-Link | Primärer CTA, visuell hervorgehoben (Button) |

**Was nicht in der Navigation steht:**
- Methodik / Über uns (kein eigener Screen in V1)
- Admin (bewusst versteckt)
- Themenfilter (gehören auf die Archivseite, nicht in die globale Nav)

**Mobile:** Hamburger-Menü mit denselben drei Elementen. Kein Bottom-Tab-Bar.

---

## 3. Screen-Hierarchie

### Öffentlicher Bereich

```
Landingpage (/)
├── → Archivseite (/archiv)          via Nav-Link
│   └── → Detailseite (/ausgabe/x)   via Edition-Card
│
└── → Detailseite (/ausgabe/x)       via "Ausgabe lesen"-CTA (letzte Ausgabe)
    ├── → Detailseite (prev/next)     via Ausgaben-Navigation
    └── → Externe Quelle             via Story-Link (neuer Tab)
```

### Admin-Bereich

```
Admin Dashboard (/admin)
├── → Story erfassen (/admin/story/neu)       via CTA-Button
│   └── → Admin Dashboard                     nach Speichern
│
├── → Edition erstellen (/admin/edition/neu)  via CTA-Button
│   └── → Admin Dashboard                     nach Speichern
│
└── → Edition reviewen (/admin/edition/:id)   via Tabellen-Link
    └── → Admin Dashboard                     nach Veröffentlichen
```

---

## 4. Primärer User-Flow: Besucher

**Einstieg über Direktaufruf oder Link:**

```
1. Landingpage öffnet sich
2. Leser sieht Tagline + Wert-Proposition (above the fold)
3. Leser sieht 3 Story-Cards der aktuellsten Ausgabe
4. Klick auf "Ausgabe lesen" → Detailseite
5. Leser liest Stories mit Kommentaren, Score und Quellen
6. Optional: klickt auf externe Quelle (neuer Tab)
7. Optional: navigiert zu vorheriger/nächster Ausgabe
```

**Einstieg über Archiv (z.B. via Social-Link):**

```
1. Archivseite öffnet sich
2. Leser sieht alle Ausgaben, standardmäßig ungefiltert
3. Optional: Klick auf Topic-Filter → Liste filtert sich
4. Klick auf Edition-Card → Detailseite
5. Leser liest Stories
```

**Abbruchpunkt / Conversion-Moment:**  
Wenn eine Story überzeugt hat → CTA "Newsletter abonnieren" (sichtbar am Ende der Detailseite und auf der Landingpage im Hero).

---

## 5. Primärer User-Flow: Admin

**Neuen Inhalt erfassen und veröffentlichen:**

```
1. Admin öffnet /admin direkt im Browser
2. Dashboard zeigt Übersicht: Stories (gesamt / nicht zugeordnet), Ausgaben (Entwurf / veröffentlicht)
3. Klick auf "Neue Story" → /admin/story/neu
4. Admin füllt Felder aus: Titel, URL, Quellenname, Quellentyp, Topics, Kommentar, Signal-Score
5. Klick "Speichern" → zurück zu /admin
6. Schritte 3–5 wiederholen bis 5–7 Stories vorhanden
7. Klick auf "Neue Ausgabe" → /admin/edition/neu
8. Admin gibt Ausgaben-Titel ein, wählt Stories per Checkbox aus, optional: Editor-Note
9. Klick "Als Entwurf speichern" → zurück zu /admin
10. Klick auf Ausgabe in Tabelle → /admin/edition/:id
11. Admin reviewt Vorschau der Ausgabe
12. Klick "Veröffentlichen" → Status wechselt zu "Veröffentlicht"
13. Ausgabe erscheint im öffentlichen Archiv und auf der Landingpage (wenn aktuellste)
```

---

## 6. Welche Informationen auf welcher Seite zuerst sichtbar sein müssen

"Zuerst sichtbar" = ohne Scrollen erreichbar (above the fold).

### Landingpage (`/`)
- Produktname
- Tagline (eine Zeile, max. 10 Wörter)
- Wert-Proposition (ein Satz)
- CTA "Newsletter abonnieren"
- Titel und Datum der aktuellsten Ausgabe
- Mindestens 1–2 Story-Cards sofort sichtbar

### Archivseite (`/archiv`)
- Topic-Filter-Leiste (alle 5 Themen + "Alle")
- Mindestens 3 Edition-Cards ohne Scrollen

### Detailseite (`/ausgabe/:slug`)
- Ausgaben-Nummer, Datum, Titel
- Optional: Editor-Note
- Erste Story vollständig (Titel + Kommentar + Score + Quelle)

### Admin Dashboard (`/admin`)
- Anzahl Stories gesamt und nicht zugeordnet
- Anzahl Ausgaben (Entwurf vs. Veröffentlicht)
- CTA "Neue Story" und "Neue Ausgabe"
- Letzte 5 Stories als Tabelle

---

## 7. Was nicht auf die Landingpage gehört

| Element | Begründung |
|---------|------------|
| Vollständige Archivliste | Gehört auf /archiv; auf Home würde sie von der aktuellsten Ausgabe ablenken |
| Topic-Filter-Leiste (interaktiv) | Filter-Kontext fehlt auf der Landingpage; Topics erscheinen nur als Chips zur Orientierung |
| Score-Erklärungstext (ausführlich) | Zu viel kognitive Last beim Ersteindruck; nur als 1-Zeiler-Teaser mit Link |
| Subscriber-Zahlen / Social Proof | Nicht vorhanden in V1; kein Fake-Counting |
| Admin-Links oder -Hinweise | Unsichtbar für Leser |
| Ältere Ausgaben als vollständige Liste | Lenkt vom Kernversprechen ab; Archiv hat dafür eine eigene Seite |
| Methodiktext (ausführlich) | Erscheint als kurzer Teaser; keine eigene Sektion auf Home |

---

## 8. Elemente aus der Agenten-Diskussion: Wo sichtbar?

### Themenfilter

| Seite | Form | Funktion |
|-------|------|---------|
| Archivseite | Filter-Tabs / Toggle-Gruppe | Interaktiv – filtert Ausgaben-Liste |
| Landingpage | 5 Topic-Chips (statisch) | Nur Orientierung, kein Filter; führen bei Klick zu `/archiv?topic=X` |
| Detailseite | Tags pro Story | Nur Anzeige, kein Filter |

**Entscheidung:** Interaktiver Filter ausschließlich auf der Archivseite. Überall sonst nur Anzeige.

---

### Transparenz-Layer (Quellenangabe + Quellentyp)

| Seite | Sichtbarkeit | Detail |
|-------|-------------|--------|
| Detailseite | Pro Story, immer sichtbar | Icon (🔵/🟡/🔴) + Quellenname + externer Link |
| Landingpage (Story-Cards) | Verkürzt | Nur Icon + Quellenname; kein ausführlicher Link-Block |
| Archivseite | Nicht pro Story | Nur Topic-Tags pro Edition sichtbar |

**Entscheidung:** Volle Transparenz auf der Detailseite. Auf der Landingpage reduziert aber vorhanden.

---

### Signal-Score (Impact / Hype-Level / Quellenqualität)

| Seite | Sichtbarkeit | Detail |
|-------|-------------|--------|
| Detailseite | Pro Story, vollständig | 3 Dimensionen mit Label, Balken und Tooltip-Erklärung |
| Landingpage (Story-Cards) | Vereinfacht | Nur eine zusammenfassende Bewertung oder Score-Icon; keine 3 Balken |
| Archivseite | Nicht pro Story | Nicht sichtbar; würde Edition-Karten überladen |
| Admin Dashboard | Pro Story in Tabelle | Numerische Kurzdarstellung (z.B. 4/2/5) |

**Entscheidung:** Voller Score nur auf der Detailseite. Auf Landingpage verdichtet. Im Archiv unsichtbar.

---

### Archiv

| Seite | Rolle |
|-------|-------|
| Archivseite `/archiv` | Primärer Ort des Archivs |
| Landingpage | Teaser der aktuellsten Ausgabe + Link zum Archiv |
| Detailseite | Prev/Next-Navigation zwischen Ausgaben |

---

### Newsletter-CTA

| Seite | Position | Form |
|-------|----------|------|
| Landingpage | Hero (above the fold) | Primärer Button, prominent |
| Detailseite | Am Ende der Seite, nach letzter Story | Sekundärer CTA (Text + Button) |
| Archivseite | Kein CTA | Bewusst weggelassen; Leser sind bereits im Produkt |
| Admin | Kein CTA | Nicht relevant |

**Entscheidung:** Maximal 2 Stellen für den CTA. Kein Newsletter-Popup, kein Sticky-Bar.

---

*Dokument-Status: Bereit für Domainmodell + Komponentenarchitektur*
