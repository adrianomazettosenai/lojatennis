import React from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onClear: () => void;
  totalResults: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearchChange,
  onClear,
  totalResults,
}) => {
  return (
    <div className="px-4 py-2 max-w-md mx-auto">
      <div className="relative flex items-center">
        <div className="absolute left-3.5 text-slate-400 pointer-events-none">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar modelo, marca, cor (ex: Jordan, Dunk, White)..."
          className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl pl-10 pr-10 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 transition-all shadow-inner"
        />
        {searchTerm ? (
          <button
            onClick={onClear}
            className="absolute right-3 p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
            aria-label="Limpar busca"
          >
            <X className="w-4 h-4" />
          </button>
        ) : (
          <div className="absolute right-3.5 text-slate-500 pointer-events-none">
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </div>
        )}
      </div>

      {searchTerm && (
        <div className="mt-1.5 flex items-center justify-between text-xs text-slate-400 px-1">
          <span>Resultados para: <strong className="text-orange-400 font-medium">"{searchTerm}"</strong></span>
          <span>{totalResults} {totalResults === 1 ? 'modelo' : 'modelos'}</span>
        </div>
      )}
    </div>
  );
};
