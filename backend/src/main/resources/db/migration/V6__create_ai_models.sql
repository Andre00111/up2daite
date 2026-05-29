-- Flyway V6: KI-Modelle-Tabelle
-- Wird von der KI-Modelle-Public-Page gelesen und im Admin-Bereich gepflegt.

CREATE TABLE ai_models (
    id           UUID         PRIMARY KEY,
    name         VARCHAR(100) NOT NULL,
    company      VARCHAR(100) NOT NULL,
    logo         VARCHAR(10),
    gradient     VARCHAR(200),
    accent_color VARCHAR(20),
    rank_pos     INTEGER      NOT NULL,
    category     VARCHAR(100),
    highlights   TEXT         NOT NULL DEFAULT '',
    release_year INTEGER
);

-- Seed: bisher statisch im Frontend hardgecoded.
INSERT INTO ai_models (id, name, company, logo, gradient, accent_color, rank_pos, category, highlights, release_year) VALUES
  ('bb000001-0000-0000-0000-000000000001', 'GPT-4o', 'OpenAI', '✦',
   'linear-gradient(135deg, #10b981 0%, #059669 100%)', '#10b981', 1, 'Multimodal',
   'Echtzeit-Voice||Vision||Reasoning', 2024),
  ('bb000002-0000-0000-0000-000000000002', 'Claude 4', 'Anthropic', '◈',
   'linear-gradient(135deg, #f97316 0%, #ea580c 100%)', '#f97316', 2, 'Reasoning',
   '200K Context||Coding||Sicherheit', 2025),
  ('bb000003-0000-0000-0000-000000000003', 'Gemini Ultra', 'Google', '◆',
   'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', '#3b82f6', 3, 'Multimodal',
   '1M Context||Video||Search', 2024),
  ('bb000004-0000-0000-0000-000000000004', 'Llama 3.1', 'Meta', '🦙',
   'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', '#8b5cf6', 4, 'Open Source',
   '405B Parameter||Open Weights||Multilingual', 2024),
  ('bb000005-0000-0000-0000-000000000005', 'Mistral Large', 'Mistral AI', '🌀',
   'linear-gradient(135deg, #ec4899 0%, #db2777 100%)', '#ec4899', 5, 'Enterprise',
   'EU-basiert||Multilingual||Effizient', 2024),
  ('bb000006-0000-0000-0000-000000000006', 'Grok-2', 'xAI', '⚡',
   'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)', '#14b8a6', 6, 'Realtime',
   'X-Integration||Echtzeit-Daten||Unzensiert', 2024),
  ('bb000007-0000-0000-0000-000000000007', 'DALL-E 3', 'OpenAI', '🎨',
   'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)', '#f43f5e', 7, 'Bildgenerierung',
   'Prompt-Treue||Text in Bildern||ChatGPT-integriert', 2023),
  ('bb000008-0000-0000-0000-000000000008', 'Midjourney v6', 'Midjourney', '🖼️',
   'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', '#6366f1', 8, 'Bildgenerierung',
   'Fotorealismus||Stil-Kontrolle||Upscaling', 2024),
  ('bb000009-0000-0000-0000-000000000009', 'Sora', 'OpenAI', '🎬',
   'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)', '#0ea5e9', 9, 'Video',
   'Text-to-Video||1 Min Clips||Physik-Verständnis', 2024);
