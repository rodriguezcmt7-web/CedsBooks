import React from 'react';
import { Book, StarDesignStyle } from '../types';
import { ModernStars } from './ModernStars';
import { StatusBadge } from './StatusBadge';
import { Calendar, Quote, ChevronRight, Star } from 'lucide-react';

interface BookCardProps {
  book: Book;
  onSelect: (book: Book) => void;
  starStyle?: StarDesignStyle;
  isAdmin?: boolean;
  onQuickEdit?: (book: Book) => void;
}

export const BookCard: React.FC<BookCardProps> = ({
  book,
  onSelect,
  starStyle = 'modern-sharp',
  isAdmin = false,
  onQuickEdit,
}) => {
  // Format date cleanly
  const formattedDate = (() => {
    try {
      const d = new Date(book.date);
      if (isNaN(d.getTime())) return book.date;
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return book.date;
    }
  })();

  return (
    <article
      id={`book-card-${book.id}`}
      onClick={() => onSelect(book)}
      className="group relative bg-white p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-100 flex flex-col shadow-xs hover:shadow-md transition-all cursor-pointer"
    >
      {/* Cover Image Presentation Container */}
      <div className="aspect-[3/4] bg-slate-100 rounded-lg mb-2 sm:mb-4 overflow-hidden relative group">
        <img
          src={book.coverUrl}
          alt={`Cover of ${book.title}`}
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop';
          }}
        />

        {/* Minimalist book spine shadow overlay */}
        <div className="absolute inset-y-0 left-0 w-2 sm:w-2.5 bg-gradient-to-r from-black/20 via-white/5 to-transparent pointer-events-none" />

        {/* Status Badge overlay on top-right */}
        <div className="absolute top-1.5 sm:top-3 right-1.5 sm:right-3 z-10 scale-85 sm:scale-100 origin-top-right">
          <StatusBadge status={book.status} size="sm" />
        </div>

        {/* Rating overlay badge on top-left */}
        <div className="absolute top-1.5 sm:top-3 left-1.5 sm:left-3 z-10 bg-white/95 backdrop-blur-xs px-1.5 sm:px-2 py-0.5 rounded shadow-xs text-[9px] sm:text-[10px] font-bold text-slate-800 flex items-center gap-0.5 sm:gap-1 border border-slate-100">
          <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-blue-600 fill-blue-600" />
          <span>{book.rating}.0</span>
        </div>
      </div>

      {/* Book Information Section */}
      <div className="flex-1 flex flex-col">
        {/* Title & Author */}
        <div className="mb-0.5 sm:mb-1">
          <h3 className="font-bold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors line-clamp-1 text-xs sm:text-base">
            {book.title}
          </h3>
        </div>
        <p className="text-[11px] sm:text-xs text-slate-500 mb-1.5 sm:mb-2.5 line-clamp-1">
          {book.author}
        </p>

        {/* Modern Minimalist Star Rating */}
        <div className="flex items-center gap-1 mb-1.5 sm:mb-3">
          <ModernStars
            rating={book.rating}
            size="xs"
            styleVariant={starStyle}
            showScore={false}
          />
          <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium ml-0.5 sm:ml-1">
            {book.rating}.0
          </span>
        </div>

        {/* Short Review Preview */}
        {book.review ? (
          <p className="text-[11px] sm:text-xs text-slate-600 line-clamp-1 sm:line-clamp-2 italic leading-tight sm:leading-relaxed mb-2 sm:mb-4">
            "{book.review}"
          </p>
        ) : null}

        {/* Footer: Date & Read More Link */}
        <div className="pt-1.5 sm:pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] sm:text-[11px] text-slate-400 mt-auto">
          <div className="flex items-center gap-1 sm:gap-1.5 truncate pr-1">
            <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-slate-400 shrink-0" />
            <span className="truncate">{formattedDate}</span>
          </div>

          <div className="flex items-center gap-0.5 font-semibold text-blue-600 group-hover:translate-x-0.5 transition-transform text-[11px] sm:text-xs shrink-0">
            <span>Details</span>
            <ChevronRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
          </div>
        </div>

        {/* Quick Admin action if authenticated */}
        {isAdmin && onQuickEdit && (
          <div className="mt-1.5 pt-1.5 border-t border-slate-100 flex justify-end">
            <button
              type="button"
              id={`quick-edit-${book.id}`}
              onClick={(e) => {
                e.stopPropagation();
                onQuickEdit(book);
              }}
              className="text-[10px] sm:text-[11px] font-semibold text-blue-600 hover:text-blue-800 hover:underline px-1.5 sm:px-2 py-0.5 rounded bg-blue-50/80"
            >
              Edit in Admin →
            </button>
          </div>
        )}
      </div>
    </article>
  );
};
