import React, { useState } from 'react';

interface ModernStarsProps {
  rating: number;
  maxRating?: number;
  interactive?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  onChange?: (rating: number) => void;
  styleVariant?: string;
  showScore?: boolean;
  className?: string;
}

export const ModernStars: React.FC<ModernStarsProps> = ({
  rating,
  maxRating = 5,
  interactive = false,
  size = 'md',
  onChange,
  showScore = false,
  className = '',
}) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const activeRating = hoverRating !== null ? hoverRating : rating;

  const sizeDimensions = {
    xs: 'w-3 h-3',
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
    xl: 'w-6 h-6',
  }[size];

  // Classic, crisp 5-pointed star
  const renderStarIcon = (isFilled: boolean) => {
    return (
      <svg
        viewBox="0 0 24 24"
        className={`${sizeDimensions} transition-transform duration-150 ${
          interactive ? 'group-hover:scale-110' : ''
        }`}
        fill={isFilled ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon
          points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
          className={
            isFilled
              ? 'text-blue-500 fill-blue-500 drop-shadow-[0_1px_2px_rgba(59,130,246,0.25)]'
              : 'text-slate-300 fill-slate-100/60'
          }
        />
      </svg>
    );
  };

  return (
    <div className={`inline-flex items-center gap-1 ${className}`}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: maxRating }).map((_, i) => {
          const starValue = i + 1;
          const isFilled = activeRating >= starValue;

          if (interactive) {
            return (
              <button
                key={i}
                type="button"
                id={`rating-star-btn-${starValue}`}
                aria-label={`Rate ${starValue} of ${maxRating} stars`}
                onClick={() => onChange && onChange(starValue)}
                onMouseEnter={() => setHoverRating(starValue)}
                onMouseLeave={() => setHoverRating(null)}
                className="group p-0.5 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 cursor-pointer transition-transform hover:scale-110"
              >
                {renderStarIcon(isFilled)}
              </button>
            );
          }

          return (
            <span key={i} className="inline-flex">
              {renderStarIcon(isFilled)}
            </span>
          );
        })}
      </div>

      {showScore && (
        <span className="ml-1.5 text-xs font-semibold text-slate-700 tracking-tight">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};
