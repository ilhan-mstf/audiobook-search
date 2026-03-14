import type { Book, BookSource } from '../types/book'

interface LVAuthor {
  first_name: string
  last_name: string
}

interface LVSection {
  listen_url: string
}

interface LVBook {
  id: string
  title: string
  description: string
  language: string
  url_librivox: string
  totaltime: string
  totaltimesecs: number
  authors: LVAuthor[]
  sections: LVSection[]
  genres: Array<{ name: string }>
}

interface LVResponse {
  books: LVBook[]
}

function makeId(title: string, author: string): string {
  return `${title}-${author}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export async function search(query: string): Promise<Book[]> {
  const params = new URLSearchParams({
    title: `^${query}`,
    format: 'json',
    extended: '1',
    limit: '10',
    offset: '0',
  })

  const res = await fetch(
    `https://librivox.org/api/feed/audiobooks/?${params}`
  )
  if (!res.ok) return []

  const data: LVResponse = await res.json()
  const books = data?.books ?? []

  return books.map((book): Book => {
    const author = [book.authors?.[0]?.first_name, book.authors?.[0]?.last_name]
      .filter(Boolean)
      .join(' ') || 'Unknown'

    const source: BookSource = {
      sourceName: 'librivox',
      isFree: true,
      priceUsd: null,
      narrator: null,
      sourceUrl: book.url_librivox,
      audioUrl: book.sections?.[0]?.listen_url ?? null,
      affiliateUrl: null,
    }

    return {
      id: makeId(book.title, author),
      title: book.title,
      author,
      description: book.description ?? null,
      language: book.language ?? 'en',
      durationSeconds: book.totaltimesecs || null,
      genres: (book.genres ?? []).map((g) => g.name),
      coverUrl: null, // LibriVox has no cover images
      sources: [source],
    }
  })
}
