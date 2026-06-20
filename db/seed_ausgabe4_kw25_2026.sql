-- ═══════════════════════════════════════════════════════════════════════════
-- UP2DAITE — Ausgabe #4 · KW 25 / Juni 2026
-- Kuratierte AI-News + neue KI-Jobs
--
-- Ausführen: psql -h <host> -U up2daite -d up2daite -f seed_ausgabe4_kw25_2026.sql
-- Lokal:     psql -h localhost -p 45432 -U up2daite -d up2daite -f ...
-- ═══════════════════════════════════════════════════════════════════════════

BEGIN;

-- ─── EDITION ────────────────────────────────────────────────────────────────

INSERT INTO editions (id, slug, number, title, published_at, status, editor_note)
VALUES (
    'edition-4',
    'ausgabe-4-gemini-claude-eu-ki',
    4,
    'Gemini 3.5 Flash vs. Claude Opus 4.8 – und die EU zieht die Bremse',
    '2026-06-20',
    'published',
    'Ein KW 25, das es in sich hat: Google und Anthropic liefern sich ein Benchmark-Duell mit echten Auswirkungen für Entwickler. Gleichzeitig zeigt die EU-Omnibus-Reform, wie schwer regulatorische Klarheit wirklich ist – und eine neue Anthropic-Studie legt offen, wen KI wirklich zuerst trifft. Wir haben priorisiert, was zählt.'
) ON CONFLICT (id) DO NOTHING;

-- ─── STORIES ────────────────────────────────────────────────────────────────

INSERT INTO stories (id, title, editorial_comment, source_name, source_url, source_type,
                     signal_impact, signal_hype_level, signal_source_quality,
                     published_at, edition_id, edition_order)
VALUES
    (
        'story-gemini-35-flash',
        'Google launcht Gemini 3.5 Flash: Viermal schneller als die Konkurrenz',
        'Auf dem Google I/O 2026 (19.–20. Mai) stellte Google sein neues Flaggschiff-Modell Gemini 3.5 Flash vor, das laut eigenen Angaben viermal schneller als vergleichbare Frontier-Modelle ist und diese in Coding-, Reasoning- und Multimodal-Benchmarks übertrifft. Gleichzeitig wurde Gemini Omni für Videogenerierung und Gemini Spark als proaktiver Hintergrund-Agent angekündigt. Google signalisiert damit, dass die Ära der agentic AI in der Produktionskette angekommen ist.',
        '9to5Google / Google Blog',
        'https://9to5google.com/2026/05/19/google-io-2026-news/',
        'primary',
        5, 3, 4,
        '2026-05-19',
        'edition-4', 0
    ),
    (
        'story-claude-opus-48',
        'Claude Opus 4.8 übernimmt die KI-Spitzenposition mit Score 61,4',
        'Anthropics Claude Opus 4.8 (veröffentlicht am 27. Mai 2026) hat als erstes Modell überhaupt die 60-Punkte-Marke des Artificial Analysis Intelligence Index durchbrochen und führt nun bei realen Wirtschaftsaufgaben sowie in Coding und Agentic Computer Use. Die Benchmark-Dominanz kommt kurz nach Anthropics eigenem Forschungsbericht zur Arbeitsmarktbelastung – ein Signal, dass das Unternehmen Leistung und gesellschaftliche Verantwortung gleichzeitig kommunizieren will.',
        'Artificial Analysis / llm-stats.com',
        'https://llm-stats.com/ai-news',
        'analysis',
        4, 2, 4,
        '2026-05-27',
        'edition-4', 1
    ),
    (
        'story-eu-omnibus-ki',
        'EU-KI-Omnibus: Hochrisiko-Fristen verschoben, neue Verbote eingeführt',
        'Am 7. Mai 2026 einigten sich EU-Parlament und Rat auf das Digital Omnibus-Paket, das die Fristen für Hochrisiko-KI-Systeme nach Anhang III um 16 Monate auf Dezember 2027 verlängert. Gleichzeitig wurden neue Verbote für KI-generierte nicht-einvernehmliche intime Inhalte und Kindesmissbrauchsmaterial eingeführt. Kritiker sehen darin eine Schwächung des ursprünglichen AI Act-Rahmens; Befürworter argumentieren, die Fristverlängerung sei nötig, um KMU nicht zu überfordern.',
        'White & Case / Inside Privacy',
        'https://www.whitecase.com/insight-alert/eu-agrees-digital-omnibus-deal-simplify-ai-rules',
        'analysis',
        5, 1, 5,
        '2026-05-07',
        'edition-4', 2
    ),
    (
        'story-anthropic-arbeitsmarkt',
        'Anthropic-Studie: KI trifft zuerst gut ausgebildete Fachkräfte',
        'Anthropics Arbeitsmarkt-Studie (März 2026, veröffentlicht auf anthropic.com) zeigt anhand realer Claude-Nutzungsdaten, dass die am stärksten KI-exponierten Berufe ausgerechnet hochqualifizierte, erfahrene und überdurchschnittlich bezahlte Tätigkeiten sind – darunter Softwareentwickler, Finanzanalysten und Kundenservice-Spezialisten. Bisher gibt es keinen messbaren Anstieg der Arbeitslosigkeit, jedoch ist die Neueinstellung junger Arbeitnehmer (22–25 Jahre) in hochexponierten Berufen seit ChatGPT-Launch um ca. 14 % zurückgegangen.',
        'Anthropic Research / Fortune',
        'https://www.anthropic.com/research/labor-market-impacts',
        'primary',
        5, 1, 5,
        '2026-03-06',
        'edition-4', 3
    ),
    (
        'story-colorado-ki-gesetz',
        'Colorado verabschiedet erstes US-Gesetz zu Hochrisiko-KI – und verschiebt es gleich wieder',
        'Colorado SB 24-205 sollte ursprünglich am 30. Juni 2026 in Kraft treten und war das erste umfassende US-Staatsgesetz zu Hochrisiko-KI-Systemen in Bereichen wie Gesundheit, Beschäftigung und Finanzen. Gouverneur Polis unterzeichnete jedoch am 14. Mai 2026 das Folgegesetz SB 189, das die Frist auf Januar 2027 verschiebt und die Anforderungen erheblich abmildert. Der politische Rückzieher zeigt, wie stark die Technologielobby regulatorische Initiativen auf Staatsebene unter Druck setzt.',
        'Troutman Privacy / Hunton Andrews Kurth',
        'https://www.troutmanprivacy.com/2026/05/colorado-legislature-passes-bill-to-repeal-and-replace-colorado-ai-act/',
        'primary',
        4, 1, 5,
        '2026-05-14',
        'edition-4', 4
    )
