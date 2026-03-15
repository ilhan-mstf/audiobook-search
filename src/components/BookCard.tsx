import type { Book, BookSource } from '../types/book'
import SourceBadge from './SourceBadge'

const CONFIRMED = new Set([
  'librivox', 'internet_archive', 'openlibrary', 'apple_books', 'google_play',
])

const GRADIENTS = [
  ['#f05635','#d9432a'],
  ['#be185d','#9d174d'],
  ['#b45309','#92400e'],
  ['#0e7490','#164e63'],
  ['#047857','#065f46'],
  ['#1d4ed8','#1e3a8a'],
  ['#f05635','#be185d'],
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
        className="flex-shrink-0 w-20 h-[106px] rounded-xl object-cover shadow-lg"
      />
    )
  }

  return (
    <div
      className="flex-shrink-0 w-20 h-[106px] rounded-xl flex items-center justify-center shadow-lg"
      style={{ background: `linear-gradient(160deg,${from},${to})` }}
    >
      <span className="text-white/85 text-2xl font-bold">
        {book.title.charAt(0).toUpperCase()}
      </span>
    </div>
  )
}

const sectionLabel = 'mb-2 text-[11px] font-semibold text-[var(--text-3)] uppercase tracking-[0.08em]'

export default function BookCard({ book }: { book: Book }) {
  const confirmed   = book.sources.filter((s) => CONFIRMED.has(s.sourceName))
  const suggestions = book.sources.filter((s) => !CONFIRMED.has(s.sourceName))
  const free        = confirmed.filter((s) => s.isFree)
  const paid        = confirmed.filter((s) => !s.isFree)

  return (
    <article className="flex gap-6 p-6 rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] hover:border-[var(--border-strong)] transition-colors duration-200">
      <Cover book={book} />

      <div className="flex-1 min-w-0 flex flex-col">

        {/* Title + author */}
        <div className="mb-2">
          <h2 className="text-[18px] font-semibold tracking-[-0.01em] leading-snug line-clamp-2 text-ink mb-1">
            {book.title}
          </h2>
          <p className="text-[15px] text-[var(--text-2)]">
            {book.author}
          </p>
        </div>

        {/* Meta */}
        {(book.durationSeconds || book.genres[0]) && (
          <div className="flex items-center gap-2 mb-3 text-[var(--text-4)] text-xs">
            {book.durationSeconds && (
              <span className="flex items-center gap-1">
                <ClockIcon />
                {formatDuration(book.durationSeconds)}
              </span>
            )}
            {book.durationSeconds && book.genres[0] && <span>·</span>}
            {book.genres[0] && <span>{book.genres[0]}</span>}
          </div>
        )}

        {/* Description */}
        {book.description && (
          <p className="text-[13px] text-[var(--text-3)] line-clamp-2 leading-relaxed mb-4">
            {book.description}
          </p>
        )}

        {/* Badges — pushed to bottom */}
        <div className="flex flex-col gap-3 mt-auto pt-1">

          {/* Confirmed sources */}
          {confirmed.length > 0 && (
            <div>
              <p className={sectionLabel}>Available on</p>
              <div className="flex flex-wrap gap-2">
                {[...free, ...paid].map((s) => (
                  <SourceBadge key={s.sourceName} source={s} />
                ))}
              </div>
            </div>
          )}

          {/* Affiliate suggestions */}
          {suggestions.length > 0 && (
            <div>
              <p className={sectionLabel}>Also search on</p>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((s: BookSource) => (
                  <SourceBadge key={s.sourceName} source={s} muted />
                ))}
              </div>
            </div>
          )}
        </div>
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
