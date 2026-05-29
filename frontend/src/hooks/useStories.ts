import { useState, useEffect, useCallback } from 'react'
import { fetchStories } from '../api/stories'
import type { Story } from '../types'

export function useStories(editionId?: string) {
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(() => {
    setLoading(true)
    return (editionId ? fetchStories(editionId) : fetchStories())
      .then((s) => { setStories(s); setError(null) })
      .catch(() => setError('Stories konnten nicht geladen werden.'))
      .finally(() => setLoading(false))
  }, [editionId])

  useEffect(() => { refresh() }, [refresh])

  // Gibt Stories in der vom Backend gelieferten Reihenfolge zurück (edition_order)
  function getStoriesForEdition(storyIds: string[]) {
    return storyIds
      .map((id) => stories.find((s) => s.id === id))
      .filter((s): s is Story => s !== undefined)
  }

  function getUnassignedStories() {
    return stories.filter((s) => s.editionId === null)
  }

  function getStoryById(id: string) {
    return stories.find((s) => s.id === id) ?? null
  }

  return { stories, loading, error, refresh, getStoriesForEdition, getUnassignedStories, getStoryById }
}