ON CONFLICT (id) DO NOTHING;

-- ─── STORY → TOPIC ZUORDNUNGEN ──────────────────────────────────────────────

INSERT INTO story_topics (story_id, topic_id) VALUES
    ('story-gemini-35-flash',       'ai-products'),
    ('story-claude-opus-48',        'ai-research'),
    ('story-eu-omnibus-ki',         'ai-policy'),
    ('story-anthropic-arbeitsmarkt','ai-business'),
    ('story-colorado-ki-gesetz',    'ai-policy')
ON CONFLICT DO NOTHING;

-- ─── NEUE KI-JOBS ───────────────────────────────────────────────────────────
-- Paralegal ist neu. Dateneingabe und Buchhalter existieren bereits (aa000002, aa000004).
-- Die bestehenden Einträge werden mit aktuelleren Risiko-Einschätzungen geupdated.

-- Neuer Job: Paralegal / Rechtsfachangestellte:r
INSERT INTO ai_jobs (id, title, category, risk_score, trend, reasoning, affected_tasks, sort_order)
VALUES (
    gen_random_uuid(),
    'Paralegal / Rechtsfachangestellte:r',
    'Rechtsdienstleistungen',
    80,
    'rising',
    'Generative KI kann heute umfangreiche Rechtsdokumente in Sekunden analysieren, zusammenfassen und nach Präzedenzfällen durchsuchen – Aufgaben, die früher Stunden menschlicher Arbeit beanspruchten. Plattformen wie Harvey AI und CoCounsel sind bereits in Großkanzleien im Einsatz und reduzieren den Bedarf an Junior-Paralegals deutlich. Komplexe Verhandlungsführung, mandantenorientierte Beratung und ethische Abwägungen bleiben vorerst menschlichen Fachkräften vorbehalten.',
    'Dokumentenrecherche||Vertragsprüfung auf Standardklauseln||Erstellung von Standardschriftsätzen||Rechtsprechungsrecherche',
    10
) ON CONFLICT DO NOTHING;

-- Risiko-Update für bestehende Dateneingabe (war 92, bleibt hoch, Reasoning aktualisiert)
UPDATE ai_jobs
SET reasoning = 'KI-Systeme verarbeiten heute über 1.000 Dokumente pro Stunde mit einer Fehlerquote unter 0,1 % – gegenüber 2–5 % bei Menschen. OCR kombiniert mit Large Language Models macht nahezu alle Routineaufgaben dieser Berufsgruppe automatisierbar. Laut Anthropic-Arbeitsmarkt-Studie (2026) gehören Dateneingabe-Tätigkeiten zu den am stärksten exponierten Gruppen.',
    risk_score = 95
WHERE id = 'aa000002-0000-0000-0000-000000000002';

-- Risiko-Update für Buchhalter (war 65 stable, Trend auf rising aktualisiert)
UPDATE ai_jobs
SET risk_score = 72,
    trend = 'rising',
    reasoning = 'Automatisierungstools wie Xero, DATEV SmartTransfer und KI-gestützte ERP-Systeme übernehmen Routinebuchungen bereits heute weitgehend selbstständig. Laut WEF und OECD sind über 70 % der Kerntätigkeiten einfacher Buchhalter automatisierbar; eine Studie projiziert eine Reduktion einfacher Buchhaltungsrollen um 35–50 % bis 2028. Komplexe steuerliche Beratung und strategisches Finanzcontrolling bleiben von der Automatisierung weitgehend unberührt.'
WHERE id = 'aa000004-0000-0000-0000-000000000004';

COMMIT;

-- ─── VERIFIKATION ───────────────────────────────────────────────────────────
-- Nach dem Ausführen prüfen:
SELECT e.number, e.title, e.status, COUNT(s.id) AS story_count
FROM editions e
LEFT JOIN stories s ON s.edition_id = e.id
GROUP BY e.id, e.number, e.title, e.status
ORDER BY e.number DESC;
