import React, { useState, useEffect, useRef } from 'react';
import { Book, CollectionFormat, MediaType, ReadingStatus, StarDesignStyle } from '../types';
import { ModernStars } from './ModernStars';
import { X, Upload, Sparkles, BookOpen, Image as ImageIcon, Save, Check, Calendar } from 'lucide-react';

export const DEFAULT_COVER_URL =
  'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800&auto=format&fit=crop';

const getDateParts = (value: string) => {
  const [year = '', month = '', day = ''] = value.split('-');
  return { year, month, day };
};

const composePartialDate = (year: string, month: string, day: string) => {
  if (!year) return '';
  if (!month) return year;
  if (!day) return `${year}-${month.padStart(2, '0')}`;
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
};

interface DatePartsFieldsProps {
  label: string;
  prefix: string;
  year: string;
  month: string;
  day: string;
  onYearChange: (value: string) => void;
  onMonthChange: (value: string) => void;
  onDayChange: (value: string) => void;
}

const DatePartsFields: React.FC<DatePartsFieldsProps> = ({
  label,
  prefix,
  year,
  month,
  day,
  onYearChange,
  onMonthChange,
  onDayChange,
}) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1899 }, (_, index) => String(currentYear - index));
  const months = [
    ['01', 'January'], ['02', 'February'], ['03', 'March'], ['04', 'April'],
    ['05', 'May'], ['06', 'June'], ['07', 'July'], ['08', 'August'],
    ['09', 'September'], ['10', 'October'], ['11', 'November'], ['12', 'December'],
  ];
  const days = Array.from({ length: 31 }, (_, index) => String(index + 1).padStart(2, '0'));
  const selectClass = 'w-full px-2.5 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 font-medium';

  return (
    <div>
      <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
        <Calendar className="w-3.5 h-3.5 text-blue-600" />
        <span>{label}</span>
      </label>
      <div className="grid grid-cols-3 gap-1.5">
        <select
          id={`${prefix}-year`}
          aria-label={`${label} year`}
          value={year}
          onChange={(e) => onYearChange(e.target.value)}
          className={selectClass}
        >
          <option value=""></option>
          {years.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
        <select
          id={`${prefix}-month`}
          aria-label={`${label} month`}
          value={month}
          onChange={(e) => onMonthChange(e.target.value)}
          className={selectClass}
        >
          <option value=""></option>
          {months.map(([value, name]) => <option key={value} value={value}>{name}</option>)}
        </select>
        <select
          id={`${prefix}-day`}
          aria-label={`${label} day`}
          value={day}
          onChange={(e) => onDayChange(e.target.value)}
          className={selectClass}
        >
          <option value=""></option>
          {days.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
      </div>
      <p className="text-[10px] text-slate-400 mt-1">Month and day are optional.</p>
    </div>
  );
};

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
  const [rating, setRating] = useState<number>(0);
  const [status, setStatus] = useState<ReadingStatus>('read');
  const [timesConsumed, setTimesConsumed] = useState(1);
  const [mediaType, setMediaType] = useState<MediaType>('book');
  const [format, setFormat] = useState<CollectionFormat>('physical');
  const [hasDuplicate, setHasDuplicate] = useState(false);
  const [startedYear, setStartedYear] = useState('');
  const [startedMonth, setStartedMonth] = useState('');
  const [startedDay, setStartedDay] = useState('');
  const [finishedYear, setFinishedYear] = useState('');
  const [finishedMonth, setFinishedMonth] = useState('');
  const [finishedDay, setFinishedDay] = useState('');
  const [recordedYear, setRecordedYear] = useState('');
  const [recordedMonth, setRecordedMonth] = useState('');
  const [recordedDay, setRecordedDay] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (bookToEdit) {
      setTitle(bookToEdit.title);
      setAuthor(bookToEdit.author);
      setCoverUrl(bookToEdit.coverUrl);
      setRating(bookToEdit.rating);
      setStatus(bookToEdit.status);
      setTimesConsumed(bookToEdit.timesConsumed ?? 0);
      setMediaType(bookToEdit.mediaType ?? 'book');
      setFormat(bookToEdit.format ?? 'physical');
      setHasDuplicate(Boolean(bookToEdit.hasDuplicate));
      const recordedDate = getDateParts(bookToEdit.date);
      const startedDate = getDateParts(bookToEdit.dateStarted ?? '');
      const finishedDate = getDateParts(bookToEdit.dateFinished ?? '');
      setRecordedYear(recordedDate.year);
      setRecordedMonth(recordedDate.month);
      setRecordedDay(recordedDate.day);
      setStartedYear(startedDate.year);
      setStartedMonth(startedDate.month);
      setStartedDay(startedDate.day);
      setFinishedYear(finishedDate.year);
      setFinishedMonth(finishedDate.month);
      setFinishedDay(finishedDate.day);
    } else {
      setTitle('');
      setAuthor('');
      setCoverUrl(DEFAULT_COVER_URL);
      setRating(0);
      setStatus('read');
      setTimesConsumed(1);
      setMediaType('book');
      setFormat('physical');
      setHasDuplicate(false);
      setRecordedYear('');
      setRecordedMonth('');
      setRecordedDay('');
      setStartedYear('');
      setStartedMonth('');
      setStartedDay('');
      setFinishedYear('');
      setFinishedMonth('');
      setFinishedDay('');
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
    const recordedDate = composePartialDate(recordedYear, recordedMonth, recordedDay);
    const startedDate = composePartialDate(startedYear, startedMonth, startedDay);
    const finishedDate = composePartialDate(finishedYear, finishedMonth, finishedDay);
    const hasDateParts = (year: string, month: string, day: string) => year || month || day;
    if (hasDateParts(recordedYear, recordedMonth, recordedDay) && !/^\d{4}$/.test(recordedYear)) {
      setErrorMsg('Recorded date needs a four-digit year.');
      return;
    }
    if (hasDateParts(startedYear, startedMonth, startedDay) && !/^\d{4}$/.test(startedYear)) {
      setErrorMsg('Started date needs a four-digit year.');
      return;
    }
    if (hasDateParts(finishedYear, finishedMonth, finishedDay) && !/^\d{4}$/.test(finishedYear)) {
      setErrorMsg('Finished date needs a four-digit year.');
      return;
    }
    if ((startedDay && !startedMonth) || (finishedDay && !finishedMonth) || (recordedDay && !recordedMonth)) {
      setErrorMsg('Choose a month before entering a day.');
      return;
    }
    if (startedDate && finishedDate && finishedDate < startedDate) {
      setErrorMsg('The finished date cannot be earlier than the started date.');
      return;
    }

    const newOrUpdatedBook: Book = {
      id: bookToEdit ? bookToEdit.id : `book-${Date.now()}`,
      title: title.trim(),
      author: author.trim(),
      coverUrl: coverUrl.trim() || DEFAULT_COVER_URL,
      rating,
      status,
      timesConsumed: Math.max(0, timesConsumed || 0),
      mediaType,
      format,
      hasDuplicate,
      isDuplicate: bookToEdit?.isDuplicate,
      duplicateOfId: bookToEdit?.duplicateOfId,
      review: bookToEdit?.review,
      date: recordedDate,
      dateStarted: startedDate || undefined,
      dateFinished: finishedDate || undefined,
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
                  {bookToEdit ? 'Edit Archive Entry' : 'New Archive Entry'}
                </h3>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500">
                {bookToEdit ? 'Update your archive entry' : "Add a title to Ced's Archives"}
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
                Entry Title <span className="text-blue-600">*</span>
              </label>
              <input
                type="text"
                required
                placeholder={mediaType === 'book' ? 'e.g. The Midnight Library' : 'e.g. The Last of Us'}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {mediaType === 'book' ? 'Author Name' : 'Director Name'} <span className="text-blue-600">*</span>
              </label>
              <input
                type="text"
                required
                placeholder={mediaType === 'book' ? 'e.g. Matt Haig' : 'e.g. Greta Gerwig'}
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Archive Type</label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['book', 'movie', 'show'] as MediaType[]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setMediaType(type)}
                    className={`px-2 py-2 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                      mediaType === type
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600'
                    }`}
                  >
                    {type === 'book' ? 'Book' : type === 'movie' ? 'Movie' : 'Show'}
                  </button>
                ))}
              </div>
            </div>
            {mediaType === 'book' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Edition</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {(['physical', 'ebook'] as CollectionFormat[]).map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setFormat(value)}
                      className={`px-2 py-2 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                        format === value
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600'
                      }`}
                    >
                      {value === 'physical' ? 'Physical' : 'E-book'}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Status & Rating Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Reading Status
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {(['read', 'reading', 'want-to-read', 'void'] as ReadingStatus[]).map((s) => {
                  const isSelected = status === s;
                  const label =
                    s === 'read'
                      ? mediaType === 'book' ? 'Read' : 'Watched'
                      : s === 'reading'
                      ? mediaType === 'book' ? 'Reading' : 'Watching'
                      : s === 'want-to-read' ? 'Want' : 'The Void';
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
                            : s === 'void'
                            ? 'bg-slate-800 text-white shadow-xs'
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
              <label htmlFor="times-consumed" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Times Read / Watched
              </label>
              <input
                type="number"
                id="times-consumed"
                min="0"
                step="1"
                value={timesConsumed}
                onChange={(e) => setTimesConsumed(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 font-medium"
              />
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

          <label className="flex items-start gap-2.5 p-3 rounded-xl bg-blue-50/70 border border-blue-100 cursor-pointer">
            <input
              type="checkbox"
              checked={hasDuplicate}
              onChange={(e) => setHasDuplicate(e.target.checked)}
              className="mt-0.5 h-4 w-4 accent-blue-600 cursor-pointer"
            />
            <span>
              <span className="block text-xs font-semibold text-slate-800">Do you have a duplicate of this?</span>
              <span className="block text-[11px] text-slate-500 mt-0.5">Show a second copy in the public archive.</span>
            </span>
          </label>

          {/* Cover Image Configuration */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
                <span>Entry Cover Image</span>
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

          {/* Reading Timeline */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
            <DatePartsFields
              label="Date Started"
              prefix="book-date-started"
              year={startedYear}
              month={startedMonth}
              day={startedDay}
              onYearChange={setStartedYear}
              onMonthChange={setStartedMonth}
              onDayChange={setStartedDay}
            />
            <DatePartsFields
              label="Date Finished"
              prefix="book-date-finished"
              year={finishedYear}
              month={finishedMonth}
              day={finishedDay}
              onYearChange={setFinishedYear}
              onMonthChange={setFinishedMonth}
              onDayChange={setFinishedDay}
            />
            <DatePartsFields
              label="Date Recorded"
              prefix="book-entry-date"
              year={recordedYear}
              month={recordedMonth}
              day={recordedDay}
              onYearChange={setRecordedYear}
              onMonthChange={setRecordedMonth}
              onDayChange={setRecordedDay}
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
              <span>{bookToEdit ? 'Save Changes' : 'Add Entry'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
