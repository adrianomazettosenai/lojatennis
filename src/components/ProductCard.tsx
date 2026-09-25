import React from 'react';
import { Heart, Star, ShoppingBag } from 'lucide-react';
import type { Product } from '../types';
import { formatBRL, calculateInstallments } from '../utils/formatters';

interface ProductCardProps {
  product: Product;
  isFavorite: boolean;
  onToggleFavorite: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isFavorite,
  onToggleFavorite,
  onSelectProduct,
  onQuickAdd,
}) => {
  const discountPercentage = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  return (
    <div className="group relative bg-slate-900/80 border border-slate-800/90 hover:border-slate-700 rounded-3xl p-3 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/5">
      {/* Top badges & favorite button */}
      <div className="relative">
        {/* Badges container */}
        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
          {product.badge && (
            <span
              className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md shadow-sm ${
                product.badge === 'Hyped'
                  ? 'bg-red-500 text-white shadow-red-500/30'
                  : product.badge === 'Limitado'
                  ? 'bg-amber-500 text-slate-950 font-black'
                  : product.badge === 'Promoção'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-orange-500 text-white'
              }`}
            >
              {product.badge}
            </span>
          )}

          {discountPercentage > 0 && (
            <span className="text-[10px] font-bold bg-slate-950/80 backdrop-blur-md text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded">
              -{discountPercentage}%
            </span>
          )}
        </div>

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(product);
          }}
          className={`absolute top-2 right-2 z-10 p-2 rounded-full backdrop-blur-md transition-all active:scale-90 ${
            isFavorite
              ? 'bg-rose-500/20 text-rose-500 border border-rose-500/30'
              : 'bg-slate-950/60 text-slate-400 hover:text-white border border-white/5'
          }`}
          aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500' : ''}`} />
        </button>

        {/* Sneaker Image */}
        <div
          onClick={() => onSelectProduct(product)}
          className="w-full aspect-square rounded-2xl overflow-hidden bg-slate-950/60 relative cursor-pointer flex items-center justify-center p-3"
        >
          <img
            src={product.image_url}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-contain object-center transform group-hover:scale-105 transition-transform duration-300 ease-out"
          />
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-3 flex flex-col flex-1">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
          <span className="font-semibold text-orange-400 uppercase tracking-wider text-[10px]">
            {product.brand}
          </span>
          <div className="flex items-center gap-1 text-[11px]">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span className="font-bold text-slate-200">{product.rating.toFixed(1)}</span>
            <span className="text-slate-500 text-[10px]">({product.reviews_count})</span>
          </div>
        </div>

        <h3
          onClick={() => onSelectProduct(product)}
          className="font-bold text-sm text-slate-100 hover:text-orange-400 transition-colors line-clamp-2 cursor-pointer leading-snug"
        >
          {product.name}
        </h3>

        {/* Available sizes mini preview */}
        <div className="mt-2 flex items-center gap-1 overflow-hidden">
          <span className="text-[10px] text-slate-500">Tam:</span>
          <div className="flex items-center gap-1 text-[10px] text-slate-400">
            {product.sizes.slice(0, 4).map((s) => (
              <span key={s} className="px-1 py-0.5 rounded bg-slate-800/80 border border-slate-700/50">
                {s}
              </span>
            ))}
            {product.sizes.length > 4 && (
              <span className="text-slate-500 text-[9px]">+{product.sizes.length - 4}</span>
            )}
          </div>
        </div>

        {/* Pricing */}
        <div className="mt-3 pt-2 border-t border-slate-800/80">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-extrabold text-white tracking-tight">
              {formatBRL(product.price)}
            </span>
            {product.original_price && (
              <span className="text-xs text-slate-500 line-through">
                {formatBRL(product.original_price)}
              </span>
            )}
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">
            {calculateInstallments(product.price, 10)}
          </p>
        </div>

        {/* Actions */}
        <div className="mt-3 grid grid-cols-5 gap-1.5">
          <button
            onClick={() => onSelectProduct(product)}
            className="col-span-4 bg-slate-800 hover:bg-slate-700 active:scale-[0.98] text-slate-100 text-xs font-semibold py-2 px-3 rounded-xl transition-all border border-slate-700/60"
          >
            Escolher Tamanho
          </button>
          <button
            onClick={() => onQuickAdd(product)}
            className="col-span-1 bg-orange-600 hover:bg-orange-500 active:scale-[0.95] text-white rounded-xl flex items-center justify-center transition-all shadow-md shadow-orange-600/30"
            title="Adicionar tamanho padrão à sacola"
            aria-label="Adicionar à sacola"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
