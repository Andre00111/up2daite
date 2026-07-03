const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

// --- Inputs -----------------------------------------------------------------
const DATA_DIR = process.env.SEED_DATA_DIR || '/tmp/seed-data';
const OUTPUT_DIR = process.env.OUTPUT_DIR;
if (!OUTPUT_DIR) {
  console.error('FEHLER: OUTPUT_DIR ist nicht gesetzt.');
  process.exit(1);
}

const load = (f) => JSON.parse(fs.readFileSync(path.join(DATA_DIR, f), 'utf8'));
const editions = load('editions.json');
const stories = load('stories.json');
const models = load('ai-models.json');
const jobs = load('ai-jobs.json');

// Group stories by editionId, sort editions newest-first (by number desc).
const storiesByEdition = {};
for (const s of stories) {
  (storiesByEdition[s.editionId] ||= []).push(s);
}
editions.sort((a, b) => b.number - a.number);

const slug = (s, n = 40) =>
  s.slice(0, n).replace(/[^a-zA-Z0-9äöüÄÖÜ]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').toLowerCase();

// --- Render -----------------------------------------------------------------
(async () => {
  const dirs = {
    editions: path.join(OUTPUT_DIR, 'editions'),
    models: path.join(OUTPUT_DIR, 'models'),
    jobs: path.join(OUTPUT_DIR, 'jobs'),
  };
  Object.values(dirs).forEach((d) => fs.mkdirSync(d, { recursive: true }));

  console.log('Starte Browser...');
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  page.on('pageerror', (e) => console.error('PAGE ERROR:', e.message));

  const htmlPath = `file://${path.join(__dirname, process.env.RENDER_HTML || 'render-cards.html')}`;
  await page.goto(htmlPath, { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts.load('800 48px Inter'));
  await new Promise((r) => setTimeout(r, 2000));

  // Injects a data object, runs render(), returns the canvases in order.
  async function renderInput(data) {
    await page.evaluate((d) => {
      document.getElementById('jsonInput').value = JSON.stringify(d);
    }, data);
    await page.evaluate(() => render());
    await new Promise((r) => setTimeout(r, 400));
    return page.evaluate(() =>
      canvases.map((c) => ({ label: c.label, dataUrl: c.canvas.toDataURL('image/png') }))
    );
  }

  const save = (filePath, dataUrl) => {
    const base64 = dataUrl.replace(/^data:image\/png;base64,/, '');
    fs.writeFileSync(filePath, Buffer.from(base64, 'base64'));
  };

  const stats = { editions: 0, stories: 0, models: 0, jobs: 0 };

  // --- Editions: cover + one card per story ---
  for (const edition of editions) {
    const edStories = storiesByEdition[edition.id] || [];
    const pngs = await renderInput({ type: 'edition', edition, stories: edStories });
    // canvases[0] = cover, canvases[1..] = stories in order
    if (pngs.length > 0) {
      save(path.join(dirs.editions, `edition-${edition.number}-cover.png`), pngs[0].dataUrl);
      stats.editions++;
    }
    edStories.forEach((story, i) => {
      const png = pngs[i + 1];
      if (!png) return;
      const name = `edition-${edition.number}-story-${i + 1}-${slug(story.title, 30)}.png`;
      save(path.join(dirs.editions, name), png.dataUrl);
      stats.stories++;
    });
    console.log(
      `📄 Edition ${edition.number} (${edition.title.slice(0, 40)}): 1 Cover + ${edStories.length} Story-Cards`
    );
  }

  // --- Models ---
  {
    const pngs = await renderInput({ type: 'models', models });
    pngs.forEach((png, i) => {
      const m = models[i];
      const name = `model-${m.rank}-${slug(m.name, 30)}.png`;
      save(path.join(dirs.models, name), png.dataUrl);
      stats.models++;
    });
    console.log(`🧠 ${stats.models} Model-Cards gerendert`);
  }

  // --- Jobs ---
  {
    const pngs = await renderInput({ type: 'jobs', jobs });
    pngs.forEach((png, i) => {
      const j = jobs[i];
      const name = `job-${slug(j.title, 30)}.png`;
      save(path.join(dirs.jobs, name), png.dataUrl);
      stats.jobs++;
    });
    console.log(`💼 ${stats.jobs} Job-Cards gerendert`);
  }

  await browser.close();

  console.log('\n📊 Instagram Seed Generator — Fertig!\n');
  console.log(`✅ Editions gerendert:      ${stats.editions}`);
  console.log(`✅ Story Cards gerendert:   ${stats.stories}`);
  console.log(`✅ Model Cards gerendert:   ${stats.models}`);
  console.log(`✅ Job Cards gerendert:     ${stats.jobs}`);
  console.log(`\n📁 Speicherort: ${OUTPUT_DIR}`);
  console.log('📸 Bilder bereit für manuellen Instagram-Upload!');
})();
