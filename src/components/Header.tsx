import React from 'react';
import { ShoppingBag, Heart, Database, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

interface HeaderProps {
  cartCount: number;
  wishlistCount: number;
  isSupabaseConnected: boolean;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenSupabaseModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  wishlistCount,
  isSupabaseConnected,
  onOpenCart,
  onOpenWishlist,
  onOpenSupabaseModal,
}) => {
  return (
    <header className="sticky top-0 z-40 glass-header px-4 py-3 safe-top">
      <div className="flex items-center justify-between max-w-md mx-auto">
        {/* Brand Logo */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/25">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                SNEAKER<span className="text-orange-500">VAULT</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20">
                PRO
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">Edições Limitadas & Drops</p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5">
          {/* Supabase status badge */}
          <button
            onClick={onOpenSupabaseModal}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all ${
              isSupabaseConnected
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20'
            }`}
            title="Clique para gerenciar o Supabase"
          >
            <Database className="w-3 h-3" />
            <span className="hidden sm:inline">
              {isSupabaseConnected ? 'Supabase' : 'Demo'}
            </span>
            {isSupabaseConnected ? (
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            ) : (
              <AlertCircle className="w-3 h-3 text-amber-400" />
            )}
          </button>

          {/* Wishlist Button */}
          <button
            onClick={onOpenWishlist}
            className="relative p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/60 active:scale-95 transition-all"
            aria-label="Favoritos"
          >
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute 1 top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-fade-in shadow-sm">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart Button */}
          <button
            onClick={onOpenCart}
            className="relative p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/60 active:scale-95 transition-all"
            aria-label="Carrinho"
          >
            <ShoppingBag className="w-5 h-5 text-orange-400" />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-orange-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-fade-in shadow-md shadow-orange-600/50">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
