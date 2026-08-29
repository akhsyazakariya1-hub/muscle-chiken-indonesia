import { dbService } from './db';

export const buildWhatsAppOrderMessage = (order) => {
  const settings = dbService.getSettings();
  const formatRupiah = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);

  const itemsList = order.items.map(item => 
    `• *${item.name}* x${item.quantity} (${formatRupiah(item.price * item.quantity)})` +
    (item.sauce ? `\n   _Sauce: ${item.sauce}_` : '')
  ).join('\n');

  const text = `*NEW ORDER ALERT — MUSCLE CHICKEN INDONESIA*
━━━━━━━━━━━━━━━━━━━━
*Order ID:* #${order.id}
*Customer:* ${order.customer_name || order.customerName}
*WhatsApp:* ${order.customer_phone || order.whatsapp}
*Address:* ${order.customer_address || order.address}

📦 *ORDER ITEMS*
${itemsList}

💰 *TOTAL:* *${formatRupiah(order.total)}*
💳 *PAYMENT:* ${order.payment_method || order.paymentMethod} (${order.payment_status || order.paymentStatus})
`;

  const cleanPhone = (settings.whatsappNumber || '6281234567890').replace(/\D/g, '');
  return {
    whatsappNumber: cleanPhone,
    messageText: text,
    whatsappUrl: `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`
  };
};

export const buildAdminToCustomerWALink = (order) => {
  const phone = (order.customer_phone || order.whatsapp || '').replace(/\D/g, '');
  if (!phone) return '#';
  const text = `Halo ${order.customer_name || order.customerName}, kami dari Muscle Chicken Indonesia terkait pesanan #${order.id}.`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
};
