import { useState, useEffect } from 'react'
import { useSearch } from '../hooks/useSearch'
import SearchCounter from '../components/SearchCounter'
import BookCard from '../components/BookCard'

const DEFAULT_TITLE = 'Audiobook Search — Find Free & Paid Audiobooks Across All Platforms'
const EXAMPLES = ['Sherlock Holmes', 'Dune', 'Sapiens', 'Pride and Prejudice', 'The Hobbit']
const PLATFORMS = ['LibriVox', 'Internet Archive', 'Apple Books', 'Audible', 'Spotify', 'Scribd', 'Kobo', 'Libby', 'Hoopla', 'Chirp']

export default function SearchPage() {
  const [query, setQuery]   = useState('')
  const { results, completedCount, isLoading, search, reset } = useSearch()
  const hasSearched = completedCount > 0 || isLoading

  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get('q')
    if (q) { setQuery(q); search(q); document.title = `"${q}" — Audiobook Search` }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function runSearch(term: string) {
    if (!term.trim()) return
    search(term)
    document.title = `"${term}" — Audiobook Search`
    const u = new URL(window.location.href)
    u.searchParams.set('q', term)
    window.history.pushState({}, '', u)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    runSearch(query)
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value)
    if (!e.target.value.trim()) {
      reset()
      document.title = DEFAULT_TITLE
      window.history.pushState({}, '', '/')
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>

      {/* ── Sticky header (results state) ─────────────────── */}
      {hasSearched && (
        <header
          className="sticky top-0 z-20"
          style={{
            background: 'rgba(8,8,13,0.8)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderBottom: '1px solid var(--border)',
          }}
        >
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
            <span style={{ fontSize: 20, flexShrink: 0 }}>🎧</span>
            <form onSubmit={handleSubmit} className="flex gap-2 flex-1">
              <input
                type="text"
                value={query}
                onChange={handleChange}
                placeholder="Search audiobooks..."
                style={{ padding: '8px 14px', fontSize: 14, borderRadius: 10 }}
              />
              <button
                type="submit"
                disabled={!query.trim() || isLoading}
                className="btn-primary"
                style={{ padding: '8px 18px', borderRadius: 10 }}
              >
                Search
              </button>
            </form>
          </div>
        </header>
      )}

      {/* ── Hero (landing state) ───────────────────────────── */}
      {!hasSearched && (
        <main className="flex flex-col items-center justify-center px-4" style={{ minHeight: '100vh', paddingBottom: 80 }}>
          {/* Glow */}
          <div
            aria-hidden="true"
            style={{
              position: 'fixed',
              top: 0, left: '50%',
              transform: 'translateX(-50%)',
              width: 800, height: 500,
              background: 'radial-gradient(ellipse at center, rgba(124,58,237,0.12) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />

          <div className="relative w-full" style={{ maxWidth: 620 }}>
            {/* Eyebrow */}
            <div className="flex justify-center mb-7">
              <span
                className="inline-flex items-center gap-2"
                style={{
                  padding: '6px 14px',
                  borderRadius: 99,
                  border: '1px solid var(--accent-border)',
                  background: 'var(--accent-dim)',
                  color: 'var(--accent-text)',
                  fontSize: 12,
                  fontWeight: 500,
                  letterSpacing: '0.01em',
                }}
              >
                <span
                  style={{
                    width: 6, height: 6,
                    borderRadius: '50%',
                    background: 'var(--accent-text)',
                    animation: 'pulse 2s infinite',
                  }}
                />
                {PLATFORMS.length}+ audiobook platforms, one search
              </span>
            </div>

            {/* Heading */}
            <h1
              className="text-center mb-4"
              style={{
                fontSize: 'clamp(36px, 6vw, 58px)',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                lineHeight: 1.1,
                color: 'var(--text-1)',
              }}
            >
              Find any audiobook,{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                everywhere it exists.
              </span>
            </h1>

            <p
              className="text-center mb-8"
              style={{ fontSize: 17, color: 'var(--text-2)', lineHeight: 1.6 }}
            >
              Free on LibriVox? Available at your library? On Audible?
              <br />
              We check all platforms at once and show you every option.
            </p>

            {/* Search bar */}
            <form onSubmit={handleSubmit}>
              <div
                className="flex gap-2 p-1.5"
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-strong)',
                  borderRadius: 'var(--radius-xl)',
                }}
              >
                <input
                  type="text"
                  value={query}
                  onChange={handleChange}
                  placeholder="Search by title or author…"
                  autoFocus
                  style={{
                    padding: '12px 16px',
                    fontSize: 16,
                    border: 'none',
                    background: 'transparent',
                    boxShadow: 'none',
                    borderRadius: 'var(--radius-lg)',
                    flex: 1,
                  }}
                />
                <button
                  type="submit"
                  disabled={!query.trim()}
                  className="btn-primary"
                  style={{ padding: '12px 24px', borderRadius: 'var(--radius-lg)' }}
                >
                  Search
                </button>
              </div>
            </form>

            {/* Example chips */}
            <div className="flex flex-wrap justify-center gap-2 mt-5">
              <span style={{ fontSize: 13, color: 'var(--text-3)', alignSelf: 'center' }}>Try:</span>
              {EXAMPLES.map((term) => (
                <button
                  key={term}
                  onClick={() => { setQuery(term); runSearch(term) }}
                  className="btn-ghost"
                  style={{ padding: '5px 12px', fontSize: 13 }}
                >
                  {term}
                </button>
              ))}
            </div>

            {/* Platform list */}
            <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 mt-12">
              {PLATFORMS.map((p) => (
                <span key={p} style={{ fontSize: 12, color: 'var(--text-4)', letterSpacing: '0.02em' }}>
                  {p}
                </span>
              ))}
            </div>
          </div>
        </main>
      )}

      {/* ── Results ────────────────────────────────────────── */}
      {hasSearched && (
        <main className="max-w-2xl mx-auto px-4 pt-6 pb-20">
          <SearchCounter
            completedCount={completedCount}
            isLoading={isLoading}
            resultCount={results.length}
          />

          {results.length === 0 && !isLoading && (
            <div className="flex flex-col items-center justify-center" style={{ marginTop: 100 }}>
              <span style={{ fontSize: 40, marginBottom: 16 }}>📭</span>
              <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-2)' }}>
                No results for "{query}"
              </p>
              <p style={{ fontSize: 14, color: 'var(--text-3)', marginTop: 6 }}>
                Try a different title or author name
              </p>
            </div>
          )}

          <div className="flex flex-col gap-2.5">
            {results.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </main>
      )}
    </div>
  )
}
