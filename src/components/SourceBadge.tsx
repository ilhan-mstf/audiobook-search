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

const base =
  'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium border no-underline transition-[filter] duration-150 whitespace-nowrap hover:brightness-110'

function variantClass(source: BookSource, muted: boolean): string {
  if (muted) {
    return 'bg-transparent border-[var(--border)] text-[var(--text-3)] text-[11px] hover:brightness-100 hover:text-[var(--text-2)] hover:border-[var(--border-strong)]'
  }
  const isLib = source.sourceName === 'libby' || source.sourceName === 'hoopla'
  if (source.isFree && !isLib) return 'bg-[var(--free-bg)] border-[var(--free-border)] text-free'
  if (isLib)                   return 'bg-[var(--lib-bg)] border-[var(--lib-border)] text-lib'
  /* paid */                   return 'bg-[var(--bg-surface)] border-[var(--border-strong)] text-[var(--text-2)]'
}

export default function SourceBadge({ source, muted = false }: Props) {
  const label = SOURCE_LABELS[source.sourceName] ?? source.sourceName
  const url   = source.affiliateUrl ?? source.sourceUrl
  const isLib = source.sourceName === 'libby' || source.sourceName === 'hoopla'

  const priceLabel = source.isFree || isLib
    ? isLib ? 'Library' : 'Free'
    : source.priceUsd != null
      ? `$${source.priceUsd.toFixed(2)}`
      : 'View'

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`${base} ${variantClass(source, muted)}`}
    >
      <span>{label}</span>
      {!muted && (
        <>
          <span className="opacity-35">·</span>
          <span>{priceLabel}</span>
        </>
      )}
    </a>
  )
}
