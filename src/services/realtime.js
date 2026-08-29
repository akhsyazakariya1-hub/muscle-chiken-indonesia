// Event-Driven Realtime Broadcast Engine

class RealtimeService {
  constructor() {
    this.channelName = 'muscle_chicken_realtime_v1';
    this.channel = null;
    this.listeners = new Map();
    this.status = 'LIVE'; // 'LIVE', 'RECONNECTING', 'OFFLINE'
    this.initChannel();
  }

  initChannel() {
    try {
      if ('BroadcastChannel' in window) {
        this.channel = new BroadcastChannel(this.channelName);
        this.channel.onmessage = (event) => {
          this.handleIncomingMessage(event.data);
        };
      }
      // Listen on window for same-tab custom events
      window.addEventListener('mc_realtime_event', (event) => {
        if (event.detail) {
          this.handleIncomingMessage(event.detail);
        }
      });

      this.status = 'LIVE';
      this.notifyStatusChange();
    } catch (e) {
      console.warn('Realtime channel fallback activated:', e);
      this.status = 'LIVE';
    }
  }

  notifyStatusChange() {
    window.dispatchEvent(new CustomEvent('mc_realtime_status', { detail: this.status }));
  }

  getStatus() {
    return this.status;
  }

  setStatus(newStatus) {
    this.status = newStatus;
    this.notifyStatusChange();
  }

  broadcast(eventType, payload) {
    const eventData = {
      type: eventType,
      payload,
      timestamp: new Date().toISOString()
    };

    // 1. Send via BroadcastChannel across browser tabs/windows
    if (this.channel) {
      try {
        this.channel.postMessage(eventData);
      } catch (e) {
        console.error('Failed to postMessage via BroadcastChannel:', e);
      }
    }

    // 2. Dispatch locally in current window
    window.dispatchEvent(new CustomEvent('mc_realtime_event', { detail: eventData }));
  }

  subscribe(eventType, callback) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType).add(callback);

    // Return unsubscribe function
    return () => {
      if (this.listeners.has(eventType)) {
        this.listeners.get(eventType).delete(callback);
      }
    };
  }

  handleIncomingMessage(data) {
    if (!data || !data.type) return;
    const callbacks = this.listeners.get(data.type);
    if (callbacks) {
      callbacks.forEach(cb => {
        try { cb(data.payload, data.timestamp); } catch (err) { console.error(err); }
      });
    }
  }
}

export const realtimeService = new RealtimeService();
