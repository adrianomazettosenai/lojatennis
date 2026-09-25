import React from 'react';
import { Home, Compass, Heart, ShoppingBag, Database } from 'lucide-react';

interface BottomNavProps {
  activeTab: 'home' | 'catalog' | 'wishlist' | 'cart' | 'supabase';
  cartCount: number;
  wishlistCount: number;
  isSupabaseConnected: boolean;
  onSelectTab: (tab: 'home' | 'catalog' | 'wishlist' | 'cart' | 'supabase') => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  cartCount,
  wishlistCount,
  isSupabaseConnected,
  onSelectTab,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 glass-nav border-t border-slate-800/80 safe-bottom">
      <div className="flex items-center justify-around max-w-md mx-auto py-2 px-2">
        {/* Home */}
        <button
          onClick={() => onSelectTab('home')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all ${
            activeTab === 'home'
              ? 'text-orange-500 scale-105'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-bold">Início</span>
        </button>

        {/* Explore / Catalog */}
        <button
          onClick={() => onSelectTab('catalog')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all ${
            activeTab === 'catalog'
              ? 'text-orange-500 scale-105'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px] font-bold">Catálogo</span>
        </button>

        {/* Wishlist */}
        <button
          onClick={() => onSelectTab('wishlist')}
          className={`relative flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all ${
            activeTab === 'wishlist'
              ? 'text-rose-500 scale-105'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Heart className={`w-5 h-5 ${activeTab === 'wishlist' ? 'fill-rose-500' : ''}`} />
          {wishlistCount > 0 && (
            <span className="absolute 0 top-0.5 right-2 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-sm">
              {wishlistCount}
            </span>
          )}
          <span className="text-[10px] font-bold">Favoritos</span>
        </button>

        {/* Cart */}
        <button
          onClick={() => onSelectTab('cart')}
          className={`relative flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all ${
            activeTab === 'cart'
              ? 'text-orange-500 scale-105'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShoppingBag className="w-5 h-5" />
          {cartCount > 0 && (
            <span className="absolute top-0.5 right-2 w-4 h-4 bg-orange-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-md shadow-orange-600/50">
              {cartCount}
            </span>
          )}
          <span className="text-[10px] font-bold">Sacola</span>
        </button>

        {/* Supabase Status & Settings */}
        <button
          onClick={() => onSelectTab('supabase')}
          className={`relative flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all ${
            activeTab === 'supabase'
              ? 'text-emerald-400 scale-105'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <Database className="w-5 h-5" />
            <span
              className={`absolute -top-0.5 -right-1 w-2 h-2 rounded-full border border-slate-900 ${
                isSupabaseConnected ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'
              }`}
            />
          </div>
          <span className="text-[10px] font-bold">Supabase</span>
        </button>
      </div>
    </nav>
  );
};
