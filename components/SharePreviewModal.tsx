'use client'
import { useEffect, useRef, useState } from 'react'
import { generateContentImage, generateSummaryImage } from '@/lib/generateShareImage'

type ContentShareParams = {
  mode: 'content'
  title: string
  type: string
  score: number
  days: number
  price: number
  roast: string
  tweetText: string
}

type SummaryShareParams = {
  mode: 'summary'
  items: { title: string; score: number; roast: string }[]
  tweetText: string
}

type Props = (ContentShareParams | SummaryShareParams) & {
  onClose: () => void
}

export default function SharePreviewModal(props: Props) {
  const { onClose } = props
  const [blobUrl, setBlobUrl] = useState<string | null>(null)
  const [generating, setGenerating] = useState(true)
  const blobRef = useRef<Blob | null>(null)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  useEffect(() => {
    let cancelled = false
    const generate = async () => {
      setGenerating(true)
      const blob = props.mode === 'content'
        ? await generateContentImage({
            title: props.title,
            type: props.type,
            score: props.score,
            days: props.days,
            price: props.price,
            roast: props.roast,
          })
        : await generateSummaryImage({ items: props.items })

      if (cancelled) return
      blobRef.current = blob
      setBlobUrl(URL.createObjectURL(blob))
      setGenerating(false)
    }
    generate()
    return () => { cancelled = true }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    return () => {
      if (blobUrl) URL.revokeObjectURL(blobUrl)
    }
  }, [blobUrl])

  const handleShare = () => {
    if (blobRef.current) {
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blobRef.current)
      a.download = 'guiltystack-share.png'
      a.click()
    }
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(props.tweetText)}&url=${encodeURIComponent('https://guilty-stack.vercel.app')}`
    window.open(tweetUrl, '_blank')
    onClose()
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
        background: 'rgba(0,0,0,0.7)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px',
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: '16px',
          padding: '24px',
          maxWidth: '640px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 'bold', fontSize: '16px' }}>シェアプレビュー</span>
          <button
            onClick={onClose}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: '20px', color: '#6b7280', padding: '4px',
            }}
          >
            ✕
          </button>
        </div>

        <div
          style={{
            borderRadius: '12px',
            overflow: 'hidden',
            border: '1px solid #e5e7eb',
            background: '#f3f4f6',
            minHeight: '200px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {generating ? (
            <span style={{ color: '#9ca3af', fontSize: '14px' }}>画像を生成中...</span>
          ) : (
            <img
              src={blobUrl!}
              alt="シェア画像プレビュー"
              style={{ width: '100%', display: 'block', borderRadius: '12px' }}
            />
          )}
        </div>

        <div
          style={{
            background: '#f9fafb',
            borderRadius: '8px',
            padding: '12px 16px',
            fontSize: '14px',
            color: '#374151',
            whiteSpace: 'pre-wrap',
            border: '1px solid #e5e7eb',
          }}
        >
          {props.tweetText}
        </div>

        {!generating && (
          <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>
            ※ シェアボタンを押すと画像がダウンロードされます。Xに添付してポストしてください。
          </p>
        )}

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              background: '#fff',
              cursor: 'pointer',
              fontSize: '14px',
              color: '#374151',
            }}
          >
            キャンセル
          </button>
          <button
            onClick={handleShare}
            disabled={generating}
            style={{
              flex: 1, padding: '12px',
              border: 'none',
              borderRadius: '8px',
              background: generating ? '#9ca3af' : '#000',
              color: '#fff',
              cursor: generating ? 'default' : 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
            }}
          >
            🐦 Xでシェア
          </button>
        </div>
      </div>
    </div>
  )
}
