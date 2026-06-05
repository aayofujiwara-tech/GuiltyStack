'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function AuthPage() {
  const router = useRouter()
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    if (mode === 'signup') {
      const { error: err } = await supabase.auth.signUp({ email, password })
      if (err) setError(err.message)
      else setMessage('確認メールを送信しました。メールを確認してください。')
    } else {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password })
      if (err) setError(err.message)
      else router.push('/')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl border p-8 space-y-6">
        <div className="text-center">
          <p className="text-4xl mb-2">💀</p>
          <h1 className="text-xl font-black text-gray-900">積罪</h1>
          <p className="text-xs text-gray-400 mt-1">積みコンテンツを断罪するアプリ</p>
        </div>

        <div className="flex rounded-lg border overflow-hidden">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-2 text-sm font-medium transition-colors ${mode === 'login' ? 'bg-red-600 text-white' : 'text-gray-600'}`}
          >
            ログイン
          </button>
          <button
            onClick={() => setMode('signup')}
            className={`flex-1 py-2 text-sm font-medium transition-colors ${mode === 'signup' ? 'bg-red-600 text-white' : 'text-gray-600'}`}
          >
            新規登録
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="メールアドレス"
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-400"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            placeholder="パスワード（6文字以上）"
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-400"
          />

          {error && <p className="text-red-600 text-xs">{error}</p>}
          {message && <p className="text-green-600 text-xs">{message}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white py-2 rounded-lg font-bold text-sm hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            {loading ? '処理中...' : mode === 'login' ? 'ログイン' : '新規登録'}
          </button>
        </form>
      </div>
    </div>
  )
}
