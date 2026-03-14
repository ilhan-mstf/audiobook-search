import { TOTAL_SOURCES } from '../hooks/useSearch'

interface Props {
  completedCount: number
  isLoading: boolean
  resultCount: number
}

export default function SearchCounter({ completedCount, isLoading, resultCount }: Props) {
  if (!isLoading && completedCount === 0) return null

  return (
    <div className="flex items-center gap-2.5 mb-5 text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
      {isLoading ? (
        <>
          <span className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </span>
          <span>
            Searched {completedCount} of {TOTAL_SOURCES} sources
            {resultCount > 0 && (
              <span style={{ color: 'rgba(255,255,255,0.6)' }}> · {resultCount} found</span>
            )}
          </span>
        </>
      ) : (
        <span>
          Searched {TOTAL_SOURCES} sources ·{' '}
          <span style={{ color: 'rgba(255,255,255,0.7)' }} className="font-medium">
            {resultCount} {resultCount === 1 ? 'book' : 'books'} found
          </span>
        </span>
      )}
    </div>
  )
}
