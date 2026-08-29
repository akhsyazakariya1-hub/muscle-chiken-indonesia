import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { 
  ShoppingBag, 
  Search, 
  User, 
  MapPin, 
  Menu, 
  X, 
  Flame, 
  ShieldCheck, 
  Compass, 
  PhoneCall,
  Crown
} from 'lucide-react';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { 
    setIsCartOpen, 
    setIsSearchOpen, 
    setIsAuthOpen, 
    setIsProfileOpen, 
    setActiveCategory,
    activeTrackingOrderId,
    setActiveTrackingOrderId
  } = useApp();

  const { cartItems } = useCart();
  const { user, admin, isAdminMode, setIsAdminMode } = useAuth();

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled 
        ? 'bg-[#063B32]/95 backdrop-blur-md border-b border-[#D8C7A1]/20 py-3.5 shadow-xl' 
        : 'bg-gradient-to-b from-[#071B2A]/90 via-[#063B32]/60 to-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* LOGO AREA */}
        <a 
          href="#" 
          className="flex items-center gap-3 group focus:outline-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#063B32] to-[#071B2A] border border-[#D8C7A1]/60 flex items-center justify-center shadow-lg group-hover:border-[#D8C7A1] transition-all duration-300">
            {/* Minimalist flexing rooster logo icon */}
            <Crown className="w-5 h-5 text-[#D8C7A1] group-hover:scale-110 transition-transform duration-300" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif tracking-widest text-lg sm:text-xl font-bold text-[#F7F3EA] leading-none">
              MUSCLE CHICKEN
            </span>
            <span className="text-[10px] tracking-[0.25em] text-[#D8C7A1] uppercase font-semibold mt-1">
              INDONESIA
            </span>
          </div>
        </a>

        {/* DESKTOP MENU LINKS */}
        <nav className="hidden lg:flex items-center gap-8">
          <button 
            onClick={() => scrollToSection('hero')} 
            className="text-sm font-medium tracking-wide text-[#F7F3EA]/90 hover:text-[#D8C7A1] transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#D8C7A1] after:scale-x-0 hover:after:scale-x-100 after:transition-transform"
          >
            Home
          </button>
          <button 
            onClick={() => { setActiveCategory('all'); scrollToSection('signature-menu'); }} 
            className="text-sm font-medium tracking-wide text-[#F7F3EA]/90 hover:text-[#D8C7A1] transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#D8C7A1] after:scale-x-0 hover:after:scale-x-100 after:transition-transform"
          >
            Menu
          </button>
          <button 
            onClick={() => scrollToSection('best-sellers')} 
            className="text-sm font-medium tracking-wide text-[#F7F3EA]/90 hover:text-[#D8C7A1] transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#D8C7A1] after:scale-x-0 hover:after:scale-x-100 after:transition-transform"
          >
            Best Seller
          </button>
          <button 
            onClick={() => scrollToSection('promotions')} 
            className="text-sm font-medium tracking-wide text-[#F7F3EA]/90 hover:text-[#D8C7A1] transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#D8C7A1] after:scale-x-0 hover:after:scale-x-100 after:transition-transform"
          >
            Promotions
          </button>
          <button 
            onClick={() => scrollToSection('brand-story')} 
            className="text-sm font-medium tracking-wide text-[#F7F3EA]/90 hover:text-[#D8C7A1] transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#D8C7A1] after:scale-x-0 hover:after:scale-x-100 after:transition-transform"
          >
            About Us
          </button>
          <button 
            onClick={() => {
              if (user) {
                setIsProfileOpen(true);
              } else {
                setActiveTrackingOrderId('MC-10291');
              }
            }} 
            className="text-sm font-medium tracking-wide text-[#D8C7A1] hover:text-[#F7F3EA] transition-colors flex items-center gap-1.5"
          >
            <Compass className="w-4 h-4" />
            Track Order
          </button>
        </nav>

        {/* RIGHT ACTION BUTTONS */}
        <div className="flex items-center gap-3 sm:gap-4">

          {/* Location Badge */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#071B2A]/60 border border-[#D8C7A1]/30 text-[#F7F3EA] text-xs">
            <MapPin className="w-3.5 h-3.5 text-[#D8C7A1]" />
            <span>SCBD, Jakarta</span>
          </div>

          {/* Search Trigger */}
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="p-2.5 rounded-full text-[#F7F3EA] hover:text-[#D8C7A1] hover:bg-[#071B2A]/50 transition-colors"
            title="Cari Menu"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Account / Login Trigger */}
          <button
            onClick={() => {
              if (user) {
                setIsProfileOpen(true);
              } else {
                setIsAuthOpen(true);
              }
            }}
            className="p-2.5 rounded-full text-[#F7F3EA] hover:text-[#D8C7A1] hover:bg-[#071B2A]/50 transition-colors relative flex items-center gap-2"
            title={user ? user.name : "Login / Customer Profile"}
          >
            <User className="w-5 h-5 text-[#D8C7A1]" />
            {user && (
              <span className="hidden md:inline text-xs font-semibold text-[#F7F3EA] truncate max-w-[100px]">
                {user.name.split(' ')[0]}
              </span>
            )}
          </button>

          {/* Cart Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2.5 rounded-full bg-gradient-to-r from-[#063B32] to-[#071B2A] border border-[#D8C7A1]/50 text-[#F7F3EA] hover:border-[#D8C7A1] transition-all shadow-md group"
          >
            <ShoppingBag className="w-5 h-5 text-[#D8C7A1] group-hover:scale-110 transition-transform" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#B98262] text-[#F7F3EA] text-[11px] font-bold flex items-center justify-center shadow-lg border border-[#071B2A] animate-pulse">
                {cartCount}
              </span>
            )}
          </button>

          {/* Admin Switch Toggle (Quick Portal Link) */}
          <button
            onClick={() => {
              if (isAdminMode) {
                setIsAdminMode(false);
                window.history.pushState({}, '', '/');
              } else {
                setIsAdminMode(true);
                window.history.pushState({}, '', '/admin');
              }
              window.dispatchEvent(new Event('popstate'));
            }}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
              isAdminMode 
                ? 'bg-[#B98262] text-white border-[#D8C7A1]' 
                : 'bg-[#071B2A]/80 text-[#D8C7A1] border-[#D8C7A1]/40 hover:bg-[#063B32]'
            }`}
            title="Toggle Admin Mode"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{isAdminMode ? 'Customer Mode' : 'Admin Portal'}</span>
          </button>


          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-[#F7F3EA] focus:outline-none"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6 text-[#D8C7A1]" /> : <Menu className="w-6 h-6 text-[#F7F3EA]" />}
          </button>

        </div>
      </div>

      {/* MOBILE DRAWER MENU */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#071B2A]/98 border-b border-[#D8C7A1]/30 backdrop-blur-xl px-6 py-6 space-y-4 animate-fade-down">
          <div className="flex items-center justify-between border-b border-[#D8C7A1]/20 pb-4">
            <span className="text-xs tracking-widest text-[#D8C7A1] font-semibold">NAVIGATION</span>
            <button 
              onClick={() => setIsAdminMode(!isAdminMode)} 
              className="text-xs font-semibold text-[#B98262] underline"
            >
              {isAdminMode ? 'To Customer View' : 'To Admin Portal'}
            </button>
          </div>
          <button 
            onClick={() => scrollToSection('hero')} 
            className="block w-full text-left text-base font-serif text-[#F7F3EA] py-2 border-b border-[#D8C7A1]/10"
          >
            Home
          </button>
          <button 
            onClick={() => { setActiveCategory('all'); scrollToSection('signature-menu'); }} 
            className="block w-full text-left text-base font-serif text-[#F7F3EA] py-2 border-b border-[#D8C7A1]/10"
          >
            Our Signature Menu
          </button>
          <button 
            onClick={() => scrollToSection('best-sellers')} 
            className="block w-full text-left text-base font-serif text-[#F7F3EA] py-2 border-b border-[#D8C7A1]/10"
          >
            The Crowd Favorites
          </button>
          <button 
            onClick={() => scrollToSection('promotions')} 
            className="block w-full text-left text-base font-serif text-[#F7F3EA] py-2 border-b border-[#D8C7A1]/10"
          >
            Promotions & Vouchers
          </button>
          <button 
            onClick={() => scrollToSection('brand-story')} 
            className="block w-full text-left text-base font-serif text-[#F7F3EA] py-2 border-b border-[#D8C7A1]/10"
          >
            The Muscle Standard (About)
          </button>
          <button 
            onClick={() => {
              setIsMobileMenuOpen(false);
              if (user) {
                setIsProfileOpen(true);
              } else {
                setActiveTrackingOrderId('MC-10291');
              }
            }} 
            className="block w-full text-left text-base font-serif text-[#D8C7A1] py-2"
          >
            Live Order Tracking
          </button>
        </div>
      )}
    </header>
  );
};
