type GenerateContentImageParams = {
  title: string
  type: string
  score: number
  days: number
  price: number
  roast: string
}

const TYPE_EMOJI: Record<string, string> = {
  game: '🎮', book: '📚', manga: '📖', movie: '🎬', anime: '📺',
}

const scoreColor = (score: number) =>
  score >= 100 ? '#1a1a1a' :
  score >= 80  ? '#dc2626' :
  score >= 60  ? '#ea580c' :
  score >= 30  ? '#ca8a04' : '#16a34a'

const levelLabel = (score: number) =>
  score >= 100 ? '死亡' :
  score >= 80  ? '末期' :
  score >= 60  ? '危険' :
  score >= 30  ? '要注意' : '平和'

function drawWrappedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
): number {
  const chars = text.split('')
  let line = ''
  let currentY = y
  for (const char of chars) {
    const testLine = line + char
    if (ctx.measureText(testLine).width > maxWidth && line !== '') {
      ctx.fillText(line, x, currentY)
      line = char
      currentY += lineHeight
    } else {
      line = testLine
    }
  }
  if (line) ctx.fillText(line, x, currentY)
  return currentY
}

export function generateContentImage(params: GenerateContentImageParams): Promise<Blob> {
  return new Promise((resolve) => {
    const W = 1200, H = 630
    const canvas = document.createElement('canvas')
    canvas.width = W
    canvas.height = H
    const ctx = canvas.getContext('2d')!

    const grad = ctx.createLinearGradient(0, 0, W, H)
    grad.addColorStop(0, '#0f0f0f')
    grad.addColorStop(1, '#1a1a2e')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, W, H)

    ctx.fillStyle = '#6b7280'
    ctx.font = '28px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('\u{1F480} 積罪 GuiltyStack', W / 2, 60)

    const cardX = 60, cardY = 90, cardW = W - 120, cardH = 460
    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.roundRect(cardX, cardY, cardW, cardH, 24)
    ctx.fill()

    const emoji = TYPE_EMOJI[params.type] ?? '\u{1F4E6}'
    ctx.fillStyle = '#111827'
    ctx.font = 'bold 40px sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText(`${emoji} ${params.title}`, cardX + 40, cardY + 70)

    const color = scoreColor(params.score)
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.roundRect(cardX + cardW - 160, cardY + 30, 120, 52, 26)
    ctx.fill()
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 30px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(`${params.score}点`, cardX + cardW - 100, cardY + 65)

    ctx.fillStyle = color
    ctx.fillRect(cardX + 40, cardY + 110, 6, 100)
    ctx.fillStyle = '#374151'
    ctx.font = 'italic 26px sans-serif'
    ctx.textAlign = 'left'
    drawWrappedText(ctx, params.roast, cardX + 60, cardY + 148, cardW - 120, 38)

    ctx.fillStyle = '#6b7280'
    ctx.font = '24px sans-serif'
    ctx.fillText(`${params.days}日放置`, cardX + 40, cardY + 290)
    ctx.fillText(`￥${params.price.toLocaleString()}`, cardX + 220, cardY + 290)
    ctx.fillText(levelLabel(params.score), cardX + 400, cardY + 290)

    const barLabels = ['日数', '消化', '金額', '鮮度']
    barLabels.forEach((label, i) => {
      const barY = cardY + 340 + i * 26
      const barX = cardX + 100
      const barW = cardW - 180
      ctx.fillStyle = '#e5e7eb'
      ctx.beginPath()
      ctx.roundRect(barX, barY, barW, 14, 7)
      ctx.fill()
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.roundRect(barX, barY, barW * Math.min(params.score / 100, 1), 14, 7)
      ctx.fill()
      ctx.fillStyle = '#6b7280'
      ctx.font = '18px sans-serif'
      ctx.textAlign = 'left'
      ctx.fillText(label, cardX + 40, barY + 12)
    })

    ctx.fillStyle = '#4b5563'
    ctx.font = '20px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('guilty-stack.vercel.app', W / 2, H - 20)

    canvas.toBlob((blob) => resolve(blob!), 'image/png')
  })
}

export type GenerateSummaryImageParams = {
  items: { title: string; score: number; roast: string }[]
}

export function generateSummaryImage(params: GenerateSummaryImageParams): Promise<Blob> {
  return new Promise((resolve) => {
    const W = 1200, H = 630
    const canvas = document.createElement('canvas')
    canvas.width = W
    canvas.height = H
    const ctx = canvas.getContext('2d')!

    const grad = ctx.createLinearGradient(0, 0, W, H)
    grad.addColorStop(0, '#0f0f0f')
    grad.addColorStop(1, '#1a1a2e')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, W, H)

    ctx.fillStyle = '#9ca3af'
    ctx.font = '28px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('\u{1F480} 今日の断罪 - 積罪 GuiltyStack', W / 2, 52)

    const items = params.items.slice(0, 2)
    const cardW = (W - 120 - 24) / 2
    items.forEach((item, i) => {
      const cardX = 60 + i * (cardW + 24)
      const cardY = 80
      const cardH = 480
      const color = scoreColor(item.score)

      ctx.fillStyle = '#ffffff'
      ctx.beginPath()
      ctx.roundRect(cardX, cardY, cardW, cardH, 20)
      ctx.fill()

      ctx.fillStyle = '#111827'
      ctx.font = 'bold 30px sans-serif'
      ctx.textAlign = 'left'
      const displayTitle = item.title.length > 14 ? item.title.slice(0, 14) + '…' : item.title
      ctx.fillText(displayTitle, cardX + 24, cardY + 52)

      ctx.fillStyle = color
      ctx.beginPath()
      ctx.roundRect(cardX + cardW - 110, cardY + 20, 90, 44, 22)
      ctx.fill()
      ctx.fillStyle = '#fff'
      ctx.font = 'bold 26px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(`${item.score}点`, cardX + cardW - 65, cardY + 50)

      ctx.fillStyle = color
      ctx.fillRect(cardX + 24, cardY + 80, 5, 80)
      ctx.fillStyle = '#4b5563'
      ctx.font = 'italic 22px sans-serif'
      ctx.textAlign = 'left'
      drawWrappedText(ctx, item.roast, cardX + 40, cardY + 112, cardW - 64, 32)
    })

    ctx.fillStyle = '#4b5563'
    ctx.font = '20px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('guilty-stack.vercel.app', W / 2, H - 16)

    canvas.toBlob((blob) => resolve(blob!), 'image/png')
  })
}
