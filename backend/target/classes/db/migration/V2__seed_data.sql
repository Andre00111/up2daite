-- Flyway Migration V2: Seed-Daten
-- Bestehende TypeScript-Daten aus frontend/src/data/ werden hier initial eingespielt.

-- Topics
INSERT INTO topics (id, label) VALUES
    ('ai-research',  'AI Research'),
    ('ai-products',  'AI Products'),
    ('ai-policy',    'AI Policy'),
    ('ai-business',  'AI Business'),
    ('ai-tools',     'AI Tools');

-- Editions (neueste zuerst in der Seed-Reihenfolge)
INSERT INTO editions (id, slug, number, title, published_at, status, editor_note) VALUES
    ('edition-3', 'ausgabe-3-gpt5-eu-ai-act', 3,
     'GPT-5, EU AI Act und ein Tool das wirklich zählt',
     '2026-04-17', 'published',
     'GPT-5 dominiert diese Woche die Schlagzeilen – aber der EU AI Act-Enforcement und Cursors Agent Mode sind die substanzielleren Entwicklungen. Wir haben die Hype-Meldungen entsprechend eingeordnet.'),

    ('edition-2', 'ausgabe-2-gemini-open-source', 2,
     'Gemini Update, Open Source gewinnt und der KI-Jobmarkt 2026',
     '2026-04-10', 'published', NULL),

    ('edition-1', 'ausgabe-1-ai-policy-schwerpunkt', 1,
     'AI Policy Schwerpunkt – in Arbeit',
     '2026-04-20', 'draft', NULL);

-- Stories Ausgabe 3
INSERT INTO stories (id, title, editorial_comment, source_name, source_url, source_type,
                     signal_impact, signal_hype_level, signal_source_quality,
                     published_at, edition_id, edition_order)
VALUES
    ('story-gpt5-launch',
     'GPT-5 ist da – was das API-Pricing für Developer bedeutet',
     'OpenAI hat GPT-5 offiziell gestartet. Die Benchmark-Headlines sind laut, aber das Relevante ist woanders: Das neue Preismodell skaliert nutzungsbasiert und ändert die Build-vs-Buy-Kalkulation für kleine Teams grundlegend. Wer heute auf GPT-4 setzt, sollte die Migrationskosten neu rechnen.',
     'OpenAI Blog', 'https://openai.com/blog', 'primary',
     5, 4, 5, '2026-04-17', 'edition-3', 0),

    ('story-eu-ai-act-enforcement',
     'EU AI Act: Erste Enforcement-Fälle werden bekannt',
     'Zwei Monate nach Inkrafttreten der GPAI-Regeln zeigen sich erste Muster: Compliance-Aufwand für kleine Teams wird systematisch unterschätzt. Noch keine Bußgelder, aber Dokumentationspflichten greifen bereits. Wer KI-Systeme in der EU einsetzt, sollte die Risikoklassifikation jetzt prüfen.',
     'Politico Tech', 'https://politico.eu', 'analysis',
     5, 1, 4, '2026-04-16', 'edition-3', 1),

    ('story-cursor-agent-mode',
     'Cursor führt vollständigen Agent Mode ein',
     'Cursor hat seinen Agent Mode aus der Beta entlassen. Der Editor übernimmt mehrstufige Aufgaben eigenständig – von Datei anlegen bis Test schreiben. Praktische Einschränkungen bleiben, aber für Routine-Tasks ist das ein echter Effizienzgewinn im Entwickleralltag.',
     'Cursor Blog', 'https://cursor.com/blog', 'primary',
     3, 2, 5, '2026-04-17', 'edition-3', 2),

    ('story-anthropic-safety-report',
     'Anthropics neuer Safety Report: Was wirklich drinsteht',
     'Anthropic hat seinen vierten Safety Report veröffentlicht. Jenseits der PR-Sprache enthält er konkrete Erkenntnisse zur Interpretierbarkeit großer Modelle – und gibt erstmals zu, dass bestimmte Sicherheitsversprechen aktuell nicht verifizierbar sind. Eine ehrliche Lektüre lohnt sich.',
     'Anthropic Research', 'https://anthropic.com/research', 'primary',
     4, 1, 5, '2026-04-15', 'edition-3', 3),

    ('story-ai-startup-funding',
     'KI-Startups sammeln in Q1 2026 Rekord-Funding ein',
     'Die Funding-Zahlen sind beeindruckend – aber 60% des Kapitals fließt in drei Infra-Player. Die lange Tail der Anwendungsschicht kämpft weiterhin mit sinkenden Bewertungen. Für Gründer in der Applikationsebene ist das ein Signal, kein Erfolg.',
     'TechCrunch', 'https://techcrunch.com', 'analysis',
     3, 3, 3, '2026-04-14', 'edition-3', 4),

    ('story-google-veo3',
     'Google kündigt Veo 3 an – besser als Sora?',
     'Google hat Veo 3 auf der I/O angekündigt. Die Pressemitteilung enthält viele Superlative, aber keine öffentlichen Benchmarks und keinen Release-Termin. Das Muster ist bekannt: Ankündigung als Reaktion auf Wettbewerber-News. Erst wenn öffentliche Demos verfügbar sind, lässt sich das einordnen.',
     'Google Press', 'https://blog.google', 'pr-driven',
     2, 5, 2, '2026-04-17', 'edition-3', 5);

