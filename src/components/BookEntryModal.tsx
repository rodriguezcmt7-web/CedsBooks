import React, { useState, useEffect, useRef } from 'react';
import { Book, ReadingStatus, StarDesignStyle } from '../types';
import { ModernStars } from './ModernStars';
import { X, Upload, Sparkles, BookOpen, Image as ImageIcon, Save, Check, Calendar } from 'lucide-react';

export const DEFAULT_COVER_URL =
  'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800&auto=format&fit=crop';

interface BookEntryModalProps {
  isOpen: boolean;
  bookToEdit: Book | null;
  onClose: () => void;
  onSave: (book: Book) => void;
  starStyle: StarDesignStyle;
}

export const BookEntryModal: React.FC<BookEntryModalProps> = ({
  isOpen,
  bookToEdit,
  onClose,
  onSave,
  starStyle,
}) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [coverUrl, setCoverUrl] = useState(DEFAULT_COVER_URL);
  const [rating, setRating] = useState<number>(5);
  const [status, setStatus] = useState<ReadingStatus>('read');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [errorMsg, setErrorMsg] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (bookToEdit) {
      setTitle(bookToEdit.title);
      setAuthor(bookToEdit.author);
      setCoverUrl(bookToEdit.coverUrl);
      setRating(bookToEdit.rating);
      setStatus(bookToEdit.status);
      setDate(bookToEdit.date);
    } else {
      setTitle('');
      setAuthor('');
      setCoverUrl(DEFAULT_COVER_URL);
      setRating(5);
      setStatus('read');
      setDate(new Date().toISOString().split('T')[0]);
    }
    setErrorMsg('');
  }, [bookToEdit, isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setCoverUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Please enter a book title.');
      return;
    }
    if (!author.trim()) {
      setErrorMsg('Please enter the author name.');
      return;
    }

    const newOrUpdatedBook: Book = {
      id: bookToEdit ? bookToEdit.id : `book-${Date.now()}`,
      title: title.trim(),
      author: author.trim(),
      coverUrl: coverUrl.trim() || DEFAULT_COVER_URL,
      rating,
      status,
      review: bookToEdit?.review,
      date: date || new Date().toISOString().split('T')[0],
      genre: bookToEdit?.genre,
      pages: bookToEdit?.pages,
      favoriteQuote: bookToEdit?.favoriteQuote,
    };

    onSave(newOrUpdatedBook);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* Top Minimalist Star Accent Bar */}
        <div className="h-1.5 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 shrink-0" />

        {/* Modal Header */}
        <div className="px-5 py-4 sm:px-6 sm:py-4.5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight font-serif-title">
                  {bookToEdit ? 'Edit Book Entry' : 'New Book Entry'}
                </h3>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500">
                {bookToEdit ? 'Update your review and rating' : "Add a book review to Ced's Books"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Content - Scrollable */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-5 sm:p-6 space-y-4 sm:space-y-5 flex-1">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          {/* Primary Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Book Title <span className="text-blue-600">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. The Midnight Library"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Author Name <span className="text-blue-600">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Matt Haig"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Status & Rating Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Reading Status
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['read', 'reading', 'want-to-read'] as ReadingStatus[]).map((s) => {
                  const isSelected = status === s;
                  const label =
                    s === 'read' ? 'Read' : s === 'reading' ? 'Reading' : 'Want to Read';
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setStatus(s)}
                      className={`px-2 py-1.5 text-center text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                        isSelected
                          ? s === 'read'
                            ? 'bg-blue-600 text-white shadow-xs'
                            : s === 'reading'
                            ? 'bg-orange-500 text-white shadow-xs'
                            : 'bg-slate-700 text-white shadow-xs'
                          : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Rating: <span className="text-blue-600 font-mono font-bold">{rating} / 5</span>
                </label>
                <span className="text-[10px] text-slate-400">Click stars to rate</span>
              </div>
              <div className="flex items-center gap-2 p-1.5 bg-white rounded-lg border border-slate-200">
                <ModernStars
                  rating={rating}
                  interactive={true}
                  size="md"
                  styleVariant={starStyle}
                  onChange={(newRating) => setRating(newRating)}
                />
                <span className="text-xs font-bold text-slate-700 font-mono ml-auto">
                  {rating}.0 / 5
                </span>
              </div>
            </div>
          </div>

          {/* Cover Image Configuration */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
                <span>Book Cover Image</span>
              </label>
              <span className="text-[10px] text-slate-400">URL link or upload image</span>
            </div>

            <div className="flex gap-3 items-start">
              {/* Cover Preview Thumbnail */}
              <div className="relative w-14 h-20 sm:w-16 sm:h-24 rounded-lg bg-slate-200 overflow-hidden border border-slate-300 shrink-0 shadow-xs flex items-center justify-center">
                {coverUrl ? (
                  <img
                    src={coverUrl}
                    alt="Cover Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = DEFAULT_COVER_URL;
                    }}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-400 p-1 text-center">
                    <ImageIcon className="w-5 h-5 mb-0.5" />
                    <span className="text-[9px]">No image</span>
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-2.5">
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">
                    Image URL
                  </label>
                  <input
                    type="url"
                    id="book-cover-url-input"
                    placeholder="Paste direct cover image URL (https://...)"
                    value={coverUrl}
                    onChange={(e) => setCoverUrl(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div className="flex items-center gap-2.5 pt-0.5">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-blue-600 transition-colors cursor-pointer shadow-2xs"
                  >
                    <Upload className="w-3.5 h-3.5 text-blue-600" />
                    <span>Upload Image</span>
                  </button>
                  <span className="text-[11px] text-slate-400">
                    JPG, PNG, WebP supported
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Date Recorded Field (Kept as requested) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              <span>Date Recorded</span>
            </label>
            <input
              type="date"
              id="book-entry-date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 font-medium"
            />
          </div>

          {/* Modal Actions Footer */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{bookToEdit ? 'Save Changes' : 'Add Book Entry'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
