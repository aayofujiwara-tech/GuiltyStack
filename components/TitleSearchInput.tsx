'use client'
import { useState, useEffect, useRef } from 'react'
import { searchByType, type SearchResult } from '@/lib/searchApi'

type Props = {
  type: string
  value: string
  onChange: (value: string) => void
  onSelect: (result: SearchResult) => void
}

export default function TitleSearchInput({ type, value, onChange, onSelect }: Props) {
  const [results, setResults] = useState<SearchResult[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!value || value.length < 2) {
      setResults([])
      setIsOpen(false)
      return
    }
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      const res = await searchByType(value, type)
      setResults(res)
      setIsOpen(res.length > 0)
      setLoading(false)
    }, 400)
    return () => clearTimeout(debounceRef.current)
  }, [value, type])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSelect = (result: SearchResult) => {
    onChange(result.title)
    onSelect(result)
    setIsOpen(false)
    setResults([])
  }

  return (
    <div ref={wrapperRef} style={{ position: 'relative' }}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="タイトルを入力..."
        style={{
          width: '100%',
          padding: '8px 12px',
          border: '1px solid #d1d5db',
          borderRadius: '8px',
          fontSize: '14px',
          outline: 'none',
          boxSizing: 'border-box',
          background: 'white',
        }}
      />
      {loading && (
        <div style={{
          position: 'absolute', right: '12px', top: '50%',
          transform: 'translateY(-50%)', color: '#9ca3af', fontSize: '12px',
          pointerEvents: 'none',
        }}>
          検索中...
        </div>
      )}
      {isOpen && results.length > 0 && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0,
          background: '#fff', border: '1px solid #e5e7eb',
          borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          zIndex: 50, overflow: 'hidden', marginTop: '4px',
        }}>
          {results.map((r, i) => (
            <div
              key={i}
              onClick={() => handleSelect(r)}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '10px 14px', cursor: 'pointer',
                borderBottom: i < results.length - 1 ? '1px solid #f3f4f6' : 'none',
                background: '#fff',
                transition: 'background 0.1s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#f9fafb')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#fff')}
            >
              {r.coverImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={r.coverImageUrl}
                  alt={r.title}
                  style={{ width: '36px', height: '48px', objectFit: 'cover', borderRadius: '4px', flexShrink: 0 }}
                />
              ) : (
                <div style={{
                  width: '36px', height: '48px', background: '#e5e7eb',
                  borderRadius: '4px', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '18px', flexShrink: 0,
                }}>
                  📦
                </div>
              )}
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '14px', fontWeight: 500, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {r.title}
                </div>
                {r.releaseDate && (
                  <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
                    {r.releaseDate}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
