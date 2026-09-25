import React, { useState, useEffect } from 'react';
import { X, Database, CheckCircle2, AlertCircle, RefreshCw, Copy, Check, ExternalLink, UploadCloud, Terminal, KeyRound, Globe } from 'lucide-react';
import { getStoredSupabaseConfig, saveSupabaseConfig, clearSupabaseConfig, testSupabaseConnection } from '../lib/supabase';
import { seedSupabaseWithSampleData } from '../services/productService';

interface SupabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReloadProducts: () => void;
}

export const SupabaseModal: React.FC<SupabaseModalProps> = ({
  isOpen,
  onClose,
  onReloadProducts,
}) => {
  const [url, setUrl] = useState('');
  const [anonKey, setAnonKey] = useState('');
  const [activeTab, setActiveTab] = useState<'config' | 'sql' | 'guide'>('config');
  const [isTesting, setIsTesting] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; tableFound: boolean } | null>(null);
  const [seedResult, setSeedResult] = useState<{ success: boolean; count: number; error?: string } | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const stored = getStoredSupabaseConfig();
      setUrl(stored.url);
      setAnonKey(stored.anonKey);
      setTestResult(null);
      setSeedResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveAndTest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsTesting(true);
    setTestResult(null);

    saveSupabaseConfig(url, anonKey);
    const result = await testSupabaseConnection();
    setIsTesting(false);
    setTestResult(result);

    if (result.success) {
      onReloadProducts();
    }
  };

  const handleClear = () => {
    clearSupabaseConfig();
    setUrl('');
    setAnonKey('');
    setTestResult(null);
    onReloadProducts();
  };

  const handleSeed = async () => {
    setIsSeeding(true);
    setSeedResult(null);
    const res = await seedSupabaseWithSampleData();
    setIsSeeding(false);
    setSeedResult(res);
    if (res.success) {
      onReloadProducts();
    }
  };

  const sqlSample = `-- Tabela de Produtos (Tênis / Sneakers)
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

-- Tabela de Pedidos
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_address TEXT NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL,
    discount NUMERIC(10, 2) DEFAULT 0,
    shipping NUMERIC(10, 2) DEFAULT 0,
    total NUMERIC(10, 2) NOT NULL,
    payment_method TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Habilitar RLS com leitura pública
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Leitura pública de produtos" ON public.products FOR SELECT USING (true);
CREATE POLICY "Inserção pública de pedidos" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir inserção de produtos" ON public.products FOR INSERT WITH CHECK (true);`;

  const handleCopySql = () => {
    navigator.clipboard?.writeText(sqlSample);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-t-[32px] sm:rounded-3xl max-h-[92vh] overflow-y-auto no-scrollbar flex flex-col z-10 shadow-2xl animate-slide-up">
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 sticky top-0 bg-slate-900/90 backdrop-blur-md z-20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                Integração Supabase
              </h3>
              <p className="text-[10px] text-slate-400">Conexão direta com banco de dados em tempo real</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 px-5 pt-2">
          <button
            onClick={() => setActiveTab('config')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 ${
              activeTab === 'config'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Conectar / Credenciais
          </button>
          <button
            onClick={() => setActiveTab('sql')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 ${
              activeTab === 'sql'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Script SQL
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 ${
              activeTab === 'guide'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Passo a Passo
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 flex-1">
          {activeTab === 'config' && (
            <div className="space-y-4">
              {/* Status Banner */}
              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-slate-400 font-medium">Estado da Conexão:</span>
                  {url && anonKey ? (
                    <span className="inline-flex items-center gap-1 text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Credenciais Definidas
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                      <AlertCircle className="w-3.5 h-3.5" /> Modo Demonstração (Mock)
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Se você não preencher nada, a loja funciona perfeitamente exibindo produtos de exemplo e simulando compras. Ao preencher suas chaves, os dados passam a vir do seu Supabase!
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSaveAndTest} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-slate-400" />
                    Project URL (Supabase)
                  </label>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://xyzabcdefg.supabase.co"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-slate-400" />
                    Anon Public API Key
                  </label>
                  <input
                    type="password"
                    value={anonKey}
                    onChange={(e) => setAnonKey(e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    type="submit"
                    disabled={isTesting}
                    className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all"
                  >
                    {isTesting ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Testando Conexão...</span>
                      </>
                    ) : (
                      <>
                        <Database className="w-3.5 h-3.5" />
                        <span>Salvar & Testar Conexão</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleClear}
                    className="px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 rounded-xl transition-all"
                  >
                    Limpar
                  </button>
                </div>
              </form>

              {/* Feedback Test Result */}
              {testResult && (
                <div
                  className={`p-3 rounded-xl border text-xs flex items-start gap-2 ${
                    testResult.success
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                      : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
                  }`}
                >
                  {testResult.success ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                  )}
                  <div>
                    <p className="font-semibold">{testResult.message}</p>
                    {testResult.tableFound === false && testResult.success && (
                      <p className="mt-1 text-[11px] text-slate-300">
                        Clique na aba <strong>Script SQL</strong> acima, copie o código e rode no SQL Editor do Supabase.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* One-Click Seed to Supabase */}
              <div className="pt-2 border-t border-slate-800">
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-slate-950 to-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2">
                    <UploadCloud className="w-4 h-4 text-orange-400" />
                    <span className="text-xs font-bold text-white">
                      Popular Catálogo no Supabase (Seed 1-Click)
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Se você já criou a tabela no Supabase e ela está vazia, clique abaixo para cadastrar automaticamente os 8 modelos de tênis com fotos e preços.
                  </p>
                  <button
                    onClick={handleSeed}
                    disabled={isSeeding || !url}
                    className="w-full py-2 px-3 bg-orange-600/80 hover:bg-orange-600 disabled:opacity-40 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all"
                  >
                    {isSeeding ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Enviando dados para o Supabase...</span>
                      </>
                    ) : (
                      <>
                        <UploadCloud className="w-3.5 h-3.5" />
                        <span>Inserir Tênis de Exemplo no Supabase</span>
                      </>
                    )}
                  </button>

                  {seedResult && (
                    <p
                      className={`text-[11px] font-semibold mt-1 ${
                        seedResult.success ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {seedResult.success
                        ? `Sucesso! ${seedResult.count} produtos inseridos no seu banco.`
                        : `Erro: ${seedResult.error}`}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sql' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  Script de Tabelas e RLS
                </span>
                <button
                  onClick={handleCopySql}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white rounded-lg flex items-center gap-1 border border-slate-700"
                >
                  {copiedSql ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-300" />
                      <span>Copiar SQL</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-[11px] text-slate-400">
                O arquivo completo <strong className="text-slate-200">supabase-schema.sql</strong> também está salvo na raiz do projeto com as tabelas <code className="text-orange-400">products</code> e <code className="text-orange-400">orders</code>.
              </p>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 max-h-60 overflow-y-auto no-scrollbar font-mono text-[11px] text-slate-300 leading-relaxed">
                <pre>{sqlSample}</pre>
              </div>
            </div>
          )}

          {activeTab === 'guide' && (
            <div className="space-y-3 text-xs text-slate-300">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                <span className="font-bold text-orange-400 block">1. Crie seu projeto</span>
                <p className="text-slate-400 text-[11px]">
                  Acesse <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-blue-400 underline inline-flex items-center gap-0.5">supabase.com <ExternalLink className="w-2.5 h-2.5" /></a> e crie um projeto gratuito.
                </p>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                <span className="font-bold text-orange-400 block">2. Execute o Script SQL</span>
                <p className="text-slate-400 text-[11px]">
                  No painel do Supabase, vá em <strong>SQL Editor</strong> &gt; <strong>New Query</strong>, cole o código da aba "Script SQL" e clique em <strong>Run</strong>.
                </p>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                <span className="font-bold text-orange-400 block">3. Obtenha as Credenciais</span>
                <p className="text-slate-400 text-[11px]">
                  Vá em <strong>Project Settings</strong> &gt; <strong>API</strong>. Copie a <strong>Project URL</strong> e a chave <strong>anon public</strong>.
                </p>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                <span className="font-bold text-orange-400 block">4. Conecte</span>
                <p className="text-slate-400 text-[11px]">
                  Cole as duas chaves na aba <strong>Conectar</strong> deste modal ou no arquivo <code className="text-emerald-400">.env</code> do projeto. Pronto! A loja sincronizará os tênis e salvará os pedidos no seu banco.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
