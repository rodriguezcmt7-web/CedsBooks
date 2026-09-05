import React from 'react';
import { BookOpen, Lock, Unlock } from 'lucide-react';

interface NavbarProps {
  currentView: 'home' | 'book-detail' | 'admin';
  onNavigateHome: () => void;
  onOpenAdmin: () => void;
  isAdminAuthenticated: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigateHome,
  onOpenAdmin,
  isAdminAuthenticated,
}) => {
  return (
    <nav className="sticky top-0 z-40 h-13 sm:h-16 flex items-center justify-between px-3 sm:px-8 bg-white/95 backdrop-blur-xs border-b border-blue-100/80 shrink-0 shadow-xs">
      <div className="max-w-7xl w-full mx-auto flex items-center justify-between gap-3">
        {/* Brand Logo & Title */}
        <button
          type="button"
          id="nav-logo-btn"
          onClick={onNavigateHome}
          className="flex items-center gap-2 sm:gap-2.5 text-left group cursor-pointer focus:outline-none"
        >
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-tr from-blue-700 to-blue-500 rounded-lg flex items-center justify-center text-white shadow-xs shadow-blue-200">
            <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
          </div>

          <div className="flex items-baseline gap-1.5 sm:gap-2">
            <span className="text-base sm:text-xl font-bold tracking-tight text-slate-900 font-serif-title">
              Ced's Books
            </span>
            <span className="hidden sm:inline text-xs text-slate-400 font-medium">
              Personal Book Archive
            </span>
          </div>
        </button>

        {/* Right Navigation: Clean Admin Access */}
        <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm font-medium">
          {/* Admin Pill Button */}
          <button
            type="button"
            id="nav-admin-btn"
            onClick={onOpenAdmin}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full border text-xs sm:text-sm transition-all cursor-pointer ${
              currentView === 'admin'
                ? 'border-blue-600 text-blue-600 bg-blue-50 font-semibold shadow-xs'
                : isAdminAuthenticated
                ? 'border-blue-200 text-blue-600 hover:bg-blue-50/80 bg-white'
                : 'border-slate-200 text-slate-600 hover:bg-slate-50 bg-white'
            }`}
          >
            {isAdminAuthenticated ? (
              <>
                <Unlock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-600" />
                <span>Admin</span>
              </>
            ) : (
              <>
                <Lock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400" />
                <span>Admin</span>
              </>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};
