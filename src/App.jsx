// src/App.jsx
import { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { Navbar } from './components/Navbar';
import { IconSet } from './components/IconSet';
import { iconSets } from './data/iconData';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentFilter, setCurrentFilter] = useState('all'); // 'all', 'fill', 'outline', etc.

  const filteredIconSets = useMemo(() => {
    // If no search or filter, return all sets
    if (!searchQuery && currentFilter === 'all') {
      return iconSets;
    }

    // Apply filtering
    return iconSets.map(set => {
      const filteredIcons = set.icons.filter(icon => {
        // Filter by search query
        const matchesSearch = icon.name.toLowerCase().includes(searchQuery.toLowerCase());
        // Filter by style
        const matchesFilter = currentFilter === 'all' || icon.style === currentFilter;
        
        return matchesSearch && matchesFilter;
      });

      // Return a new set object with only the filtered icons
      return { ...set, icons: filteredIcons };
    }).filter(set => set.icons.length > 0); // Remove sets that have no matching icons

  }, [searchQuery, currentFilter]);

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
        {filteredIconSets.length > 0 ? (
          filteredIconSets.map(set => (
            <IconSet key={set.name} set={set} />
          ))
        ) : (
          <div className="text-center py-20">
            <h3 className="text-xl font-semibold text-slate-800">No icons found</h3>
            <p className="text-slate-500 mt-2">Try adjusting your search or filters.</p>
          </div>
        )}
      </main>
      <footer className="text-center py-8 text-slate-500">
        <p>&copy; {new Date().getFullYear()} Underground Labs. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default App;