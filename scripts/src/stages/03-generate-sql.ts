import fs from 'fs'
import path from 'path'
import { PATHS } from '../config.js'
import type { ClaudeEditionResponse } from '../types.js'

function getISOWeek(dateStr: string): number {
  const d = new Date(dateStr)
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7))
  const week1 = new Date(d.getFullYear(), 0, 4)
  return (
    1 +
    Math.round(
      ((d.getTime() - week1.getTime()) / 86400000 -
        3 +
        ((week1.getDay() + 6) % 7)) /
        7,
    )
  )
}

function getNextEditionNumber(): number {
  const files = fs.readdirSync(PATHS.dbSeeds)
  const pattern = /seed_ausgabe(\d+)_kw\d+_\d+\.sql/
  let max = 0
  for (const file of files) {
    const match = file.match(pattern)
    if (match) max = Math.max(max, parseInt(match[1], 10))
  }
  return max + 1
}

function getNextFlywayVersion(): number {
  const files = fs.readdirSync(PATHS.flywayMigrations)
  const pattern = /^V(\d+)__/
  let max = 0
  for (const file of files) {
    const match = file.match(pattern)
    if (match) max = Math.max(max, parseInt(match[1], 10))
  }
  return max + 1
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[äÄ]/g, 'ae').replace(/[öÖ]/g, 'oe').replace(/[üÜ]/g, 'ue').replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60)
}

