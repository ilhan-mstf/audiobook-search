import type { Book, BookSource } from '../types/book'

function encodeQuery(title: string, author: string): string {
  return encodeURIComponent(`${title} ${author}`)
}

export function buildAffiliateSource(
  title: string,
  author: string
): BookSource[] {
  const q = encodeQuery(title, author)

  return [
    {
      sourceName: 'audible',
      isFree: false,
      priceUsd: null,
      narrator: null,
      sourceUrl: `https://www.audible.com/search?keywords=${q}`,
      audioUrl: null,
      affiliateUrl: `https://www.audible.com/search?keywords=${q}`,
    },
    {
      sourceName: 'scribd',
      isFree: false,
      priceUsd: null,
      narrator: null,
      sourceUrl: `https://www.scribd.com/search?query=${q}`,
      audioUrl: null,
      affiliateUrl: `https://www.scribd.com/search?query=${q}`,
    },
    {
      sourceName: 'spotify',
      isFree: false,
      priceUsd: null,
      narrator: null,
      sourceUrl: `https://open.spotify.com/search/${q}/audiobooks`,
      audioUrl: null,
      affiliateUrl: `https://open.spotify.com/search/${q}/audiobooks`,
    },
    {
      sourceName: 'libro_fm',
      isFree: false,
      priceUsd: null,
      narrator: null,
      sourceUrl: `https://libro.fm/search?q=${q}`,
      audioUrl: null,
      affiliateUrl: `https://libro.fm/search?q=${q}`,
    },
    {
      sourceName: 'chirp',
      isFree: false,
      priceUsd: null,
      narrator: null,
      sourceUrl: `https://www.chirpbooks.com/search?q=${q}`,
      audioUrl: null,
      affiliateUrl: `https://www.chirpbooks.com/search?q=${q}`,
    },
    {
      sourceName: 'kobo',
      isFree: false,
      priceUsd: null,
      narrator: null,
      sourceUrl: `https://www.kobo.com/search?query=${q}&fcsearchfield=Title`,
      audioUrl: null,
      affiliateUrl: `https://www.kobo.com/search?query=${q}&fcsearchfield=Title`,
    },
  ]
}

export function buildLibrarySource(title: string, author: string): BookSource[] {
  const q = encodeQuery(title, author)

  return [
    {
      sourceName: 'libby',
      isFree: true,
      priceUsd: null,
      narrator: null,
      sourceUrl: `https://libbyapp.com/search/nearby/search/query-${encodeURIComponent(title)}/page-1`,
      audioUrl: null,
      affiliateUrl: null,
    },
    {
      sourceName: 'hoopla',
      isFree: true,
      priceUsd: null,
      narrator: null,
      sourceUrl: `https://www.hoopladigital.com/search?q=${q}&type=AUDIOBOOK`,
      audioUrl: null,
      affiliateUrl: null,
    },
  ]
}

// Placeholder book shape for affiliate-only results (no API data)
export function buildAffiliatePlaceholder(title: string, author: string): Book {
  return {
    id: `${title}-${author}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, ''),
    title,
    author,
    description: null,
    language: 'en',
    durationSeconds: null,
    genres: [],
    coverUrl: null,
    sources: [
      ...buildAffiliateSource(title, author),
      ...buildLibrarySource(title, author),
    ],
  }
}
