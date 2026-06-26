import Parser from 'rss-parser'
import { RSS_FEEDS } from '../config.js'
import { log } from '../utils/logger.js'
import type { RawArticle } from '../types.js'

const parser = new Parser({ timeout: 10_000 })

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function isWithinDays(dateStr: string | undefined, days: number): boolean {
  if (!dateStr) return false
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return false
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000
  return date.getTime() >= cutoff
}

async function fetchSingleFeed(feed: typeof RSS_FEEDS[number]): Promise<RawArticle[]> {
  try {
    const result = await parser.parseURL(feed.url)
    const articles: RawArticle[] = []

    for (const item of result.items) {
      const pubDate = item.isoDate || item.pubDate
      if (!isWithinDays(pubDate, 7)) continue

      const snippet = stripHtml(item.contentSnippet || item.content || item.summary || '')
      if (!item.title || !item.link) continue

      articles.push({
        title: stripHtml(item.title),
        link: item.link,
        publishedAt: new Date(pubDate!).toISOString().split('T')[0],
        sourceName: feed.name,
        sourceLanguage: feed.language,
        snippet: snippet.slice(0, 500),
      })
    }

    log.done(`${feed.name}: ${articles.length} Artikel`)
    return articles
  } catch (err) {
    log.warn(`${feed.name} fehlgeschlagen: ${(err as Error).message}`)
    return []
  }
}

export async function fetchRssFeeds(): Promise<RawArticle[]> {
  const results = await Promise.allSettled(
    RSS_FEEDS.map(feed => fetchSingleFeed(feed))
  )

  const articles: RawArticle[] = []
  const seen = new Set<string>()

  for (const result of results) {
    if (result.status !== 'fulfilled') continue
    for (const article of result.value) {
      if (seen.has(article.link)) continue
      seen.add(article.link)
      articles.push(article)
    }
  }

  if (articles.length < 5) {
    throw new Error(
      `Nur ${articles.length} Artikel gefunden (Minimum: 5). Prüfe deine Internetverbindung oder die RSS-Feed-URLs.`
    )
  }

  return articles
}
