import { useState, useEffect } from 'react'
import { fetchStories } from '../api/stories'
import type { Story } from '../types'

export function useStories(editionId?: string) {
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = editionId
      ? fetchStories(editionId)
      : fetchStories()

    load
      .then(setStories)
      .catch(() => setError('Stories konnten nicht geladen werden.'))
      .finally(() => setLoading(false))
  }, [editionId])

  // Gibt Stories in der vom Backend gelieferten Reihenfolge zurück (edition_order)
  function getStoriesForEdition(storyIds: string[]) {
    return storyIds
      .map((id) => stories.find((s) => s.id === id))
      .filter((s): s is Story => s !== undefined)
  }

  function getUnassignedStories() {
    return stories.filter((s) => s.editionId === null)
  }

  return { stories, loading, error, getStoriesForEdition, getUnassignedStories }
}
