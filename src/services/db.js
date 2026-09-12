import { 
  INITIAL_PRODUCTS, 
  INITIAL_CATEGORIES, 
  INITIAL_PROMOTIONS, 
  INITIAL_REVIEWS, 
  INITIAL_HERO_CONFIG, 
  INITIAL_SETTINGS 
} from '../data/initialData';
import { realtimeService } from './realtime';
import { cloudDbService } from './cloudDb';
import { formatStructuredAddress } from '../data/indonesiaRegions';

// Official Unified Order Statuses (English Codes & Descriptions)
export const ORDER_STATUSES = [
  {
    id: 'ORDER_RECEIVED',
    label: 'ORDER RECEIVED',
    desc: 'Order has been received by the kitchen'
  },
  {
    id: 'PAYMENT_CONFIRMED',
    label: 'PAYMENT CONFIRMED',
    desc: 'Payment has been verified'
  },
  {
    id: 'PREPARING_INGREDIENTS',
    label: 'PREPARING INGREDIENTS',
    desc: 'Chicken is being freshly marinated'
  },
  {
    id: 'COOKING_ON_HIGH_HEAT',
    label: 'COOKING ON HIGH HEAT',
    desc: 'Chicken is being fried / grilled'
  },
  {
    id: 'PACKED_READY',
    label: 'PACKED & READY',
    desc: 'Order is carefully packed in thermal packaging'
  },
  {
    id: 'OUT_FOR_DELIVERY',
    label: 'OUT FOR DELIVERY',
    desc: 'Express courier is on the way to your location'
  },
  {
    id: 'COMPLETED',
    label: 'COMPLETED',
    desc: 'Order has been delivered. Enjoy your meal!'
  }
];

export const normalizeOrderStatus = (status) => {
  if (!status) return 'ORDER_RECEIVED';
  const s = String(status).toUpperCase();
  if (s === 'NEW' || s === 'ORDER_RECEIVED') return 'ORDER_RECEIVED';
  if (s === 'CONFIRMED' || s === 'PAYMENT_CONFIRMED') return 'PAYMENT_CONFIRMED';
  if (s === 'PREPARING' || s === 'PREPARING_INGREDIENTS') return 'PREPARING_INGREDIENTS';
  if (s === 'COOKING' || s === 'COOKING_ON_HIGH_HEAT') return 'COOKING_ON_HIGH_HEAT';
  if (s === 'READY' || s === 'PACKED_READY') return 'PACKED_READY';
  if (s === 'DELIVERING' || s === 'OUT_FOR_DELIVERY') return 'OUT_FOR_DELIVERY';
  if (s === 'COMPLETED') return 'COMPLETED';
  if (s === 'CANCELLED') return 'CANCELLED';
  return 'ORDER_RECEIVED';
};

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