function escapeSQL(str: string): string {
  return str.replace(/'/g, "''")
}

function buildSql(edition: ClaudeEditionResponse, editionNumber: number, weekNumber: number, year: number, includeVerification: boolean): string {
  const editionId = `edition-${editionNumber}`
  const editionSlug = `ausgabe-${editionNumber}-${slugify(edition.edition.title)}`
  const today = `${year}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`

  const lines: string[] = []

  lines.push(`-- ${'═'.repeat(75)}`)
  lines.push(`-- UP2DAITE — Ausgabe #${editionNumber} · KW ${weekNumber} / ${year}`)
  lines.push(`-- Automatisch kuratiert via Claude API`)
  lines.push(`--`)
  lines.push(`-- Ausführen: psql -h <host> -U up2daite -d up2daite -f <dateiname>.sql`)
  lines.push(`-- ${'═'.repeat(75)}`)
  lines.push('')
  lines.push('BEGIN;')
  lines.push('')

  // Edition
  lines.push(`-- ${'─'.repeat(3)} EDITION ${'─'.repeat(66)}`)
  lines.push('')
  lines.push(`INSERT INTO editions (id, slug, number, title, published_at, status, editor_note)`)
  lines.push(`VALUES (`)
  lines.push(`    '${editionId}',`)
  lines.push(`    '${escapeSQL(editionSlug)}',`)
  lines.push(`    ${editionNumber},`)
  lines.push(`    '${escapeSQL(edition.edition.title)}',`)
  lines.push(`    '${today}',`)
  lines.push(`    'published',`)
  lines.push(`    '${escapeSQL(edition.edition.editor_note)}'`)
  lines.push(`) ON CONFLICT (id) DO NOTHING;`)
  lines.push('')

  // Stories
  lines.push(`-- ${'─'.repeat(3)} STORIES ${'─'.repeat(65)}`)
  lines.push('')
  lines.push(`INSERT INTO stories (id, title, editorial_comment, source_name, source_url, source_type,`)
  lines.push(`                     signal_impact, signal_hype_level, signal_source_quality,`)
  lines.push(`                     published_at, edition_id, edition_order)`)
  lines.push(`VALUES`)

  edition.stories.forEach((story, i) => {
    const comma = i < edition.stories.length - 1 ? ',' : ''
    lines.push(`    (`)
    lines.push(`        '${escapeSQL(story.id_slug)}',`)
    lines.push(`        '${escapeSQL(story.title)}',`)
    lines.push(`        '${escapeSQL(story.editorial_comment)}',`)
    lines.push(`        '${escapeSQL(story.source_name)}',`)
    lines.push(`        '${escapeSQL(story.source_url)}',`)
    lines.push(`        '${story.source_type}',`)
    lines.push(`        ${story.signal_impact}, ${story.signal_hype_level}, ${story.signal_source_quality},`)
    lines.push(`        '${story.published_at}',`)
    lines.push(`        '${editionId}', ${i}`)
    lines.push(`    )${comma}`)
  })

  lines.push(`ON CONFLICT (id) DO NOTHING;`)
  lines.push('')

  // Story-Topics
  lines.push(`-- ${'─'.repeat(3)} STORY → TOPIC ZUORDNUNGEN ${'─'.repeat(48)}`)
  lines.push('')
  lines.push(`INSERT INTO story_topics (story_id, topic_id) VALUES`)

  const topicEntries: string[] = []
  for (const story of edition.stories) {
    for (const topicId of story.topic_ids) {
      topicEntries.push(`    ('${escapeSQL(story.id_slug)}', '${topicId}')`)
    }
  }
  lines.push(topicEntries.join(',\n'))
  lines.push(`ON CONFLICT DO NOTHING;`)

  // AI Jobs
  if (edition.new_jobs.length > 0) {
    lines.push('')
    lines.push(`-- ${'─'.repeat(3)} NEUE KI-JOBS ${'─'.repeat(61)}`)

    for (const job of edition.new_jobs) {
      lines.push('')
      lines.push(`INSERT INTO ai_jobs (id, title, category, risk_score, trend, reasoning, affected_tasks, sort_order)`)
      lines.push(`VALUES (`)
      lines.push(`    gen_random_uuid(),`)
      lines.push(`    '${escapeSQL(job.title)}',`)
      lines.push(`    '${escapeSQL(job.category)}',`)
      lines.push(`    ${job.risk_score},`)
      lines.push(`    '${job.trend}',`)
      lines.push(`    '${escapeSQL(job.reasoning)}',`)
      lines.push(`    '${escapeSQL(job.affected_tasks.join('||'))}',`)
      lines.push(`    0`)
      lines.push(`) ON CONFLICT DO NOTHING;`)
    }
  }

  lines.push('')
  lines.push('COMMIT;')

  if (includeVerification) {
    lines.push('')
    lines.push(`-- ${'─'.repeat(3)} VERIFIKATION ${'─'.repeat(61)}`)
    lines.push(`SELECT e.number, e.title, e.status, COUNT(s.id) AS story_count`)
    lines.push(`FROM editions e`)
    lines.push(`LEFT JOIN stories s ON s.edition_id = e.id`)
    lines.push(`GROUP BY e.id, e.number, e.title, e.status`)
    lines.push(`ORDER BY e.number DESC;`)
  }

  return lines.join('\n')
}

export interface GenerateSqlResult {
  seedPath: string
  migrationPath: string
  editionNumber: number
  weekNumber: number
  year: number
}

export function generateSql(edition: ClaudeEditionResponse): GenerateSqlResult {
  const editionNumber = getNextEditionNumber()
  const flywayVersion = getNextFlywayVersion()
  const now = new Date()
  const today = now.toISOString().split('T')[0]
  const weekNumber = getISOWeek(today)
  const year = now.getFullYear()

  const seedFilename = `seed_ausgabe${editionNumber}_kw${weekNumber}_${year}.sql`
  const migrationFilename = `V${flywayVersion}__seed_ausgabe${editionNumber}_kw${weekNumber}_${year}.sql`

  const seedPath = path.join(PATHS.dbSeeds, seedFilename)
  const migrationPath = path.join(PATHS.flywayMigrations, migrationFilename)

  const seedSql = buildSql(edition, editionNumber, weekNumber, year, true)
  const migrationSql = buildSql(edition, editionNumber, weekNumber, year, false)

  fs.writeFileSync(seedPath, seedSql, 'utf-8')
  fs.writeFileSync(migrationPath, migrationSql, 'utf-8')

  return { seedPath, migrationPath, editionNumber, weekNumber, year }
}
