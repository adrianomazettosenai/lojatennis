import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, Tag, ShoppingBag, ShieldCheck, Check } from 'lucide-react';
import type { CartItem } from '../types';
import { formatBRL } from '../utils/formatters';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  appliedCoupon: string;
  onApplyCoupon: (code: string) => boolean;
  onRemoveCoupon: () => void;
  onUpdateQuantity: (productId: string | number, size: number, quantity: number) => void;
  onRemoveItem: (productId: string | number, size: number) => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  appliedCoupon,
  onApplyCoupon,
  onRemoveCoupon,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}) => {
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  // Discount calculation
  let discount = 0;
  if (appliedCoupon === 'KICKS10') {
    discount = subtotal * 0.10;
  } else if (appliedCoupon === 'PRIMEIRACOMPRA') {
    discount = subtotal * 0.15;
  }

  const freeShippingThreshold = 299;
  const shipping = subtotal >= freeShippingThreshold || items.length === 0 ? 0 : 29.90;
  const total = Math.max(0, subtotal - discount + shipping);

  const shippingRemaining = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    const success = onApplyCoupon(couponInput.trim().toUpperCase());
    if (success) {
      setCouponError('');
      setCouponInput('');
    } else {
      setCouponError('Cupom inválido. Experimente KICKS10');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col z-10 shadow-2xl animate-slide-up sm:animate-none">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 sticky top-0 bg-slate-900/90 backdrop-blur-md safe-top">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-orange-400" />
            <h2 className="font-bold text-base text-white">Sua Sacola</h2>
            <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-semibold">
              {items.reduce((acc, i) => acc + i.quantity, 0)}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Free Shipping Bar */}
        <div className="px-5 py-2.5 bg-slate-950/70 border-b border-slate-800/80">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-300 font-medium">
              {shippingRemaining === 0 ? (
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Parabéns! Você ganhou Frete Grátis!
                </span>
              ) : (
                <span>
                  Faltam <strong className="text-orange-400">{formatBRL(shippingRemaining)}</strong> para Frete Grátis
                </span>
              )}
            </span>
            <span className="text-[10px] text-slate-500 font-bold">{Math.round(freeShippingPercent)}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                shippingRemaining === 0 ? 'bg-emerald-500' : 'bg-orange-500'
              }`}
              style={{ width: `${freeShippingPercent}%` }}
            />
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-center text-slate-500 mb-3">
                <ShoppingBag className="w-8 h-8 text-slate-600" />
              </div>
              <h3 className="font-bold text-slate-200 text-base">Sua sacola está vazia</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                Explore os lançamentos e escolha os melhores tênis para o seu estilo.
              </p>
              <button
                onClick={onClose}
                className="mt-4 px-4 py-2 rounded-xl bg-orange-600 text-white text-xs font-bold hover:bg-orange-500"
              >
                Explorar Tênis
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={`${item.product.id}-${item.selectedSize}`}
                className="flex gap-3 bg-slate-950/60 border border-slate-800/80 rounded-2xl p-3 relative group"
              >
                {/* Thumbnail */}
                <div className="w-20 h-20 rounded-xl bg-slate-900 border border-slate-800 shrink-0 p-1 flex items-center justify-center">
                  <img
                    src={item.product.image_url}
                    alt={item.product.name}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-semibold text-orange-400 uppercase tracking-wider">
                      {item.product.brand}
                    </span>
                    <h4 className="text-xs font-bold text-white truncate">
                      {item.product.name}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Tamanho: <strong className="text-slate-200">{item.selectedSize} BR</strong>
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs font-black text-white">
                      {formatBRL(item.product.price * item.quantity)}
                    </span>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg px-2 py-0.5">
                      <button
                        onClick={() =>
                          onUpdateQuantity(item.product.id, item.selectedSize, item.quantity - 1)
                        }
                        className="text-slate-400 hover:text-white p-0.5"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold text-white w-3 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          onUpdateQuantity(item.product.id, item.selectedSize, item.quantity + 1)
                        }
                        className="text-slate-400 hover:text-white p-0.5"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Delete button */}
                <button
                  onClick={() => onRemoveItem(item.product.id, item.selectedSize)}
                  className="absolute top-2 right-2 text-slate-500 hover:text-rose-400 p-1 rounded-lg"
                  aria-label="Remover produto"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer with Coupon, Summary and CTA */}
        {items.length > 0 && (
          <div className="p-5 border-t border-slate-800 bg-slate-900/90 safe-bottom space-y-3">
            {/* Coupon form */}
            <div>
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-emerald-950/40 border border-emerald-500/30 rounded-xl px-3 py-2 text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Cupom <strong>{appliedCoupon}</strong> ativo!</span>
                  </div>
                  <button
                    onClick={onRemoveCoupon}
                    className="text-xs text-rose-400 hover:underline font-medium"
                  >
                    Remover
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="Cupom (ex: KICKS10)"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white uppercase placeholder-slate-500 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white rounded-xl transition-all"
                  >
                    Aplicar
                  </button>
                </form>
              )}
              {couponError && <p className="text-[11px] text-rose-400 mt-1">{couponError}</p>}
            </div>

            {/* Financial Summary */}
            <div className="space-y-1.5 text-xs text-slate-400 pt-2 border-t border-slate-800/80">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-slate-200">{formatBRL(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-400 font-medium">
                  <span>Desconto cupom</span>
                  <span>-{formatBRL(discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Frete</span>
                <span>{shipping === 0 ? <strong className="text-emerald-400">GRÁTIS</strong> : formatBRL(shipping)}</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-white pt-2 border-t border-slate-800">
                <span>Total</span>
                <span className="text-base text-orange-400">{formatBRL(total)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={onProceedToCheckout}
              className="w-full py-3.5 bg-orange-600 hover:bg-orange-500 active:scale-[0.98] text-white font-bold text-sm rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-orange-600/30 transition-all"
            >
              <span>Finalizar Compra</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Compra 100% Segura e Criptografada</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
