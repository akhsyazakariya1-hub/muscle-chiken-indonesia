import React from 'react';
import { useApp } from '../../context/AppContext';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { Home, Utensils, Compass, ShoppingBag, User } from 'lucide-react';

export const MobileBottomNav = () => {
  const { 
    setIsCartOpen, 
    setIsAuthOpen, 
    setIsProfileOpen, 
    setActiveCategory, 
    setActiveTrackingOrderId 
  } = useApp();
  const { cartItems } = useCart();
  const { user } = useAuth();

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#063B32]/95 border-t border-[#D8C7A1]/30 backdrop-blur-md px-4 py-2 flex items-center justify-around text-xs shadow-2xl">
      
      <button 
        onClick={() => scrollTo('hero')} 
        className="flex flex-col items-center gap-1 text-[#F7F3EA] hover:text-[#D8C7A1] py-1"
      >
        <Home className="w-5 h-5 text-[#D8C7A1]" />
        <span className="text-[10px] font-medium tracking-wider">Home</span>
      </button>

      <button 
        onClick={() => { setActiveCategory('all'); scrollTo('signature-menu'); }} 
        className="flex flex-col items-center gap-1 text-[#F7F3EA] hover:text-[#D8C7A1] py-1"
      >
        <Utensils className="w-5 h-5 text-[#D8C7A1]" />
        <span className="text-[10px] font-medium tracking-wider">Menu</span>
      </button>

      <button 
        onClick={() => {
          if (user) {
            setIsProfileOpen(true);
          } else {
            setActiveTrackingOrderId('MC-10291');
          }
        }} 
        className="flex flex-col items-center gap-1 text-[#F7F3EA] hover:text-[#D8C7A1] py-1"
      >
        <Compass className="w-5 h-5 text-[#D8C7A1]" />
        <span className="text-[10px] font-medium tracking-wider">Orders</span>
      </button>

      <button 
        onClick={() => setIsCartOpen(true)} 
        className="relative flex flex-col items-center gap-1 text-[#F7F3EA] hover:text-[#D8C7A1] py-1"
      >
        <div className="relative">
          <ShoppingBag className="w-5 h-5 text-[#D8C7A1]" />
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-[#B98262] text-white text-[9px] font-bold flex items-center justify-center border border-[#071B2A]">
              {cartCount}
            </span>
          )}
        </div>
        <span className="text-[10px] font-medium tracking-wider">Cart</span>
      </button>

      <button 
        onClick={() => {
          if (user) {
            setIsProfileOpen(true);
          } else {
            setIsAuthOpen(true);
          }
        }} 
        className="flex flex-col items-center gap-1 text-[#F7F3EA] hover:text-[#D8C7A1] py-1"
      >
        <User className="w-5 h-5 text-[#D8C7A1]" />
        <span className="text-[10px] font-medium tracking-wider">Profile</span>
      </button>

    </div>
  );
};
