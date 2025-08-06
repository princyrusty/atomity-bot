
import React from 'react';
import AtomIcon from './icons/AtomIcon';

const Header: React.FC = () => {
  return (
    <header className="bg-slate-900/70 backdrop-blur-md sticky top-0 z-10 border-b border-slate-700/50">
      <div className="container mx-auto px-4 py-3 flex items-center gap-3">
        <AtomIcon className="w-8 h-8 text-cyan-400" />
        <h1 className="text-2xl font-bold text-slate-100 tracking-wider">ATOMITY</h1>
        <span className="text-xs font-mono text-cyan-400/80 border border-cyan-400/50 rounded-full px-2 py-0.5">
          v2.5-flash
        </span>
      </div>
    </header>
  );
};

export default Header;
