import Anthropic from '@anthropic-ai/sdk'
import { ANTHROPIC_MODEL } from '../config.js'
import type { RawArticle, ClaudeEditionResponse } from '../types.js'

const SYSTEM_PROMPT = `Du bist der Chefredakteur von UP2DAITE, einem kuratierten deutschen AI-Newsletter.

AUFGABE:
1. Analysiere die folgenden RSS-Artikel aus der letzten Woche.
2. Clustere thematisch verwandte Artikel (Duplikate/selbes Thema zusammenführen).
3. Wähle die TOP 4 relevantesten Stories aus. Priorisiere nach:
   - Tatsächlicher Impact auf Entwickler, Unternehmen oder Gesellschaft
   - Neuigkeitswert (echte Neuigkeit vs. recycelter Hype)
   - Quellqualität (Primärquelle > Analyse > PR-getrieben)
4. Für jede Story generiere:
   - Einen deutschen Titel (prägnant, nicht clickbait)
   - Einen editorial_comment auf Deutsch (3 kurze Sätze, kritische Einordnung, "why it matters")
   - source_type: 'primary' (Erstquelle), 'analysis' (Einordnung/Analyse), 'pr-driven' (PR/Marketing)
   - signal_impact (1-5): Wie stark verändert das die AI-Landschaft?
   - signal_hype_level (1-5): Wie viel Hype vs. Substanz? (1=sachlich, 5=pure Hype)
   - signal_source_quality (1-5): Wie verlässlich ist die Quelle?
   - topic_ids: Mindestens 1 aus ['ai-research', 'ai-products', 'ai-policy', 'ai-business', 'ai-tools']
   - id_slug: URL-sicherer Slug mit Präfix "story-" (z.B. "story-openai-gpt5-launch")
5. Prüfe ob in den News neue KI-Berufsrisiken erwähnt werden. Falls ja, generiere 1-2 neue Jobs (optional).
   - reasoning: 1 Satz (max 100 Zeichen), der das Risiko auf den Punkt bringt
   - affected_tasks: max 3 kurze Begriffe
6. Generiere einen edition_title (max 50 Zeichen) und ein editor_note (1-2 Sätze, knapp).

STIL:
- Sachlich, kritisch, nicht euphorisch
- Hype-Meldungen einordnen, nicht verstärken
- editorial_comment: 3 kurze Sätze, die die Nachricht kontextualisieren und einordnen
- Beispiel-Ton: "Wir haben priorisiert, was zählt."

WICHTIG:
- Alle Texte auf Deutsch
- source_url muss die echte URL des Originalartikels sein (aus den bereitgestellten Daten)
- published_at im Format YYYY-MM-DD
- id_slug nur Kleinbuchstaben, Zahlen und Bindestriche`

const TOOL_SCHEMA: Anthropic.Tool = {
  name: 'publish_edition',
  description: 'Publiziert eine kuratierte AI-News-Ausgabe mit Stories, Signal-Scores und optionalen Job-Risiken.',
  input_schema: {
    type: 'object' as const,
    required: ['edition', 'stories'],
    properties: {
      edition: {
        type: 'object',
        required: ['title', 'editor_note'],
        properties: {
          title: { type: 'string', description: 'Deutscher Ausgabentitel, max 50 Zeichen' },
          editor_note: { type: 'string', description: 'Deutsches Editor-Note, 1-2 kurze Sätze' },
        },
      },
      stories: {
        type: 'array',
        minItems: 4,
        maxItems: 4,
        items: {
          type: 'object',
          required: [
            'id_slug', 'title', 'editorial_comment', 'source_name', 'source_url',
            'source_type', 'signal_impact', 'signal_hype_level', 'signal_source_quality',
            'published_at', 'topic_ids',
          ],
          properties: {
            id_slug: { type: 'string' },
            title: { type: 'string' },
            editorial_comment: { type: 'string', description: '3 kurze Sätze, kritische Einordnung' },
            source_name: { type: 'string' },
            source_url: { type: 'string' },
            source_type: { type: 'string', enum: ['primary', 'analysis', 'pr-driven'] },
            signal_impact: { type: 'integer', minimum: 1, maximum: 5 },
            signal_hype_level: { type: 'integer', minimum: 1, maximum: 5 },
            signal_source_quality: { type: 'integer', minimum: 1, maximum: 5 },
            published_at: { type: 'string' },
            topic_ids: {
              type: 'array',
              items: { type: 'string', enum: ['ai-research', 'ai-products', 'ai-policy', 'ai-business', 'ai-tools'] },
            },
          },
        },
      },
      new_jobs: {
        type: 'array',
        maxItems: 2,
        items: {
          type: 'object',
          required: ['title', 'category', 'risk_score', 'trend', 'reasoning', 'affected_tasks'],
          properties: {
            title: { type: 'string' },
            category: { type: 'string' },
            risk_score: { type: 'integer', minimum: 0, maximum: 100 },
            trend: { type: 'string', enum: ['rising', 'stable', 'declining'] },
            reasoning: { type: 'string', description: '1 Satz, max 100 Zeichen' },
            affected_tasks: { type: 'array', items: { type: 'string' }, maxItems: 3 },
          },
        },
      },
    },
  },
}

export async function analyzeWithClaude(articles: RawArticle[]): Promise<ClaudeEditionResponse> {
  const client = new Anthropic()

  const articleList = articles.map((a, i) =>
    `[${i + 1}] ${a.title}\n    Quelle: ${a.sourceName} (${a.sourceLanguage})\n    URL: ${a.link}\n    Datum: ${a.publishedAt}\n    ${a.snippet}`
  ).join('\n\n')

  const response = await client.messages.create({
    model: ANTHROPIC_MODEL,
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    tools: [TOOL_SCHEMA],
    tool_choice: { type: 'tool', name: 'publish_edition' },
    messages: [
      {
        role: 'user',
        content: `Hier sind ${articles.length} aktuelle AI-Artikel aus RSS-Feeds der letzten 7 Tage:\n\n${articleList}\n\nWähle die TOP 4 relevantesten aus und erstelle die Ausgabe.`,
      },
    ],
  })

  const toolBlock = response.content.find(
    (block): block is Anthropic.ToolUseBlock => block.type === 'tool_use'
  )

  if (!toolBlock) {
    throw new Error('Claude hat keinen strukturierten Output geliefert.')
  }

  const result = toolBlock.input as ClaudeEditionResponse

  if (!Array.isArray(result.stories) || result.stories.length < 4) {
    throw new Error(`Claude hat ${Array.isArray(result.stories) ? result.stories.length : 0} Stories geliefert (erwartet: 4).`)
  }

  if (!result.new_jobs) {
    result.new_jobs = []
  }

  return result
}
