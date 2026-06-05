'use client'

import Link from 'next/link'

interface Props {
  totalPrice?: number
  avgScore?: number
  oldestDays?: number
}

export function MobileHeader({ totalPrice = 0, avgScore = 0, oldestDays = 0 }: Props) {
  return (
    <header className="lg:hidden sticky top-0 z-10 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-4 py-3">
        <h1 className="font-black text-base text-gray-900">💀 積罪</h1>
        <Link href="/stats" className="text-xs text-gray-500 hover:text-red-600">
          ¥{totalPrice.toLocaleString()} | {avgScore}点 | 最古{oldestDays}日
        </Link>
      </div>
    </header>
  )
}
