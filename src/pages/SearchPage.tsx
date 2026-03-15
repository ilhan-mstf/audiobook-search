import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSearch } from '../hooks/useSearch'
import SearchCounter from '../components/SearchCounter'
import BookCard from '../components/BookCard'

const DEFAULT_TITLE = 'Audiobook Search — Find Free & Paid Audiobooks Across All Platforms'
const EXAMPLES = ['Sherlock Holmes', 'Dune', 'Sapiens', 'Pride and Prejudice', 'The Hobbit']
const PLATFORMS = ['LibriVox', 'Internet Archive', 'Apple Books', 'Audible', 'Spotify', 'Scribd', 'Kobo', 'Libby', 'Hoopla', 'Chirp']

const btnPrimary =
  'inline-flex items-center justify-center gap-1.5 py-3 px-6 rounded-2xl bg-accent hover:bg-accent-dark disabled:opacity-30 disabled:cursor-not-allowed text-white text-sm font-semibold cursor-pointer border-none transition-colors duration-150 active:scale-[0.97] whitespace-nowrap flex-shrink-0'

const btnPrimaryCompact =
  'inline-flex items-center justify-center py-2 px-[18px] rounded-[10px] bg-accent hover:bg-accent-dark disabled:opacity-30 disabled:cursor-not-allowed text-white text-sm font-semibold cursor-pointer border-none transition-colors duration-150 active:scale-[0.97] whitespace-nowrap flex-shrink-0'

export default function SearchPage() {
  const [query, setQuery] = useState('')
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
    <div className="min-h-screen bg-canvas">

      {/* ── Sticky header (results state) ─────────────────── */}
      {hasSearched && (
        <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-canvas/80 backdrop-blur-xl">
          <div className="max-w-4xl mx-auto px-8 py-4 flex items-center gap-4">
            <svg className="flex-shrink-0" width="20" height="20" viewBox="0 0 48 48" fill="none" aria-hidden="true"><path d="M24 4L6 44h12l6-14 6 14h12L24 4z" fill="#f05635"/><path d="M24 22l-4 10h8l-4-10z" fill="#08080d"/></svg>
            <form onSubmit={handleSubmit} className="flex gap-2 flex-1">
              <input
                type="text"
                value={query}
                onChange={handleChange}
                placeholder="Search audiobooks..."
                className="flex-1 py-2.5 px-4 text-sm rounded-[10px] bg-[var(--bg-surface)] border border-[var(--border)] text-ink transition-[border-color,box-shadow] duration-150 focus:outline-none focus:border-[var(--border-focus)] focus:ring-[3px] focus:ring-[var(--accent-dim)]"
              />
              <button type="submit" disabled={!query.trim() || isLoading} className={btnPrimaryCompact}>
                Search
              </button>
            </form>
          </div>
        </header>
      )}

      {/* ── Hero (landing state) ───────────────────────────── */}
      {!hasSearched && (
        <main className="flex flex-col items-center justify-center px-4 min-h-screen pb-20">

          {/* Ambient glow — gradient can't be expressed in Tailwind */}
          <div
            aria-hidden="true"
            className="fixed top-0 left-1/2 -translate-x-1/2 pointer-events-none"
            style={{
              width: 800,
              height: 500,
              background: 'radial-gradient(ellipse at center, rgba(240,86,53,0.10) 0%, transparent 70%)',
            }}
          />

          <div className="relative w-full max-w-[620px]">

            {/* Eyebrow */}
            <div className="flex justify-center mb-7">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[var(--accent-border)] bg-[var(--accent-dim)] text-accent-soft text-xs font-medium tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-soft animate-pulse" />
                {PLATFORMS.length}+ audiobook platforms, one search
              </span>
            </div>

            {/* Heading */}
            <h1
              className="text-center mb-4 font-extrabold tracking-[-0.03em] leading-[1.1] text-ink"
              style={{ fontSize: 'clamp(36px, 6vw, 58px)' }}
            >
              Find any audiobook.{' '}
              <span className="bg-gradient-to-br from-accent-soft to-accent bg-clip-text text-transparent">
                Every platform, one search.
              </span>
            </h1>

            <p className="text-center mb-8 text-[17px] text-[var(--text-2)] leading-relaxed">
              We search LibriVox, Audible, your library, and 10+ more platforms at once
              <br />
              — so you always find the best option.
            </p>

            {/* Search bar */}
            <form onSubmit={handleSubmit}>
              <div className="flex gap-2 p-1.5 bg-[var(--bg-surface)] border border-[var(--border-strong)] rounded-[20px]">
                <input
                  type="text"
                  value={query}
                  onChange={handleChange}
                  placeholder="Search by title or author…"
                  autoFocus
                  className="flex-1 py-3 px-4 text-base bg-transparent border-none shadow-none rounded-2xl text-ink focus:outline-none focus:ring-0"
                />
                <button type="submit" disabled={!query.trim()} className={btnPrimary}>
                  Search
                </button>
              </div>
            </form>

            {/* Example chips */}
            <div className="flex flex-wrap justify-center gap-2 mt-5">
              <span className="text-[13px] text-[var(--text-3)] self-center">Try:</span>
              {EXAMPLES.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => { setQuery(term); runSearch(term) }}
                  className="inline-flex items-center px-3 py-[5px] text-[13px] rounded-full border border-[var(--border)] bg-[var(--bg-surface)] text-[var(--text-2)] hover:border-[var(--border-strong)] hover:text-ink hover:bg-[var(--bg-surface-hover)] transition-colors cursor-pointer"
                >
                  {term}
                </button>
              ))}
            </div>

            {/* Platform list */}
            <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 mt-12">
              {PLATFORMS.map((p) => (
                <span key={p} className="text-xs text-[var(--text-4)] tracking-wide">
                  {p}
                </span>
              ))}
            </div>

            {/* Blog link */}
            <div className="flex justify-center mt-10">
              <Link
                to="/blog"
                className="text-sm text-[var(--text-3)] hover:text-accent-soft no-underline transition-colors"
              >
                Read our blog →
              </Link>
            </div>
          </div>
        </main>
      )}

      {/* ── Results ────────────────────────────────────────── */}
      {hasSearched && (
        <main className="max-w-4xl mx-auto px-8 pt-8 pb-24">
          <SearchCounter
            completedCount={completedCount}
            isLoading={isLoading}
            resultCount={results.length}
          />

          {results.length === 0 && !isLoading && (
            <div className="flex flex-col items-center justify-center mt-24 text-center">
              <span className="text-5xl mb-4">📭</span>
              <p className="text-base font-semibold text-[var(--text-2)]">
                No results for "{query}"
              </p>
              <p className="text-sm text-[var(--text-3)] mt-1.5">
                Try a different title or author name
              </p>
            </div>
          )}

          <div className="flex flex-col gap-4">
            {results.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </main>
      )}
    </div>
  )
}
