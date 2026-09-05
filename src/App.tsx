import React, { useState, useEffect, useMemo } from 'react';
import { Book, CollectionFormat, MediaTab, MediaType, ReadingStatus, SortOption, StarDesignStyle, ThemeMode } from './types';
import { INITIAL_BOOKS } from './data/initialBooks';
import { supabase } from './lib/supabase';
import { Navbar } from './components/Navbar';
import { BookCard } from './components/BookCard';
import { BookFilters } from './components/BookFilters';
import { BookDetailPage } from './components/BookDetailPage';
import { AdminAuthModal } from './components/AdminAuthModal';
import { AdminDashboard } from './components/AdminDashboard';
import { ModernStars } from './components/ModernStars';
import {
  BookOpen,
  Sparkles,
  Award,
  BookmarkCheck,
  Compass,
  ArrowRight,
  Library,
  Plus,
  Heart,
  TrendingUp,
} from 'lucide-react';

const STORAGE_KEYS = {
  BOOKS: 'personal_book_reviews_v1',
  PASSWORD: 'personal_admin_password_v1',
  AUTH: 'personal_admin_auth_v1',
  STAR_STYLE: 'personal_star_style_v1',
  THEME: 'personal_theme_v1',
};

export default function App() {
  const isSupabaseConfigured = Boolean(
    import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY
  );

  // --- Persistent State ---
  const [books, setBooks] = useState<Book[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BOOKS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Error reading books from localStorage:', e);
    }
    return INITIAL_BOOKS;
  });

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;
    const client = supabase;

    const fetchBooks = async () => {
      const { data, error } = await client
        .from('books')
        .select('*')
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching books from Supabase:', error);
        return;
      }

      const mappedBooks: Book[] = (data ?? []).map((book) => ({
        id: String(book.id),
        title: String(book.title ?? ''),
        author: String(book.author ?? ''),
        coverUrl: String(book.cover_url ?? ''),
        rating: Number(book.rating ?? 0),
        timesConsumed: Number(book.times_consumed ?? 0),
        status: (book.status as ReadingStatus) ?? 'want-to-read',
        mediaType: (book.media_type as MediaType) ?? 'book',
        format: (book.format as CollectionFormat) ?? 'physical',
        hasDuplicate: Boolean(book.has_duplicate),
        review: typeof book.review === 'string' ? book.review : '',
        date: typeof book.date === 'string' ? book.date : new Date().toISOString().slice(0, 10),
        dateStarted: typeof book.date_started === 'string' ? book.date_started : undefined,
        dateFinished: typeof book.date_finished === 'string' ? book.date_finished : undefined,
        genre: typeof book.genre === 'string' ? book.genre : '',
        pages: typeof book.pages === 'number' ? book.pages : undefined,
        favoriteQuote: typeof book.favorite_quote === 'string' ? book.favorite_quote : '',
      }));

      setBooks(mappedBooks);
      localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(mappedBooks));
    };

    fetchBooks();
  }, [isSupabaseConfigured]);

  const [adminPassword, setAdminPassword] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PASSWORD);
      if (saved && saved !== 'read2026' && saved !== 'admin123') return saved;
    } catch (e) {
      console.error('Error reading password from localStorage:', e);
    }
    return 'Daddy_Matthew_05!';
  });

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.AUTH) === 'true';
    } catch {
      return false;
    }
  });

  const [starStyle, setStarStyle] = useState<StarDesignStyle>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STAR_STYLE);
      if (saved) return saved as StarDesignStyle;
    } catch {}
    return 'modern-sharp';
  });

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(books));
    } catch (e) {
      console.error('Error writing books to localStorage:', e);
    }
  }, [books]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PASSWORD, adminPassword);
    } catch (e) {
      console.error('Error writing password to localStorage:', e);
    }
  }, [adminPassword]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.AUTH, isAdminAuthenticated ? 'true' : 'false');
    } catch {}
  }, [isAdminAuthenticated]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.STAR_STYLE, starStyle);
    } catch {}
  }, [starStyle]);

  const [theme, setTheme] = useState<ThemeMode>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.THEME) === 'dark' ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
    } catch {}
  }, [theme]);

  // --- Views and Modal States ---
  const [view, setView] = useState<'home' | 'book-detail' | 'admin'>('home');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [pendingAdminAction, setPendingAdminAction] = useState<
    'view-admin' | 'add-book' | 'edit-book' | null
  >(null);

  // --- Filtering & Sorting State ---
  const [statusFilter, setStatusFilter] = useState<'all' | ReadingStatus>('all');
  const [sortBy, setSortBy] = useState<SortOption>('rating-desc');
  const [selectedAuthor, setSelectedAuthor] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [mediaType, setMediaType] = useState<MediaTab>('book');
  const mediaLabel = mediaType === 'all' ? 'Archive' : mediaType === 'book' ? 'Books' : mediaType === 'movie' ? 'Movies' : 'Shows';
  const watchedLabel = mediaType === 'all' ? 'Read / Watched' : mediaType === 'book' ? 'Read' : 'Watched';
  const activeLabel = mediaType === 'all' ? 'Active / Watching' : mediaType === 'book' ? 'Active' : 'Watching';
  const isMediaMatch = (book: Book) => mediaType === 'all' || book.mediaType === mediaType;

  const visibleBooks = useMemo(() => {
    return books.flatMap((book) => {
      const normalizedBook = { ...book, mediaType: book.mediaType ?? 'book' } as Book;
      if (!normalizedBook.hasDuplicate || normalizedBook.isDuplicate) return [normalizedBook];
      return [
        normalizedBook,
        {
          ...normalizedBook,
          id: `${normalizedBook.id}-duplicate`,
          isDuplicate: true,
          duplicateOfId: normalizedBook.id,
          hasDuplicate: false,
        },
      ];
    });
  }, [books]);

  // Extract all unique authors with counts for filter (e.g. "Adam Silvera (8)")
  const authorsWithCounts = useMemo(() => {
    const countsMap = new Map<string, number>();
    visibleBooks.filter(isMediaMatch).forEach((b) => {
      if (b.author) {
        const name = b.author.trim();
        countsMap.set(name, (countsMap.get(name) || 0) + 1);
      }
    });
    return Array.from(countsMap.entries())
      .map(([author, count]) => ({ author, count }))
      .sort((a, b) => a.author.localeCompare(b.author));
  }, [visibleBooks, mediaType]);

  // Status counts for tabs
  const statusCounts = useMemo(() => {
    return {
      all: visibleBooks.filter(isMediaMatch).length,
      read: visibleBooks.filter((b) => isMediaMatch(b) && b.status === 'read').length,
      reading: visibleBooks.filter((b) => isMediaMatch(b) && b.status === 'reading').length,
      'want-to-read': visibleBooks.filter((b) => isMediaMatch(b) && b.status === 'want-to-read').length,
      void: visibleBooks.filter((b) => isMediaMatch(b) && b.status === 'void').length,
    };
  }, [visibleBooks, mediaType]);

  // Combined Filtering & Sorting logic
  const filteredAndSortedBooks = useMemo(() => {
    return visibleBooks
      .filter((book) => {
        if (!isMediaMatch(book)) return false;
        // Status filter
        if (statusFilter !== 'all' && book.status !== statusFilter) {
          return false;
        }
        // Author filter
        if (selectedAuthor !== 'all' && book.author.trim() !== selectedAuthor.trim()) {
          return false;
        }
        // Search query filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchTitle = book.title.toLowerCase().includes(q);
          const matchAuthor = book.author.toLowerCase().includes(q);
          const matchReview = book.review?.toLowerCase().includes(q) || false;
          if (!matchTitle && !matchAuthor && !matchReview) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'rating-desc':
            return b.rating - a.rating;
          case 'rating-asc':
            return a.rating - b.rating;
          case 'author-asc':
            return a.author.localeCompare(b.author);
          case 'author-desc':
            return b.author.localeCompare(a.author);
          case 'title-asc':
            return a.title.localeCompare(b.title);
          case 'date-desc':
          default:
            return new Date(b.date).getTime() - new Date(a.date).getTime();
        }
      });
  }, [visibleBooks, mediaType, statusFilter, selectedAuthor, searchQuery, sortBy]);

  // Overall average rating calculation
  const averageRating = useMemo(() => {
    if (books.length === 0) return 0;
    const total = books.reduce((acc, b) => acc + b.rating, 0);
    return (total / books.length).toFixed(1);
  }, [books]);

  // --- Handlers ---
  const handleOpenAdmin = () => {
    if (isAdminAuthenticated) {
      setEditingBook(null);
      setView('admin');
    } else {
      setPendingAdminAction('view-admin');
      setShowAuthModal(true);
    }
  };

  const handleOpenAddBook = () => {
    if (isAdminAuthenticated) {
      setEditingBook(null);
      setView('admin');
    } else {
      setPendingAdminAction('add-book');
      setShowAuthModal(true);
    }
  };

  const handleQuickEditFromCard = (book: Book) => {
    if (isAdminAuthenticated) {
      setEditingBook(book);
      setView('admin');
    } else {
      setSelectedBook(book);
      setPendingAdminAction('edit-book');
      setShowAuthModal(true);
    }
  };

  const handleAuthSuccess = () => {
    setIsAdminAuthenticated(true);
    setShowAuthModal(false);

    if (pendingAdminAction === 'add-book') {
      setEditingBook(null);
      setView('admin');
    } else if (pendingAdminAction === 'edit-book' && selectedBook) {
      setEditingBook(selectedBook);
      setView('admin');
    } else {
      setView('admin');
    }
    setPendingAdminAction(null);
  };

  const handleLogout = () => {
    setIsAdminAuthenticated(false);
    setView('home');
  };

  const handleSaveBook = async (savedBook: Book) => {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('books').upsert({
        id: savedBook.id,
        title: savedBook.title,
        author: savedBook.author,
        cover_url: savedBook.coverUrl,
        rating: savedBook.rating,
        times_consumed: savedBook.timesConsumed ?? 0,
        status: savedBook.status,
        media_type: savedBook.mediaType ?? 'book',
        format: savedBook.format ?? 'physical',
        has_duplicate: Boolean(savedBook.hasDuplicate),
        review: savedBook.review ?? '',
        date: savedBook.date,
        date_started: savedBook.dateStarted ?? null,
        date_finished: savedBook.dateFinished ?? null,
        genre: savedBook.genre ?? '',
        pages: savedBook.pages ?? null,
        favorite_quote: savedBook.favoriteQuote ?? '',
      });

      if (error) {
        console.error('Error saving book to Supabase:', error);
        return;
      }
    }

    setBooks((prev) => {
      const idx = prev.findIndex((b) => b.id === savedBook.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = savedBook;
        return next;
      }
      return [savedBook, ...prev];
    });

    // If currently viewing detailed page of that book, update it
    if (selectedBook?.id === savedBook.id) {
      setSelectedBook(savedBook);
    }
  };

  const handleDeleteBook = async (bookId: string) => {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('books').delete().eq('id', bookId);

      if (error) {
        console.error('Error deleting book from Supabase:', error);
        return;
      }
    }

    setBooks((prev) => prev.filter((b) => b.id !== bookId));
    if (selectedBook?.id === bookId) {
      setSelectedBook(null);
      setView('home');
    }
  };

  const handleResetFilters = () => {
    setStatusFilter('all');
    setSelectedAuthor('all');
    setSearchQuery('');
    setSortBy('rating-desc');
  };

  // --- Dedicated Admin Page (Has its own page & header after entering admin password) ---
  if (view === 'admin') {
    return (
      <AdminDashboard
        books={books}
        onSaveBook={handleSaveBook}
        onDeleteBook={handleDeleteBook}
        onCloseAdmin={() => {
          setView('home');
          setEditingBook(null);
        }}
        onLogout={handleLogout}
        currentPassword={adminPassword}
        onUpdatePassword={(newPass) => setAdminPassword(newPass)}
        starStyle={starStyle}
        onUpdateStarStyle={(newStyle) => setStarStyle(newStyle)}
        onResetBooks={() => setBooks(INITIAL_BOOKS)}
        onImportBooks={(newBooks) => setBooks(newBooks)}
        initialEditingBook={editingBook}
        theme={theme}
        onToggleTheme={() => setTheme((current) => (current === 'light' ? 'dark' : 'light'))}
      />
    );
  }

  return (
    <div className={`app-theme-${theme} star-surface min-h-screen flex flex-col text-slate-900 selection:bg-blue-100 selection:text-blue-900 relative`}>
      {/* Public Navigation Bar */}
      <Navbar
        currentView={view}
        onNavigateHome={() => {
          setView('home');
          setSelectedBook(null);
        }}
        onOpenAdmin={handleOpenAdmin}
        isAdminAuthenticated={isAdminAuthenticated}
        theme={theme}
        onToggleTheme={() => setTheme((current) => (current === 'light' ? 'dark' : 'light'))}
      />

      {/* Password Authentication Modal */}
      <AdminAuthModal
        isOpen={showAuthModal}
        onClose={() => {
          setShowAuthModal(false);
          setPendingAdminAction(null);
        }}
        onSuccess={handleAuthSuccess}
        correctPassword={adminPassword}
      />

      {/* PUBLIC CONTENT ROUTER */}
      {view === 'book-detail' && selectedBook ? (
        <BookDetailPage
          book={selectedBook}
          allBooks={visibleBooks.filter(isMediaMatch)}
          onBack={() => {
            setView('home');
            setSelectedBook(null);
          }}
          onSelectBook={(b) => setSelectedBook(b)}
          onEditInAdmin={(b) => {
            if (isAdminAuthenticated) {
              setEditingBook(b);
              setView('admin');
            } else {
              setSelectedBook(b);
              setPendingAdminAction('edit-book');
              setShowAuthModal(true);
            }
          }}
          starStyle={starStyle}
          isAdmin={isAdminAuthenticated}
        />
      ) : (
        /* PUBLIC MAIN BOOK REVIEWS VIEW */
        <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-6 relative z-10">
          {/* Filters & Sorting Bar */}
          <div id="bookshelf">
            <div className="media-tabs mb-3 sm:mb-4" role="tablist" aria-label="Archive type">
              {(['all', 'book', 'movie', 'show'] as MediaTab[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  role="tab"
                  aria-selected={mediaType === type}
                  onClick={() => { setMediaType(type); setStatusFilter('all'); setSelectedAuthor('all'); }}
                  className={`media-tab ${mediaType === type ? 'media-tab-active' : ''}`}
                >
                  {type === 'all' ? 'All' : type === 'book' ? 'Books' : type === 'movie' ? 'Movies' : 'Shows'}
                  <span>{type === 'all' ? visibleBooks.length : visibleBooks.filter((book) => book.mediaType === type).length}</span>
                </button>
              ))}
            </div>
            <BookFilters
              statusFilter={statusFilter}
              onStatusChange={setStatusFilter}
              sortBy={sortBy}
              onSortChange={setSortBy}
              selectedAuthor={selectedAuthor}
              onAuthorChange={setSelectedAuthor}
              authorsWithCount={authorsWithCounts}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              statusCounts={statusCounts}
              totalFilteredCount={filteredAndSortedBooks.length}
              onResetFilters={handleResetFilters}
              mediaType={mediaType}
            />
          </div>

          {/* Books Responsive Grid - 2 columns on mobile instead of 1 giant column */}
          {filteredAndSortedBooks.length === 0 ? (
            <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 p-6 sm:p-12 text-center my-4 sm:my-8">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
                <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="font-serif-title text-base sm:text-lg font-bold text-slate-900 mb-1">
                No Entries Found
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-4 sm:mb-6">
                No entries match your current filters or search term. Try resetting your filters or
                adding a new archive entry.
              </p>
              <div className="flex items-center justify-center gap-2.5 sm:gap-3">
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Reset Filters
                </button>
                <button
                  type="button"
                  onClick={handleOpenAddBook}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add First Entry</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-6">
              {filteredAndSortedBooks.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  onSelect={(b) => {
                    setSelectedBook(b);
                    setView('book-detail');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  starStyle={starStyle}
                  isAdmin={isAdminAuthenticated}
                  onQuickEdit={handleQuickEditFromCard}
                />
              ))}
            </div>
          )}
        </main>
      )}

      {/* Clean Minimalism Footer */}
      <footer className="mt-auto h-14 border-t border-slate-200 bg-white shrink-0 flex items-center px-4 sm:px-8">
        <div className="max-w-7xl w-full mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
            {mediaLabel}: {visibleBooks.filter(isMediaMatch).length} Titles | {watchedLabel}: {statusCounts.read} | {activeLabel}: {statusCounts.reading} | Wishlist: {statusCounts['want-to-read']}
          </p>

          <div className="flex items-center gap-4 text-[10px]">
            <button
              type="button"
              onClick={() => {
                setView('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-slate-500 hover:text-blue-600 transition-colors cursor-pointer uppercase tracking-wider font-semibold"
            >
              Back to Top ↑
            </button>
            <span className="text-slate-300">•</span>
            <button
              type="button"
              onClick={handleOpenAdmin}
              className="text-slate-500 hover:text-blue-600 transition-colors cursor-pointer uppercase tracking-wider font-semibold"
            >
              Admin Portal
            </button>
            <span className="text-slate-300">•</span>
            <p className="text-blue-600 font-bold tracking-widest uppercase flex items-center">
              <span>Ced's Archives</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
