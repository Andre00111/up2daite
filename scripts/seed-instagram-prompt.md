# up2daite — Instagram Seed Generator (Re-render)

You are the seed generator for up2daite's Instagram archive.
Your task: Fetch all existing content (Editions, Stories, Models, Jobs) from the database 
and re-render them as Instagram images.

**Important:** This is a pure re-render operation. NO research, NO curation, NO data changes.
Only use the existing data from the database exactly as it is.

## Context

- Backend API runs locally at `http://localhost:8080` OR remote at `https://up2daite.com`
- Use whichever API is reachable (test with `curl http://localhost:8080/api/stories`)
- OUTPUT_DIR is passed as an environment variable
- Render engine: `scripts/render-cards.html` with Node.js/Puppeteer/Playwright

## Step 1: Fetch all Editions

Retrieve all available editions:

```bash
curl http://localhost:8080/api/editions
```

Sort by date (newest first). Record edition IDs and titles.

**CRITICAL: Translate to English** — All titles, labels, and descriptions in the response are in German. You MUST translate them to English before rendering. For example:
- "KI-News KW 27" → "AI News Week 27"
- "Datenerfassung & Eingabe" → "Data Entry & Capture"
- Any German text in fields must be translated.

## Step 2: For each Edition — fetch all associated Stories

Fetch stories for each edition:

```bash
curl http://localhost:8080/api/editions/{editionId}/stories
```

**CRITICAL: Translate to English** — All story titles, editorial comments, and labels are in German. Translate each field to English:
- `title` → English headline
- `editorialComment` → English editorial text
- `topicIds` labels → English topic names
- `buzzwords` → English buzzwords if any are in German

Save translated story data locally (for rendering step).

## Step 3: Fetch all AI Models

```bash
curl http://localhost:8080/api/ai-models
```

**CRITICAL: Translate to English** — Model names and descriptions may contain German. Ensure all model names and fields are in English.

## Step 4: Fetch all AI Jobs

```bash
curl http://localhost:8080/api/ai-jobs
```

**CRITICAL: Translate to English** — All job titles, categories, reasoning, and task descriptions are in German. Translate each field:
- `title` → English job title
- `category` → English category
- `reasoning` → English explanation
- `affectedTasks` → English task names

## Step 5: Render Instagram Images

Use `scripts/render-cards.html` with Node.js/Puppeteer to generate:

**Per Edition:**
1. **Edition Cover** (1080×1350) — Overview with title & top stories
2. **Story Cards** (1080×1350 each) — One card per story in the edition

**Global (once):**
3. **Model Cards** — All AI models in card format
4. **Job Risk Cards** — All AI jobs in card format

Save all PNGs in folder structure:
```
$OUTPUT_DIR/
  ├── editions/
  │   ├── edition-1-cover.png
  │   ├── edition-1-story-1.png
  │   ├── edition-1-story-2.png
  │   └── ...
  ├── models/
  │   ├── model-1.png
  │   └── ...
  └── jobs/
      ├── job-1.png
      └── ...
```

**Rendering command (example):**

```bash
node scripts/render-test.js \
  --type edition \
  --data '{"id":"...", "title":"...", "stories":[...]}' \
  --output "$OUTPUT_DIR/editions/edition-cover.png"
```

Or if Puppeteer doesn't work via Node directly:
```bash
# Load HTML with base64-encoded data and screenshot with browser
open "file://$PROJECT_DIR/scripts/render-cards.html?type=edition&data=$(base64 edition-data.json)"
```

## Step 6: Summary

After rendering, output a brief statistics summary:

```
📊 Instagram Seed Generator — Complete!

✅ Editions rendered:       [N]
✅ Story Cards rendered:    [M]
✅ Model Cards rendered:    [K]
✅ Job Cards rendered:      [L]

📁 Location: $OUTPUT_DIR
📸 Images ready for manual Instagram upload!
```

## Notes

- **No modifications:** Use data exactly as stored in the database
- **Progress feedback:** Output count after each edition is rendered
- **Path check:** Verify `scripts/render-cards.html` exists before rendering
- **No research:** This is a pure re-render, not content creation
