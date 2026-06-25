-- Flyway V9: KI-Modelle auf Stand Juni 2026 aktualisieren
-- Alte Einträge löschen und durch aktuelle Modelle ersetzen.

DELETE FROM ai_models;

INSERT INTO ai_models (id, name, company, logo, gradient, accent_color, rank_pos, category, highlights, release_year) VALUES

  -- ═══ TOP 3: Frontier LLMs ═══════════════════════════════════════════════════

  ('bb000001-0000-0000-0000-000000000001', 'Claude Opus 4.8', 'Anthropic', '◈',
   'linear-gradient(135deg, #f97316 0%, #ea580c 100%)', '#f97316', 1, 'Coding & Reasoning',
   'SWE-bench 88.6%||200K Context||Agentic Coding', 2026),

  ('bb000002-0000-0000-0000-000000000002', 'GPT-5.5', 'OpenAI', '✦',
   'linear-gradient(135deg, #10b981 0%, #059669 100%)', '#10b981', 2, 'Allrounder',
   'Creative Writing||Multimodal||Voice & Vision', 2026),

  ('bb000003-0000-0000-0000-000000000003', 'Gemini 3.1 Pro', 'Google', '◆',
   'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', '#3b82f6', 3, 'Reasoning',
   'GPQA 94.3%||2M Context||Google-Ökosystem', 2026),

  -- ═══ RANG 4–6: Starke Konkurrenten ══════════════════════════════════════════

  ('bb000004-0000-0000-0000-000000000004', 'Grok 4.3', 'xAI', '⚡',
   'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)', '#14b8a6', 4, 'Agentic AI',
   'Tool Use||Echtzeit-Daten||Günstigster Frontier', 2026),

  ('bb000005-0000-0000-0000-000000000005', 'DeepSeek V4', 'DeepSeek', '🔮',
   'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', '#8b5cf6', 5, 'Open Source',
   '1.6T Parameter MoE||1M Context||1/5 GPT-Preis', 2026),

  ('bb000006-0000-0000-0000-000000000006', 'Llama 4 Maverick', 'Meta', '🦙',
   'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', '#6366f1', 6, 'Open Source',
   '128 Experts MoE||1M Context||Multimodal nativ', 2025),

  -- ═══ RANG 7–8: Spezialisten ═════════════════════════════════════════════════

  ('bb000007-0000-0000-0000-000000000007', 'Claude Fable 5', 'Anthropic', '📖',
   'linear-gradient(135deg, #ec4899 0%, #db2777 100%)', '#ec4899', 7, 'Creative AI',
   'Storytelling||Roleplay||Kreatives Schreiben', 2026),

  ('bb000008-0000-0000-0000-000000000008', 'Mistral Large', 'Mistral AI', '🌀',
   'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)', '#f43f5e', 8, 'Enterprise',
   'EU-basiert||DSGVO-konform||Multilingual', 2025),

  -- ═══ RANG 9–11: Bild & Video ════════════════════════════════════════════════

  ('bb000009-0000-0000-0000-000000000009', 'Midjourney v8', 'Midjourney', '🖼️',
   'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)', '#a855f7', 9, 'Bildgenerierung',
   '5x schneller||Native 2K||Ästhetik-Leader', 2026),

  ('bb000010-0000-0000-0000-000000000010', 'FLUX.1.1 Pro', 'Black Forest Labs', '🎨',
   'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)', '#0ea5e9', 10, 'Bildgenerierung',
   'Fotorealismus||4.5s Rendering||Open Source', 2026),

  ('bb000011-0000-0000-0000-000000000011', 'Veo 3.1', 'Google', '🎬',
   'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)', '#eab308', 11, 'Videogenerierung',
   '96% Marktanteil||Text-to-Video||Prompt-Treue', 2026);
