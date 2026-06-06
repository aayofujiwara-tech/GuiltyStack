'use client'
import { useEffect, useState } from 'react'

type Props = {
  imageUrl: string
  tweetText: string
  onClose: () => void
}

export default function SharePreviewModal({ imageUrl, tweetText, onClose }: Props) {
  const [imgLoaded, setImgLoaded] = useState(false)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const handleShare = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(imageUrl)}`
    window.open(url, '_blank')
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
          {!imgLoaded && (
            <span style={{ color: '#9ca3af', fontSize: '14px' }}>画像を生成中...</span>
          )}
          <img
            src={imageUrl}
            alt="シェア画像プレビュー"
            onLoad={() => setImgLoaded(true)}
            style={{
              width: '100%',
              display: imgLoaded ? 'block' : 'none',
              borderRadius: '12px',
            }}
          />
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
          {tweetText}
        </div>

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
            style={{
              flex: 1, padding: '12px',
              border: 'none',
              borderRadius: '8px',
              background: '#000',
              color: '#fff',
              cursor: 'pointer',
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
