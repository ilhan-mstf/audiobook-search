import { Link } from 'react-router-dom'
import { useEffect } from 'react'

export default function NotFoundPage() {
  useEffect(() => {
    document.title = 'Page not found — Audiobook Search'
  }, [])

  return (
    <div className="min-h-screen bg-canvas flex flex-col items-center justify-center px-4">
      <h1 className="text-6xl font-extrabold text-ink mb-4">404</h1>
      <p className="text-lg text-[var(--text-2)] mb-8">This page doesn't exist.</p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 py-3 px-6 rounded-2xl bg-accent hover:bg-accent-dark text-white text-sm font-semibold no-underline transition-colors"
      >
        Go to search
      </Link>
    </div>
  )
}
