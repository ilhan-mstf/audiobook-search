import type { Book, BookSource } from '../types/book'
import SourceBadge from './SourceBadge'

interface Props {
  book: Book
}

// Sources where we have API confirmation the book exists
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

// Gradient based on title for consistent per-book color
function getCoverGradient(title: string): string {
  const gradients = [
    'from-violet-400 to-indigo-500',
    'from-rose-400 to-pink-500',
    'from-amber-400 to-orange-500',
    'from-teal-400 to-cyan-500',
    'from-emerald-400 to-green-500',
    'from-blue-400 to-indigo-500',
    'from-fuchsia-400 to-purple-500',
  ]
  const idx = title.charCodeAt(0) % gradients.length
  return gradients[idx]
}

function CoverPlaceholder({ title }: { title: string }) {
  return (
    <div
      className={`w-20 h-24 rounded-xl bg-gradient-to-br ${getCoverGradient(title)} flex items-center justify-center flex-shrink-0`}
    >
      <span className="text-white text-2xl font-bold">
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
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5 flex gap-4">
      {/* Cover */}
      <div className="flex-shrink-0">
        {book.coverUrl ? (
          <img
            src={book.coverUrl}
            alt={book.title}
            className="w-20 h-24 object-cover rounded-xl"
          />
        ) : (
          <CoverPlaceholder title={book.title} />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h2 className="font-bold text-gray-900 text-base leading-snug line-clamp-2 mb-0.5">
          {book.title}
        </h2>
        <p className="text-sm text-gray-400 mb-2">{book.author}</p>

        {/* Meta */}
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
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

        {/* Confirmed sources */}
        {confirmedSources.length > 0 && (
          <div className="mb-3">
            <p className="text-xs font-medium text-gray-400 mb-1.5">Available on</p>
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
            <p className="text-xs font-medium text-gray-400 mb-1.5">Also search on</p>
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
