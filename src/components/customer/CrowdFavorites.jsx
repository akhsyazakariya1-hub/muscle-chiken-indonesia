import React from 'react';
import { useApp } from '../../context/AppContext';
import { ProductCard } from './ProductCard';
import { Crown, Sparkles } from 'lucide-react';

export const CrowdFavorites = () => {
  const { products } = useApp();

  const bestSellers = products.filter(p => p.isBestSeller && p.isAvailable).slice(0, 4);

  if (bestSellers.length === 0) return null;

  return (
    <section id="best-sellers" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#071B2A] relative overflow-hidden">
      
      {/* BACKGROUND DECORATIONS */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#063B32]/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#D8C7A1]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-[#D8C7A1]/20 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#063B32] border border-[#D8C7A1]/40 text-[#D8C7A1] text-xs font-bold uppercase tracking-widest mb-3">
              <Crown className="w-3.5 h-3.5 text-[#D8C7A1]" />
              <span>MOST REQUESTED BY CULINARY ENTHUSIASTS</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#F7F3EA] tracking-tight">
              THE CROWD FAVORITES
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#F7F3EA]/70 max-w-md mt-4 md:mt-0 font-sans">
            Our highest rated gourmet creations, ordered repeatedly by fitness athletes, food critics, and chicken lovers.
          </p>
        </div>

        {/* BEST SELLERS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {bestSellers.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

      </div>
    </section>
  );
};
