import React, { useState } from 'react';
import { Tag, Sparkles, Check, ArrowRight, ShieldCheck, Truck } from 'lucide-react';

interface HeroBannerProps {
  onCouponApplied?: (code: string) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onCouponApplied }) => {
  const [copied, setCopied] = useState(false);
  const couponCode = 'KICKS10';

  const handleCopyCoupon = () => {
    navigator.clipboard?.writeText(couponCode);
    setCopied(true);
    if (onCouponApplied) {
      onCouponApplied(couponCode);
    }
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="px-4 py-2 max-w-md mx-auto">
      {/* Featured Promo Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-600 via-orange-500 to-amber-600 p-5 shadow-xl shadow-orange-500/20 text-white">
        {/* Glow & background patterns */}
        <div className="absolute -right-8 -top-8 w-36 h-36 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-black/20 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/30 backdrop-blur-md text-[11px] font-semibold text-orange-200 tracking-wide uppercase border border-white/10">
              <Sparkles className="w-3 h-3 text-amber-300" /> Drop Exclusivo
            </span>
            <span className="text-[11px] font-bold bg-white text-orange-700 px-2 py-0.5 rounded-full shadow-sm">
              100% Autêntico
            </span>
          </div>

          <div className="mt-3">
            <h2 className="text-xl font-extrabold tracking-tight leading-tight">
              Os Sneakers Mais Desejados do Momento
            </h2>
            <p className="text-xs text-orange-100/90 mt-1 line-clamp-2">
              Edições raras da Nike, Jordan, New Balance e Asics com entrega expressa e garantia de originalidade.
            </p>
          </div>

          {/* Coupon interactive strip */}
          <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-orange-200" />
              <div className="text-left">
                <p className="text-[10px] text-orange-100 uppercase tracking-wider font-medium">Cupom de Boas-vindas</p>
                <p className="text-xs font-mono font-bold tracking-wider">{couponCode} (10% OFF)</p>
              </div>
            </div>

            <button
              onClick={handleCopyCoupon}
              className="px-3 py-1.5 rounded-xl bg-white text-orange-600 text-xs font-bold hover:bg-orange-50 active:scale-95 transition-all flex items-center gap-1 shadow-sm"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copiado!</span>
                </>
              ) : (
                <>
                  <span>Copiar</span>
                  <ArrowRight className="w-3 h-3" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-2 gap-2 mt-3 text-[11px] text-slate-400">
        <div className="flex items-center gap-2 bg-slate-900/60 border border-slate-800/80 rounded-xl px-3 py-2">
          <Truck className="w-4 h-4 text-orange-400 shrink-0" />
          <span>Frete Grátis a partir de R$ 299</span>
        </div>
        <div className="flex items-center gap-2 bg-slate-900/60 border border-slate-800/80 rounded-xl px-3 py-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Garantia de Autenticidade</span>
        </div>
      </div>
    </div>
  );
};
