import type { Book, BookSource } from '../types/book'
import SourceBadge from './SourceBadge'

interface Props {
  book: Book
}

const CONFIRMED_SOURCES = new Set([
  'librivox',
  'internet_archive',
  'openlibrary',
  'apple_books',
  'google_play',
])

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

const GRADIENTS = [
  ['#7c3aed', '#4f46e5'],
  ['#db2777', '#9d174d'],
  ['#d97706', '#b45309'],
  ['#0891b2', '#0e7490'],
  ['#059669', '#047857'],
  ['#2563eb', '#1d4ed8'],
  ['#7c3aed', '#be185d'],
]

function CoverPlaceholder({ title }: { title: string }) {
  const [from, to] = GRADIENTS[title.charCodeAt(0) % GRADIENTS.length]
  return (
    <div
      className="w-16 h-20 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg"
      style={{ background: `linear-gradient(160deg, ${from}, ${to})` }}
    >
      <span className="text-white text-xl font-bold opacity-90">
        {title.charAt(0).toUpperCase()}
      </span>
    </div>
  )
}

export default function BookCard({ book }: Props) {
  const confirmedSources = book.sources.filter((s) => CONFIRMED_SOURCES.has(s.sourceName))
  const searchSources = book.sources.filter((s) => !CONFIRMED_SOURCES.has(s.sourceName))
  const freeSources = confirmedSources.filter((s) => s.isFree)
  const paidConfirmed = confirmedSources.filter((s) => !s.isFree)

  return (
    <div
      className="rounded-2xl p-4 flex gap-4 transition-all hover:scale-[1.01] cursor-default border"
      style={{
        background: 'rgba(255,255,255,0.04)',
        borderColor: 'rgba(255,255,255,0.07)',
      }}
    >
      {/* Cover */}
      <div className="flex-shrink-0 pt-0.5">
        {book.coverUrl ? (
          <img
            src={book.coverUrl}
            alt={book.title}
            className="w-16 h-20 object-cover rounded-xl shadow-lg"
          />
        ) : (
          <CoverPlaceholder title={book.title} />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h2 className="font-bold text-base leading-snug line-clamp-2 mb-0.5" style={{ color: '#f1f0f5' }}>
          {book.title}
        </h2>
        <p className="text-sm mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>{book.author}</p>

        {/* Meta */}
        <div className="flex items-center gap-2 text-xs mb-3" style={{ color: 'rgba(255,255,255,0.3)' }}>
          {book.durationSeconds && (
            <span className="flex items-center gap-1">
              <ClockIcon />
              {formatDuration(book.durationSeconds)}
            </span>
          )}
          {book.genres[0] && (
            <>
              {book.durationSeconds && <span>·</span>}
              <span>{book.genres[0]}</span>
            </>
          )}
        </div>

        {/* Confirmed available on */}
        {confirmedSources.length > 0 && (
          <div className="mb-2.5">
            <p className="text-xs font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.25)' }}>
              Available on
            </p>
            <div className="flex flex-wrap gap-1.5">
              {freeSources.map((s) => (
                <SourceBadge key={s.sourceName} source={s} />
              ))}
              {paidConfirmed.map((s) => (
                <SourceBadge key={s.sourceName} source={s} />
              ))}
            </div>
          </div>
        )}

        {/* Affiliate search links */}
        {searchSources.length > 0 && (
          <div>
            <p className="text-xs font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.25)' }}>
              Also search on
            </p>
            <div className="flex flex-wrap gap-1.5">
              {searchSources.map((s: BookSource) => (
                <SourceBadge key={s.sourceName} source={s} muted />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function ClockIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
      <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M6 3.5V6l1.5 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}
