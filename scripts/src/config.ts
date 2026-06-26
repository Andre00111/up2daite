import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export const PROJECT_ROOT = path.resolve(__dirname, '../..')

export const PATHS = {
  dbSeeds: path.join(PROJECT_ROOT, 'db'),
  flywayMigrations: path.join(PROJECT_ROOT, 'backend/src/main/resources/db/migration'),
  instagramOutput: path.join(PROJECT_ROOT, 'output/instagram'),
  fonts: path.join(__dirname, '../fonts'),
  env: path.join(PROJECT_ROOT, '.env'),
}

export const TOPICS = [
  { id: 'ai-research', label: 'AI Research' },
  { id: 'ai-products', label: 'AI Products' },
  { id: 'ai-policy', label: 'AI Policy' },
  { id: 'ai-business', label: 'AI Business' },
  { id: 'ai-tools', label: 'AI Tools' },
] as const

export const RSS_FEEDS = [
  // English
  { name: 'TechCrunch AI', url: 'https://techcrunch.com/category/artificial-intelligence/feed/', language: 'en' as const },
  { name: 'The Verge AI', url: 'https://www.theverge.com/rss/ai-artificial-intelligence/index.xml', language: 'en' as const },
  { name: 'Ars Technica', url: 'https://feeds.arstechnica.com/arstechnica/technology-lab', language: 'en' as const },
  { name: 'MIT Tech Review', url: 'https://www.technologyreview.com/feed/', language: 'en' as const },
  { name: 'OpenAI Blog', url: 'https://openai.com/blog/rss.xml', language: 'en' as const },
  { name: 'Google AI Blog', url: 'https://blog.google/technology/ai/rss/', language: 'en' as const },
  { name: 'Anthropic Blog', url: 'https://www.anthropic.com/rss.xml', language: 'en' as const },
  // German
  { name: 'Heise', url: 'https://www.heise.de/rss/heise-atom.xml', language: 'de' as const },
  { name: 'Golem.de', url: 'https://rss.golem.de/rss.php?feed=RSS2.0', language: 'de' as const },
  { name: 't3n', url: 'https://t3n.de/rss.xml', language: 'de' as const },
]

export const ANTHROPIC_MODEL = 'claude-sonnet-4-6'
