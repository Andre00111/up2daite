import { stories } from '../data/stories'

// Hinweis: Später durch fetch('/api/stories') ersetzbar.

export function useStories() {
  function getStoriesForEdition(storyIds: string[]) {
    // Reihenfolge der storyIds beibehalten (redaktionelle Sortierung)
    return storyIds
      .map((id) => stories.find((s) => s.id === id))
      .filter((s): s is NonNullable<typeof s> => s !== undefined)
  }

  function getUnassignedStories() {
    return stories.filter((s) => s.editionId === null)
  }

  return { stories, getStoriesForEdition, getUnassignedStories }
}
