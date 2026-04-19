import type { Story } from '../types'

export const stories: Story[] = [
  // --- Ausgabe 3 (6 Stories) ---
  {
    id: 'story-gpt5-launch',
    title: 'GPT-5 ist da – was das API-Pricing für Developer bedeutet',
    editorialComment:
      'OpenAI hat GPT-5 offiziell gestartet. Die Benchmark-Headlines sind laut, aber das Relevante ist woanders: Das neue Preismodell skaliert nutzungsbasiert und ändert die Build-vs-Buy-Kalkulation für kleine Teams grundlegend. Wer heute auf GPT-4 setzt, sollte die Migrationskosten neu rechnen.',
    source: {
      name: 'OpenAI Blog',
      url: 'https://openai.com/blog',
      type: 'primary',
    },
    topics: ['ai-products', 'ai-research'],
    signalScore: { impact: 5, hypeLevel: 4, sourceQuality: 5 },
    publishedAt: '2026-04-17',
    editionId: 'edition-3',
  },
  {
    id: 'story-eu-ai-act-enforcement',
    title: 'EU AI Act: Erste Enforcement-Fälle werden bekannt',
    editorialComment:
      'Zwei Monate nach Inkrafttreten der GPAI-Regeln zeigen sich erste Muster: Compliance-Aufwand für kleine Teams wird systematisch unterschätzt. Noch keine Bußgelder, aber Dokumentationspflichten greifen bereits. Wer KI-Systeme in der EU einsetzt, sollte die Risikoklassifikation jetzt prüfen.',
    source: {
      name: 'Politico Tech',
      url: 'https://politico.eu',
      type: 'analysis',
    },
    topics: ['ai-policy', 'ai-business'],
    signalScore: { impact: 5, hypeLevel: 1, sourceQuality: 4 },
    publishedAt: '2026-04-16',
    editionId: 'edition-3',
  },
  {
    id: 'story-cursor-agent-mode',
    title: 'Cursor führt vollständigen Agent Mode ein',
    editorialComment:
      'Cursor hat seinen Agent Mode aus der Beta entlassen. Der Editor übernimmt mehrstufige Aufgaben eigenständig – von Datei anlegen bis Test schreiben. Praktische Einschränkungen bleiben, aber für Routine-Tasks ist das ein echter Effizienzgewinn im Entwickleralltag.',
    source: {
      name: 'Cursor Blog',
      url: 'https://cursor.com/blog',
      type: 'primary',
    },
    topics: ['ai-tools', 'ai-products'],
    signalScore: { impact: 3, hypeLevel: 2, sourceQuality: 5 },
    publishedAt: '2026-04-17',
    editionId: 'edition-3',
  },
  {
    id: 'story-anthropic-safety-report',
    title: 'Anthropics neuer Safety Report: Was wirklich drinsteht',
    editorialComment:
      'Anthropic hat seinen vierten Safety Report veröffentlicht. Jenseits der PR-Sprache enthält er konkrete Erkenntnisse zur Interpretierbarkeit großer Modelle – und gibt erstmals zu, dass bestimmte Sicherheitsversprechen aktuell nicht verifizierbar sind. Eine ehrliche Lektüre lohnt sich.',
    source: {
      name: 'Anthropic Research',
      url: 'https://anthropic.com/research',
      type: 'primary',
    },
    topics: ['ai-research', 'ai-policy'],
    signalScore: { impact: 4, hypeLevel: 1, sourceQuality: 5 },
    publishedAt: '2026-04-15',
    editionId: 'edition-3',
  },
  {
    id: 'story-ai-startup-funding',
    title: 'KI-Startups sammeln in Q1 2026 Rekord-Funding ein',
    editorialComment:
      'Die Funding-Zahlen sind beeindruckend – aber 60% des Kapitals fließt in drei Infra-Player. Die lange Tail der Anwendungsschicht kämpft weiterhin mit sinkenden Bewertungen. Für Gründer in der Applikationsebene ist das ein Signal, kein Erfolg.',
    source: {
      name: 'TechCrunch',
      url: 'https://techcrunch.com',
      type: 'analysis',
    },
    topics: ['ai-business'],
    signalScore: { impact: 3, hypeLevel: 3, sourceQuality: 3 },
    publishedAt: '2026-04-14',
    editionId: 'edition-3',
  },
  {
    id: 'story-google-veo3',
    title: 'Google kündigt Veo 3 an – besser als Sora?',
    editorialComment:
      'Google hat Veo 3 auf der I/O angekündigt. Die Pressemitteilung enthält viele Superlative, aber keine öffentlichen Benchmarks und keinen Release-Termin. Das Muster ist bekannt: Ankündigung als Reaktion auf Wettbewerber-News. Erst wenn öffentliche Demos verfügbar sind, lässt sich das einordnen.',
    source: {
      name: 'Google Press',
      url: 'https://blog.google',
      type: 'pr-driven',
    },
    topics: ['ai-products', 'ai-research'],
    signalScore: { impact: 2, hypeLevel: 5, sourceQuality: 2 },
    publishedAt: '2026-04-17',
    editionId: 'edition-3',
  },

  // --- Ausgabe 2 (5 Stories) ---
  {
    id: 'story-gemini-update',
    title: 'Googles Gemini 2.0 Update: Was sich wirklich verändert hat',
    editorialComment:
      'Das Gemini 2.0 Update bringt messbare Verbesserungen bei Code-Generierung und Multi-Turn-Reasoning. Interessanter als die Features ist die Preisstrategie: Google senkt API-Preise aggressiv und signalisiert damit, dass der Plattformkampf in die nächste Phase geht.',
    source: {
      name: 'Google DeepMind Blog',
      url: 'https://deepmind.google',
      type: 'primary',
    },
    topics: ['ai-products', 'ai-research'],
    signalScore: { impact: 4, hypeLevel: 2, sourceQuality: 5 },
    publishedAt: '2026-04-10',
    editionId: 'edition-2',
  },
  {
    id: 'story-open-source-wins',
    title: 'Warum Open Source dieses Mal wirklich gewinnt',
    editorialComment:
      'Llama 3.1 und Mistral Large 2 liegen auf mehreren Benchmarks gleichauf mit proprietären Modellen. Das ist kein Hype mehr: Für viele Enterprise-Use-Cases ist die Make-vs-Buy-Entscheidung erstmals eine echte Abwägung. Die Implikationen für Anbieter geschlossener Modelle sind erheblich.',
    source: {
      name: 'The Gradient',
      url: 'https://thegradient.pub',
      type: 'analysis',
    },
    topics: ['ai-research', 'ai-business'],
    signalScore: { impact: 5, hypeLevel: 2, sourceQuality: 4 },
    publishedAt: '2026-04-09',
    editionId: 'edition-2',
  },
  {
    id: 'story-ai-jobs-market',
    title: 'KI-Jobmarkt 2026: Wer gesucht wird und wer nicht',
    editorialComment:
      'Neue Auswertung von 50.000 Stellenanzeigen zeigt: Nachfrage nach reinen "AI Prompt Engineers" ist eingebrochen. Gesucht werden stattdessen ML-Ops-Entwickler und Produktmanager mit technischem AI-Verständnis. Die Spezialisierung, die gerade noch als Karrieresprungbrett galt, ist bereits Commodity.',
    source: {
      name: 'LinkedIn Talent Insights',
      url: 'https://linkedin.com/business/talent',
      type: 'analysis',
    },
    topics: ['ai-business'],
    signalScore: { impact: 4, hypeLevel: 1, sourceQuality: 3 },
    publishedAt: '2026-04-08',
    editionId: 'edition-2',
  },
  {
    id: 'story-notebooklm-enterprise',
    title: 'NotebookLM Enterprise: Google greift den Knowledge-Worker-Markt an',
    editorialComment:
      'Google hat NotebookLM Enterprise mit DSGVO-Compliance und SSO-Integration angekündigt. Das Produkt löst ein echtes Problem: Wissensmanagement in Teams ohne Daten-Leak-Risiko. Direkte Konkurrenz zu Notion AI und Confluence AI – Google spielt die Datenschutz-Karte bewusst.',
    source: {
      name: 'Google Workspace Blog',
      url: 'https://workspace.google.com/blog',
      type: 'primary',
    },
    topics: ['ai-products', 'ai-tools'],
    signalScore: { impact: 3, hypeLevel: 2, sourceQuality: 4 },
    publishedAt: '2026-04-09',
    editionId: 'edition-2',
  },
  {
    id: 'story-china-ai-regulations',
    title: 'Chinas neue KI-Regulierung: Was westliche Unternehmen wissen müssen',
    editorialComment:
      'China hat eine neue Runde von KI-Regularien verabschiedet, die auch ausländische Anbieter mit Nutzern in China betreffen. Die technischen Anforderungen an Trainingsdaten und Output-Kontrolle sind in der Praxis kaum erfüllbar. Wer in den chinesischen Markt eintreten will, sollte das neu kalkulieren.',
    source: {
      name: 'South China Morning Post Tech',
      url: 'https://scmp.com/tech',
      type: 'analysis',
    },
    topics: ['ai-policy', 'ai-business'],
    signalScore: { impact: 4, hypeLevel: 1, sourceQuality: 4 },
    publishedAt: '2026-04-07',
    editionId: 'edition-2',
  },
]
