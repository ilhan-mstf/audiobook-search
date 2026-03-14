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
    <div className="min-h-screen" style={{ background: '#0f0f13' }}>

      {/* Sticky search bar after search */}
      {hasSearched && (
        <div className="sticky top-0 z-10 border-b border-white/5 backdrop-blur-md" style={{ background: 'rgba(15,15,19,0.85)' }}>
          <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
            <span className="text-lg flex-shrink-0">🎧</span>
            <form onSubmit={handleSubmit} className="flex gap-2 flex-1">
              <input
                type="text"
                value={query}
                onChange={handleChange}
                placeholder="Search audiobooks..."
                className="flex-1 px-4 py-2 rounded-xl text-sm outline-none border text-white placeholder-white/30 focus:border-violet-500 transition-colors"
                style={{ background: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.1)' }}
              />
              <button
                type="submit"
                disabled={!query.trim() || isLoading}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-white disabled:opacity-30 transition-all"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}
              >
                Search
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Hero */}
      {!hasSearched && (
        <div className="flex flex-col items-center justify-center min-h-screen px-4 pb-20 relative overflow-hidden">
          {/* Background glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(124,58,237,0.15) 0%, transparent 70%)',
            }}
          />

          <div className="relative z-10 text-center w-full max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-8 border"
              style={{ background: 'rgba(124,58,237,0.15)', borderColor: 'rgba(124,58,237,0.3)', color: '#a78bfa' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse inline-block" />
              Search across 10+ audiobook platforms
            </div>

            <h1 className="text-6xl font-bold tracking-tight mb-4" style={{ color: '#f1f0f5', letterSpacing: '-0.03em' }}>
              Find any audiobook,<br />
              <span style={{ background: 'linear-gradient(135deg, #a78bfa, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                anywhere it exists.
              </span>
            </h1>

            <p className="text-lg mb-10" style={{ color: 'rgba(241,240,245,0.45)' }}>
              One search. See every platform — free, library, or paid.
            </p>

            {/* Search bar */}
            <form onSubmit={handleSubmit} className="relative mb-5">
              <div className="flex gap-2 p-1.5 rounded-2xl border" style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)' }}>
                <input
                  type="text"
                  value={query}
                  onChange={handleChange}
                  placeholder="Search by title or author..."
                  autoFocus
                  className="flex-1 px-4 py-3 rounded-xl text-base outline-none bg-transparent text-white placeholder-white/25"
                />
                <button
                  type="submit"
                  disabled={!query.trim()}
                  className="px-6 py-3 rounded-xl font-semibold text-white disabled:opacity-30 transition-all text-sm"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}
                >
                  Search
                </button>
              </div>
            </form>

            {/* Example chips */}
            <div className="flex flex-wrap justify-center gap-2">
              <span className="text-sm self-center" style={{ color: 'rgba(255,255,255,0.25)' }}>Try:</span>
              {EXAMPLE_SEARCHES.map((term) => (
                <button
                  key={term}
                  onClick={() => handleExample(term)}
                  className="px-3 py-1.5 rounded-full text-sm transition-all border hover:border-violet-500/50"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    borderColor: 'rgba(255,255,255,0.08)',
                    color: 'rgba(255,255,255,0.5)',
                  }}
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {hasSearched && (
        <div className="max-w-3xl mx-auto px-4 pt-6 pb-16">
          <SearchCounter
            completedCount={completedCount}
            isLoading={isLoading}
            resultCount={results.length}
          />

          {results.length === 0 && !isLoading && (
            <div className="text-center mt-32">
              <p className="text-4xl mb-4">📭</p>
              <p className="font-semibold text-white/70">No audiobooks found for "{query}"</p>
              <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>Try a different title or author name</p>
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
