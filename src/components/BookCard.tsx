import type { Book, BookSource } from '../types/book'
import SourceBadge from './SourceBadge'

const CONFIRMED = new Set([
  'librivox', 'internet_archive', 'openlibrary', 'apple_books', 'google_play',
])

const GRADIENTS = [
  ['#7c3aed','#4338ca'],
  ['#be185d','#9d174d'],
  ['#b45309','#92400e'],
  ['#0e7490','#164e63'],
  ['#047857','#065f46'],
  ['#1d4ed8','#1e3a8a'],
  ['#7c3aed','#9d174d'],
]

function formatDuration(s: number) {
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

function Cover({ book }: { book: Book }) {
  const [from, to] = GRADIENTS[book.title.charCodeAt(0) % GRADIENTS.length]

  if (book.coverUrl) {
    return (
      <img
        src={book.coverUrl}
        alt={book.title}
        className="flex-shrink-0 rounded-xl object-cover shadow-lg"
        style={{ width: 60, height: 80 }}
      />
    )
  }

  return (
    <div
      className="flex-shrink-0 rounded-xl flex items-center justify-center shadow-lg"
      style={{ width: 60, height: 80, background: `linear-gradient(160deg,${from},${to})` }}
    >
      <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 22, fontWeight: 700 }}>
        {book.title.charAt(0).toUpperCase()}
      </span>
    </div>
  )
}

export default function BookCard({ book }: { book: Book }) {
  const confirmed   = book.sources.filter((s) => CONFIRMED.has(s.sourceName))
  const suggestions = book.sources.filter((s) => !CONFIRMED.has(s.sourceName))
  const free        = confirmed.filter((s) => s.isFree)
  const paid        = confirmed.filter((s) => !s.isFree)

  return (
    <article className="book-card flex gap-4 p-4">
      <Cover book={book} />

      <div className="flex-1 min-w-0">
        {/* Title + author */}
        <h2
          className="font-bold leading-snug line-clamp-2 mb-0.5"
          style={{ fontSize: 15, color: 'var(--text-1)' }}
        >
          {book.title}
        </h2>
        <p className="text-sm mb-2.5 truncate" style={{ color: 'var(--text-2)' }}>
          {book.author}
        </p>

        {/* Meta */}
        <div className="flex items-center gap-1.5 mb-3" style={{ color: 'var(--text-4)', fontSize: 12 }}>
          {book.durationSeconds && (
            <span className="flex items-center gap-1">
              <ClockIcon />
              {formatDuration(book.durationSeconds)}
            </span>
          )}
          {book.durationSeconds && book.genres[0] && <span>·</span>}
          {book.genres[0] && <span className="truncate">{book.genres[0]}</span>}
        </div>

        {/* Confirmed sources */}
        {confirmed.length > 0 && (
          <div className="mb-2.5">
            <p className="mb-1.5" style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Available on
            </p>
            <div className="flex flex-wrap gap-1.5">
              {[...free, ...paid].map((s) => (
                <SourceBadge key={s.sourceName} source={s} />
              ))}
            </div>
          </div>
        )}

        {/* Affiliate suggestions */}
        {suggestions.length > 0 && (
          <div>
            <p className="mb-1.5" style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Also search on
            </p>
            <div className="flex flex-wrap gap-1.5">
              {suggestions.map((s: BookSource) => (
                <SourceBadge key={s.sourceName} source={s} muted />
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  )
}

function ClockIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M6 3.5V6l1.5 1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}
