import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { dbService } from '../../services/db';
import { buildWhatsAppOrderMessage } from '../../services/whatsapp';
import { QRISModal } from '../ui/QRISModal';
import { 
  X, 
  MapPin, 
  CreditCard, 
  CheckCircle, 
  Truck, 
  ShoppingBag, 
  QrCode, 
  Building, 
  Wallet, 
  Banknote,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const CheckoutModal = () => {
  const { isCheckoutOpen, setIsCheckoutOpen, showToast, setActiveTrackingOrderId } = useApp();
  const { cartItems, subtotal, deliveryFee, discountAmount, grandTotal, deliveryType, setDeliveryType, clearCart } = useCart();
  const { user, loginCustomer } = useAuth();

  const [step, setStep] = useState(1);

  // Form Fields
  const [name, setName] = useState(user?.name || '');
  const [whatsapp, setWhatsapp] = useState(user?.whatsapp || '');
  const [address, setAddress] = useState(user?.address || '');
  const [notes, setNotes] = useState('');

  // Payment Selection
  const [paymentMethod, setPaymentMethod] = useState('QRIS');
  const [isQRISOpen, setIsQRISOpen] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);

  if (!isCheckoutOpen) return null;

  const formatRupiah = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);

  const handleStep1Next = (e) => {
    e.preventDefault();
    if (!name || !whatsapp || (deliveryType === 'DELIVERY' && !address)) {
      showToast('Mohon lengkapi data pengiriman Anda.', 'error');
      return;
    }
    // Auto save customer details
    loginCustomer(name, whatsapp, address);
    setStep(2);
  };

  const handleCreateOrder = () => {
    if (cartItems.length === 0) return;

    const orderData = {
      customerName: name,
      whatsapp,
      address: deliveryType === 'DELIVERY' ? address : 'PICKUP AT STORE (SCBD Lot 28)',
      deliveryType,
      items: cartItems.map(i => ({
        id: i.id,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        sauce: i.sauce,
        spicyLevel: i.spicyLevel
      })),
      subtotal,
      deliveryFee: deliveryType === 'DELIVERY' ? deliveryFee : 0,
      discount: discountAmount,
      total: deliveryType === 'DELIVERY' ? grandTotal : Math.max(0, subtotal - discountAmount),
      paymentMethod,
      notes
    };

    const newOrder = dbService.createOrder(orderData);
    setCreatedOrder(newOrder);

    if (paymentMethod === 'QRIS') {
      setIsQRISOpen(true);
    } else {
      finalizeOrderProcess(newOrder);
    }
  };

  const finalizeOrderProcess = (order) => {
    clearCart();
    showToast(`Order #${order.id} berhasil dibuat!`, 'success');

    // Build WA link if customer wants to send to admin
    const waData = buildWhatsAppOrderMessage(order);
    
    setIsCheckoutOpen(false);
    setActiveTrackingOrderId(order.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#071B2A]/85 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#F5F1E8] border border-[#D8C7A1]/40 shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col justify-between">
        
        {/* HEADER */}
        <div className="p-6 bg-[#063B32] text-[#F7F3EA] border-b border-[#D8C7A1]/20 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#D8C7A1]">PREMIUM FOOD COMMERCE CHECKOUT</span>
            <h2 className="font-serif text-2xl font-bold tracking-wide">PREPARE YOUR FEAST</h2>
          </div>

          <button 
            onClick={() => setIsCheckoutOpen(false)}
            className="p-2 rounded-full hover:bg-[#071B2A] text-[#F7F3EA] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP PROGRESS BAR */}
        <div className="bg-[#E8E5DC] px-6 py-3 border-b border-[#063B32]/10 flex items-center justify-between text-xs font-bold text-[#10201F]">
          <div className={`flex items-center gap-1.5 ${step >= 1 ? 'text-[#063B32]' : 'text-gray-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 1 ? 'bg-[#063B32] text-[#D8C7A1]' : 'bg-gray-300'}`}>1</span>
            <span>Pengiriman</span>
          </div>
          <span className="text-gray-300">•</span>
          <div className={`flex items-center gap-1.5 ${step >= 2 ? 'text-[#063B32]' : 'text-gray-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 2 ? 'bg-[#063B32] text-[#D8C7A1]' : 'bg-gray-300'}`}>2</span>
            <span>Ringkasan</span>
          </div>
          <span className="text-gray-300">•</span>
          <div className={`flex items-center gap-1.5 ${step >= 3 ? 'text-[#063B32]' : 'text-gray-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 3 ? 'bg-[#063B32] text-[#D8C7A1]' : 'bg-gray-300'}`}>3</span>
            <span>Pembayaran</span>
          </div>
        </div>

        {/* STEP CONTENT BODY */}
        <div className="p-6 overflow-y-auto flex-1">
          
          {/* STEP 1: DELIVERY ADDRESS & DETAILS */}
          {step === 1 && (
            <form onSubmit={handleStep1Next} className="space-y-4">
              
              {/* Delivery vs Pickup Toggle */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <button
                  type="button"
                  onClick={() => setDeliveryType('DELIVERY')}
                  className={`p-3.5 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
                    deliveryType === 'DELIVERY'
                      ? 'bg-[#063B32] text-[#D8C7A1] border-[#D8C7A1] shadow-md'
                      : 'bg-[#E8E5DC] text-[#10201F]/70 border-[#063B32]/10'
                  }`}
                >
                  <Truck className="w-4 h-4" />
                  <span>EXPRESS DELIVERY</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDeliveryType('PICKUP')}
                  className={`p-3.5 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
                    deliveryType === 'PICKUP'
                      ? 'bg-[#063B32] text-[#D8C7A1] border-[#D8C7A1] shadow-md'
                      : 'bg-[#E8E5DC] text-[#10201F]/70 border-[#063B32]/10'
                  }`}
                >
                  <Building className="w-4 h-4" />
                  <span>PICKUP AT STORE</span>
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#10201F] mb-1">NAMA LENGKAP *</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="Masukkan nama penerima..."
                  className="w-full px-4 py-3 rounded-xl bg-white border border-[#063B32]/20 text-sm focus:outline-none focus:border-[#063B32]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#10201F] mb-1">NOMOR WHATSAPP *</label>
                <input 
                  type="tel" 
                  value={whatsapp} 
                  onChange={(e) => setWhatsapp(e.target.value)} 
                  placeholder="Contoh: 081234567890"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-[#063B32]/20 text-sm focus:outline-none focus:border-[#063B32]"
                  required
                />
              </div>

              {deliveryType === 'DELIVERY' ? (
                <div>
                  <label className="block text-xs font-bold uppercase text-[#10201F] mb-1">ALAMAT PENGIRIMAN LENGKAP *</label>
                  <textarea 
                    rows="3"
                    value={address} 
                    onChange={(e) => setAddress(e.target.value)} 
                    placeholder="Nama jalan, nomor rumah, lantai/unit apartemen, patokan..."
                    className="w-full px-4 py-3 rounded-xl bg-white border border-[#063B32]/20 text-sm focus:outline-none focus:border-[#063B32]"
                    required
                  />
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-[#063B32]/10 border border-[#063B32]/20 text-xs text-[#063B32]">
                  <p className="font-bold">Lokasi Store Ambil Sendiri:</p>
                  <p className="mt-1">SCBD Lot 28, Jl. Jend. Sudirman No.52, Kebayoran Baru, Jakarta Selatan</p>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase text-[#10201F] mb-1">CATATAN KHUSUS (OPTIONAL)</label>
                <input 
                  type="text" 
                  value={notes} 
                  onChange={(e) => setNotes(e.target.value)} 
                  placeholder="Contoh: Kurangi sambal, pisahkan saus, titip di sekuriti..."
                  className="w-full px-4 py-3 rounded-xl bg-white border border-[#063B32]/20 text-sm focus:outline-none focus:border-[#063B32]"
                />
              </div>

              <button 
                type="submit"
                className="w-full py-4 rounded-xl bg-[#063B32] text-[#D8C7A1] font-bold text-xs uppercase tracking-widest hover:bg-[#071B2A] border border-[#D8C7A1] transition-all flex items-center justify-center gap-2 shadow-lg mt-4"
              >
                <span>LANJUT KE RINGKASAN</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* STEP 2: ORDER SUMMARY */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-serif text-lg font-bold text-[#063B32]">Ringkasan Pesanan Anda</h3>
              
              <div className="divide-y divide-[#063B32]/10 max-h-48 overflow-y-auto">
                {cartItems.map(item => (
                  <div key={item.cartKey} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-[#10201F]">{item.name} x{item.quantity}</p>
                      {item.sauce && <p className="text-[10px] text-[#063B32]">Saus: {item.sauce}</p>}
                    </div>
                    <span className="font-bold text-[#063B32]">{formatRupiah(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-2xl bg-[#E8E5DC] text-xs space-y-1.5 border border-[#063B32]/10">
                <div className="flex justify-between">
                  <span>Penerima:</span>
                  <span className="font-bold text-[#10201F]">{name} ({whatsapp})</span>
                </div>
                <div className="flex justify-between">
                  <span>Alamat:</span>
                  <span className="font-bold text-[#10201F] truncate max-w-[200px]">{address || 'Pickup at store'}</span>
                </div>
                <div className="flex justify-between border-t border-[#063B32]/10 pt-2 font-bold text-sm text-[#063B32]">
                  <span>Total Pembayaran:</span>
                  <span>{formatRupiah(deliveryType === 'DELIVERY' ? grandTotal : Math.max(0, subtotal - discountAmount))}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button 
                  onClick={() => setStep(1)}
                  className="py-3 rounded-xl bg-gray-200 text-[#10201F] font-bold text-xs uppercase"
                >
                  Kembali
                </button>
                <button 
                  onClick={() => setStep(3)}
                  className="py-3 rounded-xl bg-[#063B32] text-[#D8C7A1] font-bold text-xs uppercase hover:bg-[#071B2A]"
                >
                  Lanjut ke Pembayaran
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PAYMENT METHOD SELECTION */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="font-serif text-lg font-bold text-[#063B32]">Pilih Metode Pembayaran</h3>

              <div className="space-y-3">
                
                {/* QRIS */}
                <div 
                  onClick={() => setPaymentMethod('QRIS')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    paymentMethod === 'QRIS'
                      ? 'bg-[#063B32]/10 border-[#063B32] shadow-md'
                      : 'bg-white border-[#063B32]/10 hover:border-[#063B32]/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-[#063B32] text-[#D8C7A1]">
                      <QrCode className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#10201F]">QRIS Instant Payment</h4>
                      <p className="text-[10px] text-[#10201F]/60">Scan via GoPay, OVO, Dana, ShopeePay, BCA, Mandiri</p>
                    </div>
                  </div>
                  <input type="radio" checked={paymentMethod === 'QRIS'} readOnly />
                </div>

                {/* BANK TRANSFER */}
                <div 
                  onClick={() => setPaymentMethod('Bank Transfer')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    paymentMethod === 'Bank Transfer'
                      ? 'bg-[#063B32]/10 border-[#063B32] shadow-md'
                      : 'bg-white border-[#063B32]/10 hover:border-[#063B32]/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-[#071B2A] text-[#D8C7A1]">
                      <Building className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#10201F]">Bank Transfer / Virtual Account</h4>
                      <p className="text-[10px] text-[#10201F]/60">BCA, Mandiri, BNI, BRI Automatic Verification</p>
                    </div>
                  </div>
                  <input type="radio" checked={paymentMethod === 'Bank Transfer'} readOnly />
                </div>

                {/* E-WALLET */}
                <div 
                  onClick={() => setPaymentMethod('E-Wallet')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    paymentMethod === 'E-Wallet'
                      ? 'bg-[#063B32]/10 border-[#063B32] shadow-md'
                      : 'bg-white border-[#063B32]/10 hover:border-[#063B32]/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-[#B98262] text-white">
                      <Wallet className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#10201F]">E-Wallet Deep Link</h4>
                      <p className="text-[10px] text-[#10201F]/60">GoPay, ShopeePay, DANA Instant Checkout</p>
                    </div>
                  </div>
                  <input type="radio" checked={paymentMethod === 'E-Wallet'} readOnly />
                </div>

                {/* CASH ON DELIVERY */}
                <div 
                  onClick={() => setPaymentMethod('COD')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    paymentMethod === 'COD'
                      ? 'bg-[#063B32]/10 border-[#063B32] shadow-md'
                      : 'bg-white border-[#063B32]/10 hover:border-[#063B32]/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-[#063B32] text-[#D8C7A1]">
                      <Banknote className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#10201F]">Cash on Delivery (COD)</h4>
                      <p className="text-[10px] text-[#10201F]/60">Bayar tunai di tempat saat pesanan tiba</p>
                    </div>
                  </div>
                  <input type="radio" checked={paymentMethod === 'COD'} readOnly />
                </div>

              </div>

              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#063B32]/10">
                <button 
                  onClick={() => setStep(2)}
                  className="py-3.5 rounded-xl bg-gray-200 text-[#10201F] font-bold text-xs uppercase"
                >
                  Kembali
                </button>
                <button 
                  onClick={handleCreateOrder}
                  className="py-3.5 rounded-xl bg-[#063B32] text-[#D8C7A1] font-bold text-xs uppercase tracking-wider hover:bg-[#071B2A] border border-[#D8C7A1] flex items-center justify-center gap-2 shadow-lg"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>KONFIRMASI ORDER</span>
                </button>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* QRIS PAYMENT POPUP */}
      {isQRISOpen && createdOrder && (
        <QRISModal 
          totalAmount={createdOrder.total}
          orderId={createdOrder.id}
          onConfirm={() => {
            setIsQRISOpen(false);
            finalizeOrderProcess(createdOrder);
          }}
          onClose={() => setIsQRISOpen(false)}
        />
      )}

    </div>
  );
};
