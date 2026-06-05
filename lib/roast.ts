import { ContentType } from './types'
import { ScoreLevel } from './score'

type RoastTag = ContentType | 'all'

interface RoastLine {
  text: string
  tags: RoastTag[]
}

const ROAST_LINES: Record<ScoreLevel, RoastLine[]> = {
  peace: [
    { text: 'まだ猶予はある。でも、買ったこと覚えてる？', tags: ['all'] },
    { text: '${days}日経過。まだ取り返せる。たぶん。', tags: ['all'] },
    { text: '${title}がじっとこっちを見てる。', tags: ['all'] },
    { text: '積んだばかりの新鮮な後悔。大事に育てて。', tags: ['all'] },
    { text: 'セーブデータ、まだ存在すらしてない。', tags: ['game'] },
    { text: 'パッケージ開封してないやつ、正直に言って。', tags: ['game'] },
    { text: '1ページも読んでないのに本棚に並べた。インテリア。', tags: ['book', 'manga'] },
    { text: 'まだ1話も見てない。でも気持ちはわかる。', tags: ['movie', 'anime'] },
  ],
  caution: [
    { text: '${price}円が${days}日間、完全に眠ってる。', tags: ['all'] },
    { text: '同ジャンル、あと${undone}本溜まってるよ。積みのプロかよ。', tags: ['all'] },
    { text: '"いつかやる"って言い続けて${months}ヶ月。いつ？', tags: ['all'] },
    { text: '${title}の話、もうSNSで誰もしてないけどな。', tags: ['all'] },
    { text: 'チュートリアルで止まってるやつ、正直に言って。', tags: ['game'] },
    { text: '攻略サイトだけ読んでゲームした気になってない？', tags: ['game'] },
    { text: '本屋で買った瞬間が一番テンション高かったやつ。', tags: ['book', 'manga'] },
    { text: '積ん読って言葉、自分のためにあると思ってるでしょ。', tags: ['book', 'manga'] },
    { text: '"見るリスト"に入れたまま${months}ヶ月。リストの意味は？', tags: ['movie', 'anime'] },
    { text: '予告編だけ5回見たやつ、本編見てないよね。', tags: ['movie', 'anime'] },
  ],
  danger: [
    { text: '発売から${fresh_months}ヶ月。ネタバレ踏んでない自信ある？', tags: ['all'] },
    { text: '1日${per_day}円ずつ後悔してる計算になる。', tags: ['all'] },
    { text: 'このまま積み続けると"レトロ作品"扱いになるよ。', tags: ['all'] },
    { text: 'やらない理由を探すエネルギーで消化できてたのでは。', tags: ['all'] },
    { text: 'セーブデータの最終更新日、直視できる？', tags: ['game'] },
    { text: 'そのゲーム、もうオンラインサーバー落ちてない？', tags: ['game'] },
    { text: '${title}の続刊、もう完結してるよ。追いつける気する？', tags: ['book', 'manga'] },
    { text: '栞が1巻の序章に刺さったまま${months}ヶ月。', tags: ['book'] },
    { text: 'シーズン3まで出てるのに1話も見てないの、才能だよ。', tags: ['anime'] },
    { text: '劇場版が出たって知ってる？本編まだだけど。', tags: ['anime', 'movie'] },
  ],
  terminal: [
    { text: '積みの域を超えた。これはコレクションと呼ぶべき。', tags: ['all'] },
    { text: '中古相場、買値より下がってるかもよ。', tags: ['all'] },
    { text: '${title}を知ってる人間が周りから絶滅しつつある。', tags: ['all'] },
    { text: 'もう"積み"じゃない。"負債"だよこれ。', tags: ['all'] },
    { text: 'DLC全部出てトロコンしてる人間が地球にいる。あなたは0時間。', tags: ['game'] },
    { text: 'もはや次世代機で動くか確認が必要な時代になった。', tags: ['game'] },
    { text: 'その本、図書館で借りれば無料だったやつでは？', tags: ['book', 'manga'] },
    { text: '読んでないのに「面白いよ」って人に薦めたことある？', tags: ['book', 'manga'] },
    { text: '続編映画が公開されて、元の作品が"前日譚"になってる。', tags: ['movie'] },
    { text: '声優が変わってるアニメ、気づいてすら居なかったでしょ。', tags: ['anime'] },
  ],
  dead: [
    { text: 'おめでとう。${title}は永眠しました。享年${days}日。', tags: ['all'] },
    { text: '殿堂入りおめでとう。二度と起動しないと思う。', tags: ['all'] },
    { text: '${price}円でお焚き上げしました。合掌。', tags: ['all'] },
    { text: 'もはや考古学の領域。研究者に寄贈を検討して。', tags: ['all'] },
    { text: 'そのゲーム、もうオンラインサービス終了してない？確認して。', tags: ['game'] },
    { text: 'パッケージが日焼けし始めたら本物の積みゲーマー。', tags: ['game'] },
    { text: '本の紙、黄ばんでない？匂い嗅いでみて。', tags: ['book'] },
    { text: 'その巻だけ背表紙の色が新品のまま。一目でわかる。', tags: ['manga'] },
    { text: '続編3作公開されて、元作品がクラシック扱いになってる。', tags: ['movie'] },
    { text: 'そのアニメの監督、次回作もう完成してるよ。', tags: ['anime'] },
  ],
}

interface RoastVars {
  title: string
  price: number
  days: number
  months: number
  per_day: number
  fresh_months: number
  undone: number
}

function applyVars(text: string, vars: RoastVars): string {
  return text
    .replace(/\$\{title\}/g, vars.title)
    .replace(/\$\{price\}/g, vars.price.toLocaleString())
    .replace(/\$\{days\}/g, String(vars.days))
    .replace(/\$\{months\}/g, String(Math.floor(vars.months)))
    .replace(/\$\{per_day\}/g, String(Math.round(vars.per_day)))
    .replace(/\$\{fresh_months\}/g, String(vars.fresh_months))
    .replace(/\$\{undone\}/g, String(vars.undone))
}

export function pickRoast(
  level: ScoreLevel,
  contentType: ContentType,
  vars: RoastVars
): string {
  const pool = ROAST_LINES[level].filter((r) => {
    if (!r.tags.includes('all') && !r.tags.includes(contentType)) return false
    if (vars.per_day === 0 && r.text.includes('${per_day}')) return false
    if (vars.undone === 0 && r.text.includes('${undone}')) return false
    return true
  })
  const candidates = pool.length > 0 ? pool : ROAST_LINES[level]
  const line = candidates[Math.floor(Math.random() * candidates.length)]
  return applyVars(line.text, vars)
}
