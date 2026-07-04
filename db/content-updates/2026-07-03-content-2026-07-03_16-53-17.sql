-- up2daite Content Export
-- Generated: Fri Jul  3 16:53:17 CEST 2026
-- Filter: Entries since 2026-07-03

BEGIN;

-- ═══ EDITIONS ═════════════════════════════════════════════
-- ═══ STORIES ═════════════════════════════════════════════
-- ═══ STORY-TOPIC ASSIGNMENTS ═════════════════════════════
-- ═══ AI MODELS (nur geänderte) ═══════════════════════════

INSERT INTO ai_models (id, name, company, logo, gradient, accent_color, rank_pos, category, highlights, release_year)
VALUES (
  'bb000001-0000-0000-0000-000000000001',
  'GPT-4o',
  'OpenAI',
  '✦',
  'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  '#10b981',
  1,
  'Multimodal',
  'Echtzeit-Voice',
  |Vision||Reasoning|2024
) ON CONFLICT (id) DO UPDATE SET
  rank_pos = EXCLUDED.rank_pos,
  category = EXCLUDED.category,
  highlights = EXCLUDED.highlights;

INSERT INTO ai_models (id, name, company, logo, gradient, accent_color, rank_pos, category, highlights, release_year)
VALUES (
  'bb000002-0000-0000-0000-000000000002',
  'Claude 4',
  'Anthropic',
  '◈',
  'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
  '#f97316',
  2,
  'Reasoning',
  '200K Context',
  |Coding||Sicherheit|2025
) ON CONFLICT (id) DO UPDATE SET
  rank_pos = EXCLUDED.rank_pos,
  category = EXCLUDED.category,
  highlights = EXCLUDED.highlights;

INSERT INTO ai_models (id, name, company, logo, gradient, accent_color, rank_pos, category, highlights, release_year)
VALUES (
  'bb000003-0000-0000-0000-000000000003',
  'Gemini Ultra',
  'Google',
  '◆',
  'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
  '#3b82f6',
  3,
  'Multimodal',
  '1M Context',
  |Video||Search|2024
) ON CONFLICT (id) DO UPDATE SET
  rank_pos = EXCLUDED.rank_pos,
  category = EXCLUDED.category,
  highlights = EXCLUDED.highlights;

INSERT INTO ai_models (id, name, company, logo, gradient, accent_color, rank_pos, category, highlights, release_year)
VALUES (
  'bb000004-0000-0000-0000-000000000004',
  'Llama 3.1',
  'Meta',
  '🦙',
  'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
  '#8b5cf6',
  4,
  'Open Source',
  '405B Parameter',
  |Open Weights||Multilingual|2024
) ON CONFLICT (id) DO UPDATE SET
  rank_pos = EXCLUDED.rank_pos,
  category = EXCLUDED.category,
  highlights = EXCLUDED.highlights;

INSERT INTO ai_models (id, name, company, logo, gradient, accent_color, rank_pos, category, highlights, release_year)
VALUES (
  'bb000005-0000-0000-0000-000000000005',
  'Mistral Large',
  'Mistral AI',
  '🌀',
  'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
  '#ec4899',
  5,
  'Enterprise',
  'EU-basiert',
  |Multilingual||Effizient|2024
) ON CONFLICT (id) DO UPDATE SET
  rank_pos = EXCLUDED.rank_pos,
  category = EXCLUDED.category,
  highlights = EXCLUDED.highlights;

INSERT INTO ai_models (id, name, company, logo, gradient, accent_color, rank_pos, category, highlights, release_year)
VALUES (
  'bb000006-0000-0000-0000-000000000006',
  'Grok-2',
  'xAI',
  '⚡',
  'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
  '#14b8a6',
  6,
  'Realtime',
  'X-Integration',
  |Echtzeit-Daten||Unzensiert|2024
) ON CONFLICT (id) DO UPDATE SET
  rank_pos = EXCLUDED.rank_pos,
  category = EXCLUDED.category,
  highlights = EXCLUDED.highlights;

INSERT INTO ai_models (id, name, company, logo, gradient, accent_color, rank_pos, category, highlights, release_year)
VALUES (
  'bb000007-0000-0000-0000-000000000007',
  'DALL-E 3',
  'OpenAI',
  '🎨',
  'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)',
  '#f43f5e',
  7,
  'Bildgenerierung',
  'Prompt-Treue',
  |Text in Bildern||ChatGPT-integriert|2023
) ON CONFLICT (id) DO UPDATE SET
  rank_pos = EXCLUDED.rank_pos,
  category = EXCLUDED.category,
  highlights = EXCLUDED.highlights;

