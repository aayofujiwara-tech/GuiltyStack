export type SearchResult = {
  title: string
  releaseDate: string
  coverImageUrl: string
  platform?: string
}

export async function searchGames(query: string): Promise<SearchResult[]> {
  if (!query) return []
  const key = process.env.NEXT_PUBLIC_RAWG_API_KEY
  const res = await fetch(
    `https://api.rawg.io/api/games?key=${key}&search=${encodeURIComponent(query)}&page_size=5`
  )
  const data = await res.json()
  return (data.results ?? []).map((g: { name: string; released?: string; background_image?: string }) => ({
    title: g.name,
    releaseDate: g.released ?? '',
    coverImageUrl: g.background_image ?? '',
  }))
}

export async function searchMovies(query: string): Promise<SearchResult[]> {
  if (!query) return []
  const key = process.env.NEXT_PUBLIC_TMDB_API_KEY
  const res = await fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=${key}&query=${encodeURIComponent(query)}&language=ja-JP`
  )
  const data = await res.json()
  return (data.results ?? []).slice(0, 5).map((m: { title: string; release_date?: string; poster_path?: string }) => ({
    title: m.title,
    releaseDate: m.release_date ?? '',
    coverImageUrl: m.poster_path
      ? `https://image.tmdb.org/t/p/w500${m.poster_path}`
      : '',
  }))
}

export async function searchAnime(query: string): Promise<SearchResult[]> {
  if (!query) return []
  const key = process.env.NEXT_PUBLIC_TMDB_API_KEY
  const res = await fetch(
    `https://api.themoviedb.org/3/search/tv?api_key=${key}&query=${encodeURIComponent(query)}&language=ja-JP`
  )
  const data = await res.json()
  return (data.results ?? []).slice(0, 5).map((t: { name: string; first_air_date?: string; poster_path?: string }) => ({
    title: t.name,
    releaseDate: t.first_air_date ?? '',
    coverImageUrl: t.poster_path
      ? `https://image.tmdb.org/t/p/w500${t.poster_path}`
      : '',
  }))
}

export async function searchBooks(query: string): Promise<SearchResult[]> {
  if (!query) return []
  const res = await fetch(
    `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=5&language=jpn`
  )
  const data = await res.json()
  return (data.docs ?? []).slice(0, 5).map((b: { title: string; first_publish_year?: number; cover_i?: number }) => ({
    title: b.title,
    releaseDate: b.first_publish_year ? `${b.first_publish_year}-01-01` : '',
    coverImageUrl: b.cover_i
      ? `https://covers.openlibrary.org/b/id/${b.cover_i}-M.jpg`
      : '',
  }))
}

export async function searchByType(query: string, type: string): Promise<SearchResult[]> {
  switch (type) {
    case 'game':  return searchGames(query)
    case 'movie': return searchMovies(query)
    case 'anime': return searchAnime(query)
    case 'book':
    case 'manga': return searchBooks(query)
    default:      return []
  }
}
