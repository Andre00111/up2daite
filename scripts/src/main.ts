import { config } from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
config({ path: path.resolve(__dirname, '../../.env') })

import { fetchRssFeeds } from './stages/01-fetch-rss.js'
import { analyzeWithClaude } from './stages/02-analyze-claude.js'
import { generateSql } from './stages/03-generate-sql.js'
import { gitCommitAndPush } from './stages/04-git-push.js'
import { generateInstagramCards } from './stages/05-generate-cards.js'
import { log } from './utils/logger.js'

async function main() {
  log.banner('UP2DAITE — Automatische Ausgabe')

  log.step(1, 5, 'RSS-Feeds abrufen...')
  const articles = await fetchRssFeeds()
  log.done(`${articles.length} Artikel gefunden`)

  log.step(2, 5, 'Claude analysiert und kuratiert...')
  const edition = await analyzeWithClaude(articles)
  log.done(`"${edition.edition.title}" — ${edition.stories.length} Stories`)

  log.step(3, 5, 'SQL-Dateien generieren...')
  const { seedPath, migrationPath, editionNumber, weekNumber, year } = generateSql(edition)
  log.done(path.basename(seedPath))
  log.done(path.basename(migrationPath))

  if (process.env.DRY_RUN !== 'true') {
    log.step(4, 5, 'Git commit & push...')
    gitCommitAndPush(seedPath, migrationPath, editionNumber, weekNumber, year)
    log.done('Pushed to GitLab — CI/CD Pipeline gestartet')
  } else {
    log.skip(4, 5, 'Git push übersprungen (DRY_RUN)')
  }

  log.step(5, 5, 'Instagram-Karten generieren...')
  const cardPaths = await generateInstagramCards(edition, editionNumber, weekNumber)
  log.done(`${cardPaths.length} Dateien in output/instagram/`)

  log.banner('Fertig!')
}

main().catch(err => {
  log.error(err.message)
  if (err.stack) console.error(err.stack)
  process.exit(1)
})
