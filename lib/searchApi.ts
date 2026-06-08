export type SearchResult = {
  title: string
  releaseDate: string
  coverImageUrl: string
  platform?: string
}

export async function searchByType(query: string, type: string): Promise<SearchResult[]> {
  if (!query) return []
  const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&type=${encodeURIComponent(type)}`)
  if (!res.ok) return []
  return res.json()
}

export async function searchGames(query: string):  Promise<SearchResult[]> { return searchByType(query, 'game') }
export async function searchMovies(query: string): Promise<SearchResult[]> { return searchByType(query, 'movie') }
export async function searchAnime(query: string):  Promise<SearchResult[]> { return searchByType(query, 'anime') }
export async function searchBooks(query: string):  Promise<SearchResult[]> { return searchByType(query, 'book') }
