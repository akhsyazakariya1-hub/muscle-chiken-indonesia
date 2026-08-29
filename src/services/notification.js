export const notificationService = {
  requestPermission: async () => {
    if (!('Notification' in window)) {
      console.log('This browser does not support desktop notifications');
      return false;
    }
    if (Notification.permission === 'granted') {
      return true;
    }
    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  },

  sendPush: (title, options = {}) => {
    if (!('Notification' in window)) return;
    if (Notification.permission === 'granted') {
      new Notification(title, {
        icon: '/favicon.svg',
        badge: '/favicon.svg',
        vibrate: [200, 100, 200],
        ...options
      });
    }
  },

  notifyOrderStatusChange: (orderId, newStatus) => {
    const statusMessages = {
      ORDER_RECEIVED: 'Your order has been received.',
      PAYMENT_CONFIRMED: 'Payment confirmed. Chef is preparing your ingredients.',
      PREPARING: 'Your order is being prepared with premium standards.',
      COOKING: 'Your chicken is cooking on high heat!',
      READY: 'Your order is ready & freshly packed.',
      OUT_FOR_DELIVERY: 'Your order is on the way! Thermal courier dispatched.',
      COMPLETED: 'Order completed. Enjoy your Muscle Chicken feast!'
    };

    const msg = statusMessages[newStatus] || `Order #${orderId} status updated to ${newStatus}`;
    notificationService.sendPush(`Muscle Chicken Indonesia — #${orderId}`, {
      body: msg,
      tag: `order-${orderId}`
    });
  }
};
