import { useState, useEffect } from 'react'
import { fetchEditions } from '../api/editions'
import type { Edition, TopicId } from '../types'

export function useEditions() {
  const [editions, setEditions] = useState<Edition[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchEditions()
      .then(setEditions)
      .catch(() => setError('Ausgaben konnten nicht geladen werden.'))
      .finally(() => setLoading(false))
  }, [])

  const publishedEditions = editions.filter((e) => e.status === 'published')

  function getEditionBySlug(slug: string) {
    return editions.find((e) => e.slug === slug) ?? null
  }

  function getEditionById(id: string) {
    return editions.find((e) => e.id === id) ?? null
  }

  function getFilteredEditions(topicId: TopicId | null) {
    if (!topicId) return publishedEditions
    // Filterung nach Topic-ID — storyIds werden vom Backend mitgeliefert
    // Volle Story-Objekte für den Filter würden einen zweiten API-Call brauchen.
    // Für V1 bleibt der Filter client-seitig auf Basis der storyIds (immer leer nach Migration,
    // daher Topics direkt auf Edition-Ebene sinnvoller — TODO für V2)
    return publishedEditions
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
    loading,
    error,
    getEditionBySlug,
    getEditionById,
    getFilteredEditions,
    getPrevNext,
  }
}
