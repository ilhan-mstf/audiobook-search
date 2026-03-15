import { Link } from 'react-router-dom'
import { posts } from '../content/blog'
import { useEffect } from 'react'

export default function BlogPage() {
  useEffect(() => {
    document.title = 'Blog — Audiobook Search'
  }, [])

  return (
    <div className="min-h-screen bg-canvas">
      <header className="border-b border-[var(--border)] bg-canvas/80 backdrop-blur-xl">
        <div className="max-w-3xl mx-auto px-8 py-4 flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-ink no-underline hover:opacity-80 transition-opacity">
            <svg width="20" height="20" viewBox="0 0 48 48" fill="none" aria-hidden="true">
              <path d="M24 4L6 44h12l6-14 6 14h12L24 4z" fill="#f05635" />
              <path d="M24 22l-4 10h8l-4-10z" fill="#08080d" />
            </svg>
            <span className="font-semibold text-sm">Audiobook Search</span>
          </Link>
          <span className="text-[var(--text-4)]">/</span>
          <span className="text-sm text-[var(--text-2)]">Blog</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-8 pt-16 pb-24">
        <h1 className="text-3xl font-extrabold tracking-[-0.03em] text-ink mb-3">Blog</h1>
        <p className="text-[var(--text-2)] text-lg mb-12">Tips, guides, and insights about audiobooks.</p>

        <div className="flex flex-col gap-6">
          {posts.map((post) => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              className="group block p-6 rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] hover:border-[var(--border-strong)] transition-colors duration-200 no-underline"
            >
              <div className="flex items-center gap-3 mb-3 text-xs text-[var(--text-3)]">
                <time dateTime={post.date}>
                  {new Date(post.date + 'T00:00:00').toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
                <span>·</span>
                <span>{post.readingTime}</span>
              </div>
              <h2 className="text-xl font-semibold text-ink mb-2 group-hover:text-accent-soft transition-colors">
                {post.title}
              </h2>
              <p className="text-[var(--text-2)] text-[15px] leading-relaxed line-clamp-2">
                {post.description}
              </p>
            </Link>
          ))}
        </div>
      </main>

      <BlogFooter />
    </div>
  )
}

export function BlogFooter() {
  return (
    <footer className="border-t border-[var(--border)] py-8">
      <div className="max-w-3xl mx-auto px-8 flex items-center justify-between text-xs text-[var(--text-4)]">
        <Link to="/" className="text-[var(--text-3)] hover:text-ink no-underline transition-colors">
          Audiobook Search
        </Link>
        <span>Search 10+ audiobook platforms at once</span>
      </div>
    </footer>
  )
}
