import React from 'react';
import { MediaType, ReadingStatus } from '../types';
import { BookOpen, BookmarkCheck, Sparkles } from 'lucide-react';

interface StatusBadgeProps {
  status: ReadingStatus;
  size?: 'sm' | 'md';
  className?: string;
  mediaType?: MediaType;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  className = '',
  mediaType = 'book',
}) => {
  const isVideo = mediaType !== 'book';
  const sizeClasses =
    size === 'sm'
      ? 'px-2 py-0.5 text-[10px]'
      : 'px-2.5 py-1 text-xs';

  switch (status) {
    case 'reading':
      return (
        <span
          className={`inline-flex items-center gap-1 font-bold rounded uppercase tracking-wider bg-orange-500 text-white shadow-sm ${sizeClasses} ${className}`}
        >
          {isVideo ? 'Watching' : 'Reading'}
        </span>
      );
    case 'read':
      return (
        <span
          className={`inline-flex items-center gap-1 font-bold rounded uppercase tracking-wider bg-blue-600 text-white shadow-sm ${sizeClasses} ${className}`}
        >
          {isVideo ? 'Watched' : 'Read'}
        </span>
      );
    case 'want-to-read':
      return (
        <span
          className={`inline-flex items-center gap-1 font-bold rounded uppercase tracking-wider bg-slate-400 text-white shadow-sm ${sizeClasses} ${className}`}
        >
          Want
        </span>
      );
    case 'void':
      return (
        <span
          className={`inline-flex items-center gap-1 font-bold rounded uppercase tracking-wider bg-slate-800 text-white shadow-sm ${sizeClasses} ${className}`}
        >
          The Void
        </span>
      );
    default:
      return (
        <span
          className={`inline-flex items-center gap-1 font-bold rounded uppercase tracking-wider bg-slate-400 text-white shadow-sm ${sizeClasses} ${className}`}
        >
          Want
        </span>
      );
  }
};
