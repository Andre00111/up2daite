import fs from 'fs'
import path from 'path'
import { createCanvas, registerFont } from 'canvas'
import { PATHS, TOPICS } from '../config.js'
import { CARD_W, CARD_H } from '../canvas/canvasUtils.js'
import { drawStoryCard } from '../canvas/drawStoryCard.js'
import { drawJobRiskCard } from '../canvas/drawJobRiskCard.js'
import { drawEditionCover } from '../canvas/drawEditionCover.js'
import { log } from '../utils/logger.js'
import type { ClaudeEditionResponse, Story, Edition, AIJob, Topic } from '../types.js'

const FONT_WEIGHTS = [
  { file: 'Inter-Regular.ttf', weight: '400' },
  { file: 'Inter-Medium.ttf', weight: '500' },
  { file: 'Inter-SemiBold.ttf', weight: '600' },
  { file: 'Inter-Bold.ttf', weight: '700' },
  { file: 'Inter-ExtraBold.ttf', weight: '800' },
  { file: 'Inter-Black.ttf', weight: '900' },
]

function loadFonts() {
  for (const { file, weight } of FONT_WEIGHTS) {
    const fontPath = path.join(PATHS.fonts, file)
    if (!fs.existsSync(fontPath)) {
      log.warn(`Font nicht gefunden: ${fontPath}`)
      continue
    }
    registerFont(fontPath, { family: 'Inter', weight })
  }
}

function saveCard(canvas: ReturnType<typeof createCanvas>, outputDir: string, filename: string): string {
  const pngPath = path.join(outputDir, `${filename}.png`)
  const buffer = canvas.toBuffer('image/png')
  fs.writeFileSync(pngPath, buffer)
  return pngPath
}

function saveCaption(outputDir: string, filename: string, caption: string): string {
  const txtPath = path.join(outputDir, `${filename}-caption.txt`)
  fs.writeFileSync(txtPath, caption, 'utf-8')
  return txtPath
}

function buildStoryCaption(story: Story): string {
  const kw = new Date().toISOString().split('T')[0]
  return [
    story.title,
    '',
    story.editorialComment,
    '',
    `Signal Score: Impact ${story.signalScore.impact}/5 · Hype ${story.signalScore.hypeLevel}/5 · Quelle ${story.signalScore.sourceQuality}/5`,
    '',
    `Quelle: ${story.source.name}`,
    'Mehr auf up2daite.com',
    '',
    '#KI #AI #KuenstlicheIntelligenz #UP2DAITE #AINews #TechNews',
  ].join('\n')
}

function buildJobCaption(job: AIJob): string {
  return [
    `⚠ Jobrisiko: ${job.title}`,
    '',
    job.reasoning,
    '',
    `Automatisierungsrisiko: ${job.riskScore}%`,
    `Trend: ${job.trend === 'rising' ? 'Steigend' : job.trend === 'declining' ? 'Sinkend' : 'Stabil'}`,
    '',
    'Mehr auf up2daite.com',
    '',
    '#KI #AI #Jobmarkt #Automatisierung #UP2DAITE #KIJobs',
  ].join('\n')
}

function buildCoverCaption(edition: Edition, stories: Story[]): string {
  const storyList = stories.map((s, i) => `${i + 1}. ${s.title}`).join('\n')
  return [
    `UP2DAITE Ausgabe #${edition.number}`,
    '',
    edition.title,
    '',
    storyList,
    '',
    edition.editorNote || '',
    '',
    'Jetzt lesen auf up2daite.com',
    '',
    '#KI #AI #Newsletter #UP2DAITE #AINews #KuenstlicheIntelligenz',
  ].join('\n')
}

export async function generateInstagramCards(
  data: ClaudeEditionResponse,
  editionNumber: number,
  weekNumber: number,
): Promise<string[]> {
  loadFonts()

  const outputDir = path.join(PATHS.instagramOutput, `ausgabe-${editionNumber}-kw${weekNumber}`)
  fs.mkdirSync(outputDir, { recursive: true })

  const topics: Topic[] = TOPICS.map(t => ({ id: t.id, label: t.label }))
  const generatedFiles: string[] = []
  const today = new Date().toISOString().split('T')[0]

  // Convert Claude response to typed objects
  const stories: Story[] = data.stories.map((s, i) => ({
    id: s.id_slug,
    title: s.title,
    editorialComment: s.editorial_comment,
    source: { name: s.source_name, url: s.source_url, type: s.source_type },
    topics: s.topic_ids,
    signalScore: {
      impact: s.signal_impact,
      hypeLevel: s.signal_hype_level,
      sourceQuality: s.signal_source_quality,
    },
    publishedAt: s.published_at,
    editionId: `edition-${editionNumber}`,
  }))

  const edition: Edition = {
    id: `edition-${editionNumber}`,
    slug: `ausgabe-${editionNumber}-kw${weekNumber}`,
    number: editionNumber,
    title: data.edition.title,
    publishedAt: today,
    status: 'published',
    editorNote: data.edition.editor_note,
    storyIds: stories.map(s => s.id),
  }

  // Edition cover
  const coverCanvas = createCanvas(CARD_W, CARD_H)
  drawEditionCover(coverCanvas.getContext('2d'), edition, stories)
  generatedFiles.push(saveCard(coverCanvas, outputDir, '00-cover'))
  generatedFiles.push(saveCaption(outputDir, '00-cover', buildCoverCaption(edition, stories)))
  log.info('Cover generiert')

  // Story cards
  for (let i = 0; i < stories.length; i++) {
    const story = stories[i]
    const canvas = createCanvas(CARD_W, CARD_H)
    drawStoryCard(canvas.getContext('2d'), story, topics)
    const prefix = String(i + 1).padStart(2, '0')
    generatedFiles.push(saveCard(canvas, outputDir, `${prefix}-story-${story.id}`))
    generatedFiles.push(saveCaption(outputDir, `${prefix}-story-${story.id}`, buildStoryCaption(story)))
    log.info(`Story-Karte: ${story.title.slice(0, 50)}...`)
  }

  // Job risk cards
  for (let i = 0; i < data.new_jobs.length; i++) {
    const jobData = data.new_jobs[i]
    const job: AIJob = {
      id: `job-${i}`,
      title: jobData.title,
      category: jobData.category,
      riskScore: jobData.risk_score,
      trend: jobData.trend,
      reasoning: jobData.reasoning,
      affectedTasks: jobData.affected_tasks,
      sortOrder: 0,
    }
    const canvas = createCanvas(CARD_W, CARD_H)
    drawJobRiskCard(canvas.getContext('2d'), job)
    const prefix = String(stories.length + i + 1).padStart(2, '0')
    generatedFiles.push(saveCard(canvas, outputDir, `${prefix}-job-${jobData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 30)}`))
    generatedFiles.push(saveCaption(outputDir, `${prefix}-job-${jobData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 30)}`, buildJobCaption(job)))
    log.info(`Job-Karte: ${jobData.title}`)
  }

  return generatedFiles
}
