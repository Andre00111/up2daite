# Spec: Auth & Newsletter

**Datum:** 2026-05-28
**Status:** Design (zur Review)
**Scope:** Die zwei größten aktuell fehlenden Funktionalitäten in up2daite

---

## Problem

Die Anwendung hat zwei kritische Lücken:

1. **Admin-Bereich ist ungeschützt.** Jeder kann unter `/admin` Stories und Editions anlegen, bearbeiten oder löschen. Es gibt keinerlei Authentifizierung.
2. **Newsletter funktioniert nicht.** Der `Subscriber`-Typ existiert im Frontend, aber es gibt keine Backend-Integration, keine Anmeldung, keinen Versand. Der "Newsletter abonnieren"-Button (aktuell auskommentiert) war nur ein `mailto:`-Link.

Tests werden bewusst aus dieser Spec ausgeklammert (Feature-Priorität vor Test-Coverage). Eine separate Test-Spec folgt später.

**Constraint:** Alle Lösungen müssen kostenlos sein.

---

## Architektur-Überblick

```
┌─────────────────────────────────────────────────────────┐
│  Frontend (React/MUI)                                   │
│  • LoginPage (/login)                                   │
│  • AuthContext (Token-Refresh, Logout)                  │
│  • ProtectedRoute (umschließt /admin/*)                 │
│  • NewsletterSignupForm (Landing + Footer)              │
│  • UnsubscribePage (/unsubscribe?token=...)             │
│  • ConfirmPage (/confirm?token=...)                     │
│  • Admin: SubscriberListPage + SendEditionDialog        │
└─────────────────────────────────────────────────────────┘
                       ↓ HttpOnly Cookie (JWT)
┌─────────────────────────────────────────────────────────┐
│  Backend (Spring Boot)                                  │
│  • Spring Security + JWT-Filter                         │
│  • AuthController: /api/auth/login, /logout, /me        │
│  • SubscriberController: /api/subscribers, /confirm     │
│  • NewsletterController: /api/admin/newsletter/send     │
│  • BrevoEmailService (Bestätigungs- + Newsletter-Mails) │
│  • UserSeedRunner (legt andre+martin beim Start an)     │
└─────────────────────────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────┐
│  PostgreSQL: users, subscribers (neu)                   │
└─────────────────────────────────────────────────────────┘
                       ↓ HTTPS
┌─────────────────────────────────────────────────────────┐
│  Brevo (Email-Versand-API)                              │
└─────────────────────────────────────────────────────────┘
```

---

## Datenmodell

### `users` (Admins)

| Spalte | Typ | Hinweis |
|---|---|---|
| `id` | UUID | PK |
| `username` | VARCHAR(50) | UNIQUE, NOT NULL (`andre`, `martin`) |
| `password_hash` | VARCHAR(255) | BCrypt-Hash (Strength 10) |
| `created_at` | TIMESTAMP | |
| `last_login_at` | TIMESTAMP | nullable |

### `subscribers` (Newsletter-Empfänger)

| Spalte | Typ | Hinweis |
|---|---|---|
| `id` | UUID | PK |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL |
| `confirmed` | BOOLEAN | `false` bis Double-Opt-In |
| `confirmation_token` | VARCHAR(64) | Random Token für Bestätigungs-Link |
| `unsubscribe_token` | VARCHAR(64) | Random Token für Abmelde-Link in jeder Mail |
| `subscribed_at` | TIMESTAMP | |
| `confirmed_at` | TIMESTAMP | nullable, gesetzt bei Bestätigung |
| `unsubscribed_at` | TIMESTAMP | nullable, Row bleibt für DSGVO-Audit |

**Hinweis:** Das bestehende `frontend/src/data/subscribers.ts` Mock-File wird gelöscht.

---

## Auth-Flow

### Endpoints

| Method | Path | Auth | Beschreibung |
|---|---|---|---|
| POST | `/api/auth/login` | – | Body `{ username, password }` → Cookie + `{ username }` |
| POST | `/api/auth/logout` | Cookie | Löscht das Cookie |
| GET | `/api/auth/me` | Cookie | Liefert `{ username }` oder 401 |

### Login-Detail

1. POST `/api/auth/login` mit `{ username, password }`
2. Backend lookup `users` per username, BCrypt-Vergleich
3. Bei Erfolg: JWT erstellen (HS256, 12h Gültigkeit), Claims: `sub=username, role=admin`
4. JWT als HttpOnly-Cookie:
   - `Set-Cookie: auth=...; HttpOnly; Secure; SameSite=Strict; Max-Age=43200; Path=/`
