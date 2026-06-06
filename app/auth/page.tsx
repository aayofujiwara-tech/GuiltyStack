'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { signInWithGoogle, signInWithEmail, signUpWithEmail } from '@/lib/auth'
import { useTestMode } from '@/context/TestModeContext'

export default function AuthPage() {
  const router = useRouter()
  const { enterTestMode } = useTestMode()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode]         = useState<'login' | 'signup'>('login')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  const go = () => router.push('/home')

  const handleTestMode = () => {
    enterTestMode()
    router.push('/home')
  }

  const handleGoogle = async () => {
    setLoading(true)
    setError('')
    try {
      await signInWithGoogle()
      go()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'エラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      if (mode === 'login') {
        await signInWithEmail(email, password)
      } else {
        await signUpWithEmail(email, password)
      }
      go()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'エラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl border p-8 space-y-6">
        <div className="text-center">
          <p className="text-4xl mb-2">💀</p>
          <h1 className="text-xl font-black text-gray-900">積罪</h1>
          <p className="text-xs text-gray-400 mt-1">積みコンテンツを断罪するアプリ</p>
        </div>

        {/* Googleログイン */}
        <button
          onClick={handleGoogle}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-lg py-2.5 text-sm font-medium hover:bg-gray-50 disabled:opacity-50 transition-colors shadow-sm"
        >
          <Image src="/google-logo.svg" alt="Google" width={18} height={18} />
          Googleでログイン
        </button>

        <div className="flex items-center gap-3 text-xs text-gray-400">
          <div className="flex-1 h-px bg-gray-200" />
          またはメールで
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* ログイン/新規登録 切り替え */}
        <div className="flex rounded-lg border overflow-hidden">
          {(['login', 'signup'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex-1 py-2 text-sm font-medium transition-colors ${
                mode === m ? 'bg-red-600 text-white' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {m === 'login' ? 'ログイン' : '新規登録'}
            </button>
          ))}
        </div>

        <form onSubmit={handleEmail} className="space-y-3">
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
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white py-2 rounded-lg font-bold text-sm hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            {loading ? '処理中...' : mode === 'login' ? 'ログイン' : '新規登録'}
          </button>
        </form>

        <div className="flex items-center gap-3 text-xs text-gray-400">
          <div className="flex-1 h-px bg-gray-200" />
          または
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <button
          type="button"
          onClick={handleTestMode}
          className="w-full border border-gray-300 rounded-lg py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
        >
          👀 テストモードで試す（登録不要）
        </button>
      </div>
    </div>
  )
}
