import { IconCard } from './IconCard';

export const IconSet = ({ set }) => {
  if (set.icons.length === 0) {
    return null; // Don't render the set if no icons match the search
  }

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="pb-8 border-b border-slate-200 mb-8">
          <div className="text-2xl font-semibold text-slate-900 flex items-center gap-2"><span>{set.name}</span> <span className='px-4 py-1 text-base font-medium bg-gray-300 rounded-xl'>{set.style}</span></div>
          <p className="text-slate-500 text-base">
            Created by{' '}
            <a href={set.socialLink} target="_blank" rel="noopener noreferrer" className="font-semibold text-[#767BFA] hover:underline">
              {set.creator}
            </a>
          </p>
        </div>
        {/* Icon Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
          {set.icons.map((icon) => (
            <IconCard key={`${icon.name}-${icon.style}`} icon={icon} />
          ))}
        </div>
      </div>
    </section>
  );
};