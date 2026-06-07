import { Content, SameTypeStats } from './types'

export interface ScoreBreakdown {
  total: number
  dayScore: number
  digestScore: number
  priceScore: number
  freshnessScore: number
  days: number
  freshMonths: number
}

export function calcRegretScore(
  content: Pick<Content, 'price' | 'purchased_at' | 'release_date'>,
  sameTypeStats: SameTypeStats
): ScoreBreakdown {
  const now = new Date()

  const days = Math.floor(
    (now.getTime() - new Date(content.purchased_at).getTime()) / 86400000
  )
  const months = days / 30

  let dayScore = 0
  if (months >= 6)      dayScore = 30
  else if (months >= 5) dayScore = 29
  else if (months >= 4) dayScore = 26
  else if (months >= 3) dayScore = 22
  else if (months >= 2) dayScore = 16
  else if (months >= 1) dayScore = 8

  const digestRate = sameTypeStats.total > 0
    ? sameTypeStats.completed / sameTypeStats.total
    : 0
  const daysFactor = Math.min(days / 30, 1.0)
  const digestScore = Math.round((1 - digestRate) * 25 * daysFactor)

  let priceScore = 0
  if (content.price >= 5000)      priceScore = 20
  else if (content.price >= 2000) priceScore = 13
  else if (content.price >= 500)  priceScore = 7
  else                            priceScore = 2

  const freshMonths = Math.floor(
    (now.getTime() - new Date(content.release_date).getTime()) / (86400000 * 30)
  )
  let freshnessScore = 0
  if (freshMonths < 1)       freshnessScore = 25
  else if (freshMonths < 3)  freshnessScore = 20
  else if (freshMonths < 6)  freshnessScore = 13
  else if (freshMonths < 12) freshnessScore = 6

  const total = Math.min(100, dayScore + digestScore + priceScore + freshnessScore)

  return { total, dayScore, digestScore, priceScore, freshnessScore, days, freshMonths }
}

export type ScoreLevel = 'peace' | 'caution' | 'danger' | 'terminal' | 'dead'

export function getScoreLevel(score: number): ScoreLevel {
  if (score >= 100) return 'dead'
  if (score >= 80)  return 'terminal'
  if (score >= 60)  return 'danger'
  if (score >= 30)  return 'caution'
  return 'peace'
}

export const SCORE_LEVEL_META: Record<ScoreLevel, { label: string; icon: string; color: string; bg: string; border: string }> = {
  peace:    { label: '平和',  icon: '🟢', color: 'text-green-600',  bg: 'bg-green-50',  border: 'border-green-200' },
  caution:  { label: '要注意', icon: '🟡', color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' },
  danger:   { label: '危険',  icon: '🟠', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' },
  terminal: { label: '末期',  icon: '🔴', color: 'text-red-600',    bg: 'bg-red-50',    border: 'border-red-200' },
  dead:     { label: '死亡',  icon: '💀', color: 'text-gray-900',   bg: 'bg-gray-100',  border: 'border-gray-400' },
}

export function calcLotteryWeight(score: number, days: number, price: number): number {
  return score * 1.5
    + (days > 180 ? 20 : 0)
    + (price > 5000 ? 10 : 0)
}
