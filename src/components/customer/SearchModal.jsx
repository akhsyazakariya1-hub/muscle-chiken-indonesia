import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Search, Utensils, Flame, Sparkles } from 'lucide-react';

export const SearchModal = () => {
  const { isSearchOpen, setIsSearchOpen, products, setSelectedProduct, setActiveCategory } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  if (!isSearchOpen) return null;

  const filteredProducts = searchQuery.trim() === '' 
    ? [] 
    : products.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-20 bg-[#071B2A]/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#F5F1E8] border border-[#D8C7A1]/50 shadow-2xl p-6 space-y-6">
        
        {/* CLOSE BUTTON */}
        <button 
          onClick={() => setIsSearchOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-full text-[#10201F]/60 hover:text-[#063B32]"
        >
          <X className="w-5 h-5" />
        </button>

        {/* SEARCH INPUT BAR */}
        <div className="relative pt-2">
          <Search className="w-6 h-6 text-[#063B32] absolute left-4 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari menu, rasa pedas, burger, atau rice bowl..."
            autoFocus
            className="w-full pl-14 pr-4 py-4 rounded-2xl bg-white border border-[#063B32]/20 text-base font-medium focus:outline-none focus:border-[#063B32] shadow-inner"
          />
        </div>

        {/* AUTOCOMPLETE SUGGESTIONS / QUICK TAGS */}
        {searchQuery === '' && (
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#B98262] block mb-2">PENCARIAN POPULER:</span>
            <div className="flex flex-wrap gap-2">
              {['Crispy', 'Charcoal Grilled', 'Hot Volcano', 'Titan Burger', 'Protein Bowl', 'Truffle Fries'].map(tag => (
                <button
                  key={tag}
                  onClick={() => setSearchQuery(tag)}
                  className="px-3.5 py-1.5 rounded-full bg-[#E8E5DC] text-xs font-semibold text-[#063B32] hover:bg-[#063B32] hover:text-[#D8C7A1] transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* SEARCH RESULTS */}
        {searchQuery !== '' && (
          <div className="max-h-80 overflow-y-auto divide-y divide-[#063B32]/10 space-y-2">
            {filteredProducts.length > 0 ? (
              filteredProducts.map(prod => (
                <div 
                  key={prod.id} 
                  onClick={() => {
                    setIsSearchOpen(false);
                    setSelectedProduct(prod);
                  }}
                  className="p-3 rounded-2xl hover:bg-[#E8E5DC] transition-colors cursor-pointer flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <img src={prod.image} alt={prod.name} className="w-12 h-12 rounded-xl object-cover" />
                    <div>
                      <h4 className="font-serif text-sm font-bold text-[#10201F]">{prod.name}</h4>
                      <p className="text-[10px] text-[#B98262] uppercase font-semibold">{prod.subtitle}</p>
                    </div>
                  </div>

                  <span className="font-serif font-bold text-sm text-[#063B32]">
                    Rp {(prod.discountPrice || prod.price).toLocaleString('id-ID')}
                  </span>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-[#10201F]/60">
                <Utensils className="w-10 h-10 text-[#063B32]/30 mx-auto mb-2" />
                <p className="text-sm">Tidak ada menu yang cocok dengan "{searchQuery}".</p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
