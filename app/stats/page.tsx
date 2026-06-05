'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { Content, ContentType } from '@/lib/types'
import { ContentWithScore, enrichContents, TYPE_ICON, TYPE_LABEL } from '@/lib/contents'

export default function StatsPage() {
  const [items, setItems] = useState<ContentWithScore[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }
      const { data } = await supabase.from('contents').select('*').eq('user_id', user.id)
      if (data) setItems(enrichContents(data as Content[]))
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <div className="p-8 text-center text-gray-400">集計中...</div>

  const active = items.filter((i) => i.status !== 'completed' && i.status !== 'abandoned')
  const completed = items.filter((i) => i.status === 'completed')
  const abandoned = items.filter((i) => i.status === 'abandoned')
  const totalPrice = active.reduce((s, i) => s + i.price, 0)
  const avgScore = active.length ? Math.round(active.reduce((s, i) => s + i.score.total, 0) / active.length) : 0
  const completedValue = completed.reduce((s, i) => s + i.price, 0)
  const regretTotal = items.reduce((s, i) => s + i.price, 0) - completedValue

  const byType = (['game', 'book', 'manga', 'movie', 'anime'] as ContentType[]).map((t) => {
    const typeItems = items.filter((i) => i.type === t)
    const done = typeItems.filter((i) => i.status === 'completed').length
    return {
      type: t,
      total: typeItems.length,
      completed: done,
      rate: typeItems.length ? Math.round((done / typeItems.length) * 100) : 0,
    }
  }).filter((t) => t.total > 0)

  const longestList = [...active]
    .sort((a, b) => b.score.days - a.score.days)
    .slice(0, 5)

  const thisMonth = new Date()
  thisMonth.setDate(1)
  const confessedThisMonth = completed.filter(
    (i) => new Date(i.updated_at) >= thisMonth
  ).length

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-4 py-3 flex items-center gap-3">
        <Link href="/" className="text-gray-500 hover:text-gray-900">←</Link>
        <h1 className="font-bold">📊 統計</h1>
      </header>

      <div className="max-w-2xl mx-auto p-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <StatCard label="総積み額" value={`¥${totalPrice.toLocaleString()}`} />
          <StatCard label="平均後悔スコア" value={`${avgScore}点`} />
          <StatCard label="累計後悔額" value={`¥${regretTotal.toLocaleString()}`} sub="購入総額-消化金額" />
          <StatCard label="今月の懺悔数" value={`${confessedThisMonth}件`} sub="今月消化済み" />
          <StatCard label="放棄数" value={`${abandoned.length}件`} />
          <StatCard label="消化済み" value={`${completed.length}件`} />
        </div>

        <div className="bg-white rounded-xl border p-4">
          <h2 className="font-bold text-sm mb-4">ジャンル別消化率</h2>
          <div className="space-y-3">
            {byType.map((t) => (
              <div key={t.type}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span>{TYPE_ICON[t.type]} {TYPE_LABEL[t.type]}</span>
                  <span className="text-gray-500">{t.completed}/{t.total} ({t.rate}%)</span>
                </div>
                <div className="bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all"
                    style={{ width: `${t.rate}%` }}
                  />
                </div>
              </div>
            ))}
            {byType.length === 0 && <p className="text-sm text-gray-400">データなし</p>}
          </div>
        </div>

        <div className="bg-white rounded-xl border p-4">
          <h2 className="font-bold text-sm mb-4">最長積みランキング</h2>
          <ol className="space-y-2">
            {longestList.map((item, i) => (
              <li key={item.id} className="flex items-center gap-3 text-sm">
                <span className="text-gray-400 w-5">{i + 1}.</span>
                <span className="flex-1 truncate font-medium">{item.title}</span>
                <span className="text-gray-500 shrink-0">{item.score.days}日</span>
                <Link href={`/item/${item.id}`} className="text-red-500 shrink-0">→</Link>
              </li>
            ))}
            {longestList.length === 0 && <p className="text-sm text-gray-400">データなし</p>}
          </ol>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-white rounded-xl border p-4">
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className="font-bold text-lg text-gray-900">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  )
}
