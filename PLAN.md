# Audiobook Search Engine — Plan

## Goal
User searches a book title → we check all platforms in parallel → show where it's available (free or paid) with direct links.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Frontend | Vite + React + TypeScript + Tailwind CSS |
| Routing | React Router |
| Hosting | Cloudflare Pages |
| CORS proxy | Cloudflare Pages Functions (only if needed) |

---

## Sources

### Free (searchable via API)
| Source | API | CORS |
|---|---|---|
| LibriVox | `https://librivox.org/api/feed/audiobooks/?format=json` | Unknown — test first |
| Internet Archive | `https://archive.org/advancedsearch.php?output=json` | ✅ |
| Open Library | `https://openlibrary.org/search.json` | ✅ |

### Free (link only — no public API)
| Source | Notes |
|---|---|
| Libby / OverDrive | Requires library card — show "Check your library →" link |
| Hoopla | Requires library card — show "Check your library →" link |

### Paid (affiliate links — direct, no tracking)
| Source | Method |
|---|---|
| Apple Books | iTunes Search API (live pricing, CORS-safe ✅) |
| Google Play | Google Books API (live pricing, CORS-safe ✅) |
| Audible | Constructed search URL + Amazon Associates tag |
| Scribd / Everand | Constructed search URL |
| Spotify | Constructed search URL |
| Libro.fm | Constructed search URL + ShareASale affiliate |
| Chirp | Constructed search URL + affiliate |
| Kobo | Constructed search URL |

---

## UX Decisions

- **Search results**: one card per book (merged by title+author), showing all available platforms
- **Loading**: results appear as each source responds — counter shows "Searched 2 of 5 sources" at top. User sees results immediately, no waiting for all sources.
- **Affiliate links**: direct links, no server-side tracking needed

---

## Shared Types

```typescript
// src/types/book.ts

export type SourceName =
  | 'librivox'
  | 'internet_archive'
  | 'openlibrary'
  | 'apple_books'
  | 'google_play'
  | 'audible'
  | 'libro_fm'
  | 'chirp';

export interface BookSource {
  sourceName: SourceName;
  isFree: boolean;
  priceUsd: number | null;
  narrator: string | null;
  sourceUrl: string;
  audioUrl: string | null;     // direct stream URL, free sources only
  affiliateUrl: string | null; // paid sources
}

export interface Book {
  id: string;                  // normalized "title-author" slug
  title: string;
  author: string;
  description: string | null;
  language: string;
  durationSeconds: number | null;
  genres: string[];
  coverUrl: string | null;
  sources: BookSource[];
}
```

---

## Folder Structure

```
src/
├── types/
│   └── book.ts
├── sources/              # one file per source, each returns Book[]
│   ├── librivox.ts
│   ├── internetarchive.ts
│   ├── openlibrary.ts
│   ├── itunes.ts
│   └── googlebooks.ts
├── hooks/
│   └── useSearch.ts      # orchestrates all sources, merges duplicates
├── components/
│   ├── SearchBar.tsx
│   ├── BookCard.tsx
│   ├── SourceBadge.tsx
│   └── SearchCounter.tsx  # "Searched X of 5 sources"
├── pages/
│   ├── SearchPage.tsx
│   └── BookPage.tsx
└── main.tsx

functions/                # Pages Functions — only if LibriVox CORS fails
└── api/
    └── librivox.ts
```

---

## Build Steps

### Step 1 — Project Setup
- Scaffold with Vite (React + TypeScript template)
- Install Tailwind CSS, React Router
- Connect repo to Cloudflare Pages, verify empty deploy works

### Step 2 — Types
- Write `src/types/book.ts` (types above)
- This is the contract every source adapter must conform to

### Step 3 — Source Adapters
Build one adapter at a time, test each in isolation:
1. `librivox.ts` — test CORS first; if blocked, add Pages Function proxy
2. `internetarchive.ts`
3. `openlibrary.ts`
4. `itunes.ts` — Apple Books with live pricing
5. `googlebooks.ts` — Google Play with live pricing
6. Affiliate URL builders for Audible, Libro.fm, Chirp (pure functions, no API call)

Each adapter signature:
```typescript
export async function search(query: string): Promise<Book[]>
```

### Step 4 — Search Orchestrator (`useSearch.ts`)
- Fire all 5 adapters with `Promise.allSettled` (failures don't block others)
- As each resolves, merge into results state — deduplicate by normalized title+author
- Track `completedCount` for the progress counter
- Return `{ results, completedCount, totalSources, isLoading }`

### Step 5 — UI
- `SearchPage`: search bar + `SearchCounter` + progressive `BookCard` list
- `BookCard`: title, author, cover, list of platform badges (Free / $X.XX)
- `SourceBadge`: colored by free vs paid, links directly to source
- `BookPage`: full detail, inline `<audio>` player for free sources with chapter list

### Step 6 — CORS Check & Fix
- Test LibriVox from deployed Cloudflare Pages URL
- If CORS error → add `functions/api/librivox.ts` as a thin proxy

### Step 7 — Polish
- Empty state ("No audiobooks found for...")
- Error state per source (silent fail — just don't show that source)
- Mobile responsive layout
- Page titles + meta tags
