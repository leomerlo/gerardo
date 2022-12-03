export const currencyFormat = (value, currency = 'USD') => {
  const formatted = new Intl.NumberFormat('es-AR', { style: 'currency', currency }).format(value);
  return formatted;
}