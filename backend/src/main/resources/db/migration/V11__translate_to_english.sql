-- Flyway Migration V11: Translate all German seed content to English
-- Updates editions and stories from V2 and V7 migrations

-- ─── EDITIONS (V2) ──────────────────────────────────────────────────────────

UPDATE editions SET title = 'GPT-5, EU AI Act and a Tool That Really Matters',
                    editor_note = 'GPT-5 dominates headlines this week – but EU AI Act enforcement and Cursor''s Agent Mode are the more substantial developments. We''ve weighted hype accordingly.'
WHERE id = 'edition-3';

UPDATE editions SET title = 'Gemini Update, Open Source Wins, and the AI Job Market 2026'
WHERE id = 'edition-2';

UPDATE editions SET title = 'AI Policy Deep Dive – In Progress'
WHERE id = 'edition-1';

-- ─── STORIES (V2) Edition 3 ──────────────────────────────────────────────────

UPDATE stories SET
  title = 'GPT-5 Launches: What the New API Pricing Means for Developers',
  editorial_comment = 'OpenAI officially launched GPT-5. The benchmark headlines are loud, but what matters is elsewhere: the new usage-based pricing model fundamentally changes the build-vs-buy calculus for small teams. If you''re betting on GPT-4 today, recalculate your migration costs.'
WHERE id = 'story-gpt5-launch';

UPDATE stories SET
  title = 'EU AI Act: First Enforcement Cases Emerge',
  editorial_comment = 'Two months after the GPAI rules took effect, patterns are emerging: compliance effort for small teams is systematically underestimated. No fines yet, but documentation requirements are already biting. If you''re deploying AI systems in the EU, review your risk classification now.'
WHERE id = 'story-eu-ai-act-enforcement';

UPDATE stories SET
  title = 'Cursor Exits Agent Mode Beta – Full Autonomous Task Execution',
  editorial_comment = 'Cursor''s Agent Mode is out of beta. The editor autonomously tackles multi-step tasks – from file creation to test writing. Practical limitations remain, but for routine work, this is a genuine productivity win in daily development.'
WHERE id = 'story-cursor-agent-mode';

UPDATE stories SET
  title = 'Anthropic''s New Safety Report: What''s Actually Inside',
  editorial_comment = 'Anthropic released its fourth Safety Report. Beyond PR language, it contains concrete findings on interpretability of large models – and admits for the first time that some safety promises aren''t currently verifiable. Worth the read.'
WHERE id = 'story-anthropic-safety-report';

UPDATE stories SET
  title = 'AI Startups Raise Record Funding in Q1 2026',
  editorial_comment = 'Funding figures are impressive – but 60% flows to three infrastructure players. Long-tail application developers still struggle with declining valuations. For founders in the application layer, this is a reality check, not a victory.'
WHERE id = 'story-ai-startup-funding';

UPDATE stories SET
  title = 'Google Announces Veo 3 – Better Than Sora?',
  editorial_comment = 'Google announced Veo 3 at I/O. The press release is full of superlatives but no public benchmarks, no release date. The pattern is familiar: announcement as reaction to competitor news. Judge fairly only when public demos are available.'
WHERE id = 'story-google-veo3';

-- ─── STORIES (V2) Edition 2 ──────────────────────────────────────────────────

UPDATE stories SET
  title = 'Google''s Gemini 2.0 Update: What Actually Changed',
  editorial_comment = 'The Gemini 2.0 update brings measurable improvements in code generation and multi-turn reasoning. More interesting than features is pricing: Google aggressively cuts API costs, signaling the platform war enters its next phase.'
WHERE id = 'story-gemini-update';

UPDATE stories SET
  title = 'Why Open Source Really Wins This Time',
  editorial_comment = 'Llama 3.1 and Mistral Large 2 match proprietary models on multiple benchmarks. This is no longer hype: for many enterprise use cases, the make-vs-buy decision is finally a genuine trade-off. Implications for closed-model vendors are substantial.'
WHERE id = 'story-open-source-wins';

UPDATE stories SET
  title = 'AI Job Market 2026: Who''s Hired, Who''s Not',
  editorial_comment = 'Analysis of 50,000 job postings shows demand for pure "AI Prompt Engineers" has cratered. What''s in demand: ML Ops developers and product managers with technical AI literacy. The specialization that was a career springboard months ago is already commodity.'
WHERE id = 'story-ai-jobs-market';

