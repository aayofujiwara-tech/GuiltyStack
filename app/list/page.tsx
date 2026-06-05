'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { Content, ContentType, ContentStatus } from '@/lib/types'
import { ContentWithScore, enrichContents, TYPE_ICON } from '@/lib/contents'
import { ContentCard } from '@/components/ContentCard'

type SortKey = 'score' | 'date' | 'price'
const ALL_TYPES: (ContentType | 'all')[] = ['all', 'game', 'book', 'manga', 'movie', 'anime']
const TYPE_ICONS: Record<ContentType | 'all', string> = {
  all: '🗂️', game: '🎮', book: '📚', manga: '📖', movie: '🎬', anime: '📺',
}

export default function ListPage() {
  const [items, setItems] = useState<ContentWithScore[]>([])
  const [loading, setLoading] = useState(true)
  const [sort, setSort] = useState<SortKey>('score')
  const [typeFilter, setTypeFilter] = useState<ContentType | 'all'>('all')
  const [statusFilter, setStatusFilter] = useState<ContentStatus | 'all'>('all')
  const [search, setSearch] = useState('')
  const supabase = createClient()

  const load = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setLoading(false); return }
    const { data } = await supabase.from('contents').select('*').eq('user_id', user.id)
    if (data) setItems(enrichContents(data as Content[]))
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleComplete = async (id: string) => {
    await supabase.from('contents').update({ status: 'completed' }).eq('id', id)
    load()
  }

  const filtered = items
    .filter((i) => typeFilter === 'all' || i.type === typeFilter)
    .filter((i) => statusFilter === 'all' || i.status === statusFilter)
    .filter((i) => !search || i.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === 'score') return b.score.total - a.score.total
      if (sort === 'date')  return b.score.days - a.score.days
      return b.price - a.price
    })

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-4 py-3 flex items-center gap-3">
        <Link href="/" className="text-gray-500 hover:text-gray-900">←</Link>
        <h1 className="font-bold">📋 全件リスト</h1>
      </header>

      <div className="max-w-2xl mx-auto p-4 space-y-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 タイトルで検索..."
          className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm bg-white focus:outline-none focus:border-red-400"
        />

        <div className="flex gap-1 overflow-x-auto pb-1">
          {ALL_TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`shrink-0 text-xs px-3 py-1 rounded-full border transition-colors ${
                typeFilter === t ? 'bg-red-600 text-white border-red-600' : 'border-gray-300 text-gray-600'
              }`}
            >
              {TYPE_ICONS[t]}
            </button>
          ))}
          <div className="w-px bg-gray-200 mx-1" />
          {(['all', 'unplayed', 'in_progress', 'completed', 'abandoned'] as (ContentStatus | 'all')[]).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`shrink-0 text-xs px-3 py-1 rounded-full border transition-colors ${
                statusFilter === s ? 'bg-gray-700 text-white border-gray-700' : 'border-gray-300 text-gray-600'
              }`}
            >
              {s === 'all' ? '全て' : s === 'unplayed' ? '未消化' : s === 'in_progress' ? '進行中' : s === 'completed' ? '消化済み' : '放棄'}
            </button>
          ))}
        </div>

        <div className="flex gap-1">
          {(['score', 'date', 'price'] as SortKey[]).map((k) => (
            <button
              key={k}
              onClick={() => setSort(k)}
              className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                sort === k ? 'bg-red-600 text-white border-red-600' : 'border-gray-300 text-gray-600'
              }`}
            >
              {k === 'score' ? '後悔順▼' : k === 'date' ? '日付順' : '金額順'}
            </button>
          ))}
          <span className="ml-auto text-xs text-gray-400 self-center">{filtered.length}件</span>
        </div>

        {loading ? (
          <p className="text-center text-gray-400 py-8">読み込み中...</p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-gray-400 py-8">該当なし</p>
        ) : (
          <div className="grid gap-3 lg:grid-cols-2">
            {filtered.map((item) => (
              <ContentCard
                key={item.id}
                item={item}
                onComplete={item.status !== 'completed' ? handleComplete : undefined}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
