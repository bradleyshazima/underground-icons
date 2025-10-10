// src/components/Navbar.jsx
import { useState, useEffect, useRef } from 'react';

export const Navbar = ({ searchQuery, setSearchQuery, currentFilter, setCurrentFilter }) => {
  const [isSticky, setSticky] = useState(false);
  const navRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (navRef.current) {
        setSticky(navRef.current.getBoundingClientRect().top <= 0);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filterStyles = "px-3 py-1.5 text-sm font-semibold rounded-md transition-colors";
  const activeFilterStyles = "bg-slate-900 text-white";
  const inactiveFilterStyles = "text-slate-600 hover:bg-slate-200";

  return (
    <div ref={navRef} className={`bg-slate-50 py-4 ${isSticky ? 'sticky top-0 z-50 border-b border-slate-200' : ''} shadow`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-grow">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search all icons..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm outline-0 transition-all"
            />
          </div>
          {/* Filters (only show when sticky) */}
          <div className={`transition-opacity duration-300 flex items-center gap-2 ${isSticky ? 'opacity-100' : 'opacity-0'}`}>
            <button
              onClick={() => setCurrentFilter('all')}
              className={`${filterStyles} ${currentFilter === 'all' ? activeFilterStyles : inactiveFilterStyles}`}
            >
              All
            </button>
            <button
              onClick={() => setCurrentFilter('outline')}
              className={`${filterStyles} ${currentFilter === 'outline' ? activeFilterStyles : inactiveFilterStyles}`}
            >
              Outline
            </button>
            <button
              onClick={() => setCurrentFilter('fill')}
              className={`${filterStyles} ${currentFilter === 'fill' ? activeFilterStyles : inactiveFilterStyles}`}
            >
              Fill
            </button>
            <button
              onClick={() => setCurrentFilter('duotone')}
              className={`${filterStyles} ${currentFilter === 'duotone' ? activeFilterStyles : inactiveFilterStyles}`}
            >
              Duotone
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};