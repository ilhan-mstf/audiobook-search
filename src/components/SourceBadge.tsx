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

  const price = source.isFree || isLibrary
    ? isLibrary ? 'Library' : 'Free'
    : source.priceUsd != null
      ? `$${source.priceUsd.toFixed(2)}`
      : 'View'

  if (muted) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all border"
        style={{
          background: 'rgba(255,255,255,0.03)',
          borderColor: 'rgba(255,255,255,0.08)',
          color: 'rgba(255,255,255,0.35)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'
          e.currentTarget.style.color = 'rgba(255,255,255,0.6)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
          e.currentTarget.style.color = 'rgba(255,255,255,0.35)'
        }}
      >
        {label}
      </a>
    )
  }

  // Free
  if (source.isFree && !isLibrary) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all border"
        style={{
          background: 'rgba(16,185,129,0.12)',
          borderColor: 'rgba(16,185,129,0.3)',
          color: '#34d399',
        }}
      >
        <span>{label}</span>
        <span className="opacity-50">·</span>
        <span>{price}</span>
      </a>
    )
  }

  // Library
  if (isLibrary) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all border"
        style={{
          background: 'rgba(59,130,246,0.12)',
          borderColor: 'rgba(59,130,246,0.3)',
          color: '#60a5fa',
        }}
      >
        <span>{label}</span>
        <span className="opacity-50">·</span>
        <span>{price}</span>
      </a>
    )
  }

  // Paid
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all border"
      style={{
        background: 'rgba(255,255,255,0.06)',
        borderColor: 'rgba(255,255,255,0.12)',
        color: 'rgba(255,255,255,0.7)',
      }}
    >
      <span>{label}</span>
      <span className="opacity-40">·</span>
      <span style={{ color: 'rgba(255,255,255,0.45)' }}>{price}</span>
    </a>
  )
}