INSERT INTO ai_models (id, name, company, logo, gradient, accent_color, rank_pos, category, highlights, release_year)
VALUES (
  'bb000008-0000-0000-0000-000000000008',
  'Midjourney v6',
  'Midjourney',
  '🖼️',
  'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
  '#6366f1',
  8,
  'Bildgenerierung',
  'Fotorealismus',
  |Stil-Kontrolle||Upscaling|2024
) ON CONFLICT (id) DO UPDATE SET
  rank_pos = EXCLUDED.rank_pos,
  category = EXCLUDED.category,
  highlights = EXCLUDED.highlights;

INSERT INTO ai_models (id, name, company, logo, gradient, accent_color, rank_pos, category, highlights, release_year)
VALUES (
  'bb000009-0000-0000-0000-000000000009',
  'Sora',
  'OpenAI',
  '🎬',
  'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
  '#0ea5e9',
  9,
  'Video',
  'Text-to-Video',
  |1 Min Clips||Physik-Verständnis|2024
) ON CONFLICT (id) DO UPDATE SET
  rank_pos = EXCLUDED.rank_pos,
  category = EXCLUDED.category,
  highlights = EXCLUDED.highlights;
-- ═══ AI JOBS (neu + aktualisiert) ════════════════════════

INSERT INTO ai_jobs (id, title, category, risk_score, trend, reasoning, affected_tasks, sort_order)
VALUES (
  'aa000001-0000-0000-0000-000000000001',
  'Telefonischer Kundenservice',
  'Kundenservice',
  85,
  'rising',
  'LLM-basierte Chatbots und Voice-AI übernehmen zunehmend First-Level-Support. Unternehmen wie Klarna haben bereits 700 Support-Stellen durch AI ersetzt.',
  '{Anfragen beantworten}',
  |Beschwerden aufnehmen||Termine vereinbaren|1
) ON CONFLICT (id) DO UPDATE SET
  risk_score = EXCLUDED.risk_score,
  trend = EXCLUDED.trend,
  reasoning = EXCLUDED.reasoning;

INSERT INTO ai_jobs (id, title, category, risk_score, trend, reasoning, affected_tasks, sort_order)
VALUES (
  'aa000002-0000-0000-0000-000000000002',
  'Datenerfassung & -eingabe',
  'Administration',
  95,
  'rising',
  'KI-Systeme verarbeiten heute über 1.000 Dokumente pro Stunde mit einer Fehlerquote unter 0,1 % – gegenüber 2–5 % bei Menschen. OCR kombiniert mit Large Language Models macht nahezu alle Routineaufgaben automatisierbar. Laut Anthropic-Arbeitsmarktstudie (2026) gehören Dateneingabe-Tätigkeiten zu den am stärksten exponierten Gruppen.',
  '{Formulare digitalisieren}',
  |Daten übertragen||Rechnungen erfassen|2
) ON CONFLICT (id) DO UPDATE SET
  risk_score = EXCLUDED.risk_score,
  trend = EXCLUDED.trend,
  reasoning = EXCLUDED.reasoning;

INSERT INTO ai_jobs (id, title, category, risk_score, trend, reasoning, affected_tasks, sort_order)
VALUES (
  'aa000003-0000-0000-0000-000000000003',
  'Übersetzer:in',
  'Sprache & Medien',
  78,
  'rising',
  'DeepL, GPT-4 und spezialisierte Übersetzungs-KI erreichen nahezu menschliche Qualität. Für Standardtexte ist professionelle Übersetzung oft nicht mehr nötig.',
  '{Dokumente übersetzen}',
  |Lokalisierung||Untertitel erstellen|3
) ON CONFLICT (id) DO UPDATE SET
  risk_score = EXCLUDED.risk_score,
  trend = EXCLUDED.trend,
  reasoning = EXCLUDED.reasoning;

INSERT INTO ai_jobs (id, title, category, risk_score, trend, reasoning, affected_tasks, sort_order)
VALUES (
  'aa000004-0000-0000-0000-000000000004',
  'Buchhalter:in',
  'Finanzen',
  72,
  'rising',
  'Automatisierungstools wie Xero, DATEV SmartTransfer und KI-gestützte ERP-Systeme übernehmen Routinebuchungen bereits heute weitgehend selbstständig. Laut WEF und OECD sind über 70 % der Kerntätigkeiten einfacher Buchhalter automatisierbar; eine Studie projiziert eine Reduktion einfacher Buchhaltungsrollen um 35–50 % bis 2028.',
  '{Belege buchen}',
  |Kontenabstimmung||Standardreports|4
) ON CONFLICT (id) DO UPDATE SET
  risk_score = EXCLUDED.risk_score,
  trend = EXCLUDED.trend,
  reasoning = EXCLUDED.reasoning;

