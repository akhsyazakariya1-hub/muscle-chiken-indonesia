import React from 'react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Utensils, 
  Boxes, 
  Tag, 
  Sliders, 
  Users, 
  Settings, 
  LogOut, 
  Crown,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminSidebar = ({ activeTab, setActiveTab }) => {
  const { admin, logoutAdmin, setIsAdminMode } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders', label: 'Orders Queue', icon: ShoppingBag },
    { id: 'products', label: 'Products (CRUD)', icon: Utensils },
    { id: 'inventory', label: 'Inventory & Stock', icon: Boxes },
    { id: 'promotions', label: 'Vouchers & Promos', icon: Tag },
    { id: 'hero', label: 'Hero Banner CMS', icon: Sliders },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'settings', label: 'Admin Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#071B2A] text-[#F7F3EA] border-r border-[#D8C7A1]/20 flex flex-col justify-between p-6 shrink-0 h-screen sticky top-0">
      
      <div>
        {/* BRAND HEADER */}
        <div className="flex items-center gap-3 pb-6 border-b border-[#D8C7A1]/15">
          <div className="w-10 h-10 rounded-xl bg-[#063B32] border border-[#D8C7A1] text-[#D8C7A1] flex items-center justify-center shadow-lg">
            <Crown className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif text-lg font-bold tracking-wider text-[#F7F3EA] leading-none">
              MUSCLE CHICKEN
            </h2>
            <span className="text-[10px] tracking-widest text-[#D8C7A1] uppercase font-bold mt-1 block">
              EXECUTIVE PORTAL
            </span>
          </div>
        </div>

        {/* ADMIN USER BADGE */}
        <div className="mt-4 p-3 rounded-2xl bg-[#063B32]/40 border border-[#D8C7A1]/20 flex items-center justify-between text-xs">
          <div>
            <p className="font-bold text-[#F7F3EA] truncate max-w-[120px]">{admin?.name || 'Super Admin'}</p>
            <span className="text-[10px] text-[#D8C7A1] font-mono font-bold uppercase">{admin?.role || 'SUPER_ADMIN'}</span>
          </div>
        </div>

        {/* NAVIGATION LINKS */}
        <nav className="mt-6 space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  isActive 
                    ? 'bg-[#063B32] text-[#D8C7A1] border border-[#D8C7A1]/60 shadow-lg translate-x-1' 
                    : 'text-[#F7F3EA]/70 hover:bg-[#063B32]/30 hover:text-[#F7F3EA]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#D8C7A1]' : 'text-gray-400'}`} />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-4 h-4 text-[#D8C7A1]" />}
              </button>
            );
          })}
        </nav>
      </div>

      {/* FOOTER ACTIONS */}
      <div className="pt-6 border-t border-[#D8C7A1]/15 space-y-2">
        <button
          onClick={() => setIsAdminMode(false)}
          className="w-full py-2.5 px-3 rounded-xl bg-[#063B32]/60 text-[#D8C7A1] text-xs font-bold hover:bg-[#063B32] transition-colors flex items-center justify-center gap-2 border border-[#D8C7A1]/30"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Switch to Storefront</span>
        </button>

        <button
          onClick={logoutAdmin}
          className="w-full py-2.5 px-3 rounded-xl bg-red-950/60 text-red-300 text-xs font-bold hover:bg-red-900 transition-colors flex items-center justify-center gap-2 border border-red-800/40"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Logout Admin</span>
        </button>
      </div>

    </aside>
  );
};
