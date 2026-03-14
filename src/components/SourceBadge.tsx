import type { BookSource } from '../types/book'

const SOURCE_LABELS: Record<string, string> = {
  librivox: 'LibriVox',
  internet_archive: 'Internet Archive',
  openlibrary: 'Open Library',
  apple_books: 'Apple Books',
  google_play: 'Google Play',
  audible: 'Audible',
  scribd: 'Scribd',
  spotify: 'Spotify',
  libro_fm: 'Libro.fm',
  chirp: 'Chirp',
  kobo: 'Kobo',
  libby: 'Libby',
  hoopla: 'Hoopla',
}

interface Props {
  source: BookSource
  muted?: boolean
}

export default function SourceBadge({ source, muted = false }: Props) {
  const label = SOURCE_LABELS[source.sourceName] ?? source.sourceName
  const url = source.affiliateUrl ?? source.sourceUrl
  const isLibrary = source.sourceName === 'libby' || source.sourceName === 'hoopla'

  const price =
    source.isFree || isLibrary
      ? isLibrary
        ? 'Library'
        : 'Free'
      : source.priceUsd != null
        ? `$${source.priceUsd.toFixed(2)}`
        : 'View'

  const colorClass = muted
    ? 'bg-white text-gray-400 border-gray-200 hover:text-gray-600 hover:border-gray-300'
    : source.isFree || isLibrary
      ? isLibrary
        ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
        : 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium transition-colors ${colorClass}`}
    >
      <span>{label}</span>
      <span className="opacity-60">·</span>
      <span>{price}</span>
    </a>
  )
}
