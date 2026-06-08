import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const q    = searchParams.get('q')
  const type = searchParams.get('type')

  if (!q || !type) {
    return NextResponse.json({ error: 'Missing params' }, { status: 400 })
  }

  try {
    const results = await fetchByType(q, type)
    return NextResponse.json(results)
  } catch {
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}

type SearchResult = {
  title: string
  releaseDate: string
  coverImageUrl: string
  platform?: string
}

async function fetchByType(q: string, type: string): Promise<SearchResult[]> {
  switch (type) {
    case 'game':  return fetchGames(q)
    case 'movie': return fetchMovies(q)
    case 'anime': return fetchAnime(q)
    case 'book':
    case 'manga': return fetchBooks(q)
    default:      return []
  }
}

async function fetchGames(q: string): Promise<SearchResult[]> {
  const key = process.env.RAWG_API_KEY
  const res  = await fetch(
    `https://api.rawg.io/api/games?key=${key}&search=${encodeURIComponent(q)}&page_size=5`
  )
  const data = await res.json()
  return (data.results ?? []).map((g: { name: string; released?: string; background_image?: string }) => ({
    title:         g.name,
    releaseDate:   g.released ?? '',
    coverImageUrl: g.background_image ?? '',
  }))
}

async function fetchMovies(q: string): Promise<SearchResult[]> {
  const key = process.env.TMDB_API_KEY
  const res  = await fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=${key}&query=${encodeURIComponent(q)}&language=ja-JP`
  )
  const data = await res.json()
  return (data.results ?? []).slice(0, 5).map((m: { title: string; release_date?: string; poster_path?: string }) => ({
    title:         m.title,
    releaseDate:   m.release_date ?? '',
    coverImageUrl: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : '',
  }))
}

async function fetchAnime(q: string): Promise<SearchResult[]> {
  const key = process.env.TMDB_API_KEY
  const res  = await fetch(
    `https://api.themoviedb.org/3/search/tv?api_key=${key}&query=${encodeURIComponent(q)}&language=ja-JP`
  )
  const data = await res.json()
  return (data.results ?? []).slice(0, 5).map((t: { name: string; first_air_date?: string; poster_path?: string }) => ({
    title:         t.name,
    releaseDate:   t.first_air_date ?? '',
    coverImageUrl: t.poster_path ? `https://image.tmdb.org/t/p/w500${t.poster_path}` : '',
  }))
}

async function fetchBooks(q: string): Promise<SearchResult[]> {
  const res  = await fetch(
    `https://openlibrary.org/search.json?q=${encodeURIComponent(q)}&limit=5&language=jpn`
  )
  const data = await res.json()
  return (data.docs ?? []).slice(0, 5).map((b: { title: string; first_publish_year?: number; cover_i?: number }) => ({
    title:         b.title,
    releaseDate:   b.first_publish_year ? `${b.first_publish_year}-01-01` : '',
    coverImageUrl: b.cover_i ? `https://covers.openlibrary.org/b/id/${b.cover_i}-M.jpg` : '',
  }))
}
