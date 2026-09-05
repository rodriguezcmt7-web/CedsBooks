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

  // Classic, crisp 5-pointed star with a fractional fill for half ratings.
  const renderStarIcon = (fillAmount: number) => {
    const fillPercentage = `${Math.max(0, Math.min(1, fillAmount)) * 100}%`;
    const starShape = (className: string) => (
      <svg
        viewBox="0 0 24 24"
        className={`${sizeDimensions} ${className}`}
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    );

    return (
      <span className="relative inline-flex shrink-0">
        {starShape('text-slate-300 fill-slate-100/60')}
        <span className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: fillPercentage }}>
          {starShape('text-blue-500 fill-blue-500 drop-shadow-[0_1px_2px_rgba(59,130,246,0.25)]')}
        </span>
      </span>
    );
  };

  return (
    <div className={`inline-flex items-center gap-1 ${className}`}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: maxRating }).map((_, i) => {
          const starValue = i + 1;
          const fillAmount = activeRating - i;

          if (interactive) {
            return (
              <span
                key={i}
                className="relative inline-flex p-0.5 rounded focus-within:ring-1 focus-within:ring-blue-400 cursor-pointer transition-transform hover:scale-110"
                onMouseLeave={() => setHoverRating(null)}
              >
                {renderStarIcon(fillAmount)}
                <button
                  type="button"
                  id={`rating-star-btn-${starValue}-half`}
                  aria-label={`Rate ${(starValue - 0.5).toFixed(1)} of ${maxRating} stars`}
                  onClick={() => onChange && onChange(starValue - 0.5)}
                  onMouseEnter={() => setHoverRating(starValue - 0.5)}
                  className="absolute inset-y-0 left-0 w-1/2 rounded-l focus:outline-none"
                />
                <button
                  type="button"
                  id={`rating-star-btn-${starValue}`}
                  aria-label={`Rate ${starValue} of ${maxRating} stars`}
                  onClick={() => onChange && onChange(starValue)}
                  onMouseEnter={() => setHoverRating(starValue)}
                  className="absolute inset-y-0 right-0 w-1/2 rounded-r focus:outline-none"
                />
              </span>
            );
          }

          return (
            <span key={i} className="inline-flex">
              {renderStarIcon(fillAmount)}
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
