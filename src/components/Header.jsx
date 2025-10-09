export const Header = () => {
  return (
    <header className="text-center py-16 md:py-24 px-4 bg-slate-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold text-slate-900 tracking-tight">
          Underground Icons
        </h1>
        <p className="mt-4 text-lg md:text-xl text-slate-600">
          Beautiful hand-crafted SVG icons, by the makers of{' '}
          <span className="font-semibold text-slate-800">Underground Labs</span>.
        </p>
      </div>
    </header>
  );
};