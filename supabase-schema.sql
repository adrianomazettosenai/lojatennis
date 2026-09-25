-- ==========================================================
-- SCHEMA SUPABASE: LOJA DE TÊNIS MOBILE (SNEAKERVAULT)
-- Execute este script no SQL Editor do seu projeto Supabase
-- ==========================================================

-- 1. Criar extensão para UUID se não existir
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Tabela de Categorias
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    icon TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Tabela de Produtos (Tênis / Sneakers)
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    brand TEXT NOT NULL,
    category TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    original_price NUMERIC(10, 2),
    image_url TEXT NOT NULL,
    gallery JSONB DEFAULT '[]'::jsonb,
    description TEXT,
    rating NUMERIC(2, 1) DEFAULT 5.0,
    reviews_count INTEGER DEFAULT 0,
    sizes JSONB DEFAULT '[38, 39, 40, 41, 42, 43]'::jsonb,
    in_stock BOOLEAN DEFAULT true,
    badge TEXT,
    colors JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Tabela de Pedidos (Orders)
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_address TEXT NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL,
    discount NUMERIC(10, 2) DEFAULT 0,
    shipping NUMERIC(10, 2) DEFAULT 0,
    total NUMERIC(10, 2) NOT NULL,
    payment_method TEXT NOT NULL, -- 'pix' ou 'credit_card'
    status TEXT DEFAULT 'pending', -- 'pending', 'paid', 'shipped', 'delivered'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. Tabela de Itens do Pedido (Order Items)
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    product_name TEXT NOT NULL,
    size INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ==========================================================
-- ÍNDICES PARA PERFORMANCE MOBILE (BUSCA E FILTROS RÁPIDOS)
-- ==========================================================
CREATE INDEX IF NOT EXISTS idx_products_brand ON public.products(brand);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_price ON public.products(price);

-- ==========================================================
-- POLÍTICAS DE SEGURANÇA (ROW LEVEL SECURITY - RLS)
-- ==========================================================
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Produtos e Categorias: Leitura Pública liberada para qualquer visitante mobile
CREATE POLICY "Produtos visíveis para todos" 
    ON public.products FOR SELECT 
    USING (true);

CREATE POLICY "Categorias visíveis para todos" 
    ON public.categories FOR SELECT 
    USING (true);

-- Permitir inserção de produtos no desenvolvimento (opcional se quiser usar o botão de sincronizar da loja)
CREATE POLICY "Permitir inserção de produtos para anon" 
    ON public.products FOR INSERT 
    WITH CHECK (true);

-- Pedidos: Qualquer usuário mobile pode criar pedidos (anônimo ou autenticado)
CREATE POLICY "Qualquer visitante pode criar pedidos" 
    ON public.orders FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "Qualquer visitante pode criar itens de pedido" 
    ON public.order_items FOR INSERT 
    WITH CHECK (true);

-- Leitura de pedidos liberada para administradores ou consultas
CREATE POLICY "Leitura de pedidos" 
    ON public.orders FOR SELECT 
    USING (true);

CREATE POLICY "Leitura de itens de pedido" 
    ON public.order_items FOR SELECT 
    USING (true);

-- ==========================================================
-- DADOS INICIAIS DE EXEMPLO (SEED DE TÊNIS ICÔNICOS)
-- ==========================================================

-- Categorias
INSERT INTO public.categories (id, name, icon) VALUES
    ('todos', 'Todos', 'Flame'),
    ('casual', 'Casual & Street', 'Sparkles'),
    ('corrida', 'Performance & Corrida', 'Zap'),
    ('basquete', 'Basquete & Quadra', 'Trophy'),
    ('edicao_especial', 'Edição Limitada', 'Crown')
ON CONFLICT (id) DO NOTHING;

