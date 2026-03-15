import { TOTAL_SOURCES } from '../hooks/useSearch'

interface Props {
  completedCount: number
  isLoading: boolean
  resultCount: number
}

export default function SearchCounter({ completedCount, isLoading, resultCount }: Props) {
  if (!isLoading && completedCount === 0) return null

  return (
    <div className="flex items-center gap-2.5 mb-8 text-sm text-[var(--text-3)]">
      {isLoading ? (
        <>
          <svg
            className="w-3.5 h-3.5 animate-spin text-accent-soft flex-shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span>
            Searching {completedCount} of {TOTAL_SOURCES} sources
            {resultCount > 0 && (
              <span className="text-[var(--text-2)]"> · {resultCount} found</span>
            )}
          </span>
        </>
      ) : (
        <span>
          {TOTAL_SOURCES} sources searched ·{' '}
          <span className="text-[var(--text-2)] font-medium">
            {resultCount} {resultCount === 1 ? 'book' : 'books'} found
          </span>
        </span>
      )}
    </div>
  )
}
