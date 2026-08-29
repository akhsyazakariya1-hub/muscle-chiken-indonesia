import React from 'react';
import { useApp } from '../../context/AppContext';
import { useCart } from '../../context/CartContext';
import { Star, Flame, Eye, Plus, Heart, Check } from 'lucide-react';

export const ProductCard = ({ product }) => {
  const { setSelectedProduct, toggleFavorite, favorites, showToast } = useApp();
  const { addToCart, cartItems } = useCart();

  const isFav = favorites.includes(product.id);
  const formattedPrice = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(product.discountPrice || product.price);
  const formattedOriginalPrice = product.discountPrice ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(product.price) : null;

  // Check if already in cart
  const inCartCount = cartItems.filter(i => i.id === product.id).reduce((sum, i) => sum + i.quantity, 0);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product, { quantity: 1 });
    showToast(`${product.name} telah ditambahkan ke Keranjang!`, 'success');
  };

  return (
    <div 
      onClick={() => setSelectedProduct(product)}
      className="group relative rounded-2xl bg-[#F5F1E8] border border-[#063B32]/10 hover:border-[#D8C7A1] overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between cursor-pointer"
    >
      {/* IMAGE CONTAINER WITH HOVER ZOOM */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#071B2A]">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#071B2A]/80 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

        {/* TOP BADGES */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
          {product.badge ? (
            <span className="px-2.5 py-1 rounded-full bg-[#063B32]/90 border border-[#D8C7A1]/50 backdrop-blur-md text-[10px] font-bold tracking-wider text-[#D8C7A1] uppercase shadow-md">
              {product.badge}
            </span>
          ) : <div />}

          {/* FAVORITE BUTTON */}
          <button 
            onClick={(e) => { e.stopPropagation(); toggleFavorite(product.id); }}
            className={`p-2 rounded-full backdrop-blur-md transition-all ${
              isFav 
                ? 'bg-red-600 text-white shadow-lg scale-110' 
                : 'bg-[#071B2A]/60 text-[#F7F3EA] hover:bg-[#063B32] hover:text-[#D8C7A1]'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* QUICK VIEW HOVER OVERLAY BUTTON */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[#071B2A]/40 backdrop-blur-xs">
          <button 
            onClick={(e) => { e.stopPropagation(); setSelectedProduct(product); }}
            className="px-4 py-2 rounded-xl bg-[#F7F3EA] text-[#071B2A] text-xs font-bold tracking-wider flex items-center gap-2 shadow-xl hover:bg-[#D8C7A1] transition-colors transform translate-y-2 group-hover:translate-y-0 transition-transform"
          >
            <Eye className="w-4 h-4 text-[#063B32]" />
            <span>QUICK VIEW</span>
          </button>
        </div>

        {/* SPICY LEVEL INDICATOR */}
        {product.spicyLevel > 0 && (
          <div className="absolute bottom-3 left-3 flex items-center gap-0.5 bg-[#071B2A]/80 border border-[#D8C7A1]/30 backdrop-blur-md px-2 py-0.5 rounded-full text-xs">
            {Array.from({ length: Math.min(product.spicyLevel, 5) }).map((_, i) => (
              <Flame key={i} className="w-3 h-3 text-[#B98262] fill-[#B98262]" />
            ))}
          </div>
        )}

        {/* RATING */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-[#071B2A]/80 border border-[#D8C7A1]/30 backdrop-blur-md px-2.5 py-0.5 rounded-full text-xs font-semibold text-[#D8C7A1]">
          <Star className="w-3.5 h-3.5 fill-[#D8C7A1] text-[#D8C7A1]" />
          <span>{product.rating}</span>
        </div>
      </div>

      {/* CARD BODY CONTENT */}
      <div className="p-5 flex-1 flex flex-col justify-between bg-gradient-to-b from-[#F5F1E8] to-[#E8E5DC]">
        <div>
          <h3 className="font-serif text-xl font-bold text-[#10201F] group-hover:text-[#063B32] transition-colors leading-snug line-clamp-1 mb-1">
            {product.name}
          </h3>
          <p className="text-xs font-medium text-[#B98262] uppercase tracking-wider mb-2">
            {product.subtitle}
          </p>
          <p className="text-xs text-[#10201F]/70 leading-relaxed line-clamp-2 mb-4">
            {product.description}
          </p>
        </div>

        {/* FOOTER AREA: PRICE & ADD TO CART */}
        <div className="pt-3 border-t border-[#063B32]/10 flex items-center justify-between mt-2">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-xl font-bold text-[#063B32]">
                {formattedPrice}
              </span>
              {formattedOriginalPrice && (
                <span className="text-xs text-[#10201F]/50 line-through">
                  {formattedOriginalPrice}
                </span>
              )}
            </div>
            
            {/* Stock indicator */}
            <div className="mt-0.5 text-[10px] font-semibold text-[#063B32]/70">
              {product.stock <= product.lowStockThreshold ? (
                <span className="text-amber-700">Tersisa {product.stock} porsi</span>
              ) : (
                <span>Ready to Cook</span>
              )}
            </div>
          </div>

          <button 
            onClick={handleAddToCart}
            className={`p-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 shadow-md ${
              inCartCount > 0
                ? 'bg-[#063B32] text-[#D8C7A1] border border-[#D8C7A1]'
                : 'bg-[#071B2A] text-[#F7F3EA] hover:bg-[#063B32] hover:text-[#D8C7A1] border border-[#071B2A]'
            }`}
            title="Tambah ke Keranjang"
          >
            {inCartCount > 0 ? (
              <>
                <Check className="w-4 h-4 text-[#D8C7A1]" />
                <span className="text-xs font-bold">{inCartCount}</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span className="text-xs font-bold hidden sm:inline">ADD</span>
              </>
            )}
          </button>
        </div>
      </div>

    </div>
  );
};
