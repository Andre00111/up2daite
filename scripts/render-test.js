const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const testData = {
  type: 'edition',
  edition: {
    id: 'test-1', slug: 'kw26', number: 26,
    title: 'KI-News der Woche',
    publishedAt: '2026-06-25', status: 'draft', storyIds: []
  },
  stories: [
    {
      id: 's1', title: 'GPT-5 ist da – was das API-Pricing für Developer bedeutet',
      editorialComment: 'OpenAI hat GPT-5 offiziell gestartet. Das neue Preismodell skaliert nutzungsbasiert und ändert die Build-vs-Buy-Kalkulation für kleine Teams grundlegend.',
      source: { name: 'OpenAI Blog', url: 'https://openai.com', type: 'primary' },
      topics: ['ai-products', 'ai-research'],
      buzzwords: ['GPT-5', 'API', 'Pricing'],
      signalScore: { impact: 5, hypeLevel: 4, sourceQuality: 5 },
      publishedAt: '2026-06-23', editionId: 'test-1'
    },
    {
      id: 's2', title: 'EU AI Act: Erste Enforcement-Fälle werden bekannt',
      editorialComment: 'Zwei Monate nach Inkrafttreten der GPAI-Regeln zeigen sich erste Muster: Compliance-Aufwand für kleine Teams wird systematisch unterschätzt.',
      source: { name: 'Politico Tech', url: 'https://politico.eu', type: 'analysis' },
      topics: ['ai-policy', 'ai-business'],
      buzzwords: ['EU AI Act', 'Regulation'],
      signalScore: { impact: 5, hypeLevel: 1, sourceQuality: 4 },
      publishedAt: '2026-06-22', editionId: 'test-1'
    },
    {
      id: 's3', title: 'Claude Opus 4.8 setzt neue Benchmarks bei Code-Generierung',
      editorialComment: 'Anthropics neuestes Modell übertrifft GPT-5 in mehreren Code-Benchmarks deutlich. Besonders bei komplexen Refactoring-Aufgaben zeigt sich ein klarer Vorsprung.',
      source: { name: 'Anthropic Blog', url: 'https://anthropic.com', type: 'primary' },
      topics: ['ai-research', 'ai-products'],
      buzzwords: ['Claude', 'Anthropic', 'Benchmarks'],
      signalScore: { impact: 4, hypeLevel: 2, sourceQuality: 5 },
      publishedAt: '2026-06-24', editionId: 'test-1'
    },
    {
      id: 's4', title: 'Open Source KI: Llama 4 Maverick dominiert bei Reasoning',
      editorialComment: 'Metas neuestes Open-Source-Modell erreicht proprietäre Modelle in Reasoning-Aufgaben. Die Make-vs-Buy-Entscheidung wird für Unternehmen immer schwieriger.',
      source: { name: 'The Gradient', url: 'https://thegradient.pub', type: 'analysis' },
      topics: ['ai-research', 'ai-business'],
      buzzwords: ['Open Source', 'Llama', 'Reasoning'],
      signalScore: { impact: 4, hypeLevel: 2, sourceQuality: 4 },
      publishedAt: '2026-06-21', editionId: 'test-1'
    },
    {
      id: 's5', title: 'Veo 3.1: Google greift Sora mit neuem Videomodell an',
      editorialComment: 'Google hat Veo 3.1 vorgestellt — erstmals mit öffentlichen Benchmarks statt nur Ankündigungen. Die Qualität überzeugt, aber der Preis liegt über Sora.',
      source: { name: 'Google Blog', url: 'https://blog.google', type: 'pr-driven' },
      topics: ['ai-products'],
      buzzwords: ['Veo', 'Video', 'Google'],
      signalScore: { impact: 3, hypeLevel: 4, sourceQuality: 3 },
      publishedAt: '2026-06-25', editionId: 'test-1'
    }
  ],
  models: [
    {
      id: 'm1', name: 'Claude Opus 4.8', company: 'Anthropic', logo: '🧠',
      gradient: 'linear-gradient(135deg, #8b5cf6, #6366f1)', accentColor: '#8b5cf6',
      rank: 1, category: 'Multimodal', highlights: ['Bester Code-Generator', 'Extended Thinking', 'Tool Use Champion'], releaseYear: 2026
    },
    {
      id: 'm2', name: 'GPT-5.5', company: 'OpenAI', logo: '✦',
      gradient: 'linear-gradient(135deg, #10b981, #059669)', accentColor: '#10b981',
      rank: 2, category: 'Multimodal', highlights: ['Neues Preismodell', '1M Token Context', 'Native Vision'], releaseYear: 2026
    }
  ],
  jobs: [
    {
      id: 'j1', title: 'Übersetzer', category: 'Sprache & Kommunikation',
      riskScore: 82, trend: 'rising',
      reasoning: 'Neurale MT-Systeme erreichen in Fachübersetzungen menschliches Niveau. Nur Kreativ- und Rechtstexte erfordern noch menschliche Expertise.',
      affectedTasks: ['Fachübersetzung', 'Lokalisierung', 'Terminologie'], sortOrder: 1
    }
  ]
};

(async () => {
  const outputDir = path.join(__dirname, '..', 'output', `instagram-test-${new Date().toISOString().slice(0, 10)}`);
  fs.mkdirSync(outputDir, { recursive: true });

  console.log('Starte Browser...');
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();

  const htmlPath = `file://${path.join(__dirname, 'render-cards.html')}`;
  await page.goto(htmlPath, { waitUntil: 'networkidle0' });

  // Wait for Inter font
  await page.evaluate(() => document.fonts.load('800 48px Inter'));
  await new Promise(r => setTimeout(r, 2000));

  // Inject data and render
  await page.evaluate((data) => {
    document.getElementById('jsonInput').value = JSON.stringify(data);
  }, testData);

  await page.evaluate(() => render());
  await new Promise(r => setTimeout(r, 1000));

  // Extract canvases as PNGs
  const pngs = await page.evaluate(() => {
    return canvases.map(c => ({
      label: c.label,
      dataUrl: c.canvas.toDataURL('image/png')
    }));
  });

  for (const { label, dataUrl } of pngs) {
    const base64 = dataUrl.replace(/^data:image\/png;base64,/, '');
    const filePath = path.join(outputDir, `${label}.png`);
    fs.writeFileSync(filePath, Buffer.from(base64, 'base64'));
    console.log(`✅ ${filePath}`);
  }

  await browser.close();
  console.log(`\n🎉 ${pngs.length} Bilder generiert in: ${outputDir}`);
})();