-- Tênis / Sneakers
INSERT INTO public.products (name, brand, category, price, original_price, image_url, gallery, description, rating, reviews_count, sizes, in_stock, badge, colors)
VALUES
(
    'Air Jordan 1 Retro High OG "Chicago"',
    'Jordan',
    'basquete',
    1399.90,
    1699.90,
    'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80',
    '["https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80"]'::jsonb,
    'O clássico atemporal que redefiniu a cultura sneaker mundial. Com cabedal em couro premium vermelho, branco e preto e amortecimento Air encapsulado no calcanhar.',
    4.9,
    142,
    '[38, 39, 40, 41, 42, 43]'::jsonb,
    true,
    'Hyped',
    '["#ef4444", "#ffffff", "#000000"]'::jsonb
),
(
    'Nike Dunk Low Retro "Panda"',
    'Nike',
    'casual',
    799.90,
    949.90,
    'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80',
    '["https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?auto=format&fit=crop&w=800&q=80"]'::jsonb,
    'Criado para as quadras e adotado pelas ruas. A colorway bicolor icônica combina com qualquer visual streetwear com solado de borracha aderente.',
    4.8,
    320,
    '[37, 38, 39, 40, 41, 42, 43, 44]'::jsonb,
    true,
    'Destaque',
    '["#000000", "#ffffff"]'::jsonb
),
(
    'New Balance 9060 "Rain Cloud Grey"',
    'New Balance',
    'casual',
    1199.90,
    NULL,
    'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=800&q=80',
    '["https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=800&q=80"]'::jsonb,
    'Uma nova expressão do estilo refinado e design inovador da clássica série 99X. Entressola esculpida de dupla densidade com amortecimento ABZORB e SBS.',
    4.9,
    87,
    '[39, 40, 41, 42, 43]'::jsonb,
    true,
    'Novo',
    '["#94a3b8", "#cbd5e1"]'::jsonb
),
(
    'Nike ZoomX Vaporfly NEXT% 3',
    'Nike',
    'corrida',
    1799.90,
    2199.90,
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
    '["https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80"]'::jsonb,
    'Máxima velocidade para maratonas e provas de alta performance. Placa de fibra de carbono em toda a extensão e espuma ZoomX ultraleve.',
    5.0,
    64,
    '[39, 40, 41, 42, 43, 44]'::jsonb,
    true,
    'Limitado',
    '["#ef4444", "#f97316"]'::jsonb
),
(
    'Adidas Samba OG Cloud White',
    'Adidas',
    'casual',
    699.90,
    NULL,
    'https://images.unsplash.com/photo-1518002171953-a080ee817e1f?auto=format&fit=crop&w=800&q=80',
    '["https://images.unsplash.com/photo-1518002171953-a080ee817e1f?auto=format&fit=crop&w=800&q=80"]'::jsonb,
    'O ícone original do futebol de salão agora reina absoluto na moda urbana. Cabedal de couro com reforço em camurça T-toe e as clássicas 3 listras.',
    4.7,
    198,
    '[37, 38, 39, 40, 41, 42]'::jsonb,
    true,
    'Destaque',
    '["#ffffff", "#000000"]'::jsonb
),
(
    'Asics Gel-Kayano 14 Metallic Silver',
    'Asics',
    'corrida',
    999.90,
    1199.90,
    'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?auto=format&fit=crop&w=800&q=80',
    '["https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?auto=format&fit=crop&w=800&q=80"]'::jsonb,
    'Estética Y2K com engenharia de suporte lendária. Amortecimento com tecnologia GEL no calcanhar e antepé para absorção de impacto extraordinária.',
    4.8,
    53,
    '[38, 39, 40, 41, 42, 43]'::jsonb,
    true,
    'Promoção',
    '["#94a3b8", "#0284c7"]'::jsonb
),
(
    'Jordan 4 Retro "Military Black"',
    'Jordan',
    'edicao_especial',
    1899.90,
    NULL,
    'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?auto=format&fit=crop&w=800&q=80',
    '["https://images.unsplash.com/photo-1607522370275-f14206abe5d3?auto=format&fit=crop&w=800&q=80"]'::jsonb,
    'Um dos modelos mais desejados da silhueta AJ4. Detalhes em preto fosco contrastando com a base de couro branco e sobreposições em camurça cinza neutro.',
    4.9,
    110,
    '[40, 41, 42, 43, 44]'::jsonb,
    true,
    'Limitado',
    '["#000000", "#ffffff", "#64748b"]'::jsonb
),
(
    'Puma Palermo Special "Cobalt"',
    'Puma',
    'casual',
    549.90,
    649.90,
    'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80',
    '["https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80"]'::jsonb,
    'Direto dos arquivos dos anos 80, o tênis favorito da cultura terrace europeia. Cabedal de camurça premium com solado clássico de borracha gum.',
    4.6,
    76,
    '[37, 38, 39, 40, 41, 42]'::jsonb,
    true,
    'Promoção',
    '["#1d4ed8", "#ffffff"]'::jsonb
);
