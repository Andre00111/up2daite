-- Flyway V5: KI-Job-Risiko-Tabelle
-- Wird von der KI-Jobs-Public-Page gelesen und im Admin-Bereich gepflegt.

CREATE TABLE ai_jobs (
    id              UUID         PRIMARY KEY,
    title           VARCHAR(200) NOT NULL,
    category        VARCHAR(100) NOT NULL,
    risk_score      INTEGER      NOT NULL,
    trend           VARCHAR(20)  NOT NULL,
    reasoning       TEXT         NOT NULL,
    affected_tasks  TEXT         NOT NULL DEFAULT '',
    sort_order      INTEGER      NOT NULL DEFAULT 0
);

-- Seed: bisher statisch im Frontend hardgecoded.
INSERT INTO ai_jobs (id, title, category, risk_score, trend, reasoning, affected_tasks, sort_order) VALUES
  ('aa000001-0000-0000-0000-000000000001', 'Telefonischer Kundenservice', 'Kundenservice', 85, 'rising',
   'LLM-basierte Chatbots und Voice-AI übernehmen zunehmend First-Level-Support. Unternehmen wie Klarna haben bereits 700 Support-Stellen durch AI ersetzt.',
   'Anfragen beantworten||Beschwerden aufnehmen||Termine vereinbaren', 1),
  ('aa000002-0000-0000-0000-000000000002', 'Datenerfassung & -eingabe', 'Administration', 92, 'rising',
   'OCR, Dokumenten-AI und automatisierte Workflows machen manuelle Dateneingabe obsolet. Die meisten repetitiven Aufgaben sind bereits automatisierbar.',
   'Formulare digitalisieren||Daten übertragen||Rechnungen erfassen', 2),
  ('aa000003-0000-0000-0000-000000000003', 'Übersetzer:in', 'Sprache & Medien', 78, 'rising',
   'DeepL, GPT-4 und spezialisierte Übersetzungs-KI erreichen nahezu menschliche Qualität. Für Standardtexte ist professionelle Übersetzung oft nicht mehr nötig.',
   'Dokumente übersetzen||Lokalisierung||Untertitel erstellen', 3),
  ('aa000004-0000-0000-0000-000000000004', 'Buchhalter:in', 'Finanzen', 65, 'stable',
   'Automatisierte Buchhaltungssoftware übernimmt Routineaufgaben. Strategische Beratung und komplexe Fälle bleiben vorerst menschlich.',
   'Belege buchen||Kontenabstimmung||Standardreports', 4),
  ('aa000005-0000-0000-0000-000000000005', 'LKW-Fahrer:in', 'Transport & Logistik', 45, 'stable',
   'Autonomes Fahren macht Fortschritte, aber regulatorische und technische Hürden verzögern den breiten Einsatz. Langstrecke wird früher betroffen sein.',
   'Langstreckentransport||Highway-Fahrten||Routenplanung', 5),
  ('aa000006-0000-0000-0000-000000000006', 'Softwareentwickler:in', 'IT & Technik', 35, 'rising',
   'AI-Coding-Assistenten steigern Produktivität enorm. Komplexe Architektur und kreative Problemlösung bleiben menschlich, aber Junior-Positionen werden weniger.',
   'Boilerplate-Code||Bug-Fixes||Code-Reviews', 6),
  ('aa000007-0000-0000-0000-000000000007', 'Radiolog:in', 'Gesundheit', 55, 'rising',
   'AI-Diagnostik erkennt Muster in Bildgebung oft präziser als Menschen. Die Rolle verschiebt sich zur Qualitätskontrolle und Patientenkommunikation.',
   'Bildanalyse||Mustererkennung||Screening', 7),
  ('aa000008-0000-0000-0000-000000000008', 'Lehrer:in', 'Bildung', 25, 'stable',
   'AI unterstützt bei Wissensvermittlung und Korrektur. Soziale, erzieherische und motivationale Aspekte bleiben fundamental menschlich.',
   'Wissensabfrage||Korrektur||Lernmaterial erstellen', 8),
  ('aa000009-0000-0000-0000-000000000009', 'Grafikdesigner:in', 'Kreativ', 60, 'rising',
   'Midjourney, DALL-E und Adobe Firefly automatisieren viele visuelle Aufgaben. Konzeption und Markenarbeit bleiben wertvoll, aber Volumen sinkt.',
   'Stock-Grafiken||Social-Media-Assets||Banner erstellen', 9);
