import { editions } from '../data/editions'
import { stories } from '../data/stories'
import type { TopicId } from '../types'

// Hinweis: Diese Funktionen sind einfache Daten-Wrapper.
// Später: Datenzugriff durch fetch('/api/editions') ersetzen.

export function useEditions() {
  const publishedEditions = editions.filter((e) => e.status === 'published')

  function getEditionBySlug(slug: string) {
    return editions.find((e) => e.slug === slug) ?? null
  }

  function getEditionById(id: string) {
    return editions.find((e) => e.id === id) ?? null
  }

  function getFilteredEditions(topicId: TopicId | null) {
    if (!topicId) return publishedEditions
    return publishedEditions.filter((edition) => {
      const editionStories = stories.filter((s) => edition.storyIds.includes(s.id))
      return editionStories.some((s) => s.topics.includes(topicId))
    })
  }

  function getPrevNext(currentSlug: string) {
    const idx = publishedEditions.findIndex((e) => e.slug === currentSlug)
    return {
      prev: idx < publishedEditions.length - 1 ? publishedEditions[idx + 1] : null,
      next: idx > 0 ? publishedEditions[idx - 1] : null,
    }
  }

  return {
    editions,
    publishedEditions,
    getEditionBySlug,
    getEditionById,
    getFilteredEditions,
    getPrevNext,
  }
}
