import React, { useState, useRef } from 'react';
import { Book, MediaType, ReadingStatus, StarDesignStyle, ThemeMode } from '../types';
import { ModernStars } from './ModernStars';
import { BookEntryModal } from './BookEntryModal';
import {
  Plus,
  Trash2,
  Edit2,
  ArrowLeft,
  LogOut,
  ShieldCheck,
  CheckCircle2,
  Key,
  Library,
  AlertTriangle,
  Search,
  Settings,
  Download,
  Upload,
  RotateCcw,
  Sparkles,
  Eye,
  EyeOff,
  Sliders,
  Check,
  BookOpen,
  Moon,
  Sun,
} from 'lucide-react';

interface AdminDashboardProps {
  books: Book[];
  onSaveBook: (book: Book) => void;
  onDeleteBook: (id: string) => void;
  onCloseAdmin: () => void;
  onLogout: () => void;
  currentPassword: string;
  onUpdatePassword: (newPass: string) => void;
  starStyle: StarDesignStyle;
  onUpdateStarStyle: (newStyle: StarDesignStyle) => void;
  onResetBooks: () => void;
  onImportBooks: (books: Book[]) => void;
  initialEditingBook?: Book | null;
  initialTab?: 'collection' | 'settings';
  theme: ThemeMode;
  onToggleTheme: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  books,
  onSaveBook,
  onDeleteBook,
  onCloseAdmin,
  onLogout,
  currentPassword,
  onUpdatePassword,
  starStyle,
  onUpdateStarStyle,
  onResetBooks,
  onImportBooks,
  initialEditingBook = null,
  initialTab = 'collection',
  theme,
  onToggleTheme,
}) => {
  const [activeTab, setActiveTab] = useState<'collection' | 'settings'>(initialTab);

  // Entry Modal State
  const [isEntryModalOpen, setIsEntryModalOpen] = useState<boolean>(Boolean(initialEditingBook));
  const [bookToEdit, setBookToEdit] = useState<Book | null>(initialEditingBook);

  // Search in Admin
  const [adminSearch, setAdminSearch] = useState('');
  const [activeMediaType, setActiveMediaType] = useState<MediaType>('book');

  // Delete Confirmation modal
  const [deletingBook, setDeletingBook] = useState<Book | null>(null);

  // Reset Confirmation modal
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Notification Toast
  const [notification, setNotification] = useState<string | null>(null);

  // Password Settings State
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPass, setShowNewPass] = useState(false);
  const [passError, setPassError] = useState('');

  // Import File Input Ref
  const importFileRef = useRef<HTMLInputElement>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleOpenAddModal = () => {
    setBookToEdit(null);
    setIsEntryModalOpen(true);
  };

  const handleOpenEditModal = (book: Book) => {
    setBookToEdit(book);
    setIsEntryModalOpen(true);
  };

  const handleSaveBookFromModal = (book: Book) => {
    onSaveBook(book);
    showNotification(bookToEdit ? 'Book review updated!' : 'New book review added!');
    setIsEntryModalOpen(false);
    setBookToEdit(null);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPassError('');

    if (!newPassword.trim()) {
      setPassError('Password cannot be empty.');
      return;
    }
    if (newPassword.trim().length < 4) {
      setPassError('Password must be at least 4 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPassError('New passwords do not match.');
      return;
    }

    onUpdatePassword(newPassword.trim());
    setNewPassword('');
    setConfirmPassword('');
    showNotification('Admin passcode updated successfully!');
  };

  const handleResetPasswordDefault = () => {
    onUpdatePassword('Daddy_Matthew_05!');
    setNewPassword('');
    setConfirmPassword('');
    setPassError('');
    showNotification('Passcode reset to default: Daddy_Matthew_05!');
  };

  // Export collection as JSON
  const handleExportJSON = () => {
    try {
      const dataStr = JSON.stringify(books, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const dateStr = new Date().toISOString().slice(0, 10);
      link.download = `ceds-books-reviews-${dateStr}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showNotification(`Exported ${books.length} book reviews to JSON!`);
    } catch (err) {
      console.error('Export error:', err);
      showNotification('Failed to export library.');
    }
  };

  // Import collection from JSON
  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result;
        if (typeof text !== 'string') return;
        const parsed = JSON.parse(text);

        if (!Array.isArray(parsed)) {
          showNotification('Invalid file: JSON must contain an array of books.');
          return;
        }

        // Validate basic book items
        const validBooks: Book[] = parsed.filter(
          (b) => b && typeof b.id === 'string' && typeof b.title === 'string' && typeof b.author === 'string'
        );

        if (validBooks.length === 0) {
          showNotification('No valid book reviews found in file.');
          return;
        }

        onImportBooks(validBooks);
        showNotification(`Successfully imported ${validBooks.length} books!`);
      } catch (err) {
        console.error('Import parse error:', err);
        showNotification('Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);

    // Reset input
    e.target.value = '';
  };

  // Filter books in admin list
  const filteredBooks = books.filter(
    (b) =>
      (b.mediaType ?? 'book') === activeMediaType &&
      b.title.toLowerCase().includes(adminSearch.toLowerCase()) ||
      b.author.toLowerCase().includes(adminSearch.toLowerCase()) ||
      b.status.toLowerCase().includes(adminSearch.toLowerCase())
  );

  const totalRead = books.filter((b) => b.status === 'read').length;
  const totalReading = books.filter((b) => b.status === 'reading').length;
  const totalWantToRead = books.filter((b) => b.status === 'want-to-read').length;
  const avgRating = books.length > 0 ? (books.reduce((acc, b) => acc + b.rating, 0) / books.length).toFixed(1) : '0.0';

  return (
    <div className={`app-theme-${theme} star-surface min-h-screen text-slate-900 pb-16`}>
      {/* =========================================================================
          MAIN ADMIN HEADER BAR (Spans the very top of the admin portal page)
          ========================================================================= */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3.5 flex flex-wrap items-center justify-between gap-3">
          {/* Brand & Portal Title */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-bold tracking-tight text-white flex items-center gap-1.5 font-serif-title">
                  <span>Ced's Archives</span>
                  <span className="text-slate-400 font-normal text-xs font-sans">Admin Portal</span>
                </h1>
                <span className="text-[10px] font-mono uppercase bg-blue-500/20 text-blue-300 border border-blue-400/30 px-1.5 py-0.5 rounded font-semibold">
                  AUTHENTICATED
                </span>
              </div>
            </div>
          </div>

          {/* Right Navigation Actions */}
          <div className="flex items-center gap-2 sm:gap-3 ml-auto">
            <button
              type="button"
              id="admin-view-public-site-btn"
              onClick={onCloseAdmin}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors cursor-pointer"
              title="Return to the public book archive"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-blue-400" />
              <span>Public View</span>
            </button>

            <button
              type="button"
              id="admin-logout-btn"
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-800/50 text-xs font-semibold transition-colors cursor-pointer"
              title="Lock Admin and log out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Media tabs */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 border-t border-slate-800/80 pt-1">
          <div className="flex overflow-x-auto gap-2">
            {(['book', 'movie', 'show'] as MediaType[]).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setActiveMediaType(type)}
                className={`cursor-pointer px-4 py-2 text-xs sm:text-sm font-semibold rounded-t-lg transition-colors border-b-2 ${
                  activeMediaType === type
                    ? 'border-blue-400 text-blue-300 bg-slate-800/60'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
                }`}
              >
                {type === 'book' ? 'Books' : type === 'movie' ? 'Movies' : 'Shows'}
                <span className="ml-1.5 opacity-70">({books.filter((book) => (book.mediaType ?? 'book') === type).length})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Admin navigation */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex overflow-x-auto gap-2 border-t border-slate-800/80 pt-1">
          <button type="button" onClick={onToggleTheme} className="theme-toggle ml-auto self-center" aria-label="Toggle theme" title="Toggle theme">
            {theme === 'light' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
          </button>
          <button
            type="button"
            id="tab-manage-books"
            onClick={() => setActiveTab('collection')}
            className={`cursor-pointer px-4 py-2 text-xs sm:text-sm font-semibold rounded-t-lg transition-colors flex items-center gap-2 border-b-2 ${
              activeTab === 'collection'
                ? 'border-blue-500 text-blue-400 bg-slate-800/60'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
            }`}
          >
            <Library className="w-4 h-4" />
                    <span>Entries ({books.length})</span>
          </button>

          <button
            type="button"
            id="tab-admin-settings"
            onClick={() => setActiveTab('settings')}
            className={`cursor-pointer px-4 py-2 text-xs sm:text-sm font-semibold rounded-t-lg transition-colors flex items-center gap-2 border-b-2 ${
              activeTab === 'settings'
                ? 'border-blue-500 text-blue-400 bg-slate-800/60'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
        </div>
      </header>

      {/* Notification Toast */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl border border-blue-400/40 shadow-xl flex items-center gap-2.5 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-medium">{notification}</span>
        </div>
      )}

      {/* Delete Book Confirmation Modal */}
      {deletingBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl p-5 sm:p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center gap-2.5 text-red-600 mb-2">
              <AlertTriangle className="w-5 h-5" />
              <h4 className="text-base font-bold text-slate-900">Delete Archive Entry?</h4>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mb-5 leading-relaxed">
              Are you sure you want to delete{' '}
              <strong className="text-slate-900">"{deletingBook.title}"</strong> by{' '}
              {deletingBook.author}? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setDeletingBook(null)}
                className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                id="confirm-delete-book-btn"
                onClick={() => {
                  onDeleteBook(deletingBook.id);
                  setDeletingBook(null);
                  showNotification('Book deleted.');
                }}
                className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-xs cursor-pointer"
              >
                Delete Book
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Library Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl p-5 sm:p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center gap-2.5 text-amber-600 mb-2">
              <RotateCcw className="w-5 h-5" />
              <h4 className="text-base font-bold text-slate-900">Reset to Sample Books?</h4>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mb-5 leading-relaxed">
              This will replace all your current book reviews with the 8 original curated sample books. Make sure you have exported a JSON backup if you wish to keep your edits.
            </p>
            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onResetBooks();
                  setShowResetConfirm(false);
                  showNotification('Library reset to curated sample books!');
                }}
                className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-xs cursor-pointer"
              >
                Reset Library
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Book Entry Modal for adding and editing */}
      <BookEntryModal
        isOpen={isEntryModalOpen}
        bookToEdit={bookToEdit}
        onClose={() => {
          setIsEntryModalOpen(false);
          setBookToEdit(null);
        }}
        onSave={handleSaveBookFromModal}
        starStyle={starStyle}
      />

      {/* Hidden File Input for JSON import */}
      <input
        type="file"
        ref={importFileRef}
        accept=".json,application/json"
        className="hidden"
        onChange={handleImportFile}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8">
        {/* =========================================================================
            TAB 1: BOOK COLLECTION MANAGEMENT
            ========================================================================= */}
        {activeTab === 'collection' && (
          <div className="space-y-5">
            {/* Top Control Bar with Search & Add Entry Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200 shadow-xs">
              <div>
                <div className="flex items-center gap-1.5">
                  <h2 className="text-lg sm:text-xl font-bold font-serif-title text-slate-900">
                    Entry Archives
                  </h2>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Manage entries, adjust ratings, update status, or add new titles.
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="relative flex-1 sm:w-60">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search entries..."
                    value={adminSearch}
                    onChange={(e) => setAdminSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <button
                  type="button"
                  id="admin-add-new-book-btn"
                  onClick={handleOpenAddModal}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Entry</span>
                </button>
              </div>
            </div>

            {/* Books Management Table */}
            <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      <th className="py-2.5 px-3 sm:px-4">Entry</th>
                      <th className="py-2.5 px-3 sm:px-4">Rating</th>
                      <th className="py-2.5 px-3 sm:px-4">Status</th>
                      <th className="py-2.5 px-3 sm:px-4 hidden sm:table-cell">Date Recorded</th>
                      <th className="py-2.5 px-3 sm:px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                    {filteredBooks.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-10 text-center text-slate-400 text-xs">
                          No entries match your search.
                        </td>
                      </tr>
                    ) : (
                      filteredBooks.map((book) => (
                        <tr
                          key={book.id}
                          className="hover:bg-blue-50/40 transition-colors group"
                        >
                          {/* Book info & cover */}
                          <td className="py-2.5 px-3 sm:px-4">
                            <div className="flex items-center gap-2.5">
                              <img
                                src={book.coverUrl}
                                alt={book.title}
                                className="w-9 h-12 sm:w-10 sm:h-14 object-cover rounded shadow-xs border border-slate-200 shrink-0"
                              />
                              <div>
                                <h4 className="font-serif-title font-bold text-slate-900 group-hover:text-blue-900 line-clamp-1 text-xs sm:text-sm">
                                  {book.title}
                                </h4>
                                <p className="text-[11px] text-slate-500">
                                  {book.author}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Interactive Inline Rating Adjustment */}
                          <td className="py-2.5 px-3 sm:px-4 whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <ModernStars
                                rating={book.rating}
                                size="xs"
                                interactive={true}
                                styleVariant={starStyle}
                                onChange={(newRating) => {
                                  onSaveBook({ ...book, rating: newRating });
                                  showNotification(`Rating updated to ${newRating} stars`);
                                }}
                              />
                              <span className="text-[11px] font-mono text-slate-600">
                                ({book.rating})
                              </span>
                            </div>
                          </td>

                          {/* Interactive Inline Status Dropdown */}
                          <td className="py-2.5 px-3 sm:px-4 whitespace-nowrap">
                            <select
                              value={book.status}
                              onChange={(e) => {
                                const newStatus = e.target.value as ReadingStatus;
                                onSaveBook({ ...book, status: newStatus });
                                showNotification(`Status changed to ${newStatus}`);
                              }}
                              className="text-[11px] sm:text-xs font-semibold px-2 py-1 rounded-lg border border-slate-200 bg-white text-slate-700 cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                              <option value="want-to-read">Want</option>
                              <option value="reading">Reading</option>
                              <option value="read">Read</option>
                              <option value="void">The Void</option>
                            </select>
                          </td>

                          {/* Date */}
                          <td className="py-2.5 px-3 sm:px-4 text-[11px] text-slate-500 whitespace-nowrap hidden sm:table-cell">
                            {book.date}
                          </td>

                          {/* Action Buttons */}
                          <td className="py-2.5 px-3 sm:px-4 text-right whitespace-nowrap">
                            <div className="inline-flex items-center gap-1">
                              <button
                                type="button"
                                id={`admin-edit-${book.id}`}
                                onClick={() => handleOpenEditModal(book)}
                                className="p-1.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                                title="Edit in modal"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                id={`admin-delete-${book.id}`}
                                onClick={() => setDeletingBook(book)}
                                className="p-1.5 rounded-lg text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                                title="Delete book"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: SETTINGS (Admin Passkey, Star Style, Data Backup & Reset)
            ========================================================================= */}
        {activeTab === 'settings' && (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold font-serif-title text-slate-900">
                  Admin Settings & Preferences
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage your admin passkey, data backups, and collection settings.
              </p>
            </div>

            {/* Quick Metrics Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                  Total Reviews
                </span>
                <div className="text-xl font-bold font-mono text-slate-900">{books.length}</div>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                  Finished
                </span>
                <div className="text-xl font-bold font-mono text-blue-600">{totalRead}</div>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                  Currently Reading
                </span>
                <div className="text-xl font-bold font-mono text-orange-500">{totalReading}</div>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                  Average Rating
                </span>
                <div className="text-xl font-bold font-mono text-slate-900">
                  {avgRating} / 5
                </div>
              </div>
            </div>

            {/* 1. Admin Passkey & Security Card */}
            <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Key className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 font-serif-title">
                      Admin Passkey & Security
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Update the passcode required to access the admin portal.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleResetPasswordDefault}
                  className="text-[11px] font-semibold text-slate-500 hover:text-blue-600 hover:underline cursor-pointer"
                  title="Reset passcode to default Daddy_Matthew_05!"
                >
                  Reset to default
                </button>
              </div>

              {/* Current Password Indicator */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-slate-700">
                  <span className="text-slate-500">Current Passcode:</span>
                  <strong className="font-mono bg-white px-2 py-0.5 rounded border border-slate-200">
                    {showCurrentPass ? currentPassword : '••••••••'}
                  </strong>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCurrentPass(!showCurrentPass)}
                  className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                  title={showCurrentPass ? 'Hide password' : 'Show password'}
                >
                  {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Change Password Form */}
              <form onSubmit={handlePasswordSubmit} className="space-y-3 pt-1">
                {passError && (
                  <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                    {passError}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      New Passcode
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPass ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new passcode..."
                        required
                        className="w-full px-3 py-2 pr-9 text-xs sm:text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPass(!showNewPass)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showNewPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Confirm New Passcode
                    </label>
                    <input
                      type={showNewPass ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter new passcode..."
                      required
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Save New Passcode</span>
                  </button>
                </div>
              </form>
            </div>

            {/* 2. Library Data Management & Backups Card */}
            <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 font-serif-title">
                    Collection Data & Backups
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Export your collection, import from a JSON backup, or reset to original sample books.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                {/* Export Card */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-1">
                      <Download className="w-3.5 h-3.5 text-blue-600" />
                      <span>Export Collection</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mb-3">
                      Download a complete JSON backup of all {books.length} reviews and quotes.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleExportJSON}
                    className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-blue-600" />
                    <span>Download JSON</span>
                  </button>
                </div>

                {/* Import Card */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-1">
                      <Upload className="w-3.5 h-3.5 text-blue-600" />
                      <span>Import Collection</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mb-3">
                      Restore or replace your reviews from a previously exported JSON file.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => importFileRef.current?.click()}
                    className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5 text-blue-600" />
                    <span>Upload JSON</span>
                  </button>
                </div>

                {/* Reset Card */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-1">
                      <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
                      <span>Sample Reset</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mb-3">
                      Reset your library back to the original 8 curated book reviews.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowResetConfirm(true)}
                    className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-amber-200 hover:bg-amber-50 text-amber-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
                    <span>Reset to Sample</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
