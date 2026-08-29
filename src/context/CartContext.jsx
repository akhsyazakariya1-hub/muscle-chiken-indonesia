import React, { createContext, useContext, useState, useEffect } from 'react';
import { dbService } from '../services/db';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('mc_cart_items_v1');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return []; }
    }
    return [];
  });

  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [deliveryType, setDeliveryType] = useState('DELIVERY'); // DELIVERY or PICKUP
  const [deliveryDistanceKm, setDeliveryDistanceKm] = useState(3.5);

  useEffect(() => {
    localStorage.setItem('mc_cart_items_v1', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, options = {}) => {
    const sauce = options.sauce || (product.availableSauces?.[0] || '');
    const spicyLevel = options.spicyLevel !== undefined ? options.spicyLevel : product.spicyLevel;
    const quantity = options.quantity || 1;

    // Create unique cart key based on item id and options
    const cartItemKey = `${product.id}-${sauce}-${spicyLevel}`;

    setCartItems(prev => {
      const existingIndex = prev.findIndex(item => item.cartKey === cartItemKey);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [
        ...prev,
        {
          cartKey: cartItemKey,
          id: product.id,
          name: product.name,
          subtitle: product.subtitle,
          price: product.discountPrice || product.price,
          originalPrice: product.price,
          image: product.image,
          sauce,
          spicyLevel,
          quantity
        }
      ];
    });
  };

  const updateQuantity = (cartKey, newQty) => {
    if (newQty <= 0) {
      removeFromCart(cartKey);
      return;
    }
    setCartItems(prev => prev.map(item => item.cartKey === cartKey ? { ...item, quantity: newQty } : item));
  };

  const removeFromCart = (cartKey) => {
    setCartItems(prev => prev.filter(item => item.cartKey !== cartKey));
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedVoucher(null);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const settings = dbService.getSettings();

  // Delivery Fee Calculation
  let deliveryFee = 0;
  if (deliveryType === 'DELIVERY') {
    if (subtotal >= (settings.freeDeliveryThreshold || 200000) && subtotal > 0) {
      deliveryFee = 0;
    } else if (subtotal > 0) {
      deliveryFee = (settings.baseDeliveryFee || 12000) + Math.round((deliveryDistanceKm - 1) * (settings.deliveryFeePerKm || 3000));
      deliveryFee = Math.max(8000, deliveryFee);
    }
  }

  // Voucher Discount Calculation
  let discountAmount = 0;
  if (appliedVoucher && subtotal >= appliedVoucher.minPurchase) {
    if (appliedVoucher.type === 'percentage') {
      discountAmount = Math.min((subtotal * appliedVoucher.discount) / 100, appliedVoucher.maxDiscount || 999999);
    } else {
      discountAmount = Math.min(appliedVoucher.discount, subtotal);
    }
  }

  const grandTotal = Math.max(0, subtotal + deliveryFee - discountAmount);

  const applyVoucherCode = (code) => {
    const promos = dbService.getPromotions();
    const found = promos.find(p => p.code.toUpperCase() === code.trim().toUpperCase() && p.isActive);
    
    if (!found) {
      return { success: false, message: 'Kode voucher tidak ditemukan atau sudah berakhir.' };
    }
    if (subtotal < found.minPurchase) {
      return { 
        success: false, 
        message: `Voucher ini membutuhkan minimum pembelian Rp ${found.minPurchase.toLocaleString('id-ID')}` 
      };
    }

    setAppliedVoucher(found);
    return { success: true, message: `Voucher "${found.code}" berhasil dipasang!` };
  };

  const removeVoucher = () => {
    setAppliedVoucher(null);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      subtotal,
      deliveryFee,
      discountAmount,
      grandTotal,
      appliedVoucher,
      applyVoucherCode,
      removeVoucher,
      deliveryType,
      setDeliveryType,
      deliveryDistanceKm,
      setDeliveryDistanceKm
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
