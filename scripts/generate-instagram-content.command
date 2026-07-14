#!/bin/bash
# up2daite Instagram Content Generator
# Generates captions (TXT) and job risk cards (PNG)

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(cd "$(dirname "$SCRIPT_DIR")" && pwd)"
cd "$PROJECT_DIR"

OUTPUT_DIR="./output/instagram-$(date +%Y-%m-%d)"
mkdir -p "$OUTPUT_DIR"

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║  up2daite Instagram Content Generator                          ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "Output: $OUTPUT_DIR"
echo ""

# Step 1: Generate captions (metadata)
echo "📝 Generating captions..."
node scripts/generate-metadata.js "$OUTPUT_DIR" || {
  echo "❌ Failed to generate captions"
  exit 1
}

# Step 2: Extract job JSON from MANIFEST.txt and render cards
echo ""
echo "🎨 Rendering job risk cards..."

# Check if puppeteer is installed
if ! node -e "require('puppeteer')" 2>/dev/null; then
  echo "⚠️  Puppeteer not installed. Install with: npm install puppeteer"
  echo ""
  echo "📋 To render job cards manually:"
  echo "   1. open scripts/render-cards-en.html"
  echo "   2. Copy job JSON from: $OUTPUT_DIR/MANIFEST.txt"
  echo "   3. Paste into the textarea and click 'Rendern'"
  echo "   4. Click 'Alle herunterladen' to save as PNG"
  exit 0
fi

# Create job rendering script in project directory
RENDER_SCRIPT="$PROJECT_DIR/scripts/render-jobs.mjs"
cat > "$RENDER_SCRIPT" << 'EOF'
import puppeteer from 'puppeteer'
import fs from 'fs'
import path from 'path'
import http from 'http'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const API_URL = process.env.API_URL || 'http://localhost:48080/api'
const OUTPUT_DIR = process.argv[2] || './output/instagram-content'

async function fetchAPI(endpoint) {
  return new Promise((resolve, reject) => {
    http.get(API_URL + endpoint, (res) => {
      let data = ''
      res.on('data', chunk => (data += chunk))
      res.on('end', () => {
        try {
          resolve(JSON.parse(data))
        } catch (e) {
          resolve([])
        }
      })
    }).on('error', reject)
  })
}

async function renderCards() {
  const [jobs, models, editions, stories] = await Promise.all([
    fetchAPI('/ai-jobs'),
    fetchAPI('/ai-models'),
    fetchAPI('/editions'),
    fetchAPI('/stories'),
  ])

  const browser = await puppeteer.launch()
  let totalRendered = 0

  const types = [
    { name: 'Jobs', data: jobs, type: 'jobs', dir: 'jobs' },
    { name: 'Models', data: models, type: 'models', dir: 'models' },
  ]

  for (const { name, data, type, dir } of types) {
    const cardDir = path.join(OUTPUT_DIR, dir)
    fs.mkdirSync(cardDir, { recursive: true })
    let rendered = 0

    for (const item of data) {
      const jsonData = JSON.stringify({ type, [type]: [item] })
      const hashData = encodeURIComponent(jsonData)
      const htmlPath = path.resolve('./scripts/render-cards-en.html')
      const fileUrl = `file://${htmlPath}#${hashData}`

      try {
        const page = await browser.newPage()
        await page.goto(fileUrl, { waitUntil: 'networkidle2', timeout: 15000 })
        await page.waitForFunction(
          () => document.querySelectorAll('canvas').length > 0,
          { timeout: 10000 }
        )

        const screenshot = await page.$eval('canvas', canvas => canvas.toDataURL('image/png'))
        const base64Data = screenshot.replace(/^data:image\/png;base64,/, '')

        let filename
        if (type === 'jobs') {
          filename = item.title.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase() + '.png'
        } else if (type === 'models') {
          filename = `rank-${item.rank}-${item.name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}.png`
        }

        const filepath = path.join(cardDir, filename)
        fs.writeFileSync(filepath, Buffer.from(base64Data, 'base64'))
        console.log(`  ✓ ${filename}`)

        rendered++
        await page.close()
      } catch (err) {
        const itemName = item.title || item.name || 'unknown'
        console.error(`  ✗ ${itemName}: ${err.message}`)
      }
    }

    console.log(`✅ ${name}: ${rendered}/${data.length} rendered to ${cardDir}`)
    totalRendered += rendered
  }

  await browser.close()
  console.log(`\n✅ Total cards rendered: ${totalRendered}`)
}

renderCards().catch(err => {
  console.error('❌ Error:', err.message)
  process.exit(1)
})
EOF

node "$RENDER_SCRIPT" "$OUTPUT_DIR" || {
  echo "❌ Job card rendering failed"
  exit 1
}

rm -f "$RENDER_SCRIPT"

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "✅ Done! Content generated in: $OUTPUT_DIR"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "📁 Contents:"
echo "   • captions/     — Instagram caption TXT files (editions, models, jobs)"
echo "   • jobs/         — Job risk card PNG files (1080×1350)"
echo "   • models/       — AI model ranking card PNG files (1080×1350)"
echo "   • MANIFEST.txt  — All files + job JSON"
echo ""
