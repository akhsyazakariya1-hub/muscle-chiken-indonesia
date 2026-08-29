import React, { useState, useEffect } from 'react';
import { realtimeService } from '../../services/realtime';
import { audioService } from '../../services/audio';
import { notificationService } from '../../services/notification';
import { formatWIBTimestamp } from '../../services/db';
import { Bell, Eye, X } from 'lucide-react';

export const AdminToast = ({ onSelectOrder }) => {
  const [activeToastOrder, setActiveToastOrder] = useState(null);

  useEffect(() => {
    const unsubscribe = realtimeService.subscribe('NEW_ORDER', (newOrder) => {
      setActiveToastOrder(newOrder);

      // Play soft chime sound
      audioService.playNewOrderChime();

      // Trigger Web Push Notification if permission granted
      notificationService.sendPush('🔔 Pesanan Baru — Muscle Chicken', {
        body: `Order #${newOrder.id} dari ${newOrder.customer_name || newOrder.customerName} (${newOrder.total ? `Rp ${newOrder.total.toLocaleString('id-ID')}` : ''})`
      });

      // Auto dismiss toast after 8 seconds
      setTimeout(() => {
        setActiveToastOrder(prev => (prev?.id === newOrder.id ? null : prev));
      }, 8000);
    });

    return () => unsubscribe();
  }, []);

  if (!activeToastOrder) return null;

  const formatRupiah = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);

  return (
    <div className="fixed bottom-6 right-6 z-[100] animate-bounce-in max-w-sm w-full">
      <div className="p-5 rounded-2xl bg-[#071B2A] text-[#F7F3EA] border-2 border-[#D8C7A1] shadow-2xl space-y-3 backdrop-blur-md">
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#D8C7A1]">
            <Bell className="w-5 h-5 text-[#D8C7A1] animate-bounce" />
            <span className="font-serif font-bold text-sm tracking-wider uppercase">🔔 NEW ORDER RECEIVED</span>
          </div>
          
          <button 
            onClick={() => setActiveToastOrder(null)}
            className="p-1 rounded-full text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div>
          <div className="flex items-center justify-between font-mono text-xs">
            <span className="font-bold text-[#D8C7A1]">#{activeToastOrder.id}</span>
            <span className="text-[10px] text-gray-400">{formatWIBTimestamp(activeToastOrder.created_at)}</span>
          </div>
          <p className="text-xs text-[#F7F3EA] font-semibold mt-1">
            {activeToastOrder.customer_name || activeToastOrder.customerName} baru saja melakukan pemesanan.
          </p>
          <p className="font-serif text-lg font-bold text-[#D8C7A1] mt-1">
            Total: {formatRupiah(activeToastOrder.total)}
          </p>
        </div>

        <button
          onClick={() => {
            if (onSelectOrder) onSelectOrder(activeToastOrder);
            setActiveToastOrder(null);
          }}
          className="w-full py-2.5 rounded-xl bg-[#063B32] text-[#D8C7A1] font-bold text-xs uppercase tracking-wider hover:bg-[#D8C7A1] hover:text-[#071B2A] border border-[#D8C7A1] transition-all flex items-center justify-center gap-2 shadow-lg"
        >
          <Eye className="w-4 h-4" />
          <span>[ VIEW ORDER ]</span>
        </button>

      </div>
    </div>
  );
};
