import { useState } from 'react'
import { useSearch } from '../hooks/useSearch'
import SearchCounter from '../components/SearchCounter'
import BookCard from '../components/BookCard'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const { results, completedCount, isLoading, search, reset } = useSearch()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (query.trim()) search(query)
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value)
    if (!e.target.value.trim()) reset()
  }

  const hasSearched = completedCount > 0 || isLoading

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className={`transition-all duration-500 ${hasSearched ? 'py-8' : 'pt-32 pb-12'}`}>
        <div className="max-w-2xl mx-auto px-4">
          {!hasSearched && (
            <>
              <h1 className="text-4xl font-bold text-gray-900 text-center mb-2">
                🎧 Audiobook Search
              </h1>
              <p className="text-gray-400 text-center mb-8">
                Search free and paid audiobooks across all platforms at once
              </p>
            </>
          )}

          {/* Search bar */}
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={handleChange}
              placeholder="Search by title or author..."
              autoFocus
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 shadow-sm text-base outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
            />
            <button
              type="submit"
              disabled={!query.trim() || isLoading}
              className="px-5 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-40 transition-colors"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Results */}
      {hasSearched && (
        <div className="max-w-2xl mx-auto px-4 pb-16">
          <SearchCounter
            completedCount={completedCount}
            isLoading={isLoading}
            resultCount={results.length}
          />

          {results.length === 0 && !isLoading && (
            <p className="text-center text-gray-400 mt-16">
              No audiobooks found for "{query}"
            </p>
          )}

          <div className="flex flex-col gap-3">
            {results.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
