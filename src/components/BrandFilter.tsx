import React from 'react';

interface BrandFilterProps {
  selectedBrand: string;
  onSelectBrand: (brand: string) => void;
  brandCounts: Record<string, number>;
}

const BRANDS = [
  { id: 'all', name: 'Todos' },
  { id: 'Nike', name: 'Nike' },
  { id: 'Jordan', name: 'Jordan' },
  { id: 'Adidas', name: 'Adidas' },
  { id: 'New Balance', name: 'New Balance' },
  { id: 'Asics', name: 'Asics' },
  { id: 'Puma', name: 'Puma' },
];

export const BrandFilter: React.FC<BrandFilterProps> = ({
  selectedBrand,
  onSelectBrand,
  brandCounts,
}) => {
  return (
    <div className="py-2">
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar px-4 max-w-md mx-auto">
        {BRANDS.map((brand) => {
          const isSelected = selectedBrand === brand.id;
          const count = brand.id === 'all' 
            ? Object.values(brandCounts).reduce((a, b) => a + b, 0)
            : (brandCounts[brand.id] || 0);

          return (
            <button
              key={brand.id}
              onClick={() => onSelectBrand(brand.id)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all active:scale-95 ${
                isSelected
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
                  : 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
              }`}
            >
              <span>{brand.name}</span>
              {count > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected
                      ? 'bg-black/25 text-white'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
