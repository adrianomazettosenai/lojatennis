import { supabase } from '../supabaseClient';
import type { SupabaseClient } from '@supabase/supabase-js';

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

export function getSupabase(): SupabaseClient {
  return supabase;
}

export function saveSupabaseConfig(url: string, anonKey: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_URL, url.trim());
    localStorage.setItem(STORAGE_KEY_KEY, anonKey.trim());
  }
}

export function clearSupabaseConfig() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY_URL);
    localStorage.removeItem(STORAGE_KEY_KEY);
  }
}

export async function testSupabaseConnection(): Promise<{ success: boolean; message: string; tableFound: boolean }> {
  try {
    const { data, error } = await supabase.from('products').select('id').limit(1);

    if (error) {
      if (error.code === '42P01' || error.message.includes('relation "products" does not exist')) {
        return {
          success: true,
          tableFound: false,
          message: 'Conectado ao Supabase! Porém a tabela "products" ainda não foi criada. Execute o script SQL no Supabase.',
        };
      }
      return {
        success: false,
        tableFound: false,
        message: `Aviso do Supabase: ${error.message}`,
      };
    }

    return {
      success: true,
      tableFound: true,
      message: `Conectado com sucesso ao Supabase! Tabela "products" ativa (${data?.length ?? 0} registros encontrados).`,
    };
  } catch (err: any) {
    return {
      success: false,
      tableFound: false,
      message: `Falha de rede ou configuração: ${err.message || 'Erro desconhecido'}`,
    };
  }
}

export { supabase };
