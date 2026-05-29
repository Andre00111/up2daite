import { useState, useEffect, useCallback } from 'react'
import { fetchEditions } from '../api/editions'
import type { Edition, TopicId } from '../types'

export function useEditions() {
  const [editions, setEditions] = useState<Edition[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(() => {
    setLoading(true)
    return fetchEditions()
      // Backend liefert findAll() unsortiert → wir sortieren clientseitig nach Nummer DESC,
      // damit die neueste Ausgabe immer oben steht (Landing + Archiv).
      .then((e) => { setEditions([...e].sort((a, b) => b.number - a.number)); setError(null) })
      .catch(() => setError('Ausgaben konnten nicht geladen werden.'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { refresh() }, [refresh])

  const publishedEditions = editions.filter((e) => e.status === 'published')

  function getEditionBySlug(slug: string) {
    return editions.find((e) => e.slug === slug) ?? null
  }

  function getEditionById(id: string) {
    return editions.find((e) => e.id === id) ?? null
  }

  function getFilteredEditions(topicId: TopicId | null) {
    if (!topicId) return publishedEditions
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
    refresh,
    getEditionBySlug,
    getEditionById,
    getFilteredEditions,
    getPrevNext,
  }
}
