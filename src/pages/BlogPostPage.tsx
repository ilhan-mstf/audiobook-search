import { useParams, Link, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { getPost } from '../content/blog'
import { BlogFooter } from './BlogPage'

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()
  const post = slug ? getPost(slug) : undefined

  useEffect(() => {
    if (post) {
      document.title = `${post.title} — Audiobook Search`
    }
  }, [post])

  if (!post) return <Navigate to="/blog" replace />

  return (
    <div className="min-h-screen bg-canvas">
      {/* JSON-LD for the blog post */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.title,
            description: post.description,
            datePublished: post.date,
            author: {
              '@type': 'Organization',
              name: 'Audiobook Search',
              url: 'https://audiobook-search.pages.dev',
            },
            publisher: {
              '@type': 'Organization',
              name: 'Audiobook Search',
              url: 'https://audiobook-search.pages.dev',
            },
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': `https://audiobook-search.pages.dev/blog/${post.slug}`,
            },
          }),
        }}
      />

      <header className="border-b border-[var(--border)] bg-canvas/80 backdrop-blur-xl">
        <div className="max-w-3xl mx-auto px-8 py-4 flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-ink no-underline hover:opacity-80 transition-opacity">
            <svg width="20" height="20" viewBox="0 0 48 48" fill="none" aria-hidden="true">
              <path d="M24 4L6 44h12l6-14 6 14h12L24 4z" fill="#f05635" />
              <path d="M24 22l-4 10h8l-4-10z" fill="var(--logo-cutout)" />
            </svg>
            <span className="font-semibold text-sm">Audiobook Search</span>
          </Link>
          <span className="text-[var(--text-4)]">/</span>
          <Link to="/blog" className="text-sm text-[var(--text-2)] no-underline hover:text-ink transition-colors">
            Blog
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-8 pt-16 pb-24">
        <article>
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4 text-xs text-[var(--text-3)]">
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
            <h1 className="text-3xl font-extrabold tracking-[-0.03em] text-ink leading-tight mb-4">
              {post.title}
            </h1>
            <p className="text-lg text-[var(--text-2)] leading-relaxed">
              {post.description}
            </p>
          </div>

          <div className="prose" dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }} />
        </article>

        <div className="mt-16 pt-8 border-t border-[var(--border)]">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm text-[var(--text-2)] hover:text-ink no-underline transition-colors"
          >
            <span>←</span>
            <span>All posts</span>
          </Link>
        </div>
      </main>

      <BlogFooter />
    </div>
  )
}

/** Minimal markdown → HTML for blog posts (headings, bold, italic, links, lists, hr, paragraphs) */
function renderMarkdown(md: string): string {
  const escaped = md
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  const lines = escaped.split('\n')
  let html = ''
  let inList = false

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i]

    // Horizontal rule
    if (/^---+$/.test(line.trim())) {
      if (inList) { html += '</ul>'; inList = false }
      html += '<hr />'
      continue
    }

    // Headings
    const headingMatch = line.match(/^(#{1,3})\s+(.+)$/)
    if (headingMatch) {
      if (inList) { html += '</ul>'; inList = false }
      const level = headingMatch[1].length
      html += `<h${level}>${inline(headingMatch[2])}</h${level}>`
      continue
    }

    // List items
    if (line.match(/^- (.+)$/)) {
      if (!inList) { html += '<ul>'; inList = true }
      html += `<li>${inline(line.replace(/^- /, ''))}</li>`
      continue
    }

    // Empty line
    if (line.trim() === '') {
      if (inList) { html += '</ul>'; inList = false }
      continue
    }

    // Paragraph
    if (inList) { html += '</ul>'; inList = false }
    html += `<p>${inline(line)}</p>`
  }

  if (inList) html += '</ul>'
  return html
}

/** Inline markdown: bold, italic, links, inline code */
function inline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
}
