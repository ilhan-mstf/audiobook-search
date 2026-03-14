export type SourceName =
  | 'librivox'
  | 'internet_archive'
  | 'openlibrary'
  | 'apple_books'
  | 'google_play'
  | 'audible'
  | 'scribd'
  | 'spotify'
  | 'libro_fm'
  | 'chirp'
  | 'kobo'
  | 'libby'
  | 'hoopla';

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