-- Stories Ausgabe 2
INSERT INTO stories (id, title, editorial_comment, source_name, source_url, source_type,
                     signal_impact, signal_hype_level, signal_source_quality,
                     published_at, edition_id, edition_order)
VALUES
    ('story-gemini-update',
     'Googles Gemini 2.0 Update: Was sich wirklich verändert hat',
     'Das Gemini 2.0 Update bringt messbare Verbesserungen bei Code-Generierung und Multi-Turn-Reasoning. Interessanter als die Features ist die Preisstrategie: Google senkt API-Preise aggressiv und signalisiert damit, dass der Plattformkampf in die nächste Phase geht.',
     'Google DeepMind Blog', 'https://deepmind.google', 'primary',
     4, 2, 5, '2026-04-10', 'edition-2', 0),

    ('story-open-source-wins',
     'Warum Open Source dieses Mal wirklich gewinnt',
     'Llama 3.1 und Mistral Large 2 liegen auf mehreren Benchmarks gleichauf mit proprietären Modellen. Das ist kein Hype mehr: Für viele Enterprise-Use-Cases ist die Make-vs-Buy-Entscheidung erstmals eine echte Abwägung. Die Implikationen für Anbieter geschlossener Modelle sind erheblich.',
     'The Gradient', 'https://thegradient.pub', 'analysis',
     5, 2, 4, '2026-04-09', 'edition-2', 1),

    ('story-ai-jobs-market',
     'KI-Jobmarkt 2026: Wer gesucht wird und wer nicht',
     'Neue Auswertung von 50.000 Stellenanzeigen zeigt: Nachfrage nach reinen "AI Prompt Engineers" ist eingebrochen. Gesucht werden stattdessen ML-Ops-Entwickler und Produktmanager mit technischem AI-Verständnis. Die Spezialisierung, die gerade noch als Karrieresprungbrett galt, ist bereits Commodity.',
     'LinkedIn Talent Insights', 'https://linkedin.com/business/talent', 'analysis',
     4, 1, 3, '2026-04-08', 'edition-2', 2),

    ('story-notebooklm-enterprise',
     'NotebookLM Enterprise: Google greift den Knowledge-Worker-Markt an',
     'Google hat NotebookLM Enterprise mit DSGVO-Compliance und SSO-Integration angekündigt. Das Produkt löst ein echtes Problem: Wissensmanagement in Teams ohne Daten-Leak-Risiko. Direkte Konkurrenz zu Notion AI und Confluence AI – Google spielt die Datenschutz-Karte bewusst.',
     'Google Workspace Blog', 'https://workspace.google.com/blog', 'primary',
     3, 2, 4, '2026-04-09', 'edition-2', 3),

    ('story-china-ai-regulations',
     'Chinas neue KI-Regulierung: Was westliche Unternehmen wissen müssen',
     'China hat eine neue Runde von KI-Regularien verabschiedet, die auch ausländische Anbieter mit Nutzern in China betreffen. Die technischen Anforderungen an Trainingsdaten und Output-Kontrolle sind in der Praxis kaum erfüllbar. Wer in den chinesischen Markt eintreten will, sollte das neu kalkulieren.',
     'South China Morning Post Tech', 'https://scmp.com/tech', 'analysis',
     4, 1, 4, '2026-04-07', 'edition-2', 4);

-- Story-Topic Verknüpfungen
INSERT INTO story_topics (story_id, topic_id) VALUES
    ('story-gpt5-launch',             'ai-products'),
    ('story-gpt5-launch',             'ai-research'),
    ('story-eu-ai-act-enforcement',   'ai-policy'),
    ('story-eu-ai-act-enforcement',   'ai-business'),
    ('story-cursor-agent-mode',       'ai-tools'),
    ('story-cursor-agent-mode',       'ai-products'),
    ('story-anthropic-safety-report', 'ai-research'),
    ('story-anthropic-safety-report', 'ai-policy'),
    ('story-ai-startup-funding',      'ai-business'),
    ('story-google-veo3',             'ai-products'),
    ('story-google-veo3',             'ai-research'),
    ('story-gemini-update',           'ai-products'),
    ('story-gemini-update',           'ai-research'),
    ('story-open-source-wins',        'ai-research'),
    ('story-open-source-wins',        'ai-business'),
    ('story-ai-jobs-market',          'ai-business'),
    ('story-notebooklm-enterprise',   'ai-products'),
    ('story-notebooklm-enterprise',   'ai-tools'),
    ('story-china-ai-regulations',    'ai-policy'),
    ('story-china-ai-regulations',    'ai-business');
