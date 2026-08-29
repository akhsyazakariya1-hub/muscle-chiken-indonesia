import React, { useState, useEffect } from 'react';
import { dbService, formatWIBTimestamp } from '../../services/db';
import { useApp } from '../../context/AppContext';
import { Bell, ShoppingBag, CreditCard, User, ShieldCheck, CheckCheck } from 'lucide-react';

export const AdminNotifications = ({ onSelectOrder }) => {
  const { showToast } = useApp();
  const [notifications, setNotifications] = useState(dbService.getNotifications());
  const [activeCategory, setActiveCategory] = useState('ALL');

  const fetchNotifs = () => {
    setNotifications(dbService.getNotifications());
  };

  useEffect(() => {
    fetchNotifs();
    const handleUpdate = () => fetchNotifs();
    window.addEventListener('mc_notifications_updated', handleUpdate);
    return () => window.removeEventListener('mc_notifications_updated', handleUpdate);
  }, []);

  const filteredNotifs = notifications.filter(n => {
    if (activeCategory === 'ALL') return true;
    if (activeCategory === 'ORDERS') return n.type === 'NEW_ORDER' || n.type === 'ORDER_STATUS';
    if (activeCategory === 'PAYMENTS') return n.type === 'PAYMENT_CONFIRMED';
    if (activeCategory === 'CUSTOMERS') return n.type === 'NEW_CUSTOMER';
    if (activeCategory === 'SYSTEM') return n.type === 'SYSTEM';
    return true;
  });

  const handleMarkAllRead = () => {
    dbService.markAllNotificationsAsRead();
    fetchNotifs();
    showToast('Semua notifikasi telah ditandai dibaca.', 'success');
  };

  const getNotifIcon = (type) => {
    if (type === 'NEW_ORDER') return <ShoppingBag className="w-5 h-5 text-[#063B32]" />;
    if (type === 'PAYMENT_CONFIRMED') return <CreditCard className="w-5 h-5 text-emerald-700" />;
    if (type === 'NEW_CUSTOMER') return <User className="w-5 h-5 text-blue-600" />;
    return <Bell className="w-5 h-5 text-[#B98262]" />;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#063B32]/10 pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#B98262]">REALTIME AUDIT CENTER</span>
          <h1 className="font-serif text-3xl font-bold text-[#10201F]">ADMIN NOTIFICATIONS</h1>
        </div>

        <button 
          onClick={handleMarkAllRead}
          className="px-4 py-2.5 rounded-xl bg-[#063B32] text-[#D8C7A1] text-xs font-bold flex items-center gap-2 hover:bg-[#071B2A]"
        >
          <CheckCheck className="w-4 h-4" />
          <span>MARK ALL AS READ</span>
        </button>
      </div>

      {/* CATEGORY TABS */}
      <div className="flex items-center gap-2 border-b border-[#063B32]/10 pb-3 overflow-x-auto">
        {['ALL', 'ORDERS', 'PAYMENTS', 'CUSTOMERS', 'SYSTEM'].map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wider uppercase transition-all ${
              activeCategory === cat 
                ? 'bg-[#063B32] text-[#D8C7A1] shadow-md' 
                : 'bg-white text-gray-600 hover:bg-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* NOTIFICATIONS LIST */}
      <div className="space-y-3">
        {filteredNotifs.length > 0 ? (
          filteredNotifs.map(notif => (
            <div 
              key={notif.id}
              onClick={() => {
                dbService.markNotificationAsRead(notif.id);
                fetchNotifs();
                if (notif.order_id && onSelectOrder) {
                  const orders = dbService.getOrders();
                  const found = orders.find(o => o.id === notif.order_id);
                  if (found) onSelectOrder(found);
                }
              }}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-4 shadow-sm ${
                !notif.is_read 
                  ? 'bg-[#F5F1E8] border-[#063B32] font-semibold border-l-4' 
                  : 'bg-[#E8E5DC]/60 border-[#063B32]/10 opacity-75'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-white border border-[#063B32]/10 shrink-0">
                  {getNotifIcon(notif.type)}
                </div>
                <div>
                  <h4 className="font-serif text-sm font-bold text-[#10201F]">{notif.title}</h4>
                  <p className="text-xs text-[#10201F]/80 mt-0.5">{notif.message}</p>
                </div>
              </div>

              <span className="font-mono text-[10px] text-gray-500 shrink-0">
                {formatWIBTimestamp(notif.created_at)}
              </span>
            </div>
          ))
        ) : (
          <div className="py-16 text-center text-gray-500 bg-[#F5F1E8] rounded-2xl border border-[#063B32]/10">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p className="font-serif text-base font-bold">Tidak ada notifikasi dalam kategori {activeCategory}.</p>
          </div>
        )}
      </div>

    </div>
  );
};
