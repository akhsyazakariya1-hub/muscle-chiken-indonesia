import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { dbService } from '../../services/db';
import { buildWhatsAppOrderMessage } from '../../services/whatsapp';
import { StructuredAddressForm } from '../ui/StructuredAddressForm';
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

  // Customer Contact Fields
  const [name, setName] = useState(user?.name || '');
  const [whatsapp, setWhatsapp] = useState(user?.whatsapp || '');
  const [notes, setNotes] = useState('');

  // Structured Address State
  const [structuredAddress, setStructuredAddress] = useState(user?.structuredAddress || {
    provinceId: '33',
    provinceName: 'Jawa Tengah',
    cityId: '3329',
    cityName: 'Kabupaten Brebes',
    districtId: '332904',
    districtName: 'Ketanggungan',
    villageId: '3329042001',
    villageName: 'Ketanggungan',
    street: '',
    houseNumber: '',
    postalCode: '52263',
    additionalDetails: '',
    latitude: null,
    longitude: null
  });

  const [addressErrors, setAddressErrors] = useState({});

  // Payment Selection
  const [paymentMethod, setPaymentMethod] = useState('QRIS');
  const [isQRISOpen, setIsQRISOpen] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);

  if (!isCheckoutOpen) return null;

  const formatRupiah = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);

  const validateAddress = () => {
    const errors = {};
    if (!name.trim()) errors.name = 'Please enter your name.';
    if (!whatsapp.trim()) errors.whatsapp = 'Please enter your WhatsApp phone number.';

    if (deliveryType === 'DELIVERY') {
      if (!structuredAddress.provinceId) errors.province = 'Please select your province.';
      if (!structuredAddress.cityId) errors.city = 'Please select your city/regency.';
      if (!structuredAddress.districtId) errors.district = 'Please select your district.';
      if (!structuredAddress.villageId) errors.village = 'Please select your village.';
      if (!structuredAddress.street?.trim()) errors.street = 'Please enter your street.';
      if (!structuredAddress.houseNumber?.trim()) errors.houseNumber = 'Please enter your house number.';
    }

    setAddressErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleStep1Next = (e) => {
    e.preventDefault();
    if (!validateAddress()) {
      showToast('Please fix the errors in the delivery form.', 'error');
      return;
    }

    // Auto save customer session details
    loginCustomer(name, whatsapp, structuredAddress.formattedAddress);
    setStep(2);
  };

  const handleCreateOrder = () => {
    if (cartItems.length === 0) return;

    const orderData = {
      customerName: name,
      whatsapp,
      structured_address: deliveryType === 'DELIVERY' ? structuredAddress : null,
      address: deliveryType === 'DELIVERY' ? structuredAddress.formattedAddress : 'PICKUP AT STORE (SCBD Lot 28)',
      latitude: deliveryType === 'DELIVERY' ? structuredAddress.latitude : null,
      longitude: deliveryType === 'DELIVERY' ? structuredAddress.longitude : null,
      deliveryType,
      items: cartItems.map(i => ({
        id: i.id,
        name: i.name,
        price: i.price,
        discountPrice: i.discountPrice || null,
        quantity: i.quantity,
        sauce: i.sauce,
        spicyLevel: i.spicyLevel,
        sku: i.sku
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
    showToast(`Order #${order.id} successfully created!`, 'success');
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
            <span>Structured Address</span>
          </div>
          <span className="text-gray-300">•</span>
          <div className={`flex items-center gap-1.5 ${step >= 2 ? 'text-[#063B32]' : 'text-gray-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 2 ? 'bg-[#063B32] text-[#D8C7A1]' : 'bg-gray-300'}`}>2</span>
            <span>Summary</span>
          </div>
          <span className="text-gray-300">•</span>
          <div className={`flex items-center gap-1.5 ${step >= 3 ? 'text-[#063B32]' : 'text-gray-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 3 ? 'bg-[#063B32] text-[#D8C7A1]' : 'bg-gray-300'}`}>3</span>
            <span>Payment</span>
          </div>
        </div>

        {/* STEP CONTENT BODY */}
        <div className="p-6 overflow-y-auto flex-1">
          
          {/* STEP 1: DELIVERY ADDRESS & CONTACT DETAILS */}
          {step === 1 && (
            <form onSubmit={handleStep1Next} className="space-y-4">
              
              {/* Delivery vs Pickup Toggle */}
              <div className="grid grid-cols-2 gap-3 mb-2">
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

              {/* CONTACT DETAILS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#063B32] mb-1">FULL NAME *</label>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    placeholder="Enter customer full name..."
                    className="w-full p-2.5 rounded-xl bg-white border border-[#063B32]/20 text-xs focus:outline-none focus:border-[#063B32]"
                  />
                  {addressErrors.name && <p className="text-[10px] text-red-600 font-bold mt-0.5">{addressErrors.name}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#063B32] mb-1">WHATSAPP PHONE *</label>
                  <input 
                    type="tel" 
                    value={whatsapp} 
                    onChange={(e) => setWhatsapp(e.target.value)} 
                    placeholder="e.g. 081234567890"
                    className="w-full p-2.5 rounded-xl bg-white border border-[#063B32]/20 text-xs focus:outline-none focus:border-[#063B32]"
                  />
                  {addressErrors.whatsapp && <p className="text-[10px] text-red-600 font-bold mt-0.5">{addressErrors.whatsapp}</p>}
                </div>
              </div>

              {/* STRUCTURED ADDRESS OR PICKUP STORE */}
              {deliveryType === 'DELIVERY' ? (
                <div className="p-4 rounded-2xl bg-white/70 border border-[#063B32]/15 space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#063B32] block border-b pb-1">
                    STRUCTURED ADMINISTRATIVE ADDRESS (INDONESIA)
                  </span>
                  <StructuredAddressForm
                    value={structuredAddress}
                    onChange={(updated) => setStructuredAddress(updated)}
                    errors={addressErrors}
                  />
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-[#063B32]/10 border border-[#063B32]/20 text-xs text-[#063B32]">
                  <p className="font-bold uppercase tracking-wider">STORE PICKUP LOCATION:</p>
                  <p className="mt-1">Muscle Chicken SCBD Flagship Store — SCBD Lot 28, Jl. Jend. Sudirman No.52, Kebayoran Baru, Jakarta Selatan</p>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase text-[#063B32] mb-1">SPECIAL KITCHEN NOTES (OPTIONAL)</label>
                <input 
                  type="text" 
                  value={notes} 
                  onChange={(e) => setNotes(e.target.value)} 
                  placeholder="e.g. Separate chili sauce / Extra crispy coating"
                  className="w-full p-2.5 rounded-xl bg-white border border-[#063B32]/20 text-xs focus:outline-none focus:border-[#063B32]"
                />
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3 rounded-xl bg-[#063B32] text-[#D8C7A1] text-xs font-bold uppercase tracking-wider hover:bg-[#071B2A] transition-all flex items-center justify-center gap-2 shadow-md"
                >
                  <span>CONTINUE TO ORDER SUMMARY</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: SUMMARY */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white border border-[#063B32]/10 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#063B32] block border-b pb-1">
                  DELIVERY RECIPIENT SUMMARY
                </span>
                <p className="text-xs"><strong>Name:</strong> {name}</p>
                <p className="text-xs"><strong>WhatsApp:</strong> {whatsapp}</p>
                <p className="text-xs"><strong>Address:</strong> {deliveryType === 'DELIVERY' ? structuredAddress.formattedAddress : 'PICKUP AT SCBD STORE'}</p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#063B32]/10 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#063B32] block border-b pb-1">
                  CART ITEMS ({cartItems.length})
                </span>
                <div className="divide-y divide-[#063B32]/10">
                  {cartItems.map(item => (
                    <div key={item.id} className="py-2 flex justify-between items-center text-xs">
                      <div>
                        <p className="font-bold text-[#10201F]">{item.name}</p>
                        <p className="text-gray-500">{formatRupiah(item.price)} x {item.quantity}</p>
                      </div>
                      <p className="font-bold text-[#063B32]">{formatRupiah(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#E8E5DC] text-xs space-y-1.5 font-bold text-[#063B32]">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatRupiah(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee:</span>
                  <span>{formatRupiah(deliveryType === 'DELIVERY' ? deliveryFee : 0)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-800">
                    <span>Discount:</span>
                    <span>-{formatRupiah(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-serif border-t border-[#063B32]/10 pt-2 text-[#063B32]">
                  <span>TOTAL FEAST:</span>
                  <span>{formatRupiah(deliveryType === 'DELIVERY' ? grandTotal : Math.max(0, subtotal - discountAmount))}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 rounded-xl bg-gray-200 text-[#10201F] text-xs font-bold"
                >
                  BACK
                </button>

                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-8 py-3 rounded-xl bg-[#063B32] text-[#D8C7A1] text-xs font-bold uppercase tracking-wider hover:bg-[#071B2A] transition-all flex items-center justify-center gap-2 shadow-md"
                >
                  <span>SELECT PAYMENT METHOD</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PAYMENT METHOD */}
          {step === 3 && (
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#063B32] block">
                CHOOSE PAYMENT METHOD
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'QRIS', label: 'QRIS Instant', icon: QrCode, desc: 'GoPay, OVO, ShopeePay, BCA' },
                  { id: 'BANK_TRANSFER', label: 'Bank Transfer', icon: CreditCard, desc: 'BCA / Mandiri / BNI' },
                  { id: 'COD', label: 'Cash On Delivery', icon: Banknote, desc: 'Pay directly to courier' }
                ].map(pm => {
                  const IconComp = pm.icon;
                  const isSelected = paymentMethod === pm.id;
                  return (
                    <button
                      key={pm.id}
                      type="button"
                      onClick={() => setPaymentMethod(pm.id)}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        isSelected 
                          ? 'bg-[#063B32] text-[#D8C7A1] border-[#D8C7A1] shadow-lg' 
                          : 'bg-white text-[#10201F] border-[#063B32]/10 hover:border-[#063B32]/30'
                      }`}
                    >
                      <IconComp className={`w-5 h-5 mb-2 ${isSelected ? 'text-[#D8C7A1]' : 'text-[#063B32]'}`} />
                      <p className="font-bold text-xs">{pm.label}</p>
                      <p className={`text-[10px] mt-0.5 ${isSelected ? 'text-[#F7F3EA]/80' : 'text-gray-500'}`}>{pm.desc}</p>
                    </button>
                  );
                })}
              </div>

              <div className="p-4 rounded-2xl bg-[#063B32]/10 border border-[#063B32]/20 flex items-center justify-between text-xs">
                <span className="font-bold text-[#063B32]">TOTAL TO PAY:</span>
                <span className="font-serif font-bold text-lg text-[#063B32]">
                  {formatRupiah(deliveryType === 'DELIVERY' ? grandTotal : Math.max(0, subtotal - discountAmount))}
                </span>
              </div>

              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2.5 rounded-xl bg-gray-200 text-[#10201F] text-xs font-bold"
                >
                  BACK
                </button>

                <button
                  type="button"
                  onClick={handleCreateOrder}
                  className="px-8 py-3 rounded-xl bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider hover:bg-emerald-800 transition-all flex items-center justify-center gap-2 shadow-xl"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>PLACE ORDER & CONFIRM</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* QRIS MODAL IF SELECTED */}
      {isQRISOpen && createdOrder && (
        <QRISModal
          order={createdOrder}
          onClose={() => {
            setIsQRISOpen(false);
            finalizeOrderProcess(createdOrder);
          }}
        />
      )}
    </div>
  );
};
