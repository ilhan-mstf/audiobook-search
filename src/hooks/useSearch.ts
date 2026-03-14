import { useState, useCallback, useRef } from 'react'
import type { Book } from '../types/book'
import { search as searchLibrivox } from '../sources/librivox'
import { search as searchInternetArchive } from '../sources/internetarchive'
import { search as searchOpenLibrary } from '../sources/openlibrary'
import { search as searchItunes } from '../sources/itunes'
import { search as searchGoogleBooks } from '../sources/googlebooks'
import { buildAffiliateSource, buildLibrarySource } from '../sources/affiliates'

const SOURCES = [
  { label: 'LibriVox', fn: searchLibrivox },
  { label: 'Internet Archive', fn: searchInternetArchive },
  { label: 'Open Library', fn: searchOpenLibrary },
  { label: 'Apple Books', fn: searchItunes },
  { label: 'Google Books', fn: searchGoogleBooks },
]

export const TOTAL_SOURCES = SOURCES.length

// Merge incoming books into existing map, combining sources for duplicates
function mergeInto(map: Map<string, Book>, incoming: Book[]): Map<string, Book> {
  const next = new Map(map)
  for (const book of incoming) {
    const existing = next.get(book.id)
    if (existing) {
      const existingNames = new Set(existing.sources.map((s) => s.sourceName))
      const newSources = book.sources.filter((s) => !existingNames.has(s.sourceName))
      next.set(book.id, {
        ...existing,
        sources: [...existing.sources, ...newSources],
        description: existing.description ?? book.description,
        coverUrl: existing.coverUrl ?? book.coverUrl,
        durationSeconds: existing.durationSeconds ?? book.durationSeconds,
        genres: existing.genres.length > 0 ? existing.genres : book.genres,
      })
    } else {
      // Add affiliate + library links to every new book
      const affiliateSources = buildAffiliateSource(book.title, book.author)
      const librarySources = buildLibrarySource(book.title, book.author)
      next.set(book.id, {
        ...book,
        sources: [...book.sources, ...affiliateSources, ...librarySources],
      })
    }
  }
  return next
}

export function useSearch() {
  const [results, setResults] = useState<Book[]>([])
  const [completedCount, setCompletedCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const searchIdRef = useRef(0) // cancel stale searches

  const search = useCallback((query: string) => {
    const trimmed = query.trim()
    if (!trimmed) return

    // New search — invalidate previous
    const searchId = ++searchIdRef.current
    setResults([])
    setCompletedCount(0)
    setIsLoading(true)

    // Shared mutable map — updated as each source resolves
    let bookMap = new Map<string, Book>()

    SOURCES.forEach(({ fn }) => {
      fn(trimmed)
        .then((books) => {
          if (searchId !== searchIdRef.current) return // stale, discard
          bookMap = mergeInto(bookMap, books)
          setResults(Array.from(bookMap.values()))
        })
        .catch(() => {
          // Silent fail — just don't show that source
        })
        .finally(() => {
          if (searchId !== searchIdRef.current) return
          setCompletedCount((c) => {
            const next = c + 1
            if (next >= TOTAL_SOURCES) setIsLoading(false)
            return next
          })
        })
    })
  }, [])

  const reset = useCallback(() => {
    searchIdRef.current++ // invalidate any in-flight
    setResults([])
    setCompletedCount(0)
    setIsLoading(false)
  }, [])

  return { results, completedCount, isLoading, search, reset }
}
