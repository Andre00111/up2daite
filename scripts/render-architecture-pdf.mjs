import puppeteer from 'puppeteer'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const htmlPath = resolve(__dirname, '../output/architecture/architecture.html')
const pdfPath = resolve(__dirname, '../output/architecture/up2daite-architecture.pdf')

const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] })
const page = await browser.newPage()
await page.goto('file://' + htmlPath, { waitUntil: 'networkidle0' })
await page.pdf({
  path: pdfPath,
  format: 'A4',
  printBackground: true,
  preferCSSPageSize: true,
})
await browser.close()
console.log('PDF written to', pdfPath)
