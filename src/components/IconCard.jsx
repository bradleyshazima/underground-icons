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
    <div className='relative group flex flex-col items-center m-4'>
      <div className="relative flex flex-col items-center justify-center w-36 aspect-square rounded-lg border border-slate-200 bg-white">
        {/* The Icon */}
        <Component className="w-8 h-8 text-slate-700" />
        
        {/* Hover Buttons */}
        <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-white/25 rounded-lg p-1 gap-1">
          <button
            onClick={() => handleCopy('svg', svgString)}
            className="w-full flex-1 py-2 text-sm font-semibold rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700"
          >
            {copyState === 'svg' ? 'Copied!' : 'Copy SVG'}
          </button>
          <button
            onClick={() => handleCopy('jsx', jsxString)}
            className="w-full flex-1 py-2 text-sm font-semibold rounded-md bg-[#767BFA] hover:bg-[#484cc4] text-white"
          >
            {copyState === 'jsx' ? 'Copied!' : 'Copy JSX'}
          </button>
        </div>
      </div>
      {/* Icon Name */}
      <p className="text-xs text-slate-500 font-mono w-full text-center text-wrap">
        {name}
      </p>
    </div>
  );
};