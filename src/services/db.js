import { 
  INITIAL_PRODUCTS, 
  INITIAL_CATEGORIES, 
  INITIAL_PROMOTIONS, 
  INITIAL_REVIEWS, 
  INITIAL_HERO_CONFIG, 
  INITIAL_SETTINGS 
} from '../data/initialData';
import { realtimeService } from './realtime';

const KEYS = {
  PRODUCTS: 'mc_products_v2',
  ORDERS: 'mc_orders_v2',
  PROMOTIONS: 'mc_promotions_v2',
  REVIEWS: 'mc_reviews_v2',
  HERO: 'mc_hero_v2',
  SETTINGS: 'mc_settings_v2',
  INVENTORY_LOGS: 'mc_inventory_logs_v2',
  NOTIFICATIONS: 'mc_notifications_v2',
  CURRENT_USER: 'mc_current_user_v2',
  FAVORITES: 'mc_favorites_v2'
};

// Formats timestamp specifically into Asia/Jakarta (WIB) format
export const formatWIBTimestamp = (isoDateString) => {
  try {
    const d = isoDateString ? new Date(isoDateString) : new Date();
    const optionsDate = { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'Asia/Jakarta' };
    const optionsTime = { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Jakarta' };

    const formattedDate = new Intl.DateTimeFormat('id-ID', optionsDate).format(d);
    const formattedTime = new Intl.DateTimeFormat('id-ID', optionsTime).format(d);

    return `${formattedDate} • ${formattedTime} WIB`;
  } catch (e) {
    return isoDateString || 'Just now';
  }
};

const getOrSetInitial = (key, defaultData) => {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) {
      localStorage.setItem(key, JSON.stringify(defaultData));
      return defaultData;
    }
    return JSON.parse(stored);
  } catch (e) {
    return defaultData;
  }
};

