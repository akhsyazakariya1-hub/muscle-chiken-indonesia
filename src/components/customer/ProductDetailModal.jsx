import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useCart } from '../../context/CartContext';
import { X, Star, Flame, Plus, Minus, ShoppingBag, Check, Award, Sparkles } from 'lucide-react';

export const ProductDetailModal = () => {
  const { selectedProduct, setSelectedProduct, products, showToast, setIsCheckoutOpen } = useApp();
  const { addToCart } = useCart();

  if (!selectedProduct) return null;

  const [activeImage, setActiveImage] = useState(selectedProduct.image);
  const [selectedSauce, setSelectedSauce] = useState(selectedProduct.availableSauces?.[0] || '');
  const [spicyLevel, setSpicyLevel] = useState(selectedProduct.spicyLevel || 0);
  const [quantity, setQuantity] = useState(1);

  const formattedPrice = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(selectedProduct.discountPrice || selectedProduct.price);

  // Recommended items
  const frequentlyOrderedTogether = products.filter(p => 
    selectedProduct.frequentlyOrderedTogetherIds?.includes(p.id)
  );

  const handleAddToCart = () => {
    addToCart(selectedProduct, {
      sauce: selectedSauce,
      spicyLevel,
      quantity
    });
    showToast(`${selectedProduct.name} ditambahkan ke Keranjang!`, 'success');
    setSelectedProduct(null);
  };

  const handleBuyNow = () => {
    addToCart(selectedProduct, {
      sauce: selectedSauce,
      spicyLevel,
      quantity
    });
    setSelectedProduct(null);
    setIsCheckoutOpen(true);
  };

  const handleAddBundle = (bundleItem) => {
    addToCart(bundleItem, { quantity: 1 });
    showToast(`${bundleItem.name} ditambahkan ke Keranjang!`, 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-[#071B2A]/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl rounded-3xl bg-[#F5F1E8] border border-[#D8C7A1]/40 shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col md:flex-row">
        
        {/* CLOSE BUTTON */}
        <button 
          onClick={() => setSelectedProduct(null)}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-[#071B2A]/70 text-[#F7F3EA] hover:bg-[#063B32] hover:text-[#D8C7A1] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* LEFT COLUMN: IMAGE GALLERY */}
        <div className="w-full md:w-1/2 bg-[#071B2A] p-6 flex flex-col justify-between">
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden mb-4 border border-[#D8C7A1]/20">
            <img 
              src={activeImage} 
              alt={selectedProduct.name}
              className="w-full h-full object-cover object-center"
            />
            {selectedProduct.badge && (
              <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#063B32] border border-[#D8C7A1] text-xs font-bold text-[#D8C7A1] uppercase tracking-wider">
                {selectedProduct.badge}
              </span>
            )}
          </div>

          {/* GALLERY THUMBNAILS */}
          {selectedProduct.gallery && selectedProduct.gallery.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {selectedProduct.gallery.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    activeImage === img ? 'border-[#D8C7A1] scale-105' : 'border-transparent opacity-60'
                  }`}
                >
                  <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: DETAILS & OPTIONS */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 overflow-y-auto max-h-[85vh] flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="mb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-[#B98262]">
                {selectedProduct.category}
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#10201F] mt-1 leading-tight">
                {selectedProduct.name}
              </h2>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-1 text-xs font-bold text-[#063B32]">
                  <Star className="w-4 h-4 fill-[#D8C7A1] text-[#D8C7A1]" />
                  <span>{selectedProduct.rating}</span>
                  <span className="text-[#10201F]/50 font-normal">({selectedProduct.reviewCount} ulasan)</span>
                </div>
                <span className="text-[#10201F]/30">•</span>
                <span className="text-xs font-semibold text-[#063B32]">SKU: {selectedProduct.sku}</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-[#10201F]/80 leading-relaxed mb-6 font-sans">
              {selectedProduct.description}
            </p>

            {/* Nutrition Facts Badge */}
            {selectedProduct.nutrition && (
              <div className="p-3.5 rounded-2xl bg-[#E8E5DC] border border-[#063B32]/10 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#063B32] flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-[#B98262]" />
                    NUTRITION PROFILE
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  <div className="p-2 rounded-xl bg-white/70">
                    <span className="block text-[10px] text-[#10201F]/60">Kalori</span>
                    <span className="font-bold text-[#10201F] text-xs">{selectedProduct.nutrition.calories}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white/70">
                    <span className="block text-[10px] text-[#10201F]/60">Protein</span>
                    <span className="font-bold text-[#063B32] text-xs">{selectedProduct.nutrition.protein}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white/70">
                    <span className="block text-[10px] text-[#10201F]/60">Karbo</span>
                    <span className="font-bold text-[#10201F] text-xs">{selectedProduct.nutrition.carbs}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white/70">
                    <span className="block text-[10px] text-[#10201F]/60">Lemak</span>
                    <span className="font-bold text-[#10201F] text-xs">{selectedProduct.nutrition.fat}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Sauce Selection */}
            {selectedProduct.availableSauces && selectedProduct.availableSauces.length > 0 && (
              <div className="mb-6">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#10201F] mb-2">
                  PIHAN SAUS SIGNATURE:
                </label>
                <div className="flex flex-wrap gap-2">
                  {selectedProduct.availableSauces.map(sauce => (
                    <button
                      key={sauce}
                      onClick={() => setSelectedSauce(sauce)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border ${
                        selectedSauce === sauce 
                          ? 'bg-[#063B32] text-[#D8C7A1] border-[#D8C7A1] shadow-md' 
                          : 'bg-[#E8E5DC] text-[#10201F]/80 border-[#063B32]/10 hover:bg-[#071B2A] hover:text-[#F7F3EA]'
                      }`}
                    >
                      {sauce}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Spicy Level Selector */}
            {selectedProduct.spicyLevel > 0 && (
              <div className="mb-6">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#10201F] mb-2">
                  LEVEL KEPEDASAN:
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map(lvl => (
                    <button
                      key={lvl}
                      onClick={() => setSpicyLevel(lvl)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all border ${
                        spicyLevel === lvl 
                          ? 'bg-[#B98262] text-white border-red-500 shadow-md' 
                          : 'bg-[#E8E5DC] text-[#10201F]/70 border-[#063B32]/10'
                      }`}
                    >
                      <Flame className="w-3.5 h-3.5" />
                      <span>Lvl {lvl}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Frequently Ordered Together (Smart Recommendation) */}
            {frequentlyOrderedTogether.length > 0 && (
              <div className="mb-6 pt-4 border-t border-[#063B32]/10">
                <span className="text-xs font-bold uppercase tracking-wider text-[#063B32] flex items-center gap-1 mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-[#B98262]" />
                  FREQUENTLY ORDERED TOGETHER
                </span>
                <div className="space-y-2">
                  {frequentlyOrderedTogether.map(rec => (
                    <div key={rec.id} className="flex items-center justify-between p-2.5 rounded-xl bg-[#E8E5DC]/80 border border-[#063B32]/10">
                      <div className="flex items-center gap-3">
                        <img src={rec.image} alt={rec.name} className="w-10 h-10 rounded-lg object-cover" />
                        <div>
                          <p className="text-xs font-bold text-[#10201F]">{rec.name}</p>
                          <p className="text-[10px] text-[#063B32] font-semibold">Rp {(rec.discountPrice || rec.price).toLocaleString('id-ID')}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleAddBundle(rec)}
                        className="px-3 py-1.5 rounded-lg bg-[#063B32] text-[#D8C7A1] text-[11px] font-bold hover:bg-[#071B2A] transition-colors"
                      >
                        + Add
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* FOOTER ACTIONS: QUANTITY & BUY BUTTONS */}
          <div className="pt-4 border-t border-[#063B32]/15 mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-[#10201F]/60">TOTAL PRICE</span>
                <p className="font-serif text-2xl font-bold text-[#063B32]">
                  {formattedPrice}
                </p>
              </div>

              {/* Quantity Counter */}
              <div className="flex items-center gap-3 bg-[#E8E5DC] p-1.5 rounded-xl border border-[#063B32]/10">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-1.5 rounded-lg bg-white text-[#10201F] hover:bg-[#063B32] hover:text-[#D8C7A1] transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center text-sm font-bold text-[#10201F]">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-1.5 rounded-lg bg-white text-[#10201F] hover:bg-[#063B32] hover:text-[#D8C7A1] transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleAddToCart}
                className="py-3.5 px-4 rounded-xl bg-[#063B32] text-[#D8C7A1] font-bold text-xs uppercase tracking-wider hover:bg-[#071B2A] border border-[#D8C7A1]/60 transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <ShoppingBag className="w-4 h-4 text-[#D8C7A1]" />
                <span>ADD TO CART</span>
              </button>

              <button
                onClick={handleBuyNow}
                className="py-3.5 px-4 rounded-xl bg-[#D8C7A1] text-[#071B2A] font-bold text-xs uppercase tracking-wider hover:bg-[#F7F3EA] border border-[#D8C7A1] transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <span>BUY NOW</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
