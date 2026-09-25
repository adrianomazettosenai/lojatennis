import { createClient, SupabaseClient } from '@supabase/supabase-js';

const STORAGE_KEY_URL = 'sneaker_supabase_url';
const STORAGE_KEY_KEY = 'sneaker_supabase_key';

export function getStoredSupabaseConfig(): { url: string; anonKey: string } {
  const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

  const storedUrl = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY_URL) : null;
  const storedKey = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY_KEY) : null;

  return {
    url: storedUrl?.trim() || envUrl.trim(),
    anonKey: storedKey?.trim() || envKey.trim(),
  };
}

let supabaseInstance: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  const { url, anonKey } = getStoredSupabaseConfig();

  if (!url || !anonKey || url === 'SUA_URL_DO_SUPABASE_AQUI' || anonKey === 'SUA_ANON_KEY_AQUI') {
    return null;
  }

  try {
    if (!supabaseInstance) {
      supabaseInstance = createClient(url, anonKey);
    }
    return supabaseInstance;
  } catch (error) {
    console.error('Erro ao inicializar Supabase:', error);
    return null;
  }
}

export function saveSupabaseConfig(url: string, anonKey: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_URL, url.trim());
    localStorage.setItem(STORAGE_KEY_KEY, anonKey.trim());
    supabaseInstance = null; // Reset instance to recreate with new credentials
  }
}

export function clearSupabaseConfig() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY_URL);
    localStorage.removeItem(STORAGE_KEY_KEY);
    supabaseInstance = null;
  }
}

export async function testSupabaseConnection(): Promise<{ success: boolean; message: string; tableFound: boolean }> {
  const client = getSupabase();
  if (!client) {
    return {
      success: false,
      message: 'URL ou Chave Anon não configuradas.',
      tableFound: false,
    };
  }

  try {
    const { data, error } = await client.from('products').select('id').limit(1);

    if (error) {
      // Check if it's a 42P01 table does not exist or permission error
      if (error.code === '42P01' || error.message.includes('relation "products" does not exist')) {
        return {
          success: true,
          tableFound: false,
          message: 'Conectado ao Supabase com sucesso! Porém a tabela "products" ainda não foi criada. Execute o script SQL fornecido.',
        };
      }
      return {
        success: false,
        tableFound: false,
        message: `Erro do Supabase: ${error.message}`,
      };
    }

    return {
      success: true,
      tableFound: true,
      message: `Conectado com sucesso! Tabela "products" ativa (${data?.length ?? 0} registros consultados).`,
    };
  } catch (err: any) {
    return {
      success: false,
      tableFound: false,
      message: `Falha de rede ou configuração inválida: ${err.message || 'Erro desconhecido'}`,
    };
  }
}
