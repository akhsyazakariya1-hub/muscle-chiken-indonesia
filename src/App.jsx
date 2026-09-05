import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider, useApp } from './context/AppContext';
import { CartProvider } from './context/CartContext';

// Customer Components
import { Navbar } from './components/customer/Navbar';
import { Hero } from './components/customer/Hero';
import { TrustBar } from './components/customer/TrustBar';
import { MenuSection } from './components/customer/MenuSection';
import { CrowdFavorites } from './components/customer/CrowdFavorites';
import { BrandStory } from './components/customer/BrandStory';
import { PromoBanners } from './components/customer/PromoBanners';
import { ReviewSection } from './components/customer/ReviewSection';
import { Footer } from './components/customer/Footer';

// Customer Modals & UI
import { CartDrawer } from './components/customer/CartDrawer';
import { CheckoutModal } from './components/customer/CheckoutModal';
import { ProductDetailModal } from './components/customer/ProductDetailModal';
import { OrderTracker } from './components/customer/OrderTracker';
import { CustomerAuthModal } from './components/customer/CustomerAuthModal';
import { CustomerProfileModal } from './components/customer/CustomerProfileModal';
import { SearchModal } from './components/customer/SearchModal';
import { MobileBottomNav } from './components/customer/MobileBottomNav';
import { Toast } from './components/ui/Toast';
import { ErrorBoundary } from './components/ui/ErrorBoundary';

// Admin Components
import { AdminNavbar } from './components/admin/AdminNavbar';
import { AdminSidebar } from './components/admin/AdminSidebar';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminOrders } from './components/admin/AdminOrders';
import { AdminProducts } from './components/admin/AdminProducts';
import { AdminInventory } from './components/admin/AdminInventory';
import { AdminPromotions } from './components/admin/AdminPromotions';
import { AdminHeroManager } from './components/admin/AdminHeroManager';
import { AdminCustomers } from './components/admin/AdminCustomers';
import { AdminNotifications } from './components/admin/AdminNotifications';
import { AdminSettings } from './components/admin/AdminSettings';
import { AdminLoginPage } from './components/admin/AdminLoginPage';
import { AdminToast } from './components/admin/AdminToast';

const MainLayout = () => {
  const { admin, isAdminMode, setIsAdminMode } = useAuth();
  const [adminTab, setAdminTab] = useState('dashboard');
  const [selectedOrderForModal, setSelectedOrderForModal] = useState(null);

  // URL Path & Hash Router state listener
  const getFullLocation = () => window.location.pathname + window.location.search + window.location.hash;
  const [currentPath, setCurrentPath] = useState(getFullLocation());

  useEffect(() => {
    const handleLocationChange = () => {
      const path = getFullLocation();
      setCurrentPath(path);

      if (path.includes('/admin') || path.includes('#admin') || path.includes('p=/admin')) {
        setIsAdminMode(true);
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);

    // Initial path check
    handleLocationChange();

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, [setIsAdminMode]);

  // Determine if Admin Route is active
  const isAdminRoute = isAdminMode || currentPath.includes('/admin') || currentPath.includes('#admin') || currentPath.includes('p=/admin');
  const isLoginPageExplicit = currentPath.includes('/admin/login') || currentPath.includes('#admin/login') || currentPath.includes('p=/admin/login');

  // --- 1. ADMIN ROUTE HANDLING ---
  if (isAdminRoute) {
    // If not authenticated as Admin, show Admin Login Page
    if (!admin || isLoginPageExplicit) {
      return (
        <AdminLoginPage 
          onLoginSuccess={() => {
            setIsAdminMode(true);
            window.history.pushState({}, '', '/admin');
            setCurrentPath('/admin');
          }}
        />
      );
    }

    // Authenticated Admin Dashboard Layout
    return (
      <div className="min-h-screen bg-[#F5F1E8] text-[#10201F] flex">
        {/* ADMIN SIDEBAR */}
        <AdminSidebar activeTab={adminTab} setActiveTab={setAdminTab} />

        {/* MAIN ADMIN CONTENT AREA */}
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <AdminNavbar 
            activeTab={adminTab} 
            setActiveTab={setAdminTab} 
            setSelectedOrderForModal={(order) => {
              setSelectedOrderForModal(order);
              setAdminTab('orders');
            }}
          />

          <main className="flex-1 p-8 overflow-y-auto">
            {adminTab === 'dashboard' && <AdminDashboard />}
            {adminTab === 'orders' && <AdminOrders initialSelectedOrder={selectedOrderForModal} />}
            {adminTab === 'products' && <AdminProducts />}
            {adminTab === 'inventory' && <AdminInventory />}
            {adminTab === 'promotions' && <AdminPromotions />}
            {adminTab === 'hero' && <AdminHeroManager />}
            {adminTab === 'customers' && <AdminCustomers />}
            {adminTab === 'notifications' && (
              <AdminNotifications onSelectOrder={(order) => {
                setSelectedOrderForModal(order);
                setAdminTab('orders');
              }} />
            )}
            {adminTab === 'settings' && <AdminSettings />}
          </main>
        </div>

        {/* REALTIME NEW ORDER TOAST */}
        <AdminToast 
          onSelectOrder={(order) => {
            setSelectedOrderForModal(order);
            setAdminTab('orders');
          }}
        />

        <Toast />
      </div>
    );
  }

  // --- 2. CUSTOMER STOREFRONT LAYOUT ---
  return (
    <div className="min-h-screen bg-[#F5F1E8] text-[#10201F] flex flex-col justify-between selection:bg-[#D8C7A1] selection:text-[#071B2A]">
      <Navbar />

      <main className="flex-1">
        <Hero />
        <TrustBar />
        <MenuSection />
        <CrowdFavorites />
        <BrandStory />
        <PromoBanners />
        <ReviewSection />
      </main>

      <Footer />

      {/* CUSTOMER DRAWERS & MODALS */}
      <CartDrawer />
      <CheckoutModal />
      <ProductDetailModal />
      <OrderTracker />
      <CustomerAuthModal />
      <CustomerProfileModal />
      <SearchModal />
      <MobileBottomNav />
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppProvider>
          <CartProvider>
            <MainLayout />
          </CartProvider>
        </AppProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