export const dbService = {
  // PRODUCTS
  getProducts: () => getOrSetInitial(KEYS.PRODUCTS, INITIAL_PRODUCTS || []),
  saveProducts: (products) => {
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(products));
    window.dispatchEvent(new Event('mc_db_updated'));
  },

  addProduct: (productData) => {
    const products = dbService.getProducts();
    const newProduct = {
      ...productData,
      id: `mc-${Date.now().toString().slice(-4)}`,
      sku: productData.sku || `MC-${productData.category?.substring(0, 3).toUpperCase() || 'GEN'}-${Math.floor(100 + Math.random() * 900)}`,
      rating: 5.0,
      reviewCount: 0,
      isAvailable: true,
      stock: Number(productData.stock || 20)
    };
    products.unshift(newProduct);
    dbService.saveProducts(products);

    dbService.addInventoryLog({
      productId: newProduct.id,
      productName: newProduct.name,
      change: newProduct.stock,
      type: 'INCOMING',
      reason: 'Initial stock creation by Admin'
    });

    return newProduct;
  },

  updateProduct: (id, updatedFields) => {
    const products = dbService.getProducts();
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
      const oldStock = products[index].stock;
      products[index] = { ...products[index], ...updatedFields };
      dbService.saveProducts(products);

      if (updatedFields.stock !== undefined && updatedFields.stock !== oldStock) {
        const diff = updatedFields.stock - oldStock;
        dbService.addInventoryLog({
          productId: id,
          productName: products[index].name,
          change: diff,
          type: diff > 0 ? 'INCOMING' : 'DEDUCTION',
          reason: 'Manual stock update by Admin'
        });
      }
      return products[index];
    }
    return null;
  },

  deleteProduct: (id) => {
    const products = dbService.getProducts().filter(p => p.id !== id);
    dbService.saveProducts(products);
  },

  duplicateProduct: (id) => {
    const products = dbService.getProducts();
    const target = products.find(p => p.id === id);
    if (target) {
      const duplicate = {
        ...target,
        id: `mc-${Date.now().toString().slice(-4)}`,
        name: `${target.name} (COPY)`,
        sku: `${target.sku}-COPY`
      };
      products.unshift(duplicate);
      dbService.saveProducts(products);
      return duplicate;
    }
  },

  // PROMOTIONS & VOUCHERS
  getPromotions: () => getOrSetInitial(KEYS.PROMOTIONS, INITIAL_PROMOTIONS || []),
  savePromotions: (promos) => {
    localStorage.setItem(KEYS.PROMOTIONS, JSON.stringify(promos));
    window.dispatchEvent(new Event('mc_db_updated'));
  },
  addPromotion: (promoData) => {
    const promos = dbService.getPromotions();
    const newPromo = {
      id: `promo-${Date.now()}`,
      usedCount: 0,
      isActive: true,
      ...promoData
    };
    promos.unshift(newPromo);
    dbService.savePromotions(promos);
    return newPromo;
  },

  // INVENTORY LOGS
  getInventoryLogs: () => getOrSetInitial(KEYS.INVENTORY_LOGS, []),
  addInventoryLog: (log) => {
    const logs = dbService.getInventoryLogs();
    logs.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      ...log
    });
    localStorage.setItem(KEYS.INVENTORY_LOGS, JSON.stringify(logs));
  },

  // ORDERS WITH REALTIME BROADCAST & IDEMPOTENCY PROTECTION
  getOrders: () => getOrSetInitial(KEYS.ORDERS, [
    {
      id: 'MC-10291',
      created_at: new Date(Date.now() - 1800000).toISOString(),
      updated_at: new Date(Date.now() - 1800000).toISOString(),
      customer_name: 'Budi Santoso',
      customer_phone: '081298765432',
      customer_address: 'Jl. Senopati No. 42, Kebayoran Baru, Jakarta Selatan',
      items: [
        { id: 'mc-01', name: 'MUSCLE CRISPY SIGNATURE', price: 42000, quantity: 2, sauce: 'Champagne Mayo' },
        { id: 'mc-07', name: 'TRUFFLE GARLIC FRIES', price: 32000, quantity: 1 }
      ],
      subtotal: 116000,
      delivery_fee: 12000,
      discount: 20000,
      total: 108000,
      payment_method: 'QRIS',
      payment_status: 'PAID',
      order_status: 'NEW',
      notes: 'Tolong sambal dipisah.'
    },
    {
      id: 'MC-10290',
      created_at: new Date(Date.now() - 3600000).toISOString(),
      updated_at: new Date(Date.now() - 3600000).toISOString(),
      customer_name: 'Andi Wijaya',
      customer_phone: '081311223344',
      customer_address: 'Apartemen Pacific Place Tower 2 Apt 14B, SCBD',
      items: [
        { id: 'mc-03', name: 'SIGNATURE CHARCOAL GRILLED', price: 52000, quantity: 2, sauce: 'Truffle Aioli' }
      ],
      subtotal: 104000,
      delivery_fee: 16000,
      discount: 0,
      total: 120000,
      payment_method: 'GoPay',
      payment_status: 'PAID',
      order_status: 'PREPARING',
      notes: 'Titip di resepsionis lobby.'
    }
  ]),

  createOrder: (orderData) => {
    const orders = dbService.getOrders();
    const orderId = `MC-${Math.floor(10000 + Math.random() * 90000)}`;
    const nowISO = new Date().toISOString();

    const newOrder = {
      id: orderId,
      created_at: nowISO,
      updated_at: nowISO,
      order_status: 'NEW',
      payment_status: orderData.payment_method === 'COD' ? 'PENDING' : 'PAID',
      ...orderData
    };

    orders.unshift(newOrder);
    localStorage.setItem(KEYS.ORDERS, JSON.stringify(orders));

    // Deduct stock
    const products = dbService.getProducts();
    orderData.items.forEach(item => {
      const prod = products.find(p => p.id === item.id);
      if (prod) {
        prod.stock = Math.max(0, prod.stock - item.quantity);
        dbService.addInventoryLog({
          productId: prod.id,
          productName: prod.name,
          change: -item.quantity,
          type: 'ORDER_DEDUCTION',
          reason: `Order #${orderId}`
        });
      }
    });
    dbService.saveProducts(products);

    // Create Notification Record
    dbService.addNotification({
      recipient_id: 'admin',
      type: 'NEW_ORDER',
      title: '🔔 Pesanan Baru Received',
      message: `Order #${newOrder.id} dari ${newOrder.customer_name} telah masuk (${formatWIBTimestamp(nowISO)})`,
      order_id: newOrder.id,
      is_read: false
    });

    // Broadcast Realtime Event
    realtimeService.broadcast('NEW_ORDER', newOrder);
    window.dispatchEvent(new Event('mc_db_updated'));

    return newOrder;
  },

  updateOrderStatus: (orderId, newStatus) => {
    const orders = dbService.getOrders();
    const order = orders.find(o => o.id === orderId);
    if (order) {
      const oldStatus = order.order_status;
      order.order_status = newStatus;
      order.updated_at = new Date().toISOString();
      if (newStatus === 'COMPLETED') order.payment_status = 'PAID';

      // If cancelled, restore stock
      if (newStatus === 'CANCELLED' && oldStatus !== 'CANCELLED') {
        const products = dbService.getProducts();
        order.items.forEach(item => {
          const prod = products.find(p => p.id === item.id);
          if (prod) {
            prod.stock += item.quantity;
            dbService.addInventoryLog({
              productId: prod.id,
              productName: prod.name,
              change: item.quantity,
              type: 'RESTORED',
              reason: `Order #${orderId} Cancelled`
            });
          }
        });
        dbService.saveProducts(products);
      }

      localStorage.setItem(KEYS.ORDERS, JSON.stringify(orders));

      // Broadcast Realtime Event to Customer
      realtimeService.broadcast('ORDER_STATUS_UPDATED', {
        orderId: order.id,
        order_status: newStatus,
        customer_phone: order.customer_phone
      });

      window.dispatchEvent(new Event('mc_db_updated'));
      return order;
    }
  },

  // NOTIFICATIONS TABLE
  getNotifications: () => getOrSetInitial(KEYS.NOTIFICATIONS, [
    {
      id: 'notif-1',
      recipient_id: 'admin',
      type: 'NEW_ORDER',
      title: 'Pesanan Baru',
      message: 'Order #MC-10291 dari Budi Santoso telah masuk.',
      order_id: 'MC-10291',
      is_read: false,
      created_at: new Date(Date.now() - 1800000).toISOString()
    },
    {
      id: 'notif-2',
      recipient_id: 'admin',
      type: 'PAYMENT_CONFIRMED',
      title: 'Pembayaran Dikonfirmasi',
      message: 'Pembayaran untuk pesanan #MC-10290 telah terverifikasi.',
      order_id: 'MC-10290',
      is_read: true,
      created_at: new Date(Date.now() - 3600000).toISOString()
    }
  ]),

  addNotification: (notifData) => {
    const notifications = dbService.getNotifications();
    const newNotif = {
      id: `notif-${Date.now()}`,
      created_at: new Date().toISOString(),
      is_read: false,
      ...notifData
    };
    notifications.unshift(newNotif);
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(notifications));
    window.dispatchEvent(new Event('mc_notifications_updated'));
    return newNotif;
  },

  markNotificationAsRead: (id) => {
    const notifs = dbService.getNotifications();
    const target = notifs.find(n => n.id === id);
    if (target) {
      target.is_read = true;
      localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(notifs));
      window.dispatchEvent(new Event('mc_notifications_updated'));
    }
  },

  markAllNotificationsAsRead: () => {
    const notifs = dbService.getNotifications().map(n => ({ ...n, is_read: true }));
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(notifs));
    window.dispatchEvent(new Event('mc_notifications_updated'));
  },

  // HERO & SETTINGS
  getHeroConfig: () => getOrSetInitial(KEYS.HERO, INITIAL_HERO_CONFIG || {}),
  saveHeroConfig: (config) => {
    localStorage.setItem(KEYS.HERO, JSON.stringify(config));
    window.dispatchEvent(new Event('mc_db_updated'));
  },

  getSettings: () => getOrSetInitial(KEYS.SETTINGS, {
    ...INITIAL_SETTINGS,
    whatsappNumber: '6281234567890',
    soundEnabled: true,
    newOrderNotification: true,
    browserNotification: true
  }),

  saveSettings: (settings) => {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
    window.dispatchEvent(new Event('mc_db_updated'));
  },

  // REVIEWS & USER & FAVORITES
  getReviews: () => getOrSetInitial(KEYS.REVIEWS, INITIAL_REVIEWS || []),
  addReview: (reviewData) => {
    const reviews = dbService.getReviews();
    const newReview = { id: `rev-${Date.now()}`, date: new Date().toISOString().split('T')[0], verifiedPurchase: true, ...reviewData };
    reviews.unshift(newReview);
    localStorage.setItem(KEYS.REVIEWS, JSON.stringify(reviews));
    window.dispatchEvent(new Event('mc_db_updated'));
    return newReview;
  },
  getCurrentUser: () => getOrSetInitial(KEYS.CURRENT_USER, null),
  setCurrentUser: (user) => {
    if (!user) localStorage.removeItem(KEYS.CURRENT_USER);
    else localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
    window.dispatchEvent(new Event('mc_auth_updated'));
  },
  getFavorites: () => getOrSetInitial(KEYS.FAVORITES, []),
  toggleFavorite: (productId) => {
    let favs = dbService.getFavorites();
    if (favs.includes(productId)) favs = favs.filter(id => id !== productId);
    else favs.push(productId);
    localStorage.setItem(KEYS.FAVORITES, JSON.stringify(favs));
    window.dispatchEvent(new Event('mc_favorites_updated'));
    return favs;
  }
};
