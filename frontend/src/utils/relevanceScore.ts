import type { SignalScore } from '../types'

/**
 * Berechnet einen Relevanz-Score aus den Signal-Score-Dimensionen.
 * Hoher Impact + hohe Quellenqualität - hoher Hype = hohe Relevanz.
 * Range: -3 bis 9 (praktisch meist 1-7).
 */
export function calcRelevance(s: SignalScore): number {
  return s.impact + s.sourceQuality - s.hypeLevel
}