UPDATE stories SET
  title = 'NotebookLM Enterprise: Google Attacks the Knowledge Worker Market',
  editorial_comment = 'Google announced NotebookLM Enterprise with GDPR compliance and SSO. This solves a real problem: knowledge management in teams without data-leak risk. Direct competition to Notion AI and Confluence AI – Google plays the privacy card deliberately.'
WHERE id = 'story-notebooklm-enterprise';

UPDATE stories SET
  title = 'China''s New AI Regulation: What Western Companies Must Know',
  editorial_comment = 'China passed a new round of AI regulations affecting foreign vendors with users in China too. Technical requirements for training data and output control are nearly impossible in practice. Anyone entering the Chinese market should recalculate.'
WHERE id = 'story-china-ai-regulations';

-- ─── STORIES (V7) Edition 4 ──────────────────────────────────────────────────

UPDATE stories SET
  title = 'Google Launches Gemini 3.5 Flash: Four Times Faster Than the Competition',
  editorial_comment = 'At Google I/O 2026 (May 19–20), Google unveiled Gemini 3.5 Flash, its new flagship model that claims to be four times faster than comparable frontier models while outperforming them on coding, reasoning, and multimodal benchmarks. Gemini Omni for video generation and Gemini Spark as a proactive background agent were also announced. Google signals that the agentic AI era is arriving in production.'
WHERE id = 'story-gemini-35-flash';

UPDATE stories SET
  title = 'Claude Opus 4.8 Takes AI''s Top Spot with Score 61.4',
  editorial_comment = 'Anthropic''s Claude Opus 4.8 (released May 27, 2026) is the first model ever to breach the 60-point barrier on the Artificial Analysis Intelligence Index, now leading in real-world business tasks, coding, and agentic computer use. The benchmark dominance comes shortly after Anthropic''s own labor market impact report – a signal the company is communicating performance and social responsibility in tandem.'
WHERE id = 'story-claude-opus-48';

UPDATE stories SET
  title = 'EU Digital Omnibus: High-Risk Deadlines Pushed Back, New Bans Introduced',
  editorial_comment = 'On May 7, 2026, the EU Parliament and Council agreed on the Digital Omnibus Package, extending high-risk AI system deadlines from Annex III by 16 months to December 2027. New bans on AI-generated non-consensual intimate content and child abuse material were introduced. Critics see this as weakening the original AI Act framework; supporters argue the extension is needed to avoid overwhelming SMEs.'
WHERE id = 'story-eu-omnibus-ki';

UPDATE stories SET
  title = 'Anthropic Study: AI Hits Highly Skilled Workers First',
  editorial_comment = 'Anthropic''s labor market study (March 2026) shows using real Claude usage data that the most AI-exposed professions are exactly those highly qualified, experienced, and above-average-paid roles – including software developers, financial analysts, and customer service specialists. No measurable unemployment surge yet, but new hires aged 22–25 in high-exposure roles have declined ~14% since ChatGPT''s launch.'
WHERE id = 'story-anthropic-arbeitsmarkt';

UPDATE stories SET
  title = 'Colorado Passes First U.S. Law on High-Risk AI – Then Delays It',
  editorial_comment = 'Colorado SB 24-205 was set to take effect June 30, 2026, and was the first comprehensive U.S. state law on high-risk AI systems in healthcare, employment, and finance. Governor Polis signed a follow-up bill (SB 189) on May 14, 2026, pushing the deadline to January 2027 and substantially easing requirements. The policy retreat shows how hard the tech lobby can pressure state-level regulatory initiatives.'
WHERE id = 'story-colorado-ki-gesetz';

-- ─── EDITIONS (V7) ──────────────────────────────────────────────────────────

UPDATE editions SET
  title = 'Gemini 3.5 Flash vs. Claude Opus 4.8 – and the EU Pumps the Brakes',
  editor_note = 'Week 25 packs a punch: Google and Anthropic trade benchmark blows with real developer impact. Meanwhile, the EU''s Digital Omnibus reform shows how hard regulatory clarity actually is – and a new Anthropic study lays bare who AI really hits first. We''ve prioritized what matters.'
WHERE id = 'edition-4';

-- ─── AI JOBS (V5) ──────────────────────────────────────────────────────────

UPDATE ai_jobs SET
  title = 'Customer Service Representative (Phone)',
  category = 'Customer Service',
  reasoning = 'LLM-based chatbots and voice AI increasingly handle first-level support. Companies like Klara have already replaced 700 support roles with AI.',
  affected_tasks = 'Answer queries||Document complaints||Schedule appointments'
WHERE id = 'aa000001-0000-0000-0000-000000000001';

