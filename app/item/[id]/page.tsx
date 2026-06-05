'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { useTestMode } from '@/context/TestModeContext'
import { fetchContents, updateContentStatus, deleteContent } from '@/lib/firestore'
import { Content, ContentStatus } from '@/lib/types'
import { ContentWithScore, enrichContents, TYPE_ICON, TYPE_LABEL } from '@/lib/contents'
import { getScoreLevel, SCORE_LEVEL_META } from '@/lib/score'
import { ScoreBadge } from '@/components/ScoreBadge'
import { ScoreBar } from '@/components/ScoreBar'
import { pickRoast } from '@/lib/roast'

const STATUS_LABELS: Record<ContentStatus, string> = {
  unplayed: '未消化', in_progress: '進行中', completed: '消化済み', abandoned: '放棄',
}

const COMPLETION_TEXT: Partial<Record<ContentStatus, string>> = {
  completed: '昇天しました。お疲れ様でした。',
  abandoned: '放棄を認めた。潔い。',
}

export default function ItemPage() {
  const { id }   = useParams<{ id: string }>()
  const router   = useRouter()
  const { user } = useAuth()
  const { isTestMode, testContents, updateTestStatus, deleteTestContent } = useTestMode()
  const [item, setItem]     = useState<ContentWithScore | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (!user && !isTestMode) return
    const load = async () => {
      const all: Content[] = isTestMode
        ? testContents
        : await fetchContents(user!.uid)
      const enriched = enrichContents(all)
      setItem(enriched.find((i) => i.id === id) ?? null)
      setLoading(false)
    }
    load()
  }, [user, id, isTestMode, testContents])

  const handleStatusChange = async (status: ContentStatus) => {
    // ローカルstateを即時更新してスコア反映
    setItem((prev) => prev ? { ...prev, status } : null)

    if (isTestMode) {
      updateTestStatus(id, status)
      router.push('/')
      return
    }
    if (!user) return
    await updateContentStatus(user.uid, id, status)
    router.push('/')
  }

  const handleDelete = async () => {
    if (!item) return
    if (!confirm(`「${item.title}」を削除しますか？`)) return
    if (isTestMode) {
      deleteTestContent(id)
      router.push('/')
      return
    }
    if (!user) return
    setDeleting(true)
    await deleteContent(user.uid, id)
    router.push('/')
  }

  if (loading) return <div className="p-8 text-center text-gray-400">読み込み中...</div>
  if (!item)   return <div className="p-8 text-center text-gray-400">見つかりません</div>

  const isDone = item.status === 'completed' || item.status === 'abandoned'
  const displayScore = isDone ? 0 : item.score.total
  const level = getScoreLevel(displayScore)
  const meta  = isDone ? SCORE_LEVEL_META['peace'] : SCORE_LEVEL_META[level]

  const roastText = isDone
    ? COMPLETION_TEXT[item.status]!
    : pickRoast(level, item.type, {
        title: item.title,
        price: item.price,
        days: item.score.days,
        months: item.score.days / 30,
        per_day: item.score.days > 0 ? Math.round(item.price / item.score.days) : 0,
        fresh_months: item.score.freshMonths,
        undone: 0,
      })

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-gray-500 hover:text-gray-900">←</Link>
          <h1 className="font-bold text-sm truncate max-w-48">{item.title}</h1>
        </div>
        <button onClick={handleDelete} disabled={deleting} className="text-xs text-red-500 hover:text-red-700 disabled:opacity-50">
          削除
        </button>
      </header>

      <div className="max-w-lg mx-auto p-4 space-y-4">
        <div className={`rounded-xl border p-5 ${meta.bg} ${meta.border}`}>
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">{TYPE_ICON[item.type]}</span>
                <h2 className="font-bold text-lg">{item.title}</h2>
              </div>
              <p className="text-sm text-gray-500">
                {TYPE_LABEL[item.type]}{item.platform && ` · ${item.platform}`} · ¥{item.price.toLocaleString()}
              </p>
            </div>
            <ScoreBadge score={displayScore} size="lg" />
          </div>
          <p className="text-base italic text-gray-700 mb-4 border-l-4 border-red-400 pl-3">「{roastText}」</p>
          {!isDone && (
            <div className="space-y-2">
              <ScoreBar label="日数" value={item.score.dayScore}       max={30} />
              <ScoreBar label="消化" value={item.score.digestScore}    max={25} />
              <ScoreBar label="金額" value={item.score.priceScore}     max={20} />
              <ScoreBar label="鮮度" value={item.score.freshnessScore} max={25} />
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border p-4 space-y-3">
          <h3 className="font-bold text-sm">情報</h3>
          <dl className="grid grid-cols-2 gap-2 text-sm">
            <dt className="text-gray-500">購入日</dt><dd>{item.purchased_at}</dd>
            <dt className="text-gray-500">経過日数</dt><dd>{item.score.days}日</dd>
            <dt className="text-gray-500">発売日</dt><dd>{item.release_date}</dd>
            <dt className="text-gray-500">ステータス</dt><dd>{STATUS_LABELS[item.status]}</dd>
          </dl>
          {item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-1">
              {item.tags.map((t) => (
                <span key={t} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{t}</span>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border p-4">
          <h3 className="font-bold text-sm mb-3">ステータス変更</h3>
          <div className="grid grid-cols-2 gap-2">
            {(['in_progress', 'completed', 'abandoned', 'unplayed'] as ContentStatus[]).map((s) => (
              <button
                key={s}
                onClick={() => handleStatusChange(s)}
                disabled={item.status === s}
                className={`text-sm py-2 rounded-lg border font-medium transition-colors ${
                  item.status === s ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-default'
                  : s === 'completed' ? 'border-green-500 text-green-700 hover:bg-green-50'
                  : s === 'abandoned' ? 'border-gray-400 text-gray-600 hover:bg-gray-50'
                  : 'border-blue-400 text-blue-700 hover:bg-blue-50'
                }`}
              >
                {STATUS_LABELS[s]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
