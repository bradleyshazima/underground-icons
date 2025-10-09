// src/components/IconCard.jsx
import { useState } from 'react';

export const IconCard = ({ icon }) => {
  const { name, Component, svgString, jsxString } = icon;
  const [copyState, setCopyState] = useState(null); // 'svg', 'jsx', or null

  const handleCopy = (type, content) => {
    navigator.clipboard.writeText(content).then(() => {
      setCopyState(type);
      setTimeout(() => setCopyState(null), 2000); // Reset after 2 seconds
    });
  };

  return (
    <div className="relative group flex flex-col items-center justify-center p-4 aspect-square rounded-lg border border-slate-200 bg-white">
      {/* The Icon */}
      <Component className="w-8 h-8 text-slate-700" />
      
      {/* Icon Name */}
      <p className="absolute bottom-3 text-xs text-slate-500 font-mono group-hover:opacity-0 transition-opacity">
        {name}
      </p>

      {/* Hover Buttons */}
      <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 backdrop-blur-sm rounded-lg">
        <button
          onClick={() => handleCopy('svg', svgString)}
          className="w-3/4 mb-1.5 py-2 text-sm font-semibold rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700"
        >
          {copyState === 'svg' ? 'Copied!' : 'Copy SVG'}
        </button>
        <button
          onClick={() => handleCopy('jsx', jsxString)}
          className="w-3/4 mt-1.5 py-2 text-sm font-semibold rounded-md bg-slate-800 hover:bg-slate-900 text-white"
        >
          {copyState === 'jsx' ? 'Copied!' : 'Copy JSX'}
        </button>
      </div>
    </div>
  );
};