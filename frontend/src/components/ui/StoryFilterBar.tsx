import { Box, Chip, Slider, Typography } from '@mui/material'
import type { Story } from '../../types'
import { calcRelevance } from '../../utils/relevanceScore'

export interface StoryFilters {
  minImpact: number
  maxHype: number
  minSourceQuality: number
  buzzword: string | null
  sortByRelevance: boolean
}

export const defaultFilters: StoryFilters = {
  minImpact: 1,
  maxHype: 5,
  minSourceQuality: 1,
  buzzword: null,
  sortByRelevance: false,
}

interface Props {
  filters: StoryFilters
  onChange: (filters: StoryFilters) => void
  stories: Story[]
}

export function applyFilters(stories: Story[], filters: StoryFilters): Story[] {
  let result = stories.filter((s) => {
    if (s.signalScore.impact < filters.minImpact) return false
    if (s.signalScore.hypeLevel > filters.maxHype) return false
    if (s.signalScore.sourceQuality < filters.minSourceQuality) return false
    if (filters.buzzword && !s.buzzwords.includes(filters.buzzword)) return false
    return true
  })

  if (filters.sortByRelevance) {
    result = [...result].sort((a, b) => calcRelevance(b.signalScore) - calcRelevance(a.signalScore))
  }

  return result
}

export default function StoryFilterBar({ filters, onChange, stories }: Props) {
  const allBuzzwords = [...new Set(stories.flatMap((s) => s.buzzwords))].sort()

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        <Box sx={{ minWidth: 160 }}>
          <Typography variant="caption" color="text.secondary">
            Min. Impact: {filters.minImpact}
          </Typography>
          <Slider
            min={1} max={5} step={1} marks
            value={filters.minImpact}
            onChange={(_, v) => onChange({ ...filters, minImpact: v as number })}
            size="small"
          />
        </Box>
        <Box sx={{ minWidth: 160 }}>
          <Typography variant="caption" color="text.secondary">
            Max. Hype: {filters.maxHype}
          </Typography>
          <Slider
            min={1} max={5} step={1} marks
            value={filters.maxHype}
            onChange={(_, v) => onChange({ ...filters, maxHype: v as number })}
            size="small"
          />
        </Box>
        <Box sx={{ minWidth: 160 }}>
          <Typography variant="caption" color="text.secondary">
            Min. Quellenqualität: {filters.minSourceQuality}
          </Typography>
          <Slider
            min={1} max={5} step={1} marks
            value={filters.minSourceQuality}
            onChange={(_, v) => onChange({ ...filters, minSourceQuality: v as number })}
            size="small"
          />
        </Box>
      </Box>

      {allBuzzwords.length > 0 && (
        <Box>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
            Buzzwords
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            <Chip
              label="Alle"
              size="small"
              onClick={() => onChange({ ...filters, buzzword: null })}
              variant={filters.buzzword === null ? 'filled' : 'outlined'}
              color={filters.buzzword === null ? 'primary' : 'default'}
            />
            {allBuzzwords.map((bw) => (
              <Chip
                key={bw}
                label={bw}
                size="small"
                onClick={() => onChange({ ...filters, buzzword: bw })}
                variant={filters.buzzword === bw ? 'filled' : 'outlined'}
                color={filters.buzzword === bw ? 'primary' : 'default'}
              />
            ))}
          </Box>
        </Box>
      )}

      <Box>
        <Chip
          label="Nach Relevanz sortieren"
          size="small"
          onClick={() => onChange({ ...filters, sortByRelevance: !filters.sortByRelevance })}
          variant={filters.sortByRelevance ? 'filled' : 'outlined'}
          color={filters.sortByRelevance ? 'secondary' : 'default'}
        />
      </Box>
    </Box>
  )
}
