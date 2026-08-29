import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useCart } from '../../context/CartContext';
import { X, Trash2, Plus, Minus, Tag, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';

export const CartDrawer = () => {
  const { isCartOpen, setIsCartOpen, setIsCheckoutOpen, showToast } = useApp();
  const { 
    cartItems, 
    updateQuantity, 
    removeFromCart, 
    subtotal, 
    deliveryFee, 
    discountAmount, 
    grandTotal, 
    appliedVoucher, 
    applyVoucherCode, 
    removeVoucher 
  } = useCart();

  const [voucherInput, setVoucherInput] = useState('');

  if (!isCartOpen) return null;

  const handleApplyVoucher = (e) => {
    e.preventDefault();
    if (!voucherInput.trim()) return;
    const res = applyVoucherCode(voucherInput);
    showToast(res.message, res.success ? 'success' : 'error');
    if (res.success) setVoucherInput('');
  };

  const handleProceedCheckout = () => {
    if (cartItems.length === 0) {
      showToast('Keranjang Anda masih kosong.', 'error');
      return;
    }
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const formatRupiah = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#071B2A]/70 backdrop-blur-sm animate-fade-in flex justify-end">
      
      {/* SIDE DRAWER CONTAINER */}
      <div className="relative w-full max-w-md bg-[#F5F1E8] h-full shadow-2xl flex flex-col justify-between border-l border-[#D8C7A1]/40 animate-slide-left">
        
        {/* HEADER */}
        <div className="p-6 bg-[#063B32] text-[#F7F3EA] border-b border-[#D8C7A1]/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-[#D8C7A1]" />
            <h2 className="font-serif text-xl font-bold tracking-wide text-[#F7F3EA]">YOUR CART</h2>
            <span className="px-2 py-0.5 rounded-full bg-[#071B2A] text-[#D8C7A1] text-xs font-bold">
              {cartItems.reduce((sum, item) => sum + item.quantity, 0)} items
            </span>
          </div>
          
          <button 
            onClick={() => setIsCartOpen(false)}
            className="p-2 rounded-full hover:bg-[#071B2A] text-[#F7F3EA] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CART ITEMS LIST */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <div key={item.cartKey} className="p-4 rounded-2xl bg-[#E8E5DC] border border-[#063B32]/10 flex items-center justify-between gap-4 shadow-sm hover:border-[#063B32]/30 transition-all">
                <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover shrink-0 border border-[#063B32]/10" />
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-serif text-sm font-bold text-[#10201F] truncate">{item.name}</h4>
                  <div className="flex flex-wrap items-center gap-1.5 mt-0.5 text-[10px] text-[#063B32] font-medium">
                    {item.sauce && <span className="bg-[#063B32]/10 px-1.5 py-0.5 rounded">Saus: {item.sauce}</span>}
                    {item.spicyLevel > 0 && <span className="bg-[#B98262]/20 text-[#B98262] px-1.5 py-0.5 rounded font-bold">Spicy Lvl {item.spicyLevel}</span>}
                  </div>
                  <p className="text-xs font-bold text-[#063B32] mt-1">
                    {formatRupiah(item.price)}
                  </p>
                </div>

                {/* Quantity Controls & Delete */}
                <div className="flex flex-col items-end gap-2">
                  <button 
                    onClick={() => removeFromCart(item.cartKey)}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                    title="Hapus"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-2 bg-white rounded-lg p-1 border border-[#063B32]/10">
                    <button 
                      onClick={() => updateQuantity(item.cartKey, item.quantity - 1)}
                      className="p-1 rounded text-[#10201F] hover:bg-[#063B32] hover:text-[#D8C7A1]"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-bold text-[#10201F] w-4 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.cartKey, item.quantity + 1)}
                      className="p-1 rounded text-[#10201F] hover:bg-[#063B32] hover:text-[#D8C7A1]"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-20 text-center text-[#10201F]/60">
              <ShoppingBag className="w-16 h-16 text-[#063B32]/30 mx-auto mb-4" />
              <h3 className="font-serif text-lg font-bold text-[#10201F]">Your cart is waiting for something delicious.</h3>
              <p className="text-xs text-[#10201F]/60 mt-1">Jelajahi menu signature Muscle Chicken sekarang.</p>
            </div>
          )}
        </div>

        {/* FOOTER SUMMARY & CHECKOUT */}
        {cartItems.length > 0 && (
          <div className="p-6 bg-[#E8E5DC] border-t border-[#063B32]/15 space-y-4">
            
            {/* VOUCHER FORM */}
            <form onSubmit={handleApplyVoucher} className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="w-4 h-4 text-[#063B32] absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  value={voucherInput} 
                  onChange={(e) => setVoucherInput(e.target.value)} 
                  placeholder="Kode Voucher (ex: GREATNESS20)"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-[#063B32]/20 text-xs font-mono uppercase focus:outline-none focus:border-[#063B32]"
                />
              </div>
              <button 
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#063B32] text-[#D8C7A1] text-xs font-bold uppercase tracking-wider hover:bg-[#071B2A]"
              >
                APPLY
              </button>
            </form>

            {appliedVoucher && (
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#063B32]/10 border border-[#063B32]/20 text-xs font-semibold text-[#063B32]">
                <span>Voucher: {appliedVoucher.code}</span>
                <button onClick={removeVoucher} className="text-red-600 underline text-[10px]">Hapus</button>
              </div>
            )}

            {/* BREAKDOWN */}
            <div className="space-y-1.5 text-xs text-[#10201F]/80">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-[#10201F]">{formatRupiah(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimasi Ongkir</span>
                <span className="font-bold text-[#10201F]">{deliveryFee === 0 ? 'GRATIS' : formatRupiah(deliveryFee)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-[#063B32]">
                  <span>Diskon Voucher</span>
                  <span className="font-bold">-{formatRupiah(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold text-[#063B32] pt-2 border-t border-[#063B32]/10">
                <span>TOTAL</span>
                <span className="font-serif text-lg">{formatRupiah(grandTotal)}</span>
              </div>
            </div>

            {/* CHECKOUT BUTTON */}
            <button
              onClick={handleProceedCheckout}
              className="w-full py-4 rounded-xl bg-[#063B32] text-[#D8C7A1] font-bold text-xs uppercase tracking-widest hover:bg-[#071B2A] border border-[#D8C7A1] transition-all flex items-center justify-center gap-3 shadow-xl"
            >
              <span>PROCEED TO CHECKOUT</span>
              <ArrowRight className="w-4 h-4 text-[#D8C7A1]" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