INSERT INTO ai_jobs (id, title, category, risk_score, trend, reasoning, affected_tasks, sort_order)
VALUES (
  'aa000005-0000-0000-0000-000000000005',
  'LKW-Fahrer:in',
  'Transport & Logistik',
  45,
  'stable',
  'Autonomes Fahren macht Fortschritte, aber regulatorische und technische Hürden verzögern den breiten Einsatz. Langstrecke wird früher betroffen sein.',
  '{Langstreckentransport}',
  |Highway-Fahrten||Routenplanung|5
) ON CONFLICT (id) DO UPDATE SET
  risk_score = EXCLUDED.risk_score,
  trend = EXCLUDED.trend,
  reasoning = EXCLUDED.reasoning;

INSERT INTO ai_jobs (id, title, category, risk_score, trend, reasoning, affected_tasks, sort_order)
VALUES (
  'aa000006-0000-0000-0000-000000000006',
  'Softwareentwickler:in',
  'IT & Technik',
  35,
  'rising',
  'AI-Coding-Assistenten steigern Produktivität enorm. Komplexe Architektur und kreative Problemlösung bleiben menschlich, aber Junior-Positionen werden weniger.',
  '{Boilerplate-Code}',
  |Bug-Fixes||Code-Reviews|6
) ON CONFLICT (id) DO UPDATE SET
  risk_score = EXCLUDED.risk_score,
  trend = EXCLUDED.trend,
  reasoning = EXCLUDED.reasoning;

INSERT INTO ai_jobs (id, title, category, risk_score, trend, reasoning, affected_tasks, sort_order)
VALUES (
  'aa000007-0000-0000-0000-000000000007',
  'Radiolog:in',
  'Gesundheit',
  55,
  'rising',
  'AI-Diagnostik erkennt Muster in Bildgebung oft präziser als Menschen. Die Rolle verschiebt sich zur Qualitätskontrolle und Patientenkommunikation.',
  '{Bildanalyse}',
  |Mustererkennung||Screening|7
) ON CONFLICT (id) DO UPDATE SET
  risk_score = EXCLUDED.risk_score,
  trend = EXCLUDED.trend,
  reasoning = EXCLUDED.reasoning;

INSERT INTO ai_jobs (id, title, category, risk_score, trend, reasoning, affected_tasks, sort_order)
VALUES (
  'aa000008-0000-0000-0000-000000000008',
  'Lehrer:in',
  'Bildung',
  25,
  'stable',
  'AI unterstützt bei Wissensvermittlung und Korrektur. Soziale, erzieherische und motivationale Aspekte bleiben fundamental menschlich.',
  '{Wissensabfrage}',
  |Korrektur||Lernmaterial erstellen|8
) ON CONFLICT (id) DO UPDATE SET
  risk_score = EXCLUDED.risk_score,
  trend = EXCLUDED.trend,
  reasoning = EXCLUDED.reasoning;

INSERT INTO ai_jobs (id, title, category, risk_score, trend, reasoning, affected_tasks, sort_order)
VALUES (
  'aa000009-0000-0000-0000-000000000009',
  'Grafikdesigner:in',
  'Kreativ',
  60,
  'rising',
  'Midjourney, DALL-E und Adobe Firefly automatisieren viele visuelle Aufgaben. Konzeption und Markenarbeit bleiben wertvoll, aber Volumen sinkt.',
  '{Stock-Grafiken}',
  |Social-Media-Assets||Banner erstellen|9
) ON CONFLICT (id) DO UPDATE SET
  risk_score = EXCLUDED.risk_score,
  trend = EXCLUDED.trend,
  reasoning = EXCLUDED.reasoning;

INSERT INTO ai_jobs (id, title, category, risk_score, trend, reasoning, affected_tasks, sort_order)
VALUES (
  'bb000010-0000-0000-0000-000000000010',
  'Paralegal / Rechtsfachangestellte:r',
  'Rechtsdienstleistungen',
  80,
  'rising',
  'Generative KI kann heute umfangreiche Rechtsdokumente in Sekunden analysieren, zusammenfassen und nach Präzedenzfällen durchsuchen – Aufgaben, die früher Stunden menschlicher Arbeit beanspruchten. Plattformen wie Harvey AI und CoCounsel sind bereits in Großkanzleien im Einsatz und reduzieren den Bedarf an Junior-Paralegals deutlich. Komplexe Verhandlungsführung und ethische Abwägungen bleiben vorerst menschlichen Fachkräften vorbehalten.',
  '{Dokumentenrecherche}',
  |Vertragsprüfung auf Standardklauseln||Erstellung von Standardschriftsätzen||Rechtsprechungsrecherche|10
) ON CONFLICT (id) DO UPDATE SET
  risk_score = EXCLUDED.risk_score,
  trend = EXCLUDED.trend,
  reasoning = EXCLUDED.reasoning;

COMMIT;

-- Summary:
-- Exported: Fri Jul  3 16:53:18 CEST 2026
-- Since: 2026-07-03
-- Review before applying: psql -h localhost -p 45432 -U up2daite -d up2daite < /Users/andre.butkevich/Desktop/Projects/AI-news-app/db/content-updates/2026-07-03-content-2026-07-03_16-53-17.sql
