'use client'

interface Props {
  label: string
  value: number
  max: number
}

export function ScoreBar({ label, value, max }: Props) {
  const pct = Math.round((value / max) * 100)
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-8 text-gray-500 shrink-0">{label}</span>
      <div className="flex-1 bg-gray-200 rounded-full h-1.5">
        <div
          className="bg-red-400 h-1.5 rounded-full transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-5 text-right text-gray-700 font-mono">{value}</span>
    </div>
  )
}
