import React from 'react';
import { MediaType, ReadingStatus, SortOption } from '../types';
import { Search, X } from 'lucide-react';

export interface AuthorWithCount {
  author: string;
  count: number;
}

interface BookFiltersProps {
  statusFilter: 'all' | ReadingStatus;
  onStatusChange: (status: 'all' | ReadingStatus) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  selectedAuthor: string;
  onAuthorChange: (author: string) => void;
  authorsWithCount: AuthorWithCount[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusCounts: {
    all: number;
    'want-to-read': number;
    reading: number;
    read: number;
    void: number;
  };
  totalFilteredCount: number;
  onResetFilters: () => void;
  mediaType: MediaType;
}

export const BookFilters: React.FC<BookFiltersProps> = ({
  statusFilter,
  onStatusChange,
  sortBy,
  onSortChange,
  selectedAuthor,
  onAuthorChange,
  authorsWithCount,
  searchQuery,
  onSearchChange,
  statusCounts,
  totalFilteredCount,
  onResetFilters,
  mediaType,
}) => {
  const isVideo = mediaType !== 'book';
  const personLabel = isVideo ? 'Director' : 'Author';
  const statusLabels = isVideo
    ? { read: 'Watched', reading: 'Watching', want: 'Want' }
    : { read: 'Read', reading: 'Reading', want: 'Want' };
  const isFiltered =
    statusFilter !== 'all' ||
    selectedAuthor !== 'all' ||
    searchQuery.trim() !== '' ||
    sortBy !== 'rating-desc';

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-100 shadow-xs p-3 sm:p-5 mb-4 sm:mb-8">
      {/* Top Row: Clean Minimalist Segmented Tabs & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5 sm:gap-4 pb-2.5 sm:pb-4 border-b border-slate-100">
        {/* Status Filter Tabs (Clean Minimalism Segmented Control) */}
        <div className="flex p-0.5 sm:p-1 bg-slate-100 rounded-lg overflow-x-auto max-w-full scrollbar-none w-full sm:w-auto">
          {(
            [
              { key: 'all', label: 'All', count: statusCounts.all },
              { key: 'read', label: statusLabels.read, count: statusCounts.read },
              { key: 'reading', label: statusLabels.reading, count: statusCounts.reading },
              { key: 'want-to-read', label: statusLabels.want, count: statusCounts['want-to-read'] },
              { key: 'void', label: 'The Void', count: statusCounts.void },
            ] as const
          ).map((tab) => {
            const isActive = statusFilter === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                id={`filter-tab-${tab.key}`}
                onClick={() => onStatusChange(tab.key)}
                className={`cursor-pointer whitespace-nowrap px-2.5 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm transition-all flex items-center justify-center sm:justify-start gap-1 sm:gap-1.5 flex-1 sm:flex-initial ${
                  isActive
                    ? 'bg-white text-blue-600 font-semibold rounded-md shadow-xs'
                    : 'text-slate-500 font-medium hover:text-slate-900'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] sm:text-[11px] px-1 sm:px-1.5 py-0.5 rounded-full font-mono ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 font-bold'
                      : 'bg-slate-200/70 text-slate-500'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            id="search-input"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={`Search titles or ${personLabel.toLowerCase()}s...`}
            className="w-full pl-8 sm:pl-9 pr-7 sm:pr-8 py-1 sm:py-1.5 text-xs sm:text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400 text-slate-700"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
            >
              <X className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Bottom Controls Row: Sorting, Author Filtering, Clear Button */}
      <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3 pt-2.5 sm:pt-4 text-xs sm:text-sm">
        <div className="grid grid-cols-2 sm:flex items-center gap-2 w-full sm:w-auto">
          {/* Rating & Sorting Dropdown */}
          <div className="min-w-0">
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="w-full bg-white border border-slate-200 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium text-slate-600 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 cursor-pointer truncate"
            >
              <option value="rating-desc">Sort: Highest Rated</option>
              <option value="rating-asc">Sort: Lowest Rated</option>
              <option value="author-asc">Sort: {personLabel} A-Z</option>
              <option value="author-desc">Sort: {personLabel} Z-A</option>
              <option value="title-asc">Sort: Title A-Z</option>
              <option value="date-desc">Sort: Most Recent</option>
            </select>
          </div>

          {/* Author Filter Dropdown with Counts e.g. "Adam Silvera (8)" */}
          <div className="min-w-0">
            <select
              id="author-filter-select"
              value={selectedAuthor}
              onChange={(e) => onAuthorChange(e.target.value)}
              className="w-full bg-white border border-slate-200 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium text-slate-600 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 cursor-pointer sm:max-w-[240px] truncate"
            >
              <option value="all">All {personLabel}s</option>
              {authorsWithCount.map(({ author, count }) => (
                <option key={author} value={author}>
                  {author} ({count})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right side: Reset & Count */}
        <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-2.5 ml-auto">
          {/* Reset Filters button if any active */}
          {isFiltered ? (
            <button
              type="button"
              id="reset-filters-btn"
              onClick={onResetFilters}
              className="text-[11px] sm:text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md bg-blue-50 cursor-pointer"
            >
              <X className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              Reset Filters
            </button>
          ) : (
            <div />
          )}

          <div className="text-[11px] sm:text-xs text-slate-400 font-medium whitespace-nowrap">
            <strong className="text-slate-800 font-bold">{totalFilteredCount}</strong> entries
          </div>
        </div>
      </div>
    </div>
  );
};
