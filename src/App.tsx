import { useState, useEffect, useMemo, useCallback } from 'react';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { HeroBanner } from './components/HeroBanner';
import { BrandFilter } from './components/BrandFilter';
import { CategoryFilter } from './components/CategoryFilter';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { SupabaseModal } from './components/SupabaseModal';
import { BottomNav } from './components/BottomNav';
import { Toast, type ToastMessage } from './components/Toast';
import type { Product, CartItem } from './types';
import { fetchProducts } from './services/productService';
import { getStoredSupabaseConfig, testSupabaseConnection } from './lib/supabase';
import { Loader2, RefreshCw, Database } from 'lucide-react';

export default function App() {
  // Products & Data Source
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dataSource, setDataSource] = useState<'supabase' | 'mock'>('mock');
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(false);

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Modals & Drawers
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [activeNavTab, setActiveNavTab] = useState<'home' | 'catalog' | 'wishlist' | 'cart' | 'supabase'>('home');

  // Cart & Wishlist with localStorage persistence
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('sneaker_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('sneaker_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState<string>('');
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const showToast = (type: 'success' | 'error' | 'info', message: string) => {
    setToast({
      id: Date.now().toString(),
      type,
      message,
    });
  };

  // Save Cart & Wishlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('sneaker_cart', JSON.stringify(cart));
    } catch (e) {
      console.warn('Erro ao salvar carrinho no cache:', e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('sneaker_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.warn('Erro ao salvar favoritos no cache:', e);
    }
  }, [wishlist]);

  // Load products & check Supabase status
  const loadProducts = useCallback(async () => {
    setIsLoading(true);

    const { url, anonKey } = getStoredSupabaseConfig();
    if (url && anonKey) {
      const test = await testSupabaseConnection();
      setIsSupabaseConnected(test.success);
    } else {
      setIsSupabaseConnected(false);
    }

    const result = await fetchProducts();
    setProducts(result.products);
    setDataSource(result.source);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Calculate brand counts
  const brandCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach((p) => {
      counts[p.brand] = (counts[p.brand] || 0) + 1;
    });
    return counts;
  }, [products]);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Brand filter
      if (selectedBrand !== 'all' && product.brand.toLowerCase() !== selectedBrand.toLowerCase()) {
        return false;
      }
      // Category filter
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false;
      }
      // Search term filter
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesBrand = product.brand.toLowerCase().includes(query);
        const matchesDesc = product.description.toLowerCase().includes(query);
        return matchesName || matchesBrand || matchesDesc;
      }
      return true;
    });
  }, [products, selectedBrand, selectedCategory, searchTerm]);

  // Cart operations
  const handleAddToCart = (product: Product, size: number, quantity: number) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedSize === size
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [...prev, { product, selectedSize: size, quantity }];
    });
    showToast('success', `${product.name} (Tam ${size}) adicionado à sacola!`);
  };

  const handleQuickAdd = (product: Product) => {
    const defaultSize = product.sizes[0] || 40;
    handleAddToCart(product, defaultSize, 1);
  };

  const handleUpdateQuantity = (productId: string | number, size: number, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId, size);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId && item.selectedSize === size
          ? { ...item, quantity }
          : item
      )
    );
  };

  const handleRemoveItem = (productId: string | number, size: number) => {
    setCart((prev) =>
      prev.filter((item) => !(item.product.id === productId && item.selectedSize === size))
    );
    showToast('info', 'Item removido da sacola.');
  };

  // Coupon handling
  const handleApplyCoupon = (code: string) => {
    if (code === 'KICKS10' || code === 'PRIMEIRACOMPRA') {
      setAppliedCoupon(code);
      showToast('success', `Cupom ${code} aplicado com sucesso!`);
      return true;
    }
    return false;
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon('');
    showToast('info', 'Cupom removido.');
  };

  // Wishlist operations
  const handleToggleFavorite = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        showToast('info', `${product.name} removido dos favoritos.`);
        return prev.filter((p) => p.id !== product.id);
      } else {
        showToast('success', `${product.name} salvo nos favoritos!`);
        return [...prev, product];
      }
    });
  };

  // Bottom Navigation tab selection
  const handleSelectBottomTab = (tab: 'home' | 'catalog' | 'wishlist' | 'cart' | 'supabase') => {
    setActiveNavTab(tab);
    if (tab === 'home') {
      setSelectedBrand('all');
      setSelectedCategory('all');
      setSearchTerm('');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (tab === 'catalog') {
      const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
      if (searchInput) searchInput.focus();
    } else if (tab === 'wishlist') {
      setIsWishlistOpen(true);
    } else if (tab === 'cart') {
      setIsCartOpen(true);
    } else if (tab === 'supabase') {
      setIsSupabaseModalOpen(true);
    }
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = wishlist.length;

  // Checkout subtotal calculation
  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  let discount = 0;
  if (appliedCoupon === 'KICKS10') discount = subtotal * 0.10;
  if (appliedCoupon === 'PRIMEIRACOMPRA') discount = subtotal * 0.15;
  const shipping = subtotal >= 299 || cart.length === 0 ? 0 : 29.90;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col pb-20 selection:bg-orange-500 selection:text-white">
      {/* Toast alert */}
      <Toast toast={toast} onDismiss={() => setToast(null)} />

      {/* Top Header */}
      <Header
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        isSupabaseConnected={isSupabaseConnected}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-md mx-auto">
        {/* Supabase status notice if running mock */}
        <div className="px-4 pt-2">
          <div
            onClick={() => setIsSupabaseModalOpen(true)}
            className={`p-2.5 rounded-2xl flex items-center justify-between text-xs cursor-pointer transition-all border ${
              isSupabaseConnected && dataSource === 'supabase'
                ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300 hover:bg-emerald-950/50'
                : 'bg-amber-950/30 border-amber-500/30 text-amber-300 hover:bg-amber-950/50'
            }`}
          >
            <div className="flex items-center gap-2">
              <Database className="w-3.5 h-3.5 shrink-0" />
              <span>
                {isSupabaseConnected && dataSource === 'supabase'
                  ? 'Conectado ao Supabase (Dados em tempo real)'
                  : 'Modo Demonstração (Toque para conectar seu Supabase)'}
              </span>
            </div>
            <span className="text-[10px] font-bold underline shrink-0">
              {isSupabaseConnected ? 'Config' : 'Conectar'}
            </span>
          </div>
        </div>

        {/* Search Bar */}
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onClear={() => setSearchTerm('')}
          totalResults={filteredProducts.length}
        />

        {/* Hero banner (visible when not actively searching) */}
        {!searchTerm && (
          <HeroBanner
            onCouponApplied={(code) => {
              handleApplyCoupon(code);
            }}
          />
        )}

        {/* Brand filters */}
        <BrandFilter
          selectedBrand={selectedBrand}
          onSelectBrand={setSelectedBrand}
          brandCounts={brandCounts}
        />

        {/* Category filters */}
        <CategoryFilter
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Products Grid Header */}
        <div className="px-4 py-2 flex items-center justify-between">
          <div>
            <h2 className="text-base font-extrabold text-white tracking-tight">
              {selectedBrand !== 'all' ? selectedBrand : 'Todos os Sneakers'}
            </h2>
            <p className="text-[11px] text-slate-400">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'modelo disponível' : 'modelos disponíveis'}
            </p>
          </div>

          <button
            onClick={loadProducts}
            title="Atualizar produtos do Supabase"
            className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all flex items-center gap-1 text-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Recarregar</span>
          </button>
        </div>

        {/* Products Grid */}
        <div className="px-4 py-2">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin text-orange-500 mb-2" />
              <p className="text-xs font-medium">Buscando tênis no Supabase...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 text-center my-4">
              <p className="text-sm font-bold text-slate-200">Nenhum sneaker encontrado</p>
              <p className="text-xs text-slate-400 mt-1">
                Tente ajustar os filtros de marca ou o termo de busca.
              </p>
              <button
                onClick={() => {
                  setSelectedBrand('all');
                  setSelectedCategory('all');
                  setSearchTerm('');
                }}
                className="mt-4 px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold transition-all"
              >
                Limpar Todos os Filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {filteredProducts.map((product) => {
                const isFavorite = wishlist.some((p) => p.id === product.id);
                return (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isFavorite={isFavorite}
                    onToggleFavorite={handleToggleFavorite}
                    onSelectProduct={setSelectedProduct}
                    onQuickAdd={handleQuickAdd}
                  />
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isFavorite={selectedProduct ? wishlist.some((p) => p.id === selectedProduct.id) : false}
        onClose={() => setSelectedProduct(null)}
        onToggleFavorite={handleToggleFavorite}
        onAddToCart={handleAddToCart}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        appliedCoupon={appliedCoupon}
        onApplyCoupon={handleApplyCoupon}
        onRemoveCoupon={handleRemoveCoupon}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        favorites={wishlist}
        onRemoveFavorite={handleToggleFavorite}
        onSelectProduct={setSelectedProduct}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        subtotal={subtotal}
        discount={discount}
        shipping={shipping}
        isSupabaseConnected={isSupabaseConnected}
        onOrderCompleted={() => {
          setCart([]);
          setAppliedCoupon('');
        }}
      />

      {/* Supabase Management Modal */}
      <SupabaseModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
        onReloadProducts={loadProducts}
      />

      {/* Fixed Mobile Bottom Navigation */}
      <BottomNav
        activeTab={activeNavTab}
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        isSupabaseConnected={isSupabaseConnected}
        onSelectTab={handleSelectBottomTab}
      />
    </div>
  );
}
