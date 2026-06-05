'use client'

import Link from 'next/link'
import { ContentWithScore } from '@/lib/contents'
import { TYPE_ICON, TYPE_LABEL } from '@/lib/contents'
import { getScoreLevel, SCORE_LEVEL_META } from '@/lib/score'
import { ScoreBadge } from './ScoreBadge'
import { ScoreBar } from './ScoreBar'

interface Props {
  item: ContentWithScore
  showBreakdown?: boolean
  onComplete?: (id: string) => void
}

export function ContentCard({ item, showBreakdown = false, onComplete }: Props) {
  const level = getScoreLevel(item.score.total)
  const meta = SCORE_LEVEL_META[level]
  const roastText = item.roastText

  return (
    <div className={`rounded-xl border p-4 flex flex-col gap-3 ${meta.bg} ${meta.border}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xl">{TYPE_ICON[item.type]}</span>
          <div className="min-w-0">
            <p className="font-bold text-sm truncate">{item.title}</p>
            <p className="text-xs text-gray-500">{TYPE_LABEL[item.type]} · {item.score.days}日 · ¥{item.price.toLocaleString()}</p>
          </div>
        </div>
        <ScoreBadge score={item.score.total} />
      </div>

      <p className="text-sm text-gray-700 italic">「{roastText}」</p>

      {showBreakdown && (
        <div className="flex flex-col gap-1.5">
          <ScoreBar label="日数" value={item.score.dayScore}       max={30} />
          <ScoreBar label="消化" value={item.score.digestScore}    max={25} />
          <ScoreBar label="金額" value={item.score.priceScore}     max={20} />
          <ScoreBar label="鮮度" value={item.score.freshnessScore} max={25} />
        </div>
      )}

      <div className="flex gap-2 mt-1">
        {onComplete && (
          <button
            onClick={() => onComplete(item.id)}
            className="flex-1 text-xs bg-white border border-gray-300 rounded-lg py-1.5 hover:bg-green-50 hover:border-green-400 transition-colors font-medium"
          >
            ✓ 消化した
          </button>
        )}
        <Link
          href={`/item/${item.id}`}
          className="flex-1 text-xs bg-white border border-gray-300 rounded-lg py-1.5 text-center hover:bg-gray-50 transition-colors font-medium"
        >
          詳細 →
        </Link>
      </div>
    </div>
  )
}
