import type { BookSource } from '../types/book'

const SOURCE_LABELS: Record<string, string> = {
  librivox:         'LibriVox',
  internet_archive: 'Internet Archive',
  openlibrary:      'Open Library',
  apple_books:      'Apple Books',
  google_play:      'Google Play',
  audible:          'Audible',
  scribd:           'Scribd',
  spotify:          'Spotify',
  libro_fm:         'Libro.fm',
  chirp:            'Chirp',
  kobo:             'Kobo',
  libby:            'Libby',
  hoopla:           'Hoopla',
}

interface Props {
  source: BookSource
  muted?: boolean
}

export default function SourceBadge({ source, muted = false }: Props) {
  const label  = SOURCE_LABELS[source.sourceName] ?? source.sourceName
  const url    = source.affiliateUrl ?? source.sourceUrl
  const isLib  = source.sourceName === 'libby' || source.sourceName === 'hoopla'

  const priceLabel = source.isFree || isLib
    ? isLib ? 'Library' : 'Free'
    : source.priceUsd != null
      ? `$${source.priceUsd.toFixed(2)}`
      : 'View'

  const cls = muted
    ? 'badge badge-muted'
    : source.isFree && !isLib
      ? 'badge badge-free'
      : isLib
        ? 'badge badge-library'
        : 'badge badge-paid'

  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className={cls}>
      <span>{label}</span>
      {!muted && (
        <>
          <span style={{ opacity: 0.35 }}>·</span>
          <span>{priceLabel}</span>
        </>
      )}
    </a>
  )
}
