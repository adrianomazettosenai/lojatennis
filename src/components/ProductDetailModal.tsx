import React, { useState } from 'react';
import { X, Heart, Star, ShieldCheck, Truck, RotateCcw, Plus, Minus, Check } from 'lucide-react';
import type { Product } from '../types';
import { formatBRL, calculateInstallments } from '../utils/formatters';

interface ProductDetailModalProps {
  product: Product | null;
  isFavorite: boolean;
  onClose: () => void;
  onToggleFavorite: (product: Product) => void;
  onAddToCart: (product: Product, size: number, quantity: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isFavorite,
  onClose,
  onToggleFavorite,
  onAddToCart,
}) => {
  if (!product) return null;

  const [selectedImage, setSelectedImage] = useState<string>(product.image_url);
  const [selectedSize, setSelectedSize] = useState<number>(product.sizes[0] || 40);
  const [quantity, setQuantity] = useState<number>(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const images = product.gallery && product.gallery.length > 0 ? product.gallery : [product.image_url];

  const handleAddToCart = () => {
    onAddToCart(product, selectedSize, quantity);
    setAddedAnimation(true);
    setTimeout(() => {
      setAddedAnimation(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      {/* Background click to dismiss */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal / Bottom Sheet Container */}
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-t-[32px] sm:rounded-3xl max-h-[92vh] overflow-y-auto no-scrollbar flex flex-col z-10 shadow-2xl animate-slide-up">
        {/* Top drag bar for mobile aesthetic */}
        <div className="pt-3 pb-1 flex justify-center sm:hidden">
          <div className="w-12 h-1.5 bg-slate-700/80 rounded-full" />
        </div>

        {/* Header Actions */}
        <div className="flex items-center justify-between px-5 py-3 sticky top-0 bg-slate-900/90 backdrop-blur-md z-20 border-b border-slate-800/60">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
            {product.brand}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleFavorite(product)}
              className={`p-2 rounded-full border transition-all ${
                isFavorite
                  ? 'bg-rose-500/20 text-rose-500 border-rose-500/40'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white border border-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Gallery Section */}
        <div className="px-5 pt-3">
          <div className="w-full aspect-[4/3] rounded-3xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-center p-4 relative overflow-hidden">
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-full object-contain"
            />
            {product.badge && (
              <span className="absolute top-3 left-3 text-xs font-black uppercase px-2.5 py-1 rounded-lg bg-orange-600 text-white shadow-lg">
                {product.badge}
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex items-center gap-2.5 mt-3 overflow-x-auto no-scrollbar pb-1">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-16 h-16 rounded-xl bg-slate-950 border-2 overflow-hidden flex-shrink-0 p-1 transition-all ${
                    selectedImage === img
                      ? 'border-orange-500 shadow-md shadow-orange-500/20 scale-105'
                      : 'border-slate-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="p-5 flex flex-col gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <div className="flex items-center text-amber-400 text-xs">
                <Star className="w-3.5 h-3.5 fill-amber-400 mr-1" />
                <span className="font-bold">{product.rating.toFixed(1)}</span>
              </div>
              <span className="text-slate-500 text-xs">|</span>
              <span className="text-slate-400 text-xs">{product.reviews_count} avaliações de compradores</span>
            </div>

            <h1 className="text-xl font-extrabold text-white leading-tight">
              {product.name}
            </h1>

            <div className="mt-2.5 flex items-baseline gap-2">
              <span className="text-2xl font-black text-white">
                {formatBRL(product.price)}
              </span>
              {product.original_price && (
                <span className="text-sm text-slate-500 line-through">
                  {formatBRL(product.original_price)}
                </span>
              )}
            </div>
            <p className="text-xs text-orange-400 font-medium">
              {calculateInstallments(product.price, 10)}
            </p>
          </div>

          {/* Size Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Selecione o Tamanho (BR)
              </span>
              <span className="text-xs text-orange-400 underline cursor-pointer">
                Tabela de Medidas
              </span>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {product.sizes.map((size) => {
                const isSelected = selectedSize === size;
                return (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-2.5 rounded-xl text-xs font-extrabold transition-all border ${
                      isSelected
                        ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/25 scale-105'
                        : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center justify-between py-2 border-y border-slate-800">
            <span className="text-xs font-semibold text-slate-300">Quantidade</span>
            <div className="flex items-center gap-3 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="text-slate-400 hover:text-white p-1"
                disabled={quantity <= 1}
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="text-sm font-bold text-white w-4 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="text-slate-400 hover:text-white p-1"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Descrição do Modelo
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Guarantees */}
          <div className="space-y-2 text-xs text-slate-400 pt-1">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Frete com rastreamento para todo o Brasil</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-orange-400 shrink-0" />
              <span>Certificado de autenticidade garantido</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-blue-400 shrink-0" />
              <span>Primeira troca grátis em até 30 dias</span>
            </div>
          </div>
        </div>

        {/* Sticky Action Footer */}
        <div className="sticky bottom-0 p-4 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 safe-bottom">
          <button
            onClick={handleAddToCart}
            className={`w-full py-3.5 px-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-xl ${
              addedAnimation
                ? 'bg-emerald-600 text-white'
                : 'bg-orange-600 hover:bg-orange-500 text-white shadow-orange-600/30 active:scale-[0.98]'
            }`}
          >
            {addedAnimation ? (
              <>
                <Check className="w-5 h-5 text-white animate-bounce" />
                <span>Adicionado à Sacola!</span>
              </>
            ) : (
              <>
                <span>Adicionar à Sacola</span>
                <span>•</span>
                <span>{formatBRL(product.price * quantity)}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
