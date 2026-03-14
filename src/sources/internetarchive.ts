import type { Book, BookSource } from '../types/book'

interface IADoc {
  identifier: string
  title?: string
  creator?: string | string[]
  description?: string | string[]
  subject?: string | string[]
  language?: string | string[]
  runtime?: string
  downloads?: number
}

interface IAResponse {
  response: {
    docs: IADoc[]
  }
}

function toArray<T>(val: T | T[] | undefined): T[] {
  if (!val) return []
  return Array.isArray(val) ? val : [val]
}

function parseDuration(runtime: string | undefined): number | null {
  if (!runtime) return null
  // formats: "HH:MM:SS" or "MM:SS"
  const parts = runtime.split(':').map(Number)
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2]
  if (parts.length === 2) return parts[0] * 60 + parts[1]
  return null
}

function makeId(title: string, author: string): string {
  return `${title}-${author}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export async function search(query: string): Promise<Book[]> {
  const params = new URLSearchParams({
    q: `(title:"${query}" OR creator:"${query}") AND mediatype:audio AND subject:audiobook`,
    'fl[]': 'identifier,title,creator,description,subject,language,runtime',
    'sort[]': 'downloads desc',
    rows: '10',
    page: '1',
    output: 'json',
  })

  const res = await fetch(`https://archive.org/advancedsearch.php?${params}`)
  if (!res.ok) return []

  const data: IAResponse = await res.json()
  const docs = data?.response?.docs ?? []

  return docs
    .filter((doc) => doc.title)
    .map((doc): Book => {
      const title = doc.title!
      const author = toArray(doc.creator)[0] ?? 'Unknown'
      const source: BookSource = {
        sourceName: 'internet_archive',
        isFree: true,
        priceUsd: null,
        narrator: null,
        sourceUrl: `https://archive.org/details/${doc.identifier}`,
        audioUrl: `https://archive.org/details/${doc.identifier}`,
        affiliateUrl: null,
      }
      return {
        id: makeId(title, author),
        title,
        author,
        description: toArray(doc.description)[0] ?? null,
        language: toArray(doc.language)[0] ?? 'en',
        durationSeconds: parseDuration(doc.runtime),
        genres: toArray(doc.subject).slice(0, 3),
        coverUrl: `https://archive.org/services/img/${doc.identifier}`,
        sources: [source],
      }
    })
}
