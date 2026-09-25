import React from 'react';
import { X, Heart, Trash2, ShoppingBag } from 'lucide-react';
import type { Product } from '../types';
import { formatBRL } from '../utils/formatters';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: Product[];
  onRemoveFavorite: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  favorites,
  onRemoveFavorite,
  onSelectProduct,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col z-10 shadow-2xl animate-slide-up sm:animate-none">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 sticky top-0 bg-slate-900/90 backdrop-blur-md safe-top">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            <h2 className="font-bold text-base text-white">Meus Favoritos</h2>
            <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-semibold">
              {favorites.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-3">
          {favorites.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-center text-slate-500 mb-3">
                <Heart className="w-8 h-8 text-slate-600" />
              </div>
              <h3 className="font-bold text-slate-200 text-base">Nenhum favorito ainda</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                Toque no ícone de coração nos tênis que você mais gostar para salvá-los aqui.
              </p>
              <button
                onClick={onClose}
                className="mt-4 px-4 py-2 rounded-xl bg-orange-600 text-white text-xs font-bold hover:bg-orange-500"
              >
                Explorar Catálogo
              </button>
            </div>
          ) : (
            favorites.map((product) => (
              <div
                key={product.id}
                className="flex gap-3 bg-slate-950/60 border border-slate-800/80 rounded-2xl p-3 relative group"
              >
                {/* Thumbnail */}
                <div
                  onClick={() => {
                    onSelectProduct(product);
                    onClose();
                  }}
                  className="w-20 h-20 rounded-xl bg-slate-900 border border-slate-800 shrink-0 p-1 flex items-center justify-center cursor-pointer"
                >
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-semibold text-orange-400 uppercase tracking-wider">
                      {product.brand}
                    </span>
                    <h4
                      onClick={() => {
                        onSelectProduct(product);
                        onClose();
                      }}
                      className="text-xs font-bold text-white truncate cursor-pointer hover:text-orange-400 transition-colors"
                    >
                      {product.name}
                    </h4>
                    <p className="text-xs font-extrabold text-white mt-1">
                      {formatBRL(product.price)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => {
                        onSelectProduct(product);
                        onClose();
                      }}
                      className="flex-1 py-1.5 px-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all"
                    >
                      <ShoppingBag className="w-3 h-3" />
                      <span>Comprar</span>
                    </button>
                    <button
                      onClick={() => onRemoveFavorite(product)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg bg-slate-900"
                      title="Remover"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
