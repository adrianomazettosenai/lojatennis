import React from 'react';
import { Flame, Sparkles, Zap, Trophy, Crown } from 'lucide-react';

interface CategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const CATEGORIES = [
  { id: 'all', name: 'Todos', icon: Flame },
  { id: 'casual', name: 'Casual & Street', icon: Sparkles },
  { id: 'corrida', name: 'Corrida', icon: Zap },
  { id: 'basquete', name: 'Basquete', icon: Trophy },
  { id: 'edicao_especial', name: 'Especiais', icon: Crown },
];

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="py-2">
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar px-4 max-w-md mx-auto">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all active:scale-95 ${
                isSelected
                  ? 'bg-slate-800 text-orange-400 border border-orange-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-orange-400' : 'text-slate-500'}`} />
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
