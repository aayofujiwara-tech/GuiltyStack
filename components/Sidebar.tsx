'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface StatsData {
  totalPrice: number
  avgScore: number
  oldestTitle: string
  oldestDays: number
}

interface Props {
  stats?: StatsData
}

const NAV = [
  { href: '/',      label: '🏠 ホーム' },
  { href: '/list',  label: '📋 一覧' },
  { href: '/add',   label: '➕ 追加' },
  { href: '/stats', label: '📊 統計' },
]

export function Sidebar({ stats }: Props) {
  const pathname = usePathname()
  return (
    <aside className="hidden lg:flex flex-col w-52 shrink-0 sticky top-0 h-screen border-r border-gray-200 bg-white p-4">
      <h1 className="font-black text-lg mb-6 text-gray-900">💀 積罪</h1>
      <nav className="flex flex-col gap-1">
        {NAV.map((n) => (
          <Link
            key={n.href}
            href={n.href}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              pathname === n.href
                ? 'bg-red-50 text-red-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {n.label}
          </Link>
        ))}
      </nav>
      {stats && (
        <div className="mt-auto border-t pt-4 space-y-3">
          <div>
            <p className="text-xs text-gray-400">総積み額</p>
            <p className="font-bold text-gray-900">¥{stats.totalPrice.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">平均スコア</p>
            <p className="font-bold text-gray-900">{stats.avgScore}点</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">最古の積み</p>
            <p className="font-bold text-gray-900 text-sm truncate">{stats.oldestTitle}</p>
            <p className="text-xs text-gray-500">{stats.oldestDays}日</p>
          </div>
        </div>
      )}
    </aside>
  )
}
