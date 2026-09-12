import React, { useState, useEffect } from 'react';
import { realtimeService } from '../../services/realtime';
import { audioService } from '../../services/audio';
import { notificationService } from '../../services/notification';
import { formatWIBDateTime } from '../../services/db';
import { Bell, Eye, X } from 'lucide-react';

export const AdminToast = ({ onSelectOrder }) => {
  const [activeToastOrder, setActiveToastOrder] = useState(null);

  useEffect(() => {
    const unsubscribe = realtimeService.subscribe('NEW_ORDER', (newOrder) => {
      setActiveToastOrder(newOrder);

      // Play soft chime sound
      audioService.playNewOrderChime();

      // Trigger Web Push Notification if permission granted
      notificationService.sendPush('🔔 NEW ORDER RECEIVED — Muscle Chicken', {
        body: `NEW ORDER\n${newOrder.customer_name || newOrder.customerName}\n#${newOrder.id}\n${formatWIBDateTime(newOrder.created_at).time}\nRp ${(newOrder.total || 0).toLocaleString('id-ID')}\nORDER RECEIVED`
      });

      // Auto dismiss toast after 12 seconds
      setTimeout(() => {
        setActiveToastOrder(prev => (prev?.id === newOrder.id ? null : prev));
      }, 12000);
    });

    return () => unsubscribe();
  }, []);

  if (!activeToastOrder) return null;

  const formatRupiah = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
  const wibTime = formatWIBDateTime(activeToastOrder.created_at || activeToastOrder.createdAt);

  return (
    <div className="fixed bottom-6 right-6 z-[100] animate-bounce-in max-w-sm w-full">
      <div className="p-5 rounded-2xl bg-[#071B2A] text-[#F7F3EA] border-2 border-[#D8C7A1] shadow-2xl space-y-3 backdrop-blur-md">
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#D8C7A1]">
            <Bell className="w-5 h-5 text-[#D8C7A1] animate-bounce" />
            <span className="font-serif font-bold text-sm tracking-wider uppercase">NEW ORDER</span>
          </div>
          
          <button 
            onClick={() => setActiveToastOrder(null)}
            className="p-1 rounded-full text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* NOTIFICATION CONTENT IN EXACT SPECIFIED FORMAT */}
        <div className="space-y-1 font-sans text-xs bg-[#063B32]/70 p-3 rounded-xl border border-[#D8C7A1]/30">
          <p className="font-bold text-[#D8C7A1] text-sm font-mono">
            {activeToastOrder.customer_name || activeToastOrder.customerName}
          </p>
          <p className="text-gray-300 font-mono text-[11px]">
            #{activeToastOrder.id} • {wibTime.time}
          </p>
          <p className="text-[#D8C7A1] font-bold text-sm font-serif">
            {formatRupiah(activeToastOrder.total)}
          </p>
          <span className="inline-block px-2 py-0.5 rounded bg-emerald-800 text-emerald-100 text-[10px] font-bold uppercase tracking-wider mt-1">
            ORDER RECEIVED
          </span>
        </div>

        <button
          onClick={() => {
            if (onSelectOrder) onSelectOrder(activeToastOrder);
            setActiveToastOrder(null);
          }}
          className="w-full py-2.5 rounded-xl bg-[#D8C7A1] text-[#071B2A] font-bold text-xs uppercase tracking-wider hover:bg-[#F7F3EA] border border-[#D8C7A1] transition-all flex items-center justify-center gap-2 shadow-lg mt-2"
        >
          <Eye className="w-4 h-4" />
          <span>[ VIEW ORDER DETAILS ]</span>
        </button>

      </div>
    </div>
  );
};
