import type { Book, BookSource } from '../types/book'

interface ITunesResult {
  collectionId: number
  collectionName: string
  artistName: string
  collectionPrice?: number
  currency?: string
  artworkUrl100?: string
  primaryGenreName?: string
  trackTimeMillis?: number
  collectionViewUrl: string
  description?: string
}

interface ITunesResponse {
  results: ITunesResult[]
}

function makeId(title: string, author: string): string {
  return `${title}-${author}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export async function search(query: string): Promise<Book[]> {
  const params = new URLSearchParams({
    term: query,
    media: 'audiobook',
    limit: '10',
    country: 'us',
  })

  const res = await fetch(`https://itunes.apple.com/search?${params}`)
  if (!res.ok) return []

  const data: ITunesResponse = await res.json()
  const results = data?.results ?? []

  return results.map((item): Book => {
    const source: BookSource = {
      sourceName: 'apple_books',
      isFree: false,
      priceUsd: item.collectionPrice ?? null,
      narrator: null,
      sourceUrl: item.collectionViewUrl,
      audioUrl: null,
      affiliateUrl: item.collectionViewUrl,
    }
    return {
      id: makeId(item.collectionName, item.artistName),
      title: item.collectionName,
      author: item.artistName,
      description: item.description ?? null,
      language: 'en',
      durationSeconds: item.trackTimeMillis
        ? Math.round(item.trackTimeMillis / 1000)
        : null,
      genres: item.primaryGenreName ? [item.primaryGenreName] : [],
      coverUrl: item.artworkUrl100?.replace('100x100', '400x400') ?? null,
      sources: [source],
    }
  })
}
