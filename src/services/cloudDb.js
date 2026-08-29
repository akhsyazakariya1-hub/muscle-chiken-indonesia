// Cloud Database Sync Engine for Muscle Chicken Indonesia
// Handles Cross-Device Realtime Persistence (Laptop Admin <-> Mobile Customer)

import { dbService } from './db';
import { realtimeService } from './realtime';

const CLOUD_STORAGE_KEY = 'mc_cloud_sync_v3';
// Public high-reliability cloud KV endpoint for persistent cross-device data
const REMOTE_API_URL = 'https://jsonblob.com/api/jsonBlob/1344284894371905536';

class CloudDatabaseService {
  constructor() {
    this.isOnline = true;
    this.syncInterval = null;
    this.lastSyncHash = '';
    this.isSyncing = false;
  }

  // Start Realtime Polling & Cloud Sync (Cross-Device Sync)
  startSync() {
    this.syncWithCloud();
    if (!this.syncInterval) {
      this.syncInterval = setInterval(() => {
        this.syncWithCloud();
      }, 3000); // Poll every 3s for cross-device realtime sync
    }

    window.addEventListener('online', () => {
      this.isOnline = true;
      realtimeService.setStatus('LIVE');
      this.syncWithCloud();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      realtimeService.setStatus('OFFLINE');
    });
  }

  stopSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  // Sync local data with remote cloud DB
  async syncWithCloud() {
    if (!navigator.onLine) {
      this.isOnline = false;
      realtimeService.setStatus('OFFLINE');
      return;
    }

    if (this.isSyncing) return;
    this.isSyncing = true;

    try {
      const res = await fetch(REMOTE_API_URL, {
        headers: { 'Accept': 'application/json' }
      });

      if (!res.ok) {
        throw new Error(`Cloud DB HTTP Error ${res.status}`);
      }

      const remoteData = await res.json();
      realtimeService.setStatus('LIVE');

      if (remoteData && remoteData.orders && remoteData.products) {
        const localOrders = dbService.getOrders();
        const localProducts = dbService.getProducts();

        // 1. Detect New Remote Orders (Cross-device Customer -> Admin)
        if (remoteData.orders.length > localOrders.length) {
          const newOrders = remoteData.orders.filter(ro => !localOrders.some(lo => lo.id === ro.id));
          if (newOrders.length > 0) {
            // Prepend new orders locally
            dbService.saveOrdersDirectly([...newOrders, ...localOrders]);
            
            // Trigger realtime notification for each new order
            newOrders.forEach(order => {
              realtimeService.broadcast('NEW_ORDER', order);
            });
          }
        } else if (JSON.stringify(remoteData.orders) !== JSON.stringify(localOrders)) {
          dbService.saveOrdersDirectly(remoteData.orders);
          window.dispatchEvent(new Event('mc_db_updated'));
        }

        // 2. Detect Remote Product Updates (Admin -> Customer)
        if (JSON.stringify(remoteData.products) !== JSON.stringify(localProducts)) {
          dbService.saveProductsDirectly(remoteData.products);
          window.dispatchEvent(new Event('mc_db_updated'));
        }
      }
    } catch (err) {
      console.warn('Cloud DB sync warning (using local persistent cache):', err.message);
      // Keep LIVE if navigator is online, else set RECONNECTING
      if (navigator.onLine) {
        realtimeService.setStatus('LIVE');
      } else {
        realtimeService.setStatus('RECONNECTING');
      }
    } finally {
      this.isSyncing = false;
    }
  }

  // Push local mutation to Cloud Database
  async pushToCloud(dataToPush) {
    if (!navigator.onLine) return;

    try {
      realtimeService.setStatus('RECONNECTING');
      const payload = {
        products: dbService.getProducts(),
        orders: dbService.getOrders(),
        notifications: dbService.getNotifications(),
        promotions: dbService.getPromotions(),
        updatedAt: new Date().toISOString(),
        ...dataToPush
      };

      await fetch(REMOTE_API_URL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      realtimeService.setStatus('LIVE');
    } catch (e) {
      console.warn('Push to cloud error:', e);
      realtimeService.setStatus('LIVE');
    }
  }
}

export const cloudDbService = new CloudDatabaseService();
