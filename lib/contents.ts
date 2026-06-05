import { Content, ContentType, SameTypeStats } from './types'
import { calcRegretScore, calcLotteryWeight, ScoreBreakdown } from './score'

export interface ContentWithScore extends Content {
  score: ScoreBreakdown
  lotteryWeight: number
}

export function enrichContents(contents: Content[]): ContentWithScore[] {
  const statsByType: Record<ContentType, SameTypeStats> = {
    game: { total: 0, completed: 0 },
    book: { total: 0, completed: 0 },
    manga: { total: 0, completed: 0 },
    movie: { total: 0, completed: 0 },
    anime: { total: 0, completed: 0 },
  }

  for (const c of contents) {
    statsByType[c.type].total++
    if (c.status === 'completed') statsByType[c.type].completed++
  }

  return contents.map((c) => {
    const score = calcRegretScore(c, statsByType[c.type])
    return {
      ...c,
      score,
      lotteryWeight: calcLotteryWeight(score.total, score.days, c.price),
    }
  })
}

export function lotteryPick(items: ContentWithScore[], count: number): ContentWithScore[] {
  if (items.length === 0) return []
  const totalWeight = items.reduce((sum, i) => sum + i.lotteryWeight, 0)
  const result: ContentWithScore[] = []
  const remaining = [...items]

  for (let i = 0; i < Math.min(count, items.length); i++) {
    let rand = Math.random() * remaining.reduce((sum, r) => sum + r.lotteryWeight, 0)
    const idx = remaining.findIndex((r) => {
      rand -= r.lotteryWeight
      return rand <= 0
    })
    const picked = remaining.splice(idx === -1 ? remaining.length - 1 : idx, 1)[0]
    result.push(picked)
  }

  return result
}

export const TYPE_LABEL: Record<ContentType, string> = {
  game:  'ゲーム',
  book:  '本',
  manga: 'マンガ',
  movie: '映画',
  anime: 'アニメ',
}

export const TYPE_ICON: Record<ContentType, string> = {
  game:  '🎮',
  book:  '📚',
  manga: '📖',
  movie: '🎬',
  anime: '📺',
}
