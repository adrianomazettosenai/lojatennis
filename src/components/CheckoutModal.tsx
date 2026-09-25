import React, { useState } from 'react';
import { X, Check, QrCode, CreditCard, ShieldCheck, Copy, CheckCircle2, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { CartItem, Order } from '../types';
import { formatBRL } from '../utils/formatters';
import { submitOrder } from '../services/productService';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  onOrderCompleted: () => void;
  isSupabaseConnected: boolean;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  subtotal,
  discount,
  shipping,
  onOrderCompleted,
  isSupabaseConnected,
}) => {
  const [step, setStep] = useState<'details' | 'payment' | 'success'>('details');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'credit_card'>('pix');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrderId, setCompletedOrderId] = useState<string>('');
  const [pixCopied, setPixCopied] = useState(false);

  // Credit card inputs
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [installments, setInstallments] = useState(1);

  if (!isOpen) return null;

  // 5% extra discount if PIX
  const pixDiscount = paymentMethod === 'pix' ? (subtotal - discount) * 0.05 : 0;
  const finalTotal = Math.max(0, subtotal - discount - pixDiscount + shipping);

  const fakePixCode = `00020126580014br.gov.bcb.pix0136sneaker-vault-${Date.now()}520400005303986540${Math.round(
    finalTotal
  )}5802BR5916SNEAKERVAULT6009SAOPAULO62070503***6304`;

  const handleCopyPix = () => {
    navigator.clipboard?.writeText(fakePixCode);
    setPixCopied(true);
    setTimeout(() => setPixCopied(false), 2500);
  };

  const handleConfirmOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const orderData: Order = {
      customer_name: customerName,
      customer_phone: customerPhone,
      customer_address: customerAddress,
      subtotal,
      discount: discount + pixDiscount,
      shipping,
      total: finalTotal,
      payment_method: paymentMethod,
      items: items.map((i) => ({
        product_id: i.product.id,
        product_name: i.product.name,
        size: i.selectedSize,
        quantity: i.quantity,
        price: i.product.price,
      })),
    };

    const res = await submitOrder(orderData);
    setIsSubmitting(false);

    if (res.success) {
      setCompletedOrderId(res.orderId || `ORD-${Date.now().toString().slice(-6)}`);
      setStep('success');

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (err) {
        console.warn('Confetti unavailable:', err);
      }

      onOrderCompleted();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
      <div className="absolute inset-0" onClick={step === 'success' ? onClose : undefined} />

      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-t-[32px] sm:rounded-3xl max-h-[94vh] overflow-y-auto no-scrollbar flex flex-col z-10 shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 sticky top-0 bg-slate-900/90 backdrop-blur-md z-20">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-sm text-white">
              {step === 'details' && '1. Endereço e Contato'}
              {step === 'payment' && '2. Forma de Pagamento'}
              {step === 'success' && 'Pedido Confirmado! 🎉'}
            </h3>
          </div>
          {step !== 'success' && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Content depending on step */}
        <div className="p-5 flex-1">
          {step === 'details' && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setStep('payment');
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Ex: Carlos Eduardo Silva"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  WhatsApp / Telefone *
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="(11) 99999-9999"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Endereço Completo de Entrega (com CEP) *
                </label>
                <textarea
                  required
                  rows={2}
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  placeholder="Rua, Número, Complemento, Bairro, Cidade - UF, CEP"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Order preview snippet */}
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-3.5 text-xs space-y-1.5">
                <span className="font-bold text-slate-300 block mb-1">Resumo dos itens:</span>
                {items.slice(0, 3).map((it, idx) => (
                  <div key={idx} className="flex justify-between text-slate-400">
                    <span className="truncate pr-2">{it.quantity}x {it.product.name} (Tam {it.selectedSize})</span>
                    <span className="text-slate-200 shrink-0">{formatBRL(it.product.price * it.quantity)}</span>
                  </div>
                ))}
                {items.length > 3 && (
                  <p className="text-[10px] text-slate-500">+{items.length - 3} outros itens</p>
                )}
                <div className="pt-2 border-t border-slate-800 flex justify-between font-bold text-white">
                  <span>Total provisório</span>
                  <span className="text-orange-400">{formatBRL(finalTotal)}</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-orange-600/30 transition-all mt-4"
              >
                <span>Avançar para Pagamento</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {step === 'payment' && (
            <form onSubmit={handleConfirmOrder} className="space-y-4">
              {/* Payment method selector */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('pix')}
                  className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                    paymentMethod === 'pix'
                      ? 'bg-emerald-950/40 border-emerald-500 text-white shadow-md shadow-emerald-500/10'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <QrCode className={`w-5 h-5 ${paymentMethod === 'pix' ? 'text-emerald-400' : 'text-slate-500'}`} />
                    <span className="text-[10px] font-black uppercase px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                      -5% OFF
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">PIX Imediato</p>
                    <p className="text-[10px] text-slate-400">Aprovação instantânea</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('credit_card')}
                  className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                    paymentMethod === 'credit_card'
                      ? 'bg-orange-950/40 border-orange-500 text-white shadow-md shadow-orange-500/10'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <CreditCard className={`w-5 h-5 ${paymentMethod === 'credit_card' ? 'text-orange-400' : 'text-slate-500'}`} />
                    <span className="text-[10px] font-semibold text-slate-400">Até 10x</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Cartão de Crédito</p>
                    <p className="text-[10px] text-slate-400">Sem juros no cartão</p>
                  </div>
                </button>
              </div>

              {/* Method specific fields */}
              {paymentMethod === 'pix' ? (
                <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-center space-y-3">
                  <div className="inline-flex p-3 bg-white rounded-2xl shadow-inner">
                    {/* SVG representation of QR Code */}
                    <div className="w-32 h-32 flex flex-col items-center justify-center bg-slate-100 rounded-lg p-2">
                      <QrCode className="w-24 h-24 text-slate-900" />
                      <span className="text-[9px] font-mono font-bold text-slate-700 uppercase">PIX SNEAKERVAULT</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-bold text-slate-200">Total com 5% de desconto no PIX:</p>
                    <p className="text-xl font-black text-emerald-400 mt-0.5">{formatBRL(finalTotal)}</p>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleCopyPix}
                      className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all border border-slate-700"
                    >
                      {pixCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Código PIX Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-400" />
                          <span>Copiar Código PIX Copia e Cola</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Número do Cartão
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={19}
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="0000 0000 0000 0000"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono placeholder-slate-600 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Nome Impresso no Cartão
                    </label>
                    <input
                      type="text"
                      required
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      placeholder="NOME COMO NO CARTÃO"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white uppercase placeholder-slate-600 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                        Validade
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={5}
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/AA"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono placeholder-slate-600 focus:outline-none focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                        CVV
                      </label>
                      <input
                        type="password"
                        required
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="123"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono placeholder-slate-600 focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Parcelas
                    </label>
                    <select
                      value={installments}
                      onChange={(e) => setInstallments(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                    >
                      {[1, 2, 3, 4, 5, 6, 10].map((num) => (
                        <option key={num} value={num}>
                          {num}x de {formatBRL(finalTotal / num)} sem juros
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Supabase status badge in checkout */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                <span>Destino do Pedido:</span>
                <span className="font-semibold text-slate-300">
                  {isSupabaseConnected ? '⚡ Supabase em Tempo Real' : '💾 Armazenamento Local Demo'}
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('details')}
                  className="px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3.5 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] disabled:opacity-50 text-white font-bold text-sm rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Processando Pedido...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Confirmar Pedido ({formatBRL(finalTotal)})</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {step === 'success' && (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full mb-1">
                  <Sparkles className="w-3 h-3" /> Pedido Registrado com Sucesso
                </span>
                <h4 className="text-lg font-black text-white">Obrigado pela preferência!</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                  Enviaremos o código de rastreamento no WhatsApp cadastrado (<strong className="text-slate-200">{customerPhone}</strong>).
                </p>
              </div>

              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Código do Pedido:</span>
                  <span className="font-mono font-bold text-orange-400">{completedOrderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Cliente:</span>
                  <span className="text-white font-medium">{customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Forma de Pagamento:</span>
                  <span className="text-white font-medium uppercase">{paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Status:</span>
                  <span className="text-emerald-400 font-bold">
                    {paymentMethod === 'pix' ? 'Aguardando compensação' : 'Aprovado'}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-800 text-sm font-bold text-white">
                  <span>Total:</span>
                  <span className="text-orange-400">{formatBRL(finalTotal)}</span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3.5 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-2xl transition-all shadow-lg shadow-orange-600/30"
              >
                Continuar Comprando
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