5. Response Body: `{ username }` (kein Token im Body)
6. `last_login_at` updaten

### Authentifizierte Requests

- Spring Security JWT-Filter prüft Cookie bei `/api/admin/**`
- Fehlendes/ungültiges JWT → `401 Unauthorized`
- Frontend leitet bei 401 zu `/login` um

### Frontend

- `AuthContext` ruft beim App-Start `/api/auth/me` auf, um State wiederherzustellen
- `ProtectedRoute`-Komponente umschließt `/admin/*` Routen
- `/login` ist eigene Route (kein Modal, damit Bookmarks/Reload sauber funktionieren)
- Login-UI: schlichtes MUI-Form mit Username + Password Field + Submit-Button, Error-State für falsche Credentials

### User-Seeding

- `UserSeedRunner` als Spring `ApplicationRunner`
- Liest ENV-Variablen:
  - `ADMIN_ANDRE_PASSWORD`
  - `ADMIN_MARTIN_PASSWORD`
- Legt User nur an, wenn nicht vorhanden (idempotent)
- Passwörter werden als K8s Secret deployed (analog zu `postgres-credentials`)

---

## Newsletter-Flow

### Endpoints (Public)

| Method | Path | Auth | Beschreibung |
|---|---|---|---|
| POST | `/api/subscribers` | – | Body `{ email }` → speichert mit `confirmed=false`, sendet Bestätigungs-Mail |
| GET | `/api/subscribers/confirm?token=...` | – | Setzt `confirmed=true`, `confirmed_at=now` |
| GET | `/api/subscribers/unsubscribe?token=...` | – | Setzt `unsubscribed_at=now` |

### Endpoints (Admin)

| Method | Path | Auth | Beschreibung |
|---|---|---|---|
| GET | `/api/admin/subscribers` | Cookie | Liste aller bestätigten Subscriber |
| POST | `/api/admin/newsletter/send` | Cookie | Body `{ editionId }` → sendet Edition an alle bestätigten Subscriber |

### Anmelde-Flow

1. User trägt Email im NewsletterSignupForm ein (Landing-Page + Footer)
2. POST `/api/subscribers` mit `{ email }`
3. Backend:
   - Email-Validierung (Format)
   - Bei bereits existierender Email: neuen `confirmation_token` setzen, Mail erneut senden (kein Fehler nach außen → kein Email-Enumeration)
   - Sonst: neue Row mit `confirmed=false`, random `confirmation_token` (64 Zeichen)
   - Brevo-API call: Bestätigungs-Mail mit Link `https://up2daite.com/confirm?token=...`
4. Frontend zeigt "Bitte prüfe deine E-Mails."

### Bestätigung

1. User klickt Link in Mail → Frontend Route `/confirm?token=...`
2. Frontend ruft `GET /api/subscribers/confirm?token=...` auf
3. Backend setzt `confirmed=true`, `confirmed_at=now`, leert `confirmation_token`
4. Frontend zeigt Erfolgs-Meldung

### Abmeldung

1. Jede Newsletter-Mail enthält einen `unsubscribe`-Link mit `unsubscribe_token`
2. Klick → Frontend Route `/unsubscribe?token=...`
3. `GET /api/subscribers/unsubscribe?token=...` setzt `unsubscribed_at=now`
4. Frontend zeigt "Du wurdest abgemeldet."

### Versand-Flow (Admin)

1. Admin öffnet Admin-Dashboard → "Subscriber"-Tab (`/admin/subscribers`)
2. Liste aller bestätigten Subscriber + Count
3. Button "Edition versenden" → Dialog mit Edition-Auswahl (nur `published`)
4. Bestätigen → POST `/api/admin/newsletter/send` mit `{ editionId }`
5. Backend:
   - Edition aus DB laden
   - Für jeden bestätigten Subscriber: Brevo-API call mit personalisiertem Unsubscribe-Link
   - Rate-Limit: 300 Mails/Tag (Brevo Free Tier) → bei mehr als 300 Subscribers in V1: Backend lehnt Versand mit Fehler ab ("Subscriber-Limit für Free-Tier überschritten"). Queue/Throttling kommt in V2.
6. Admin sieht Status: "X Mails versendet, Y Fehler"

### Email-Templates

