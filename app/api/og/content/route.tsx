import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const title = searchParams.get('title') ?? '不明'
  const type = searchParams.get('type') ?? 'game'
  const score = Number(searchParams.get('score') ?? 0)
  const days = searchParams.get('days') ?? '0'
  const price = searchParams.get('price') ?? '0'
  const roast = searchParams.get('roast') ?? ''

  const typeEmoji: Record<string, string> = {
    game: '🎮', book: '📚', manga: '📖', movie: '🎬', anime: '📺',
  }
  const scoreColor =
    score >= 100 ? '#1a1a1a' :
    score >= 80  ? '#dc2626' :
    score >= 60  ? '#ea580c' :
    score >= 30  ? '#ca8a04' : '#16a34a'

  const levelLabel =
    score >= 100 ? '💀 死亡' :
    score >= 80  ? '🔴 末期' :
    score >= 60  ? '🟠 危険' :
    score >= 30  ? '🟡 要注意' : '🟢 平和'

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          padding: '60px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '32px' }}>
          <span style={{ fontSize: '28px', color: '#6b7280', letterSpacing: '4px' }}>
            💀 積罪 GuiltyStack
          </span>
        </div>

        <div
          style={{
            background: '#ffffff',
            borderRadius: '24px',
            padding: '48px 56px',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ fontSize: '48px' }}>{typeEmoji[type] ?? '📦'}</span>
              <span style={{ fontSize: '40px', fontWeight: 'bold', color: '#111827' }}>
                {title}
              </span>
            </div>
            <div
              style={{
                background: scoreColor,
                color: '#fff',
                borderRadius: '999px',
                padding: '8px 24px',
                fontSize: '32px',
                fontWeight: 'bold',
              }}
            >
              {score}点
            </div>
          </div>

          <div
            style={{
              borderLeft: `6px solid ${scoreColor}`,
              paddingLeft: '20px',
              fontSize: '28px',
              color: '#374151',
              fontStyle: 'italic',
            }}
          >
            {roast}
          </div>

          <div style={{ display: 'flex', gap: '32px', fontSize: '22px', color: '#6b7280' }}>
            <span>{days}日放置</span>
            <span>¥{Number(price).toLocaleString()}</span>
            <span>{levelLabel}</span>
          </div>
        </div>

        <div style={{ marginTop: '24px', fontSize: '20px', color: '#4b5563' }}>
          guilty-stack.vercel.app
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
