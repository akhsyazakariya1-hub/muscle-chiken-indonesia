import React, { createContext, useContext, useState, useEffect } from 'react';
import { dbService } from '../services/db';
import { cloudDbService } from '../services/cloudDb';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [heroConfig, setHeroConfig] = useState({});
  const [settings, setSettings] = useState({});
  const [reviews, setReviews] = useState([]);
  const [favorites, setFavorites] = useState([]);

  // Active Category Filter
  const [activeCategory, setActiveCategory] = useState('all');

  // Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null); // Quick view / detail modal
  const [activeTrackingOrderId, setActiveTrackingOrderId] = useState(null); // Live Order Tracker modal target

  // Toast Notification System
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => setToast(null), 3500);
  };

  const refreshDataFromDB = () => {
    setProducts(dbService.getProducts());
    setPromotions(dbService.getPromotions());
    setHeroConfig(dbService.getHeroConfig());
    setSettings(dbService.getSettings());
    setReviews(dbService.getReviews());
    setFavorites(dbService.getFavorites());
  };

  useEffect(() => {
    refreshDataFromDB();
    cloudDbService.startSync();

    // Listen for database updates across app
    const handleDbUpdate = () => refreshDataFromDB();
    window.addEventListener('mc_db_updated', handleDbUpdate);
    window.addEventListener('mc_favorites_updated', handleDbUpdate);

    return () => {
      cloudDbService.stopSync();
      window.removeEventListener('mc_db_updated', handleDbUpdate);
      window.removeEventListener('mc_favorites_updated', handleDbUpdate);
    };
  }, []);


  const toggleFavorite = (productId) => {
    const updatedFavs = dbService.toggleFavorite(productId);
    setFavorites(updatedFavs);
    const isFav = updatedFavs.includes(productId);
    showToast(isFav ? 'Ditambahkan ke Favorit' : 'Dihapus dari Favorit', isFav ? 'success' : 'info');
  };

  return (
    <AppContext.Provider value={{
      products,
      categories,
      promotions,
      heroConfig,
      settings,
      reviews,
      favorites,
      activeCategory,
      setActiveCategory,
      isCartOpen,
      setIsCartOpen,
      isSearchOpen,
      setIsSearchOpen,
      isAuthOpen,
      setIsAuthOpen,
      isProfileOpen,
      setIsProfileOpen,
      isCheckoutOpen,
      setIsCheckoutOpen,
      selectedProduct,
      setSelectedProduct,
      activeTrackingOrderId,
      setActiveTrackingOrderId,
      toast,
      showToast,
      toggleFavorite,
      refreshDataFromDB
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
