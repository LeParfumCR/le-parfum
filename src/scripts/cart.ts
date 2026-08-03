// Le Parfum — carrito de compras (client-side, sin pagos en línea).
// El pedido final se arma como un mensaje y se envía por WhatsApp.

export interface CartItem {
  slug: string;
  nombre: string;
  marca: string;
  precio: number;
  moneda: string;
  imagen: string;
  cantidad: number;
}

const STORAGE_KEY = 'leparfum_cart';
export const CART_UPDATED_EVENT = 'leparfum:cart-updated';
export const CART_TOGGLE_EVENT = 'leparfum:cart-toggle';

function notify() {
  window.dispatchEvent(new CustomEvent(CART_UPDATED_EVENT));
}

export function getCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  notify();
}

export function addToCart(item: Omit<CartItem, 'cantidad'>, cantidad = 1) {
  const items = getCart();
  const existing = items.find((i) => i.slug === item.slug);
  if (existing) {
    existing.cantidad += cantidad;
  } else {
    items.push({ ...item, cantidad });
  }
  saveCart(items);
}

export function updateQuantity(slug: string, cantidad: number) {
  let items = getCart();
  if (cantidad <= 0) {
    items = items.filter((i) => i.slug !== slug);
  } else {
    const existing = items.find((i) => i.slug === slug);
    if (existing) existing.cantidad = cantidad;
  }
  saveCart(items);
}

export function removeFromCart(slug: string) {
  const items = getCart().filter((i) => i.slug !== slug);
  saveCart(items);
}

export function clearCart() {
  saveCart([]);
}

export function cartCount(): number {
  return getCart().reduce((sum, i) => sum + i.cantidad, 0);
}

export function cartTotal(): number {
  return getCart().reduce((sum, i) => sum + i.precio * i.cantidad, 0);
}

export function formatCurrency(amount: number, moneda = 'CRC'): string {
  return new Intl.NumberFormat('es-CR', {
    style: 'currency',
    currency: moneda,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function buildWhatsappOrderUrl(whatsappNumber: string): string {
  const items = getCart();
  const moneda = items[0]?.moneda ?? 'CRC';

  const lineas = items
    .map(
      (i) =>
        `• ${i.cantidad}x ${i.nombre} (${i.marca}) — ${formatCurrency(i.precio * i.cantidad, i.moneda)}`
    )
    .join('\n');

  const total = formatCurrency(cartTotal(), moneda);

  const mensaje =
    `Hola, quiero hacer un pedido:\n\n${lineas}\n\nTotal: ${total}\n\n` +
    `¿Podrían confirmarme disponibilidad, forma de pago y envío?`;

  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(mensaje)}`;
}