UPDATE ai_jobs SET
  title = 'Data Entry & Data Input',
  category = 'Administration',
  reasoning = 'OCR, document AI, and automated workflows make manual data entry obsolete. Most repetitive tasks are already automatable.',
  affected_tasks = 'Digitize forms||Transfer data||Capture invoices'
WHERE id = 'aa000002-0000-0000-0000-000000000002';

UPDATE ai_jobs SET
  title = 'Translator',
  category = 'Language & Media',
  reasoning = 'DeepL, GPT-4, and specialized translation AI reach near-human quality. For standard texts, professional translation is often unnecessary.',
  affected_tasks = 'Translate documents||Localization||Create subtitles'
WHERE id = 'aa000003-0000-0000-0000-000000000003';

UPDATE ai_jobs SET
  title = 'Accountant',
  category = 'Finance',
  reasoning = 'Automated accounting software handles routine tasks. Strategic consulting and complex cases remain human for now.',
  affected_tasks = 'Post receipts||Bank reconciliation||Standard reports'
WHERE id = 'aa000004-0000-0000-0000-000000000004';

UPDATE ai_jobs SET
  title = 'Truck Driver',
  category = 'Transport & Logistics',
  reasoning = 'Autonomous driving makes progress, but regulatory and technical hurdles delay widespread adoption. Long-haul will be affected first.',
  affected_tasks = 'Long-distance transport||Highway driving||Route planning'
WHERE id = 'aa000005-0000-0000-0000-000000000005';

UPDATE ai_jobs SET
  title = 'Software Developer',
  category = 'IT & Tech',
  reasoning = 'AI coding assistants boost productivity immensely. Complex architecture and creative problem-solving remain human, but junior roles decline.',
  affected_tasks = 'Boilerplate code||Bug fixes||Code reviews'
WHERE id = 'aa000006-0000-0000-0000-000000000006';

UPDATE ai_jobs SET
  title = 'Radiologist',
  category = 'Healthcare',
  reasoning = 'AI diagnostics often recognize patterns in imaging more accurately than humans. The role shifts toward quality control and patient communication.',
  affected_tasks = 'Image analysis||Pattern recognition||Screening'
WHERE id = 'aa000007-0000-0000-0000-000000000007';

UPDATE ai_jobs SET
  title = 'Teacher',
  category = 'Education',
  reasoning = 'AI assists with knowledge delivery and grading. Social, educational, and motivational aspects remain fundamentally human.',
  affected_tasks = 'Knowledge testing||Grading||Create learning materials'
WHERE id = 'aa000008-0000-0000-0000-000000000008';

UPDATE ai_jobs SET
  title = 'Graphic Designer',
  category = 'Creative',
  reasoning = 'Midjourney, DALL-E, and Adobe Firefly automate many visual tasks. Concept work and branding remain valuable, but volume declines.',
  affected_tasks = 'Stock graphics||Social media assets||Banner creation'
WHERE id = 'aa000009-0000-0000-0000-000000000009';

-- ─── AI MODELS (V6) ──────────────────────────────────────────────────────────

UPDATE ai_models SET highlights = 'Real-time Voice||Vision||Reasoning' WHERE id = 'bb000001-0000-0000-0000-000000000001';
UPDATE ai_models SET highlights = '200K Context||Coding||Security' WHERE id = 'bb000002-0000-0000-0000-000000000002';
UPDATE ai_models SET highlights = '1M Context||Video||Search' WHERE id = 'bb000003-0000-0000-0000-000000000003';
UPDATE ai_models SET highlights = '405B Parameters||Open Weights||Multilingual' WHERE id = 'bb000004-0000-0000-0000-000000000004';
UPDATE ai_models SET highlights = 'EU-based||Multilingual||Efficient' WHERE id = 'bb000005-0000-0000-0000-000000000005';
UPDATE ai_models SET highlights = 'X Integration||Real-time Data||Uncensored' WHERE id = 'bb000006-0000-0000-0000-000000000006';
UPDATE ai_models SET highlights = 'Prompt Fidelity||Text in Images||ChatGPT Integrated' WHERE id = 'bb000007-0000-0000-0000-000000000007';
UPDATE ai_models SET highlights = 'Photorealism||Style Control||Upscaling' WHERE id = 'bb000008-0000-0000-0000-000000000008';
UPDATE ai_models SET highlights = 'Text-to-Video||1 Min Clips||Physics Understanding' WHERE id = 'bb000009-0000-0000-0000-000000000009';
