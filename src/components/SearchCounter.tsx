import { TOTAL_SOURCES } from '../hooks/useSearch'

interface Props {
  completedCount: number
  isLoading: boolean
  resultCount: number
}

export default function SearchCounter({ completedCount, isLoading, resultCount }: Props) {
  if (!isLoading && completedCount === 0) return null

  return (
    <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
      {isLoading ? (
        <>
          <span className="inline-block w-3 h-3 rounded-full bg-indigo-400 animate-pulse" />
          <span>
            Searched {completedCount} of {TOTAL_SOURCES} sources
            {resultCount > 0 && ` · ${resultCount} found so far`}
          </span>
        </>
      ) : (
        <span>
          Searched {TOTAL_SOURCES} sources · {resultCount} book{resultCount !== 1 ? 's' : ''} found
        </span>
      )}
    </div>
  )
}
