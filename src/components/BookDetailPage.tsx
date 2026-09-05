import React from 'react';
import { Book, StarDesignStyle } from '../types';
import { ModernStars } from './ModernStars';
import { StatusBadge } from './StatusBadge';
import {
  ArrowLeft,
  Calendar,
  BookOpen,
  Quote,
  Edit3,
  Bookmark,
  Share2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface BookDetailPageProps {
  book: Book;
  allBooks: Book[];
  onBack: () => void;
  onSelectBook: (book: Book) => void;
  onEditInAdmin: (book: Book) => void;
  starStyle?: StarDesignStyle;
  isAdmin?: boolean;
}

export const BookDetailPage: React.FC<BookDetailPageProps> = ({
  book,
  allBooks,
  onBack,
  onSelectBook,
  onEditInAdmin,
  starStyle = 'modern-sharp',
  isAdmin = false,
}) => {
  const currentIndex = allBooks.findIndex((b) => b.id === book.id);
  const prevBook = currentIndex > 0 ? allBooks[currentIndex - 1] : null;
  const nextBook =
    currentIndex >= 0 && currentIndex < allBooks.length - 1
      ? allBooks[currentIndex + 1]
      : null;

  const [copied, setCopied] = React.useState(false);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedDate = (() => {
    try {
      const d = new Date(book.date);
      if (isNaN(d.getTime())) return book.date;
      return d.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return book.date;
    }
  })();

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
      {/* Top Navigation Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 sm:mb-8">
        <button
          type="button"
          id="back-to-bookshelf-btn"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-blue-900 hover:border-blue-300 shadow-xs font-semibold text-xs sm:text-sm transition-all hover:-translate-x-0.5 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-1.5 sm:gap-2 ml-auto">
          {/* Previous / Next book navigation */}
          {prevBook && (
            <button
              type="button"
              id="prev-book-nav-btn"
              onClick={() => onSelectBook(prevBook)}
              title={`Previous: ${prevBook.title}`}
              className="p-1.5 sm:p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-blue-900 hover:border-blue-300 shadow-xs cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          )}
          {nextBook && (
            <button
              type="button"
              id="next-book-nav-btn"
              onClick={() => onSelectBook(nextBook)}
              title={`Next: ${nextBook.title}`}
              className="p-1.5 sm:p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-blue-900 hover:border-blue-300 shadow-xs cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          )}

          {/* Quick Share Link */}
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-slate-900 shadow-xs text-xs font-medium cursor-pointer"
          >
            <Share2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-600" />
            <span>{copied ? 'Copied!' : 'Share'}</span>
          </button>

          {/* Admin Edit button */}
          <button
            type="button"
            id="detail-edit-admin-btn"
            onClick={() => onEditInAdmin(book)}
            className="inline-flex items-center gap-1 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 shadow-xs text-xs font-semibold cursor-pointer"
          >
            <Edit3 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>{isAdmin ? 'Edit' : 'Manage'}</span>
          </button>
        </div>
      </div>

      {/* Main Reading Book Detailed View Container */}
      <article className="bg-white rounded-xl sm:rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
        {/* Clean minimalist blue accent bar */}
        <div className="h-1 sm:h-1.5 bg-blue-600" />

        <div className="p-4 sm:p-8 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-12 items-start">
            {/* Left Column: Compact Book Cover Presentation */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="relative w-full max-w-[180px] sm:max-w-[300px] aspect-[3/4] bg-slate-100 rounded-xl overflow-hidden shadow-sm">
                <img
                  src={book.coverUrl}
                  alt={`Cover of ${book.title}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop';
                  }}
                />
                {/* Subtle book spine highlight line */}
                <div className="absolute inset-y-0 left-0 w-2.5 bg-gradient-to-r from-black/20 via-white/5 to-transparent pointer-events-none" />
              </div>

              {/* Status and Rating Card below cover */}
              <div className="w-full max-w-[280px] sm:max-w-[300px] mt-3 sm:mt-6 p-3 sm:p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col gap-2 sm:gap-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Reading Status</span>
                  <StatusBadge status={book.status} size="sm" />
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                  <span className="text-slate-500 font-medium">Personal Rating</span>
                  <div className="flex items-center gap-1.5">
                    <ModernStars rating={book.rating} size="xs" styleVariant={starStyle} />
                    <span className="text-xs sm:text-sm font-bold text-slate-800">{book.rating}.0</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                  <span className="text-slate-500 font-medium">Date Recorded</span>
                  <span className="text-slate-700 font-semibold">{formattedDate}</span>
                </div>

                {book.pages && (
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                    <span className="text-slate-500 font-medium">Length</span>
                    <span className="text-slate-700 font-semibold">{book.pages} pages</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Book Details, Typography & Full Review */}
            <div className="lg:col-span-7 flex flex-col">
              {/* Book Title */}
              <h1 className="text-xl sm:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight leading-snug mb-1 sm:mb-2">
                {book.title}
              </h1>

              {/* Author */}
              <p className="text-xs sm:text-base text-slate-500 font-medium mb-3 sm:mb-6">
                Written by <strong className="text-slate-900 font-semibold">{book.author}</strong>
              </p>

              {/* Minimalist Star Rating Callout */}
              <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3.5 mb-4 sm:mb-8 rounded-xl bg-slate-50 border border-slate-100">
                <ModernStars rating={book.rating} size="sm" styleVariant={starStyle} />
                <div className="h-3.5 w-px bg-slate-200" />
                <span className="text-xs sm:text-sm font-semibold text-slate-800">
                  {book.rating} out of 5 Stars
                </span>
                <span className="text-[11px] sm:text-xs text-blue-600 font-semibold ml-auto flex items-center gap-1">
                  Book Entry
                </span>
              </div>

              {/* Full Review Section (if present) */}
              {book.review && (
                <div className="mb-4 sm:mb-8">
                  <h2 className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-2 sm:mb-3 flex items-center gap-2">
                    <span>My Book Review</span>
                    <div className="flex-1 h-px bg-slate-100" />
                  </h2>

                  <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-xs sm:text-base">
                    <p className="whitespace-pre-line leading-relaxed">
                      {book.review}
                    </p>
                  </div>
                </div>
              )}

              {/* Favorite Quote Block (if exists) */}
              {book.favoriteQuote && (
                <div className="relative p-3.5 sm:p-6 rounded-xl bg-blue-600 text-white shadow-xs shadow-blue-200/50 overflow-hidden mb-4 sm:mb-8">
                  <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-blue-500 rounded-full blur-2xl opacity-40 pointer-events-none" />
                  <Quote className="w-8 h-8 sm:w-10 sm:h-10 text-white/10 absolute -bottom-2 -right-2 pointer-events-none" />
                  <p className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-blue-200 mb-1 sm:mb-2 font-bold">
                    Key Quote / Margin Note
                  </p>
                  <blockquote className="italic text-xs sm:text-base leading-relaxed text-white font-medium">
                    "{book.favoriteQuote}"
                  </blockquote>
                  <p className="text-[11px] sm:text-xs text-blue-100 mt-1.5 sm:mt-2 font-medium">
                    — {book.title}, by {book.author}
                  </p>
                </div>
              )}

              {/* Book Metadata Summary */}
              <div className="mt-auto pt-4 sm:pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 sm:gap-4 text-xs text-slate-500">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" />
                  <span>Entry added on {formattedDate}</span>
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                  <button
                    type="button"
                    onClick={onBack}
                    className="text-blue-600 font-semibold hover:underline cursor-pointer"
                  >
                    ← Return to bookshelf
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};
