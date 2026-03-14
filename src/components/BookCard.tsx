import type { Book } from '../types/book'
import SourceBadge from './SourceBadge'

interface Props {
  book: Book
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

export default function BookCard({ book }: Props) {
  const freeSources = book.sources.filter((s) => s.isFree)
  const librarySources = book.sources.filter(
    (s) => s.sourceName === 'libby' || s.sourceName === 'hoopla'
  )
  const paidSources = book.sources.filter(
    (s) => !s.isFree && s.sourceName !== 'libby' && s.sourceName !== 'hoopla'
  )

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex gap-4">
      {/* Cover */}
      <div className="flex-shrink-0">
        {book.coverUrl ? (
          <img
            src={book.coverUrl}
            alt={book.title}
            className="w-20 h-20 object-cover rounded-xl"
          />
        ) : (
          <div className="w-20 h-20 bg-indigo-50 rounded-xl flex items-center justify-center text-2xl">
            🎧
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h2 className="font-semibold text-gray-900 text-base leading-snug truncate">
          {book.title}
        </h2>
        <p className="text-sm text-gray-500 mb-1">{book.author}</p>

        {/* Meta */}
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
          {book.durationSeconds && (
            <span>{formatDuration(book.durationSeconds)}</span>
          )}
          {book.genres[0] && (
            <>
              {book.durationSeconds && <span>·</span>}
              <span>{book.genres[0]}</span>
            </>
          )}
        </div>

        {/* Sources */}
        <div className="flex flex-wrap gap-2">
          {freeSources.map((s) => (
            <SourceBadge key={s.sourceName} source={s} />
          ))}
          {librarySources.map((s) => (
            <SourceBadge key={s.sourceName} source={s} />
          ))}
          {paidSources.map((s) => (
            <SourceBadge key={s.sourceName} source={s} />
          ))}
        </div>
      </div>
    </div>
  )
}
