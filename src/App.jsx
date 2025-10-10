import { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { Navbar } from './components/Navbar';
import { IconSet } from './components/IconSet';

const modules = import.meta.glob('./data/*.js', { eager: true });
const iconSets = Object.values(modules).flatMap(mod => mod.iconSets || []);

const filterStyles = "px-3 py-1.5 text-sm font-semibold rounded-md transition-colors";
const activeFilterStyles = "bg-[#212135] text-white";
const inactiveFilterStyles = "text-slate-600 hover:bg-slate-200";

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentFilter, setCurrentFilter] = useState('all');
  const [visibleCount, setVisibleCount] = useState(100); // 👈 start with 100 visible

  const filteredIconSets = useMemo(() => {
    if (!searchQuery && currentFilter === 'all') return iconSets;

    return iconSets
      .map(set => {
        const filteredIcons = set.icons.filter(icon => {
          const matchesSearch = icon.name.toLowerCase().includes(searchQuery.toLowerCase());
          const matchesFilter = currentFilter === 'all' || icon.style === currentFilter;
          return matchesSearch && matchesFilter;
        });
        return { ...set, icons: filteredIcons };
      })
      .filter(set => set.icons.length > 0);
  }, [searchQuery, currentFilter]);

  // 👇 Automatically load more icons progressively
  useEffect(() => {
    if (visibleCount >= filteredIconSets.length) return;

    const interval = setInterval(() => {
      setVisibleCount(prev => Math.min(prev + 100, filteredIconSets.length)); // load 100 more
    }, 500); // every half second, load another batch

    return () => clearInterval(interval);
  }, [filteredIconSets.length, visibleCount]);

  // Slice the list of sets to show only part of it
  const visibleSets = filteredIconSets.slice(0, visibleCount);

  return (
    <div className="bg-slate-50 min-h-screen">
      <Header />
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        currentFilter={currentFilter}
        setCurrentFilter={setCurrentFilter}
      />

      <main>
        {/* Filters */}
        <div className="w-full h-16 px-40 flex items-center gap-2">
          {['all', 'outline', 'fill', 'duotone', 'broken', 'cute'].map(style => (
            <button
              key={style}
              onClick={() => setCurrentFilter(style)}
              className={`${filterStyles} ${currentFilter === style ? activeFilterStyles : inactiveFilterStyles}`}
            >
              {style.charAt(0).toUpperCase() + style.slice(1)}
            </button>
          ))}
        </div>

        {visibleSets.length > 0 ? (
          visibleSets.map(set => (
            <IconSet key={`${set.name}-${set.style}`} set={set} />
          ))
        ) : (
          <div className="text-center py-20">
            <h3 className="text-xl font-semibold text-slate-800">No icons found</h3>
            <p className="text-slate-500 mt-2">Try adjusting your search or filters.</p>
          </div>
        )}

        {/* 👇 Loading indicator */}
        {visibleCount < filteredIconSets.length && (
          <div className="text-center py-10 text-slate-500">Loading more icons...</div>
        )}
      </main>

      <footer className="text-center py-8 text-slate-500">
        <p>&copy; {new Date().getFullYear()} Underground Labs. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default App;
