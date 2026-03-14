import type { Book, BookSource } from '../types/book'

interface GBVolumeInfo {
  title: string
  authors?: string[]
  description?: string
  categories?: string[]
  imageLinks?: { thumbnail?: string }
  language?: string
  infoLink: string
}

interface GBSaleInfo {
  saleability: string
  listPrice?: { amount: number; currencyCode: string }
  buyLink?: string
}

interface GBItem {
  id: string
  volumeInfo: GBVolumeInfo
  saleInfo?: GBSaleInfo
}

interface GBResponse {
  items?: GBItem[]
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
    printType: 'books',
    maxResults: '10',
  })

  const res = await fetch(
    `https://www.googleapis.com/books/v1/volumes?${params}`
  )
  if (!res.ok) return []

  const data: GBResponse = await res.json()
  const items = data?.items ?? []

  return items
    .filter(
      (item) =>
        item.saleInfo?.saleability === 'FOR_SALE' && item.saleInfo?.buyLink
    )
    .map((item): Book => {
      const { volumeInfo, saleInfo } = item
      const author = volumeInfo.authors?.[0] ?? 'Unknown'
      const source: BookSource = {
        sourceName: 'google_play',
        isFree: false,
        priceUsd: saleInfo?.listPrice?.amount ?? null,
        narrator: null,
        sourceUrl: saleInfo!.buyLink!,
        audioUrl: null,
        affiliateUrl: saleInfo!.buyLink!,
      }
      return {
        id: makeId(volumeInfo.title, author),
        title: volumeInfo.title,
        author,
        description: volumeInfo.description ?? null,
        language: volumeInfo.language ?? 'en',
        durationSeconds: null,
        genres: volumeInfo.categories ?? [],
        coverUrl: volumeInfo.imageLinks?.thumbnail?.replace('http:', 'https:') ?? null,
        sources: [source],
      }
    })
}
