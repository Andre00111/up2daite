const CYAN = '\x1b[36m'
const GREEN = '\x1b[32m'
const YELLOW = '\x1b[33m'
const RED = '\x1b[31m'
const BOLD = '\x1b[1m'
const DIM = '\x1b[2m'
const RESET = '\x1b[0m'

export const log = {
  banner(text: string) {
    const line = '═'.repeat(50)
    console.log(`\n${CYAN}${line}${RESET}`)
    console.log(`${BOLD}${CYAN}  ${text}${RESET}`)
    console.log(`${CYAN}${line}${RESET}\n`)
  },

  step(current: number, total: number, message: string) {
    console.log(`${BOLD}${CYAN}[${current}/${total}]${RESET} ${message}`)
  },

  done(message: string) {
    console.log(`  ${GREEN}✓${RESET} ${message}`)
  },

  skip(current: number, total: number, message: string) {
    console.log(`${YELLOW}[${current}/${total}] ⏭ ${message}${RESET}`)
  },

  warn(message: string) {
    console.log(`  ${YELLOW}⚠ ${message}${RESET}`)
  },

  error(message: string) {
    console.log(`  ${RED}✗ ${message}${RESET}`)
  },

  info(message: string) {
    console.log(`  ${DIM}${message}${RESET}`)
  },
}
