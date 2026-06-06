'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useTestMode } from '@/context/TestModeContext'

const SCORE_CRITERIA = [
  { icon: '⏰', label: '経過日数', points: 30, desc: '購入から6ヶ月で満点。時間は容赦しない。' },
  { icon: '📊', label: '消化率',   points: 25, desc: '同ジャンルで積めば積むほど加点される。' },
  { icon: '💴', label: '金額',     points: 20, desc: '高い買い物ほど後悔も重い。' },
  { icon: '🔥', label: '話題の鮮度', points: 25, desc: '発売直後に積むほど最悪。' },
]

const SAMPLE_CARDS = [
  { emoji: '🎮', title: 'Elden Ring',       days: 487, price: '¥8,800', score: 92,  level: '💀', roast: 'もう"積み"じゃない。"負債"だよこれ。' },
  { emoji: '📚', title: '三体',             days: 312, price: '¥2,200', score: 68,  level: '🟠', roast: '栞が1巻の序章に刺さったまま10ヶ月。' },
  { emoji: '🎬', title: 'オッペンハイマー', days: 120, price: '¥2,400', score: 70,  level: '🟠', roast: '発売から10ヶ月。ネタバレ踏んでない自信ある？' },
  { emoji: '📺', title: '推しの子',         days: 400, price: '¥0',     score: 57,  level: '🟡', roast: '"見るリスト"に入れたまま13ヶ月。リストの意味は？' },
]

export default function LandingPage() {
  const { user, loading: authLoading } = useAuth()
  const { isTestMode, enterTestMode } = useTestMode()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && (user || isTestMode)) router.push('/home')
  }, [authLoading, user, isTestMode, router])

  const handleTestMode = () => {
    enterTestMode()
    router.push('/home')
  }

  if (authLoading) {
    return <div className="min-h-screen bg-[#0a0a0a]" />
  }

  return (
    <div style={{ background: '#0a0a0a', color: '#f9fafb', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>

      {/* Hero */}
      <section style={{ textAlign: 'center', padding: '80px 24px 64px' }}>
        <p style={{ fontSize: '48px', marginBottom: '8px' }}>💀</p>
        <h1 style={{ fontSize: 'clamp(32px, 6vw, 64px)', fontWeight: 900, letterSpacing: '-1px', marginBottom: '8px' }}>
          積罪
        </h1>
        <p style={{ fontSize: '14px', color: '#6b7280', letterSpacing: '4px', marginBottom: '4px' }}>
          つみざい / GuiltyStack
        </p>
        <p style={{ fontSize: 'clamp(16px, 3vw, 22px)', color: '#d1d5db', marginTop: '24px', marginBottom: '40px', lineHeight: 1.6 }}>
          あなたの積みコンテンツを、容赦なく断罪する。
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={handleTestMode}
            style={{
              background: '#dc2626', color: '#fff', border: 'none',
              borderRadius: '9999px', padding: '14px 28px',
              fontSize: '15px', fontWeight: 700, cursor: 'pointer',
            }}
          >
            👀 テストモードで試す（登録不要）
          </button>
          <button
            onClick={() => router.push('/auth')}
            style={{
              background: 'transparent', color: '#f9fafb',
              border: '1px solid #374151',
              borderRadius: '9999px', padding: '14px 28px',
              fontSize: '15px', fontWeight: 600, cursor: 'pointer',
            }}
          >
            ログイン / 新規登録
          </button>
        </div>
      </section>

      {/* なぜ断罪されるのか */}
      <section style={{ maxWidth: '840px', margin: '0 auto', padding: '64px 24px' }}>
        <h2 style={{ textAlign: 'center', fontSize: 'clamp(20px, 4vw, 28px)', fontWeight: 800, marginBottom: '40px' }}>
          なぜ積むと断罪されるのか
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
          {SCORE_CRITERIA.map((c) => (
            <div
              key={c.label}
              style={{
                background: '#111111', border: '1px solid #dc2626',
                borderRadius: '16px', padding: '24px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                <span style={{ fontSize: '28px' }}>{c.icon}</span>
                <div>
                  <span style={{ fontWeight: 700, fontSize: '16px' }}>{c.label}</span>
                  <span style={{ marginLeft: '8px', color: '#dc2626', fontWeight: 700 }}>（{c.points}点）</span>
                </div>
              </div>
              <p style={{ color: '#9ca3af', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 毒舌サンプル */}
      <section style={{ maxWidth: '840px', margin: '0 auto', padding: '0 24px 64px' }}>
        <h2 style={{ textAlign: 'center', fontSize: 'clamp(20px, 4vw, 28px)', fontWeight: 800, marginBottom: '40px' }}>
          積罪はこう断罪する
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
          {SAMPLE_CARDS.map((card) => (
            <div
              key={card.title}
              style={{ background: '#111111', borderRadius: '16px', padding: '20px', border: '1px solid #1f2937' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <span style={{ fontSize: '22px', marginRight: '8px' }}>{card.emoji}</span>
                  <span style={{ fontWeight: 700, fontSize: '16px' }}>{card.title}</span>
                  <p style={{ color: '#6b7280', fontSize: '12px', marginTop: '4px', margin: '4px 0 0' }}>
                    {card.days}日 · {card.price}
                  </p>
                </div>
                <div style={{
                  background: card.score >= 80 ? '#dc2626' : card.score >= 60 ? '#ea580c' : '#ca8a04',
                  color: '#fff', borderRadius: '9999px', padding: '4px 12px',
                  fontSize: '14px', fontWeight: 700, whiteSpace: 'nowrap',
                }}>
                  {card.score}点 {card.level}
                </div>
              </div>
              <p style={{
                borderLeft: `4px solid ${card.score >= 80 ? '#dc2626' : card.score >= 60 ? '#ea580c' : '#ca8a04'}`,
                paddingLeft: '12px', color: '#d1d5db', fontSize: '14px',
                fontStyle: 'italic', lineHeight: 1.6, margin: 0,
              }}>
                「{card.roast}」
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ textAlign: 'center', padding: '64px 24px', background: '#0f0f0f' }}>
        <h2 style={{ fontSize: 'clamp(20px, 4vw, 32px)', fontWeight: 800, marginBottom: '32px' }}>
          あなたの積みを、今すぐ断罪する。
        </h2>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={handleTestMode}
            style={{
              background: '#dc2626', color: '#fff', border: 'none',
              borderRadius: '9999px', padding: '14px 28px',
              fontSize: '15px', fontWeight: 700, cursor: 'pointer',
            }}
          >
            👀 テストモードで試す
          </button>
          <button
            onClick={() => router.push('/auth')}
            style={{
              background: 'transparent', color: '#f9fafb',
              border: '1px solid #374151',
              borderRadius: '9999px', padding: '14px 28px',
              fontSize: '15px', fontWeight: 600, cursor: 'pointer',
            }}
          >
            アカウントを作って始める →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '32px 24px', borderTop: '1px solid #1f2937' }}>
        <p style={{ color: '#374151', fontSize: '14px', margin: 0 }}>
          💀 積罪 GuiltyStack
        </p>
        <p style={{ color: '#374151', fontSize: '12px', marginTop: '6px' }}>
          © 2026 GuiltyStack
        </p>
      </footer>
    </div>
  )
}
