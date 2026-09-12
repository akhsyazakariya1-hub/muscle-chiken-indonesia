import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { dbService, normalizeOrderStatus, formatWIBDateTime } from '../../services/db';
import { X, User, Phone, MapPin, Heart, Clock, LogOut, Compass, Sparkles } from 'lucide-react';

export const CustomerProfileModal = () => {
  const { isProfileOpen, setIsProfileOpen, setActiveTrackingOrderId, favorites, products, showToast } = useApp();
  const { user, logoutCustomer } = useAuth();
  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'favorites', 'profile'

  if (!isProfileOpen || !user) return null;

  const orders = dbService.getOrders().filter(o => 
    (o.customer_phone && o.customer_phone === user.whatsapp) || 
    (o.whatsapp && o.whatsapp === user.whatsapp) ||
    (o.customer_name && o.customer_name === user.name) ||
    (o.customerName && o.customerName === user.name)
  );
  
  const favoriteProducts = products.filter(p => favorites.includes(p.id));

  const formatRupiah = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#071B2A]/85 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#F5F1E8] border border-[#D8C7A1]/40 shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col justify-between">
        
        {/* HEADER */}
        <div className="p-6 bg-[#063B32] text-[#F7F3EA] border-b border-[#D8C7A1]/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#071B2A] border border-[#D8C7A1] text-[#D8C7A1] flex items-center justify-center font-bold font-serif text-lg">
              {user.name ? user.name[0].toUpperCase() : 'U'}
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold tracking-wide">{user.name}</h2>
              <p className="text-xs text-[#D8C7A1]">{user.whatsapp}</p>
            </div>
          </div>

          <button 
            onClick={() => setIsProfileOpen(false)}
            className="p-2 rounded-full hover:bg-[#071B2A] text-[#F7F3EA] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* PROFILE TABS NAVIGATION */}
        <div className="bg-[#E8E5DC] px-6 py-2 border-b border-[#063B32]/10 flex items-center gap-4 text-xs font-bold text-[#10201F]">
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-2 px-3 rounded-xl transition-all ${
              activeTab === 'orders' ? 'bg-[#063B32] text-[#D8C7A1]' : 'hover:bg-gray-200'
            }`}
          >
            My Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`py-2 px-3 rounded-xl transition-all ${
              activeTab === 'favorites' ? 'bg-[#063B32] text-[#D8C7A1]' : 'hover:bg-gray-200'
            }`}
          >
            Favorites ({favoriteProducts.length})
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-2 px-3 rounded-xl transition-all ${
              activeTab === 'profile' ? 'bg-[#063B32] text-[#D8C7A1]' : 'hover:bg-gray-200'
            }`}
          >
            Account Info
          </button>
        </div>

        {/* TAB BODY */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          
          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {orders.length > 0 ? (
                orders.map(ord => {
                  const statusId = normalizeOrderStatus(ord.order_status || ord.status);
                  const wibTime = formatWIBDateTime(ord.created_at || ord.createdAt);

                  return (
                    <div key={ord.id} className="p-4 rounded-2xl bg-[#E8E5DC] border border-[#063B32]/10 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#063B32]">#{ord.id}</span>
                          <span className="text-[10px] text-gray-500 font-mono">{wibTime.full}</span>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full bg-[#063B32] text-[#D8C7A1] text-[10px] font-bold uppercase tracking-wider">
                          {statusId}
                        </span>
                      </div>

                      <div className="text-xs space-y-1">
                        {(ord.items || []).map((item, idx) => (
                          <div key={idx} className="flex justify-between">
                            <span>{item.name} x{item.quantity}</span>
                            <span className="font-bold">{formatRupiah(item.price * item.quantity)}</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2 border-t border-[#063B32]/10 flex items-center justify-between">
                        <span className="font-serif font-bold text-sm text-[#063B32]">Total: {formatRupiah(ord.total)}</span>
                        <button
                          onClick={() => {
                            setIsProfileOpen(false);
                            setActiveTrackingOrderId(ord.id);
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-[#063B32] text-[#D8C7A1] text-xs font-bold flex items-center gap-1.5 hover:bg-[#071B2A] transition-all shadow-sm"
                        >
                          <Compass className="w-3.5 h-3.5" />
                          <span>TRACK ORDER REALTIME</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-12 text-center text-[#10201F]/60">
                  <Clock className="w-12 h-12 text-[#063B32]/30 mx-auto mb-2" />
                  <p className="font-serif text-lg font-bold">No orders yet. Let's change that.</p>
                </div>
              )}
            </div>
          )}

          {/* FAVORITES TAB */}
          {activeTab === 'favorites' && (
            <div className="space-y-3">
              {favoriteProducts.length > 0 ? (
                favoriteProducts.map(prod => (
                  <div key={prod.id} className="p-3.5 rounded-2xl bg-[#E8E5DC] border border-[#063B32]/10 flex items-center justify-between gap-3">
                    <img src={prod.image} alt={prod.name} className="w-12 h-12 rounded-xl object-cover" />
                    <div className="flex-1">
                      <h4 className="font-serif text-xs font-bold text-[#10201F]">{prod.name}</h4>
                      <p className="text-[10px] text-[#063B32] font-bold">Rp {(prod.discountPrice || prod.price).toLocaleString('id-ID')}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center text-[#10201F]/60">
                  <Heart className="w-12 h-12 text-[#063B32]/30 mx-auto mb-2" />
                  <p className="font-serif text-lg font-bold">Save your favorite gourmet chicken items here.</p>
                </div>
              )}
            </div>
          )}

          {/* PROFILE INFO TAB */}
          {activeTab === 'profile' && (
            <div className="p-4 rounded-2xl bg-[#E8E5DC] border border-[#063B32]/10 space-y-3 text-xs text-[#10201F]">
              <div>
                <span className="text-gray-500 block">Full Name</span>
                <p className="font-bold text-sm">{user.name}</p>
              </div>
              <div>
                <span className="text-gray-500 block">WhatsApp Phone</span>
                <p className="font-bold text-sm">{user.whatsapp}</p>
              </div>
              <div>
                <span className="text-gray-500 block">Default Delivery Address</span>
                <p className="font-bold text-sm">{user.address || 'No address set'}</p>
              </div>
              {user.email && (
                <div>
                  <span className="text-gray-500 block">Email</span>
                  <p className="font-bold text-sm">{user.email}</p>
                </div>
              )}
            </div>
          )}

        </div>

        {/* FOOTER */}
        <div className="p-4 bg-[#E8E5DC] border-t border-[#063B32]/15 flex items-center justify-between">
          <button
            onClick={() => {
              logoutCustomer();
              setIsProfileOpen(false);
              showToast('Logged out of profile.', 'info');
            }}
            className="px-4 py-2 rounded-xl bg-red-100 text-red-700 text-xs font-bold flex items-center gap-2 hover:bg-red-200"
          >
            <LogOut className="w-4 h-4" />
            <span>LOGOUT</span>
          </button>

          <button
            onClick={() => setIsProfileOpen(false)}
            className="px-5 py-2 rounded-xl bg-[#063B32] text-[#D8C7A1] text-xs font-bold"
          >
            CLOSE
          </button>
        </div>

      </div>
    </div>
  );
};
