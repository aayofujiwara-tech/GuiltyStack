'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { Content } from '@/lib/types'
import { ContentWithScore, enrichContents, lotteryPick } from '@/lib/contents'
import { ContentCard } from '@/components/ContentCard'
import { MobileHeader } from '@/components/MobileHeader'
import { Sidebar } from '@/components/Sidebar'

type SortKey = 'score' | 'date' | 'price'

export default function HomePage() {
  const [items, setItems] = useState<ContentWithScore[]>([])
  const [sentenced, setSentenced] = useState<ContentWithScore[]>([])
  const [loading, setLoading] = useState(true)
  const [sort, setSort] = useState<SortKey>('score')
  const [isPC, setIsPC] = useState(false)
  const supabase = createClient()

  const load = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setLoading(false)
      return
    }
    const { data } = await supabase
      .from('contents')
      .select('*')
      .eq('user_id', user.id)
      .neq('status', 'completed')
      .neq('status', 'abandoned')
    if (data) {
      const enriched = enrichContents(data as Content[])
      setItems(enriched)
      const pc = window.innerWidth >= 1024
      setIsPC(pc)
      setSentenced(lotteryPick(enriched, pc ? 2 : 3))
    }
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const handleComplete = async (id: string) => {
    await supabase.from('contents').update({ status: 'completed' }).eq('id', id)
    load()
  }

  const sorted = [...items].sort((a, b) => {
    if (sort === 'score') return b.score.total - a.score.total
    if (sort === 'date')  return b.score.days - a.score.days
    return b.price - a.price
  })

  const totalPrice = items.reduce((s, i) => s + i.price, 0)
  const avgScore = items.length
    ? Math.round(items.reduce((s, i) => s + i.score.total, 0) / items.length)
    : 0
  const oldest = items.reduce<ContentWithScore | null>(
    (prev, cur) => !prev || cur.score.days > prev.score.days ? cur : prev,
    null
  )

  const stats = {
    totalPrice,
    avgScore,
    oldestTitle: oldest?.title ?? '—',
    oldestDays: oldest?.score.days ?? 0,
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-400 animate-pulse">断罪準備中...</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar stats={stats} />

      <div className="flex-1 flex flex-col min-w-0">
        <MobileHeader totalPrice={totalPrice} avgScore={avgScore} oldestDays={oldest?.score.days ?? 0} />

        <main className="flex-1 p-4 lg:p-6 max-w-4xl mx-auto w-full pb-24 lg:pb-6">
          {items.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              <section className="mb-8">
                <h2 className="font-bold text-base mb-3 flex items-center gap-2">
                  🎲 今日の断罪
                  <span className="text-xs text-gray-400 font-normal">（重み付き抽選）</span>
                </h2>
                <div className="grid gap-3 lg:grid-cols-2">
                  {sentenced.map((item) => (
                    <ContentCard
                      key={item.id}
                      item={item}
                      showBreakdown={isPC}
                      onComplete={handleComplete}
                    />
                  ))}
                </div>
              </section>

              <section>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-bold text-base">── 全件リスト</h2>
                  <div className="flex gap-1">
                    {(['score', 'date', 'price'] as SortKey[]).map((k) => (
                      <button
                        key={k}
                        onClick={() => setSort(k)}
                        className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                          sort === k
                            ? 'bg-red-600 text-white border-red-600'
                            : 'border-gray-300 text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {k === 'score' ? '後悔順▼' : k === 'date' ? '日付' : '金額'}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid gap-3 lg:grid-cols-2">
                  {sorted.map((item) => (
                    <ContentCard
                      key={item.id}
                      item={item}
                      onComplete={handleComplete}
                    />
                  ))}
                </div>
              </section>
            </>
          )}
        </main>

        <MobileFab />
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <p className="text-5xl mb-4">🎉</p>
      <h2 className="text-lg font-bold mb-2">断罪対象なし</h2>
      <p className="text-gray-500 text-sm mb-6">積みコンテンツを登録して断罪を始めよう</p>
      <Link
        href="/add"
        className="bg-red-600 text-white px-6 py-2 rounded-full font-bold text-sm hover:bg-red-700 transition-colors"
      >
        ＋ 追加する
      </Link>
    </div>
  )
}

function MobileFab() {
  return (
    <Link
      href="/add"
      className="lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-red-600 text-white rounded-full shadow-lg flex items-center justify-center text-2xl hover:bg-red-700 transition-colors z-20"
    >
      ＋
    </Link>
  )
}
