import { supabase } from '../supabaseClient';
import type { Product, Order } from '../types';
import { INITIAL_PRODUCTS } from '../data/mockProducts';

export interface FetchProductsResult {
  products: Product[];
  source: 'supabase' | 'mock';
  error?: string;
}

export async function fetchProducts(): Promise<FetchProductsResult> {
  console.log('📡 [Supabase GET/SELECT]: Executando primeira leitura assíncrona da nuvem na tabela "products"...');

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.warn('⚠️ [Supabase DevTools F12] Erro na consulta ou tabela não encontrada:', error.message);
      return {
        products: INITIAL_PRODUCTS,
        source: 'mock',
        error: error.message,
      };
    }

    if (!data || data.length === 0) {
      console.info('ℹ️ [Supabase DevTools F12] Tabela "products" está vazia.');
      return {
        products: INITIAL_PRODUCTS,
        source: 'mock',
        error: 'Tabela products vazia. Exibindo dados locais de demonstração.',
      };
    }

    console.log(`✅ [Supabase DevTools F12] Sucesso! ${data.length} produtos carregados diretamente da nuvem:`, data);

    const mappedProducts: Product[] = data.map((item: any) => ({
      id: item.id,
      name: item.name,
      brand: item.brand,
      category: item.category || 'casual',
      price: Number(item.price),
      original_price: item.original_price ? Number(item.original_price) : undefined,
      image_url: item.image_url,
      gallery: item.gallery ? (Array.isArray(item.gallery) ? item.gallery : [item.image_url]) : [item.image_url],
      description: item.description || '',
      rating: item.rating ? Number(item.rating) : 4.8,
      reviews_count: item.reviews_count ? Number(item.reviews_count) : 10,
      sizes: Array.isArray(item.sizes) ? item.sizes : [38, 39, 40, 41, 42],
      in_stock: item.in_stock !== false,
      badge: item.badge || undefined,
      colors: Array.isArray(item.colors) ? item.colors : undefined,
      created_at: item.created_at,
    }));

    return {
      products: mappedProducts,
      source: 'supabase',
    };
  } catch (err: any) {
    console.error('❌ [Supabase DevTools F12] Exceção na conexão:', err);
    return {
      products: INITIAL_PRODUCTS,
      source: 'mock',
      error: err.message || 'Falha de conexão',
    };
  }
}

export async function seedSupabaseWithSampleData(): Promise<{ success: boolean; count: number; error?: string }> {
  try {
    const productsToInsert = INITIAL_PRODUCTS.map((prod) => ({
      name: prod.name,
      brand: prod.brand,
      category: prod.category,
      price: prod.price,
      original_price: prod.original_price || null,
      image_url: prod.image_url,
      gallery: prod.gallery || [prod.image_url],
      description: prod.description,
      rating: prod.rating,
      reviews_count: prod.reviews_count,
      sizes: prod.sizes,
      in_stock: prod.in_stock,
      badge: prod.badge || null,
      colors: prod.colors || [],
    }));

    const { data, error } = await supabase
      .from('products')
      .insert(productsToInsert)
      .select();

    if (error) {
      console.error('❌ [Supabase DevTools F12] Erro no seed:', error.message);
      return { success: false, count: 0, error: error.message };
    }

    console.log('✅ [Supabase DevTools F12] Seed concluído com sucesso:', data);
    return { success: true, count: data?.length || productsToInsert.length };
  } catch (err: any) {
    return { success: false, count: 0, error: err.message };
  }
}

export async function submitOrder(order: Order): Promise<{ success: boolean; orderId?: string; error?: string }> {
  // Salvar no histórico local
  try {
    const localOrders = JSON.parse(localStorage.getItem('sneaker_local_orders') || '[]');
    const localId = `ORD-${Date.now().toString().slice(-6)}`;
    const savedOrder = { ...order, id: localId, created_at: new Date().toISOString() };
    localOrders.unshift(savedOrder);
    localStorage.setItem('sneaker_local_orders', JSON.stringify(localOrders));
  } catch (e) {
    console.warn('Aviso: Armazenamento local falhou:', e);
  }

  try {
    console.log('📡 [Supabase INSERT]: Enviando pedido para a nuvem...', order);
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_name: order.customer_name,
        customer_phone: order.customer_phone,
        customer_address: order.customer_address,
        subtotal: order.subtotal,
        discount: order.discount,
        shipping: order.shipping,
        total: order.total,
        payment_method: order.payment_method,
        status: order.payment_method === 'pix' ? 'paid' : 'pending',
      })
      .select()
      .single();

    if (orderError) {
      console.warn('⚠️ [Supabase DevTools F12] Pedido salvo localmente (aviso Supabase):', orderError.message);
      return {
        success: true,
        orderId: `LOC-${Date.now().toString().slice(-6)}`,
      };
    }

    console.log('✅ [Supabase DevTools F12] Pedido registrado no Supabase:', orderData);

    if (orderData?.id && order.items.length > 0) {
      try {
        const itemsToInsert = order.items.map((it) => ({
          order_id: orderData.id,
          product_name: it.product_name,
          size: it.size,
          quantity: it.quantity,
          price: it.price,
        }));
        await supabase.from('order_items').insert(itemsToInsert);
      } catch (itemErr) {
        console.warn('Nota: Inserção de itens complementares:', itemErr);
      }
    }

    return {
      success: true,
      orderId: orderData?.id ? `SUPA-${String(orderData.id).slice(-6)}` : `ORD-${Date.now().toString().slice(-6)}`,
    };
  } catch (err: any) {
    console.error('Erro ao enviar pedido para o Supabase:', err);
    return {
      success: true,
      orderId: `LOC-${Date.now().toString().slice(-6)}`,
    };
  }
}
