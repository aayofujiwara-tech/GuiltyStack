'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTestMode } from '@/context/TestModeContext'

interface Props {
  totalPrice?: number
  avgScore?: number
  oldestDays?: number
}

export function MobileHeader({ totalPrice = 0, avgScore = 0, oldestDays = 0 }: Props) {
  const router = useRouter()
  const { isTestMode, exitTestMode } = useTestMode()

  const handleLogin = () => {
    exitTestMode()
    router.push('/auth')
  }

  return (
    <header className="lg:hidden sticky top-0 z-10 bg-white border-b border-gray-200">
      {isTestMode && (
        <div className="flex items-center justify-between px-4 py-1.5 bg-amber-50 border-b border-amber-100 text-xs text-amber-700">
          <span className="font-medium">🧪 テストモード中</span>
          <button onClick={handleLogin} className="text-red-600 font-medium hover:underline">
            ログインして始める →
          </button>
        </div>
      )}
      <div className="flex items-center justify-between px-4 py-3">
        <h1 className="font-black text-base text-gray-900">💀 積罪</h1>
        <Link href="/stats" className="text-xs text-gray-500 hover:text-red-600">
          ¥{totalPrice.toLocaleString()} | {avgScore}点 | 最古{oldestDays}日
        </Link>
      </div>
    </header>
  )
}
