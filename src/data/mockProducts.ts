import type { Product } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Air Jordan 1 Retro High OG "Chicago"',
    brand: 'Jordan',
    category: 'basquete',
    price: 1399.90,
    original_price: 1699.90,
    image_url: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'O clássico atemporal que redefiniu a cultura sneaker mundial. Com cabedal em couro premium vermelho, branco e preto e amortecimento Air encapsulado no calcanhar.',
    rating: 4.9,
    reviews_count: 142,
    sizes: [38, 39, 40, 41, 42, 43],
    in_stock: true,
    badge: 'Hyped',
    colors: ['#ef4444', '#ffffff', '#000000']
  },
  {
    id: 'prod-2',
    name: 'Nike Dunk Low Retro "Panda"',
    brand: 'Nike',
    category: 'casual',
    price: 799.90,
    original_price: 949.90,
    image_url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Criado para as quadras e adotado pelas ruas. A colorway bicolor icônica combina com qualquer visual streetwear com solado de borracha aderente.',
    rating: 4.8,
    reviews_count: 320,
    sizes: [37, 38, 39, 40, 41, 42, 43, 44],
    in_stock: true,
    badge: 'Destaque',
    colors: ['#000000', '#ffffff']
  },
  {
    id: 'prod-3',
    name: 'New Balance 9060 "Rain Cloud Grey"',
    brand: 'New Balance',
    category: 'casual',
    price: 1199.90,
    image_url: 'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1512374382149-233c42b6613c?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Uma nova expressão do estilo refinado e design inovador da clássica série 99X. Entressola esculpida de dupla densidade com amortecimento ABZORB e SBS.',
    rating: 4.9,
    reviews_count: 87,
    sizes: [39, 40, 41, 42, 43],
    in_stock: true,
    badge: 'Novo',
    colors: ['#94a3b8', '#cbd5e1']
  },
  {
    id: 'prod-4',
    name: 'Nike ZoomX Vaporfly NEXT% 3',
    brand: 'Nike',
    category: 'corrida',
    price: 1799.90,
    original_price: 2199.90,
    image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Máxima velocidade para maratonas e provas de alta performance. Placa de fibra de carbono em toda a extensão e espuma ZoomX ultraleve.',
    rating: 5.0,
    reviews_count: 64,
    sizes: [39, 40, 41, 42, 43, 44],
    in_stock: true,
    badge: 'Limitado',
    colors: ['#ef4444', '#f97316']
  },
  {
    id: 'prod-5',
    name: 'Adidas Samba OG Cloud White',
    brand: 'Adidas',
    category: 'casual',
    price: 699.90,
    image_url: 'https://images.unsplash.com/photo-1518002171953-a080ee817e1f?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1518002171953-a080ee817e1f?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'O ícone original do futebol de salão agora reina absoluto na moda urbana. Cabedal de couro com reforço em camurça T-toe e as clássicas 3 listras.',
    rating: 4.7,
    reviews_count: 198,
    sizes: [37, 38, 39, 40, 41, 42],
    in_stock: true,
    badge: 'Destaque',
    colors: ['#ffffff', '#000000']
  },
  {
    id: 'prod-6',
    name: 'Asics Gel-Kayano 14 Metallic Silver',
    brand: 'Asics',
    category: 'corrida',
    price: 999.90,
    original_price: 1199.90,
    image_url: 'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Estética Y2K com engenharia de suporte lendária. Amortecimento com tecnologia GEL no calcanhar e antepé para absorção de impacto extraordinária.',
    rating: 4.8,
    reviews_count: 53,
    sizes: [38, 39, 40, 41, 42, 43],
    in_stock: true,
    badge: 'Promoção',
    colors: ['#94a3b8', '#0284c7']
  },
  {
    id: 'prod-7',
    name: 'Jordan 4 Retro "Military Black"',
    brand: 'Jordan',
    category: 'edicao_especial',
    price: 1899.90,
    image_url: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Um dos modelos mais desejados da silhueta AJ4. Detalhes em preto fosco contrastando com a base de couro branco e sobreposições em camurça cinza neutro.',
    rating: 4.9,
    reviews_count: 110,
    sizes: [40, 41, 42, 43, 44],
    in_stock: true,
    badge: 'Limitado',
    colors: ['#000000', '#ffffff', '#64748b']
  },
  {
    id: 'prod-8',
    name: 'Puma Palermo Special "Cobalt"',
    brand: 'Puma',
    category: 'casual',
    price: 549.90,
    original_price: 649.90,
    image_url: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Direto dos arquivos dos anos 80, o tênis favorito da cultura terrace europeia. Cabedal de camurça premium com solado clássico de borracha gum.',
    rating: 4.6,
    reviews_count: 76,
    sizes: [37, 38, 39, 40, 41, 42],
    in_stock: true,
    badge: 'Promoção',
    colors: ['#1d4ed8', '#ffffff']
  }
];
