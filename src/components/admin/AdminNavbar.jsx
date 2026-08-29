import React, { useState, useEffect } from 'react';
import { dbService } from '../../services/db';
import { realtimeService } from '../../services/realtime';
import { Bell, ShieldCheck, CheckCheck, Radio } from 'lucide-react';

export const AdminNavbar = ({ activeTab, setActiveTab, setSelectedOrderForModal }) => {
  const [notifications, setNotifications] = useState(dbService.getNotifications());
  const [realtimeStatus, setRealtimeStatus] = useState(realtimeService.getStatus());
  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);

  const fetchNotifs = () => {
    setNotifications(dbService.getNotifications());
  };

  useEffect(() => {
    fetchNotifs();
    const handleNotifUpdate = () => fetchNotifs();
    const handleRealtimeStatus = (e) => setRealtimeStatus(e.detail);

    window.addEventListener('mc_notifications_updated', handleNotifUpdate);
    window.addEventListener('mc_realtime_status', handleRealtimeStatus);

    return () => {
      window.removeEventListener('mc_notifications_updated', handleNotifUpdate);
      window.removeEventListener('mc_realtime_status', handleRealtimeStatus);
    };
  }, []);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const handleMarkAllRead = () => {
    dbService.markAllNotificationsAsRead();
    fetchNotifs();
  };

  return (
    <header className="bg-[#071B2A] text-[#F7F3EA] border-b border-[#D8C7A1]/20 px-6 py-4 flex items-center justify-between shadow-md">
      
      {/* LEFT: STATUS INDICATOR */}
      <div className="flex items-center gap-3">
        <div 
          className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#063B32] border border-[#D8C7A1]/40 text-xs font-bold font-mono text-[#D8C7A1]"
          title="Realtime connection status"
        >
          <span className={`w-2.5 h-2.5 rounded-full ${
            realtimeStatus === 'LIVE' 
              ? 'bg-emerald-400 animate-pulse' 
              : realtimeStatus === 'RECONNECTING' 
                ? 'bg-amber-400 animate-bounce' 
                : 'bg-red-500'
          }`} />
          <span>● {realtimeStatus}</span>
        </div>
      </div>

      {/* RIGHT: NOTIFICATION BELL & QUICK ACTIONS */}
      <div className="flex items-center gap-4 relative">
        
        {/* BELL ICON NOTIFICATION TRIGGER */}
        <div className="relative">
          <button
            onClick={() => setIsNotifDropdownOpen(!isNotifDropdownOpen)}
            className="p-2.5 rounded-full bg-[#063B32]/70 text-[#F7F3EA] hover:text-[#D8C7A1] hover:bg-[#063B32] border border-[#D8C7A1]/30 transition-all relative"
            title="Notification Center"
          >
            <Bell className="w-5 h-5 text-[#D8C7A1]" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[20px] h-5 rounded-full bg-red-600 text-white text-[10px] font-extrabold flex items-center justify-center border-2 border-[#071B2A] animate-pulse px-1">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>

          {/* NOTIFICATION DROPDOWN */}
          {isNotifDropdownOpen && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl bg-[#F5F1E8] border border-[#D8C7A1] shadow-2xl text-[#10201F] z-50 overflow-hidden animate-fade-down">
              
              <div className="p-4 bg-[#063B32] text-[#F7F3EA] flex items-center justify-between border-b border-[#D8C7A1]/20">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-[#D8C7A1]" />
                  <h4 className="font-serif text-sm font-bold">NOTIFIKASI REALTIME</h4>
                </div>
                {unreadCount > 0 && (
                  <button 
                    onClick={handleMarkAllRead}
                    className="text-[10px] text-[#D8C7A1] hover:underline flex items-center gap-1 font-bold"
                  >
                    <CheckCheck className="w-3 h-3" />
                    <span>MARK ALL READ</span>
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-[#063B32]/10">
                {notifications.length > 0 ? (
                  notifications.slice(0, 8).map(notif => (
                    <div 
                      key={notif.id} 
                      onClick={() => {
                        dbService.markNotificationAsRead(notif.id);
                        setIsNotifDropdownOpen(false);
                        if (notif.order_id && setSelectedOrderForModal) {
                          const found = dbService.getOrders().find(o => o.id === notif.order_id);
                          if (found) setSelectedOrderForModal(found);
                        } else {
                          setActiveTab('notifications');
                        }
                      }}
                      className={`p-3.5 hover:bg-[#E8E5DC] transition-colors cursor-pointer text-xs ${
                        !notif.is_read ? 'bg-[#063B32]/10 font-medium' : 'opacity-80'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#063B32]">{notif.title}</span>
                        <span className="text-[10px] text-gray-400">
                          {new Date(notif.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-xs text-[#10201F]/80 mt-1">{notif.message}</p>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-xs text-gray-500">Tidak ada notifikasi.</div>
                )}
              </div>

              <div className="p-3 bg-[#E8E5DC] text-center border-t border-[#063B32]/10">
                <button
                  onClick={() => {
                    setIsNotifDropdownOpen(false);
                    setActiveTab('notifications');
                  }}
                  className="text-xs font-bold text-[#063B32] hover:underline"
                >
                  LIHAT SEMUA NOTIFIKASI →
                </button>
              </div>

            </div>
          )}
        </div>

      </div>
    </header>
  );
};
