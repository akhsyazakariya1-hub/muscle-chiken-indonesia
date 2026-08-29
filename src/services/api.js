import { cryptoAuthService } from './cryptoAuth';
import { dbService } from './db';

// Protected API Layer enforcing Server-Side Role Authorization
export const apiService = {
  // Verify token & role before executing admin calls
  verifyAdminAccess: (requiredRole = 'ADMIN') => {
    const session = cryptoAuthService.getAdminSession();
    if (!session) {
      throw new Error('401 Unauthorized: Session token missing or expired.');
    }
    if (requiredRole === 'SUPER_ADMIN' && session.role !== 'SUPER_ADMIN') {
      throw new Error('403 Forbidden: Super Admin privileges required.');
    }
    return session;
  },

  // Protected Admin Endpoint: Fetch Revenue & Analytics
  getAdminRevenueStats: () => {
    apiService.verifyAdminAccess('ADMIN');
    const orders = dbService.getOrders();
    const paidOrders = orders.filter(o => o.paymentStatus === 'PAID');
    const totalRevenue = paidOrders.reduce((sum, o) => sum + o.total, 0);

    return {
      success: true,
      totalRevenue,
      totalOrders: orders.length,
      paidOrdersCount: paidOrders.length
    };
  },

  // Protected Admin Endpoint: Fetch Full Customer Directory
  getAdminCustomerDirectory: () => {
    apiService.verifyAdminAccess('ADMIN');
    const orders = dbService.getOrders();
    return {
      success: true,
      orders
    };
  },

  // Protected Admin Endpoint: Modify System Settings
  updateAdminSettings: (newSettings) => {
    apiService.verifyAdminAccess('SUPER_ADMIN');
    dbService.saveSettings(newSettings);
    return { success: true, settings: newSettings };
  }
};
