import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  // items=タイトル,スコア,毒舌|タイトル,スコア,毒舌 の形式で受け取る
  const itemsRaw = searchParams.get('items') ?? ''
  const items = itemsRaw.split('|').slice(0, 2).map(item => {
    const [title, score, roast] = item.split(',')
    return { title, score: Number(score), roast }
  })

  const scoreColor = (score: number) =>
    score >= 100 ? '#1a1a1a' :
    score >= 80  ? '#dc2626' :
    score >= 60  ? '#ea580c' :
    score >= 30  ? '#ca8a04' : '#16a34a'

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
          padding: '48px',
          gap: '24px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '28px', color: '#9ca3af', letterSpacing: '4px' }}>
            💀 今日の断罪 - 積罪 GuiltyStack
          </span>
        </div>

        <div style={{ display: 'flex', gap: '24px', width: '100%' }}>
          {items.map((item, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                background: '#ffffff',
                borderRadius: '20px',
                padding: '36px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827' }}>
                  {item.title}
                </span>
                <div
                  style={{
                    background: scoreColor(item.score),
                    color: '#fff',
                    borderRadius: '999px',
                    padding: '6px 18px',
                    fontSize: '24px',
                    fontWeight: 'bold',
                  }}
                >
                  {item.score}点
                </div>
              </div>
              <div
                style={{
                  borderLeft: `5px solid ${scoreColor(item.score)}`,
                  paddingLeft: '16px',
                  fontSize: '22px',
                  color: '#4b5563',
                  fontStyle: 'italic',
                }}
              >
                {item.roast}
              </div>
            </div>
          ))}
        </div>

        <div style={{ fontSize: '20px', color: '#4b5563', marginTop: '8px' }}>
          guilty-stack.vercel.app
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