// Formats timestamp specifically into Asia/Jakarta (WIB) format (DD/MM/YYYY and HH:mm WIB)
export const formatWIBDateTime = (isoDateString) => {
  try {
    const d = isoDateString ? new Date(isoDateString) : new Date();
    
    // Convert date to Asia/Jakarta timeZone parts
    const optionsDate = { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'Asia/Jakarta' };
    const optionsTime = { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Jakarta' };

    const formattedDate = new Intl.DateTimeFormat('en-GB', optionsDate).format(d); // DD/MM/YYYY
    const formattedTime = new Intl.DateTimeFormat('id-ID', optionsTime).format(d); // HH:mm

    return {
      date: formattedDate,
      time: `${formattedTime} WIB`,
      full: `${formattedDate} ${formattedTime} WIB`
    };
  } catch (e) {
    return { date: '', time: 'Just now', full: isoDateString || 'Just now' };
  }
};

export const formatWIBTimestamp = (isoDateString) => {
  return formatWIBDateTime(isoDateString).full;
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
  getProducts: (includeDeleted = false) => {
    const all = getOrSetInitial(KEYS.PRODUCTS, INITIAL_PRODUCTS || []);
    if (includeDeleted) return all;
    return all.filter(p => !p.isDeleted);
  },
  
  saveProductsDirectly: (products) => {
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(products));
    window.dispatchEvent(new Event('mc_db_updated'));
  },

  saveProducts: (products) => {
    dbService.saveProductsDirectly(products);
    cloudDbService.pushToCloud({ products });
  },

  addProduct: (productData) => {
    const products = dbService.getProducts(true);
    const now = new Date().toISOString();
    const newProduct = {
      id: productData.id || `mc-${Date.now().toString().slice(-4)}`,
      name: productData.name || 'New Gourmet Chicken',
      subtitle: productData.subtitle || '',
      category: productData.category || 'fried',
      price: Number(productData.price || 0),
      discountPrice: productData.discountPrice ? Number(productData.discountPrice) : null,
      rating: Number(productData.rating || 5.0),
      reviewCount: Number(productData.reviewCount || 0),
      badge: productData.badge || '',
      spicyLevel: Number(productData.spicyLevel || 0),
      stock: Number(productData.stock || 20),
      lowStockThreshold: Number(productData.lowStockThreshold || 5),
      isAvailable: productData.isAvailable ?? (Number(productData.stock) > 0),
      isFeatured: Boolean(productData.isFeatured),
      isBestSeller: Boolean(productData.isBestSeller),
      sku: productData.sku || `MC-${(productData.category || 'GEN').substring(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      image: productData.image || 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?q=80&w=1000&auto=format&fit=crop',
      gallery: productData.gallery || [productData.image],
      description: productData.description || '',
      ingredients: productData.ingredients || [],
      nutrition: productData.nutrition || { calories: '350 kcal', protein: '35g', carbs: '10g', fat: '12g' },
      isDeleted: false,
      createdAt: now,
      updatedAt: now
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
    const products = dbService.getProducts(true);
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
      const oldStock = products[index].stock;
      const now = new Date().toISOString();
      const newStock = updatedFields.stock !== undefined ? Number(updatedFields.stock) : oldStock;

      products[index] = { 
        ...products[index], 
        ...updatedFields, 
        stock: newStock,
        isAvailable: updatedFields.isAvailable !== undefined ? Boolean(updatedFields.isAvailable) : (newStock > 0),
        updatedAt: now 
      };
      dbService.saveProducts(products);

      if (updatedFields.stock !== undefined && newStock !== oldStock) {
        const diff = newStock - oldStock;
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
    // Soft delete to protect historical order snapshots
    const products = dbService.getProducts(true);
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
      products[index].isDeleted = true;
      products[index].updatedAt = new Date().toISOString();
      dbService.saveProducts(products);
    }
  },

  duplicateProduct: (id) => {
    const products = dbService.getProducts(true);
    const target = products.find(p => p.id === id);
    if (target) {
      const duplicate = {
        ...target,
        id: `mc-${Date.now().toString().slice(-4)}`,
        name: `${target.name} (COPY)`,
        sku: `${target.sku}-COPY`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      products.unshift(duplicate);
      dbService.saveProducts(products);
      return duplicate;
    }
  },

  // PROMOTIONS & VOUCHERS
  getPromotions: (includeInactive = false) => {
    const all = getOrSetInitial(KEYS.PROMOTIONS, INITIAL_PROMOTIONS || []);
    if (includeInactive) return all;
    return all.filter(p => p.isActive && !p.isDeleted);
  },
  
  savePromotions: (promos) => {
    localStorage.setItem(KEYS.PROMOTIONS, JSON.stringify(promos));
    window.dispatchEvent(new Event('mc_db_updated'));
    cloudDbService.pushToCloud({ promotions: promos });
  },

  addPromotion: (promoData) => {
    const promos = dbService.getPromotions(true);
    const now = new Date().toISOString();
    const newPromo = {
      id: `promo-${Date.now()}`,
      name: promoData.name || 'Special Discount',
      description: promoData.description || '',
      promo_code: (promoData.promo_code || promoData.code || 'SPECIAL20').toUpperCase(),
      discount_type: promoData.discount_type || 'PERCENTAGE', // PERCENTAGE | FIXED_AMOUNT
      discount_value: Number(promoData.discount_value || promoData.discount || 10),
      minimum_purchase: Number(promoData.minimum_purchase || promoData.minPurchase || 0),
      maximum_discount: Number(promoData.maximum_discount || promoData.maxDiscount || 50000),
      start_at: promoData.start_at || now,
      end_at: promoData.end_at || new Date(Date.now() + 86400000 * 30).toISOString(),
      banner_url: promoData.banner_url || promoData.banner || 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?q=80&w=1000&auto=format&fit=crop',
      usedCount: 0,
      isActive: promoData.isActive ?? true,
      isDeleted: false,
      createdAt: now,
      updatedAt: now
    };
    promos.unshift(newPromo);
    dbService.savePromotions(promos);
    return newPromo;
  },

  updatePromotion: (id, updatedFields) => {
    const promos = dbService.getPromotions(true);
    const index = promos.findIndex(p => p.id === id);
    if (index !== -1) {
      promos[index] = { 
        ...promos[index], 
        ...updatedFields, 
        updatedAt: new Date().toISOString() 
      };
      dbService.savePromotions(promos);
      return promos[index];
    }
    return null;
  },

  deletePromotion: (id) => {
    const promos = dbService.getPromotions(true);
    const index = promos.findIndex(p => p.id === id);
    if (index !== -1) {
      promos[index].isDeleted = true;
      promos[index].isActive = false;
      promos[index].updatedAt = new Date().toISOString();
      dbService.savePromotions(promos);
    }
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

  // ORDERS WITH REALTIME BROADCAST & CLOUD PUSH
  getOrders: () => {
    const rawOrders = getOrSetInitial(KEYS.ORDERS, [
      {
        id: 'MC-10291',
        created_at: new Date(Date.now() - 1800000).toISOString(),
        updated_at: new Date(Date.now() - 1800000).toISOString(),
        customer_id: 'usr-101',
        customer_name: 'Budi Santoso',
        customer_phone: '081298765432',
        customer_address: 'Jl. Senopati No. 42, Kebayoran Baru, Jakarta Selatan',
        structured_address: {
          provinceName: 'DKI Jakarta',
          cityName: 'Kota Jakarta Selatan',
          districtName: 'Kebayoran Baru',
          villageName: 'Senayan',
          street: 'Jl. Senopati',
          houseNumber: '42',
          postalCode: '12190',
          additionalDetails: 'Patokan sebelah coffee shop'
        },
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
        order_status: 'ORDER_RECEIVED',
        notes: 'Tolong sambal dipisah.'
      },
      {
        id: 'MC-10290',
        created_at: new Date(Date.now() - 3600000).toISOString(),
        updated_at: new Date(Date.now() - 3600000).toISOString(),
        customer_id: 'usr-102',
        customer_name: 'Andi Wijaya',
        customer_phone: '081311223344',
        customer_address: 'Apartemen Pacific Place Tower 2 Apt 14B, SCBD',
        structured_address: {
          provinceName: 'DKI Jakarta',
          cityName: 'Kota Jakarta Selatan',
          districtName: 'Kebayoran Baru',
          villageName: 'Senayan',
          street: 'SCBD Lot 28',
          houseNumber: 'Apt 14B',
          postalCode: '12190',
          additionalDetails: 'Titip di resepsionis'
        },
        items: [
          { id: 'mc-03', name: 'SIGNATURE CHARCOAL GRILLED', price: 52000, quantity: 2, sauce: 'Truffle Aioli' }
        ],
        subtotal: 104000,
        delivery_fee: 16000,
        discount: 0,
        total: 120000,
        payment_method: 'GoPay',
        payment_status: 'PAID',
        order_status: 'PREPARING_INGREDIENTS',
        notes: 'Titip di resepsionis lobby.'
      }
    ]);

    // Ensure status normalization on every retrieve
    return rawOrders.map(o => ({
      ...o,
      order_status: normalizeOrderStatus(o.order_status || o.status),
      customer_name: o.customer_name || o.customerName || 'Guest Customer',
      customer_phone: o.customer_phone || o.whatsapp || '',
      customer_address: typeof o.customer_address === 'object' ? formatStructuredAddress(o.customer_address) : (o.customer_address || o.address || '')
    }));
  },

  saveOrdersDirectly: (orders) => {
    localStorage.setItem(KEYS.ORDERS, JSON.stringify(orders));
    window.dispatchEvent(new Event('mc_db_updated'));
  },

  createOrder: (orderData) => {
    const orders = dbService.getOrders();
    const orderId = `MC-${Math.floor(10000 + Math.random() * 90000)}`;
    const nowISO = new Date().toISOString();
    const wibFormatted = formatWIBDateTime(nowISO);

    // Save product snapshots so historical order items are preserved
    const snapshotItems = (orderData.items || []).map(item => ({
      id: item.id,
      name: item.name,
      price: Number(item.price), // Purchased snapshot price
      discountPrice: item.discountPrice ? Number(item.discountPrice) : null,
      quantity: Number(item.quantity),
      sauce: item.sauce || null,
      spicyLevel: item.spicyLevel || 0,
      sku: item.sku || ''
    }));

    const formattedAddressString = typeof orderData.structured_address === 'object'
      ? formatStructuredAddress(orderData.structured_address)
      : (orderData.address || orderData.customer_address || '');

    const newOrder = {
      id: orderId,
      created_at: nowISO,
      updated_at: nowISO,
      order_status: 'ORDER_RECEIVED',
      payment_status: orderData.payment_method === 'COD' ? 'PENDING' : 'PAID',
      customer_id: orderData.customer_id || `usr-${Date.now()}`,
      customer_name: orderData.customerName || orderData.customer_name || 'Customer',
      customer_phone: orderData.whatsapp || orderData.customer_phone || '',
      customer_address: formattedAddressString,
      structured_address: orderData.structured_address || null,
      latitude: orderData.latitude || null,
      longitude: orderData.longitude || null,
      deliveryType: orderData.deliveryType || 'DELIVERY',
      items: snapshotItems,
      subtotal: Number(orderData.subtotal || 0),
      delivery_fee: Number(orderData.deliveryFee || orderData.delivery_fee || 0),
      discount: Number(orderData.discount || 0),
      total: Number(orderData.total || 0),
      payment_method: orderData.paymentMethod || orderData.payment_method || 'QRIS',
      notes: orderData.notes || ''
    };

    orders.unshift(newOrder);
    dbService.saveOrdersDirectly(orders);

    // Deduct stock from active products database
    const products = dbService.getProducts(true);
    snapshotItems.forEach(item => {
      const prod = products.find(p => p.id === item.id);
      if (prod) {
        prod.stock = Math.max(0, prod.stock - item.quantity);
        if (prod.stock === 0) prod.isAvailable = false;
        dbService.addInventoryLog({
          productId: prod.id,
          productName: prod.name,
          change: -item.quantity,
          type: 'ORDER_DEDUCTION',
          reason: `Order #${orderId}`
        });
      }
    });
    dbService.saveProductsDirectly(products);

    // Create Notification Record specifically for Admin
    dbService.addNotification({
      recipient_id: 'admin',
      type: 'NEW_ORDER',
      title: 'NEW ORDER',
      customer_name: newOrder.customer_name,
      order_id: newOrder.id,
      order_time: wibFormatted.time,
      total_amount: newOrder.total,
      current_status: 'ORDER_RECEIVED',
      message: `NEW ORDER\n${newOrder.customer_name}\n#${newOrder.id}\n${wibFormatted.time}\nRp${newOrder.total.toLocaleString('id-ID')}\nORDER RECEIVED`,
      is_read: false
    });

    // Broadcast Realtime Event locally & across windows
    realtimeService.broadcast('NEW_ORDER', newOrder);
    
    // Push to Cloud for Cross-Device Realtime Sync
    cloudDbService.pushToCloud({ orders, products });

    return newOrder;
  },

  updateOrderStatus: (orderId, newStatus) => {
    const orders = dbService.getOrders();
    const order = orders.find(o => o.id === orderId);
    if (order) {
      const oldStatus = order.order_status;
      const normalized = normalizeOrderStatus(newStatus);
      order.order_status = normalized;
      order.updated_at = new Date().toISOString();
      if (normalized === 'COMPLETED') order.payment_status = 'PAID';

      // If cancelled, restore stock
      if (normalized === 'CANCELLED' && oldStatus !== 'CANCELLED') {
        const products = dbService.getProducts(true);
        order.items.forEach(item => {
          const prod = products.find(p => p.id === item.id);
          if (prod) {
            prod.stock += item.quantity;
            prod.isAvailable = true;
            dbService.addInventoryLog({
              productId: prod.id,
              productName: prod.name,
              change: item.quantity,
              type: 'RESTORED',
              reason: `Order #${orderId} Cancelled`
            });
          }
        });
        dbService.saveProductsDirectly(products);
      }

      dbService.saveOrdersDirectly(orders);

      // Broadcast Realtime Event to Customer
      realtimeService.broadcast('ORDER_STATUS_UPDATED', {
        orderId: order.id,
        order_status: normalized,
        customer_phone: order.customer_phone
      });

      cloudDbService.pushToCloud({ orders });

      return order;
    }
  },

  // NOTIFICATIONS TABLE
  getNotifications: () => getOrSetInitial(KEYS.NOTIFICATIONS, [
    {
      id: 'notif-1',
      recipient_id: 'admin',
      type: 'NEW_ORDER',
      title: 'NEW ORDER',
      customer_name: 'Budi Santoso',
      order_id: 'MC-10291',
      order_time: '16:25 WIB',
      total_amount: 108000,
      current_status: 'ORDER_RECEIVED',
      message: 'NEW ORDER\nBudi Santoso\n#MC-10291\n16:25 WIB\nRp108.000\nORDER RECEIVED',
      is_read: false,
      created_at: new Date(Date.now() - 1800000).toISOString()
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
    cloudDbService.pushToCloud({ notifications });
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
