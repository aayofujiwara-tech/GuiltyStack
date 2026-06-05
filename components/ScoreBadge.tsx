import { getScoreLevel, SCORE_LEVEL_META } from '@/lib/score'

interface Props {
  score: number
  size?: 'sm' | 'md' | 'lg'
}

export function ScoreBadge({ score, size = 'md' }: Props) {
  const level = getScoreLevel(score)
  const meta = SCORE_LEVEL_META[level]
  const sizeClass = size === 'sm' ? 'text-xs px-1.5 py-0.5' : size === 'lg' ? 'text-lg px-3 py-1' : 'text-sm px-2 py-0.5'
  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-bold ${sizeClass} ${meta.color} ${meta.bg} ${meta.border} border`}>
      {meta.icon} {score}点
    </span>
  )
}