- **Bestätigungs-Mail:** simpler HTML+Text mit Link + Hinweis "Falls du das nicht warst, ignoriere diese Mail"
- **Newsletter-Mail:** Edition-Titel, Editor's Note, Story-Liste mit Links zu Edition-Detail-Page, Unsubscribe-Footer
- Templates werden in `backend/src/main/resources/templates/` als HTML-Files mit **Thymeleaf** gepflegt (Spring Boot Standard, in `spring-boot-starter-thymeleaf` Dependency enthalten)

---

## Brevo-Integration

- Free Tier: 300 Mails/Tag, unbegrenzte Kontakte
- API Key wird als ENV-Variable `BREVO_API_KEY` ins Backend gegeben
- K8s Secret: `brevo-credentials`
- Setup-Schritte (außerhalb der App):
  1. Account auf brevo.com anlegen
  2. Sender verifizieren (`hello@up2daite.com`)
  3. API-Key generieren
  4. K8s Secret deployen
- Sender-Domain (up2daite.com) muss SPF/DKIM/DMARC haben (Brevo gibt DNS-Einträge vor)

---

## Error-Handling

- **Login 401**: Frontend zeigt "Falscher Username oder Passwort" (generisch, kein Hinweis welcher Teil falsch ist)
- **Rate-Limit Login**: Spring Security default reicht erstmal, keine eigene Bruteforce-Bremse (V2 falls nötig)
- **Subscribe-Dublette**: keine Fehlermeldung nach außen, einfach Bestätigungs-Mail erneut senden (Email-Enumeration-Schutz)
- **Brevo-API-Fehler beim Subscribe**: Subscriber wird trotzdem gespeichert, Admin-UI zeigt "Mail-Versand fehlgeschlagen, manuell erneut senden" Button
- **Brevo-API-Fehler beim Newsletter-Send**: pro-Empfänger-Fehler werden geloggt, finaler Response zeigt Anzahl Erfolge/Fehler
- **Token-Mismatch (confirm/unsubscribe)**: 404 mit generischer Meldung "Link ungültig oder abgelaufen"

---

## Sicherheit

- BCrypt für Passwörter (Strength 10)
- JWT-Secret aus ENV (`JWT_SECRET`, 256-bit random)
- CORS: nur up2daite.com-Domain für Production
- HTTPS-Pflicht in Production (Secure-Cookie-Flag)
- DSGVO:
  - Double-Opt-In für Newsletter
  - Unsubscribe-Link in jeder Mail
  - Abgemeldete Subscriber bleiben in DB (Audit-Trail), aber bekommen keine Mails mehr
  - Datenschutzhinweis bei Email-Eingabe ("Mit der Anmeldung stimmst du der Speicherung deiner E-Mail zu...")

---

## Konfiguration (neue ENV-Variablen)

| Variable | Wo | Beschreibung |
|---|---|---|
| `JWT_SECRET` | K8s Secret | 256-bit random für JWT-Signing |
| `ADMIN_ANDRE_PASSWORD` | K8s Secret | Initial-Passwort für Andre |
| `ADMIN_MARTIN_PASSWORD` | K8s Secret | Initial-Passwort für Martin |
| `BREVO_API_KEY` | K8s Secret | Brevo API Key |
| `APP_BASE_URL` | ConfigMap | z.B. `https://up2daite.com` für Email-Links |

---

## Implementierungs-Reihenfolge

Spec wird als **eine** Spec geführt, aber Implementierung in Schritten:

### Phase 1: Auth (höchste Priorität)
1. Backend: User-Entity, Repository, UserSeedRunner, Spring Security, JWT-Filter, AuthController
2. Frontend: AuthContext, LoginPage, ProtectedRoute, Logout-Button
3. K8s: Secrets + Deployment-Update

### Phase 2: Newsletter
1. Backend: Subscriber-Entity, Repository, SubscriberController, BrevoEmailService
2. Frontend: NewsletterSignupForm, ConfirmPage, UnsubscribePage
3. Brevo-Account-Setup + DNS-Konfiguration
4. K8s: Brevo-Secret

### Phase 3: Newsletter-Versand
1. Backend: NewsletterController, Email-Templates
2. Frontend: Admin-Subscriber-Page, SendEditionDialog

Tests folgen in separater Spec.

---

## Offene Punkte (für die Implementierung zu klären)

- DNS-Zugriff auf `up2daite.com` für SPF/DKIM/DMARC – wer pflegt das?
- Soll der Newsletter-Versand asynchron laufen (z.B. mit Spring `@Async` + Queue) oder synchron mit Loading-Spinner im Admin-UI?
- Soll die SubscriberListPage Pagination haben oder reicht eine simple Liste (erste Iteration)?
