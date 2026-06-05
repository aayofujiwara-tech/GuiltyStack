export type ContentType = 'game' | 'book' | 'manga' | 'movie' | 'anime'
export type ContentStatus = 'unplayed' | 'in_progress' | 'completed' | 'abandoned'
export type FreshnessSource = 'manual' | 'api'

export interface Content {
  id: string
  user_id: string
  title: string
  type: ContentType
  price: number
  purchased_at: string
  release_date: string
  freshness_source: FreshnessSource
  platform: string | null
  cover_image_url: string | null
  status: ContentStatus
  tags: string[] | null
  created_at: string
  updated_at: string
}

export interface RoastHistory {
  id: string
  content_id: string
  user_id: string
  roast_text: string
  score_at: number
  shown_at: string
}

export interface ContentWithScore extends Content {
  regretScore: number
  dayScore: number
  digestScore: number
  priceScore: number
  freshnessScore: number
  days: number
  freshMonths: number
}

export interface SameTypeStats {
  total: number
  completed: number
}
