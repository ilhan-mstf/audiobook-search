import type { Book, BookSource } from '../types/book'

interface OLDoc {
  key: string
  title: string
  author_name?: string[]
  first_publish_year?: number
  subject?: string[]
  language?: string[]
  ia?: string[]
  cover_i?: number
}

interface OLResponse {
  docs: OLDoc[]
}

function makeId(title: string, author: string): string {
  return `${title}-${author}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export async function search(query: string): Promise<Book[]> {
  const params = new URLSearchParams({
    q: query,
    fields: 'key,title,author_name,first_publish_year,subject,language,ia,cover_i',
    limit: '10',
  })

  const res = await fetch(`https://openlibrary.org/search.json?${params}`)
  if (!res.ok) return []

  const data: OLResponse = await res.json()
  const docs = data?.docs ?? []

  // only include results that have an Internet Archive audio copy
  return docs
    .filter((doc) => doc.ia && doc.ia.length > 0)
    .map((doc): Book => {
      const author = doc.author_name?.[0] ?? 'Unknown'
      const iaId = doc.ia![0]
      const source: BookSource = {
        sourceName: 'openlibrary',
        isFree: true,
        priceUsd: null,
        narrator: null,
        sourceUrl: `https://openlibrary.org${doc.key}`,
        audioUrl: `https://archive.org/details/${iaId}`,
        affiliateUrl: null,
      }
      return {
        id: makeId(doc.title, author),
        title: doc.title,
        author,
        description: null,
        language: doc.language?.[0] ?? 'en',
        durationSeconds: null,
        genres: (doc.subject ?? []).slice(0, 3),
        coverUrl: doc.cover_i
          ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
          : null,
        sources: [source],
      }
    })
}
