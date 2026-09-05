export type ReadingStatus = 'want-to-read' | 'reading' | 'read';

export interface Book {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  rating: number; // 1 to 5
  status: ReadingStatus;
  review?: string;
  date: string; // ISO date string or formatted (YYYY-MM-DD)
  genre?: string;
  pages?: number;
  favoriteQuote?: string;
}

export interface PromoBanner {
  enabled: boolean;
  imageUrl: string;
  badgeText: string;
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
}

export type SortOption =
  | 'rating-desc'
  | 'rating-asc'
  | 'author-asc'
  | 'author-desc'
  | 'title-asc'
  | 'date-desc';

export type StarDesignStyle = 'minimal-diamond' | 'modern-sharp' | 'editorial-classic';
