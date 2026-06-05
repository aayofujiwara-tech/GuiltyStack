'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { ContentType } from '@/lib/types'

const TYPES: { value: ContentType; label: string; icon: string }[] = [
  { value: 'game',  label: 'ゲーム', icon: '🎮' },
  { value: 'book',  label: '本',     icon: '📚' },
  { value: 'manga', label: 'マンガ', icon: '📖' },
  { value: 'movie', label: '映画',   icon: '🎬' },
  { value: 'anime', label: 'アニメ', icon: '📺' },
]

export default function AddPage() {
  const router = useRouter()
  const supabase = createClient()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const today = new Date().toISOString().split('T')[0]

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setError('ログインが必要です')
      setSubmitting(false)
      return
    }

    const fd = new FormData(e.currentTarget)
    const payload = {
      user_id: user.id,
      title: fd.get('title') as string,
      type: fd.get('type') as ContentType,
      price: parseInt(fd.get('price') as string, 10),
      purchased_at: fd.get('purchased_at') as string,
      release_date: fd.get('release_date') as string,
      platform: (fd.get('platform') as string) || null,
      cover_image_url: (fd.get('cover_image_url') as string) || null,
      tags: (fd.get('tags') as string)
        ? (fd.get('tags') as string).split(/[,、]/).map((t) => t.trim()).filter(Boolean)
        : null,
      status: 'unplayed' as const,
      freshness_source: 'manual' as const,
    }

    const { error: err } = await supabase.from('contents').insert(payload)
    if (err) {
      setError(err.message)
      setSubmitting(false)
      return
    }
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-4 py-3 flex items-center gap-3">
        <Link href="/" className="text-gray-500 hover:text-gray-900">←</Link>
        <h1 className="font-bold">コンテンツ登録</h1>
      </header>

      <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4 space-y-5">
        <Field label="タイトル *">
          <input
            name="title"
            required
            placeholder="例: Elden Ring"
            className="input"
          />
        </Field>

        <Field label="コンテンツタイプ *">
          <div className="grid grid-cols-5 gap-2">
            {TYPES.map((t) => (
              <label key={t.value} className="flex flex-col items-center gap-1 cursor-pointer">
                <input type="radio" name="type" value={t.value} required className="sr-only peer" />
                <span className="w-full text-center py-2 rounded-lg border border-gray-200 text-2xl peer-checked:border-red-500 peer-checked:bg-red-50 transition-colors">
                  {t.icon}
                </span>
                <span className="text-xs text-gray-600">{t.label}</span>
              </label>
            ))}
          </div>
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="購入金額（円）*">
            <input
              name="price"
              type="number"
              min={0}
              required
              placeholder="8800"
              className="input"
            />
          </Field>
          <Field label="プラットフォーム">
            <input
              name="platform"
              placeholder="Switch / Steam..."
              className="input"
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="購入日 *">
            <input
              name="purchased_at"
              type="date"
              required
              defaultValue={today}
              className="input"
            />
          </Field>
          <Field label="発売日 *">
            <input
              name="release_date"
              type="date"
              required
              defaultValue={today}
              className="input"
            />
          </Field>
        </div>

        <Field label="カバー画像URL">
          <input
            name="cover_image_url"
            type="url"
            placeholder="https://..."
            className="input"
          />
        </Field>

        <Field label="タグ（カンマ区切り）">
          <input
            name="tags"
            placeholder="RPG, オープンワールド"
            className="input"
          />
        </Field>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-red-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-red-700 disabled:opacity-50 transition-colors"
        >
          {submitting ? '登録中...' : '登録して断罪スタート'}
        </button>
      </form>

      <style jsx>{`
        .input {
          width: 100%;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          background: white;
          outline: none;
        }
        .input:focus {
          border-color: #ef4444;
          box-shadow: 0 0 0 2px rgba(239,68,68,0.15);
        }
      `}</style>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {children}
    </div>
  )
}
