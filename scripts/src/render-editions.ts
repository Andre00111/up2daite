import { execFileSync } from 'node:child_process'
import { mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createCanvas } from 'canvas'
import type { Edition, Story } from './types.js'
import { CARD_W, CARD_H } from './canvas/canvasUtils.js'
import { drawEditionCover } from './canvas/drawEditionCover.js'

const PSQL = '/opt/homebrew/opt/libpq/bin/psql'
const CONN = ['-h', 'localhost', '-p', '45432', '-U', 'up2daite', '-d', 'up2daite']

function query<T>(sql: string): T {
  const out = execFileSync(PSQL, [...CONN, '-A', '-t', '-c', sql], {
    env: { ...process.env, PGPASSWORD: 'up2daite' },
    encoding: 'utf8',
    maxBuffer: 32 * 1024 * 1024,
  })
  return JSON.parse(out.trim() || 'null') as T
}

interface DbEdition {
  id: string
  slug: string
  number: number
  title: string
  published_at: string | null
  status: string
  editor_note: string | null
}

interface DbStory {
  id: string
  title: string
  edition_id: string
  edition_order: number | null
}

const editions = query<DbEdition[]>(
  `select json_agg(e order by e.number) from (select * from editions) e`,
) ?? []

const allStories = query<DbStory[]>(
  `select json_agg(s order by s.edition_id, s.edition_order nulls last)
   from (select id, title, edition_id, edition_order from stories where edition_id is not null) s`,
) ?? []

const storiesByEdition = new Map<string, DbStory[]>()
for (const s of allStories) {
  const arr = storiesByEdition.get(s.edition_id) ?? []
  arr.push(s)
  storiesByEdition.set(s.edition_id, arr)
}

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '../..')
const ts = new Date().toISOString().replace(/[:.]/g, '-').replace('T', '_').slice(0, 19)
const outDir = path.join(projectRoot, 'output', `editions-${ts}`)
mkdirSync(outDir, { recursive: true })

let count = 0
for (const e of editions) {
  const dbStories = storiesByEdition.get(e.id) ?? []
  const publishedAt = e.published_at ?? new Date().toISOString().slice(0, 10)

  const edition: Edition = {
    id: e.id,
    slug: e.slug,
    number: e.number,
    title: e.title,
    publishedAt,
    status: e.status === 'published' ? 'published' : 'draft',
    editorNote: e.editor_note ?? undefined,
    storyIds: dbStories.map((s) => s.id),
  }

  const stories = dbStories.map<Story>((s) => ({
    id: s.id,
    title: s.title,
    editorialComment: '',
    source: { name: '', url: '', type: 'primary' },
    topics: [],
    signalScore: { impact: 3, hypeLevel: 3, sourceQuality: 3 },
    publishedAt,
    editionId: s.edition_id,
  }))

  const canvas = createCanvas(CARD_W, CARD_H)
  const ctx = canvas.getContext('2d')
  drawEditionCover(ctx as unknown as import('canvas').CanvasRenderingContext2D, edition, stories)

  const file = path.join(outDir, `edition-${e.number}.png`)
  writeFileSync(file, canvas.toBuffer('image/png'))
  count++
  console.log(`✅ Edition #${e.number} (${dbStories.length} stories) → ${path.basename(file)}`)
}

console.log(`\n📁 ${count} edition covers rendered to ${outDir}`)
