import type { Edition } from '../types'

// Sortiert: neueste zuerst
export const editions: Edition[] = [
  {
    id: 'edition-3',
    slug: 'ausgabe-3-gpt5-eu-ai-act',
    number: 3,
    title: 'GPT-5, EU AI Act und ein Tool das wirklich zählt',
    publishedAt: '2026-04-17',
    status: 'published',
    editorNote:
      'GPT-5 dominiert diese Woche die Schlagzeilen – aber der EU AI Act-Enforcement und Cursors Agent Mode sind die substanzielleren Entwicklungen. Wir haben die Hype-Meldungen entsprechend eingeordnet.',
    storyIds: [
      'story-gpt5-launch',
      'story-eu-ai-act-enforcement',
      'story-cursor-agent-mode',
      'story-anthropic-safety-report',
      'story-ai-startup-funding',
      'story-google-veo3',
    ],
  },
  {
    id: 'edition-2',
    slug: 'ausgabe-2-gemini-open-source',
    number: 2,
    title: 'Gemini Update, Open Source gewinnt und der KI-Jobmarkt 2026',
    publishedAt: '2026-04-10',
    status: 'published',
    storyIds: [
      'story-gemini-update',
      'story-open-source-wins',
      'story-ai-jobs-market',
      'story-notebooklm-enterprise',
      'story-china-ai-regulations',
    ],
  },
  {
    id: 'edition-1',
    slug: 'ausgabe-1-ai-policy-schwerpunkt',
    number: 1,
    title: 'AI Policy Schwerpunkt – in Arbeit',
    publishedAt: '2026-04-20',
    status: 'draft',
    storyIds: [],
  },
]
