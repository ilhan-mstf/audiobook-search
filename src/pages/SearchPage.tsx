import { useState, useEffect } from 'react'
import { useSearch } from '../hooks/useSearch'
import SearchCounter from '../components/SearchCounter'
import BookCard from '../components/BookCard'

const DEFAULT_TITLE = 'Audiobook Search — Find Free & Paid Audiobooks Across All Platforms'

const EXAMPLE_SEARCHES = ['Sherlock Holmes', 'Dune', 'Sapiens', 'Jane Eyre', 'The Hobbit']

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const { results, completedCount, isLoading, search, reset } = useSearch()

  const hasSearched = completedCount > 0 || isLoading

  // Run search from URL ?q= on first load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const q = params.get('q')
    if (q) {
      setQuery(q)
      search(q)
      document.title = `"${q}" — Audiobook Search`
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function runSearch(term: string) {
    search(term)
    document.title = `"${term}" — Audiobook Search`
    const url = new URL(window.location.href)
    url.searchParams.set('q', term)
    window.history.pushState({}, '', url)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (query.trim()) runSearch(query)
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value)
    if (!e.target.value.trim()) {
      reset()
      document.title = DEFAULT_TITLE
      window.history.pushState({}, '', '/')
    }
  }

  function handleExample(term: string) {
    setQuery(term)
    runSearch(term)
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Sticky search header (after search) */}
      {hasSearched && (
        <div className="sticky top-0 z-10 bg-white border-b border-gray-100 shadow-sm">
          <div className="max-w-2xl mx-auto px-4 py-3">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="text"
                value={query}
                onChange={handleChange}
                placeholder="Search by title or author..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50"
              />
              <button
                type="submit"
                disabled={!query.trim() || isLoading}
                className="px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 disabled:opacity-40 transition-colors"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Landing hero (before search) */}
      {!hasSearched && (
        <div className="flex flex-col items-center justify-center min-h-screen px-4 pb-24">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600 mb-6 shadow-lg shadow-indigo-200">
              <span className="text-3xl">🎧</span>
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-3 tracking-tight">
              Audiobook Search
            </h1>
            <p className="text-lg text-gray-400 max-w-sm mx-auto">
              Find where any audiobook is available — free, library, or paid — all at once.
            </p>
          </div>

          {/* Search bar */}
          <form onSubmit={handleSubmit} className="w-full max-w-xl flex gap-2 mb-5">
            <input
              type="text"
              value={query}
              onChange={handleChange}
              placeholder="Search by title or author..."
              autoFocus
              className="flex-1 px-5 py-4 rounded-2xl border border-gray-200 shadow-sm text-base outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
            />
            <button
              type="submit"
              disabled={!query.trim()}
              className="px-6 py-4 bg-indigo-600 text-white rounded-2xl font-medium hover:bg-indigo-700 disabled:opacity-40 transition-colors shadow-sm"
            >
              Search
            </button>
          </form>

          {/* Example chips */}
          <div className="flex flex-wrap justify-center gap-2">
            <span className="text-sm text-gray-400 mr-1 self-center">Try:</span>
            {EXAMPLE_SEARCHES.map((term) => (
              <button
                key={term}
                onClick={() => handleExample(term)}
                className="px-3 py-1.5 rounded-full border border-gray-200 bg-white text-sm text-gray-500 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {hasSearched && (
        <div className="max-w-2xl mx-auto px-4 pt-6 pb-16">
          <SearchCounter
            completedCount={completedCount}
            isLoading={isLoading}
            resultCount={results.length}
          />

          {results.length === 0 && !isLoading && (
            <div className="text-center mt-24">
              <p className="text-4xl mb-3">📭</p>
              <p className="text-gray-500 font-medium">No audiobooks found for "{query}"</p>
              <p className="text-gray-400 text-sm mt-1">Try a different title or author name</p>
            </div>
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
