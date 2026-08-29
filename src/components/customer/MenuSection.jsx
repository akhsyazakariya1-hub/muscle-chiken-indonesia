import React from 'react';
import { useApp } from '../../context/AppContext';
import { INITIAL_CATEGORIES } from '../../data/initialData';
import { ProductCard } from './ProductCard';
import { Sparkles, Utensils } from 'lucide-react';

export const MenuSection = () => {
  const { products, activeCategory, setActiveCategory } = useApp();

  const filteredProducts = activeCategory === 'all' 
    ? products.filter(p => p.isAvailable) 
    : products.filter(p => p.category === activeCategory && p.isAvailable);

  return (
    <section id="signature-menu" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#F5F1E8]">
      <div className="max-w-7xl mx-auto">
        
        {/* SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#063B32]/10 border border-[#063B32]/20 text-[#063B32] text-xs font-bold uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#B98262]" />
            <span>EXCLUSIVITY IN EVERY BITE</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#10201F] tracking-tight mb-4">
            OUR SIGNATURE MENU
          </h2>

          <p className="text-sm sm:text-base text-[#10201F]/70 font-sans leading-relaxed">
            Crafted for those who expect more from every bite. Each recipe engineered for peak taste and optimal nutrition.
          </p>
        </div>

        {/* CATEGORY FILTER TABS */}
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-4 mb-10 no-scrollbar scroll-smooth justify-start md:justify-center">
          {INITIAL_CATEGORIES.map(cat => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-3 rounded-full text-xs font-bold tracking-wider uppercase whitespace-nowrap transition-all duration-300 flex items-center gap-2 border ${
                  isActive 
                    ? 'bg-[#063B32] text-[#D8C7A1] border-[#D8C7A1] shadow-lg scale-105' 
                    : 'bg-[#E8E5DC] text-[#10201F]/80 border-[#063B32]/10 hover:bg-[#071B2A] hover:text-[#F7F3EA] hover:border-[#D8C7A1]'
                }`}
              >
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* PRODUCT GRID */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center bg-[#E8E5DC]/50 rounded-3xl border border-[#063B32]/10 max-w-md mx-auto">
            <Utensils className="w-12 h-12 text-[#063B32]/40 mx-auto mb-3" />
            <h3 className="font-serif text-xl font-bold text-[#10201F]">Menu Belum Tersedia</h3>
            <p className="text-xs text-[#10201F]/60 mt-1">Silakan pilih kategori lainnya.</p>
          </div>
        )}

      </div>
    </section>
  );
};
