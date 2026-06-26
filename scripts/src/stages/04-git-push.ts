import { execSync } from 'child_process'
import { PROJECT_ROOT } from '../config.js'
import { log } from '../utils/logger.js'

export function gitCommitAndPush(
  seedPath: string,
  migrationPath: string,
  editionNumber: number,
  weekNumber: number,
  year: number,
): void {
  const opts = { cwd: PROJECT_ROOT, stdio: 'pipe' as const }

  try {
    execSync(`git add "${seedPath}" "${migrationPath}"`, opts)
    execSync(
      `git commit -m "feat: Ausgabe #${editionNumber} KW ${weekNumber}/${year} -- automatisch kuratiert"`,
      opts,
    )
    execSync('git push', opts)
  } catch (err) {
    log.warn(`Git-Operation fehlgeschlagen: ${(err as Error).message}`)
    log.warn('SQL-Dateien wurden lokal erstellt. Du kannst manuell pushen.')
  }
}
