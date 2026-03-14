import { TOTAL_SOURCES } from '../hooks/useSearch'

interface Props {
  completedCount: number
  isLoading: boolean
  resultCount: number
}

export default function SearchCounter({ completedCount, isLoading, resultCount }: Props) {
  if (!isLoading && completedCount === 0) return null

  return (
    <div className="flex items-center gap-2.5 mb-5" style={{ color: 'var(--text-3)', fontSize: 13 }}>
      {isLoading ? (
        <>
          <span className="flex gap-0.5">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="rounded-full animate-bounce"
                style={{
                  width: 5,
                  height: 5,
                  background: 'var(--accent-text)',
                  animationDelay: `${i * 0.12}s`,
                  animationDuration: '0.8s',
                }}
              />
            ))}
          </span>
          <span>
            Searching {completedCount} of {TOTAL_SOURCES} sources
            {resultCount > 0 && (
              <span style={{ color: 'var(--text-2)' }}> · {resultCount} found</span>
            )}
          </span>
        </>
      ) : (
        <span>
          {TOTAL_SOURCES} sources searched ·{' '}
          <span style={{ color: 'var(--text-2)', fontWeight: 500 }}>
            {resultCount} {resultCount === 1 ? 'book' : 'books'} found
          </span>
        </span>
      )}
    </div>
  )
}
