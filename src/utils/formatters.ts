export function formatBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function calculateInstallments(price: number, installments = 10): string {
  const installmentValue = price / installments;
  return `${installments}x de ${formatBRL(installmentValue)} sem juros`;
}
