import React from 'react';
import { useApp } from '../../context/AppContext';
import { useCart } from '../../context/CartContext';
import { Tag, ArrowRight, Gift, Sparkles } from 'lucide-react';

export const PromoBanners = () => {
  const { promotions, setActiveCategory, showToast } = useApp();
  const { applyVoucherCode } = useCart();

  const handleClaimPromo = (code) => {
    const res = applyVoucherCode(code);
    showToast(res.message, res.success ? 'success' : 'info');
    const el = document.getElementById('signature-menu');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="promotions" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#063B32] text-[#F7F3EA] relative overflow-hidden">
      
      {/* BACKGROUND SHIMMER & ACCENT LIGHTS */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#D8C7A1]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* HEADER */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#071B2A]/70 border border-[#D8C7A1]/40 text-[#D8C7A1] text-xs font-bold uppercase tracking-widest mb-3">
            <Gift className="w-3.5 h-3.5 text-[#D8C7A1]" />
            <span>EXCLUSIVE CULINARY OFFERS</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#F7F3EA] tracking-tight">
            POWER YOUR DAY WITH SPECIAL PROMOS
          </h2>

          <p className="text-xs sm:text-sm text-[#F7F3EA]/80 mt-3 font-sans">
            Nikmati diskon eksklusif dan penawaran hemat porsi hemat protein tinggi untuk pesanan Anda.
          </p>
        </div>

        {/* BANNER CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* BANNER 1: FIRST ORDER */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#071B2A] to-[#092C32] border border-[#D8C7A1]/40 p-8 sm:p-10 flex flex-col justify-between shadow-2xl group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#D8C7A1]/10 rounded-full blur-2xl group-hover:scale-125 transition-transform" />
            
            <div>
              <span className="px-3.5 py-1.5 rounded-full bg-[#D8C7A1] text-[#071B2A] text-xs font-extrabold uppercase tracking-widest inline-block mb-4">
                NEW MEMBER OFFER
              </span>
              <h3 className="font-serif text-3xl sm:text-4xl font-bold text-[#F7F3EA] mb-2 leading-tight">
                20% OFF YOUR FIRST ORDER
              </h3>
              <p className="text-xs sm:text-sm text-[#F7F3EA]/80 mb-6 font-sans">
                Gunakan kode <span className="text-[#D8C7A1] font-bold">GREATNESS20</span> saat checkout untuk potongan langsung hingga Rp 50.000.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-[#D8C7A1]/20">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#D8C7A1]" />
                <span className="font-mono text-sm font-bold text-[#D8C7A1]">KODE: GREATNESS20</span>
              </div>
              <button 
                onClick={() => handleClaimPromo('GREATNESS20')}
                className="px-6 py-3 rounded-xl bg-[#D8C7A1] text-[#071B2A] font-bold text-xs uppercase tracking-wider hover:bg-[#F7F3EA] transition-colors flex items-center gap-2 shadow-lg"
              >
                <span>KLAIM SEKARANG</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* BANNER 2: FAMILY FEAST */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#092C32] to-[#063B32] border border-[#D8C7A1]/40 p-8 sm:p-10 flex flex-col justify-between shadow-2xl group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#B98262]/20 rounded-full blur-2xl group-hover:scale-125 transition-transform" />
            
            <div>
              <span className="px-3.5 py-1.5 rounded-full bg-[#B98262] text-white text-xs font-extrabold uppercase tracking-widest inline-block mb-4">
                FAMILY & ATHLETE FEAST
              </span>
              <h3 className="font-serif text-3xl sm:text-4xl font-bold text-[#F7F3EA] mb-2 leading-tight">
                SAVE RP 35.000 ON BUNDLES
              </h3>
              <p className="text-xs sm:text-sm text-[#F7F3EA]/80 mb-6 font-sans">
                Nikmati porsi melimpah bersama keluarga & tim dengan kode <span className="text-[#D8C7A1] font-bold">MUSCLEFEAST</span>.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-[#D8C7A1]/20">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#D8C7A1]" />
                <span className="font-mono text-sm font-bold text-[#D8C7A1]">KODE: MUSCLEFEAST</span>
              </div>
              <button 
                onClick={() => handleClaimPromo('MUSCLEFEAST')}
                className="px-6 py-3 rounded-xl bg-[#D8C7A1] text-[#071B2A] font-bold text-xs uppercase tracking-wider hover:bg-[#F7F3EA] transition-colors flex items-center gap-2 shadow-lg"
              >
                <span>KLAIM SEKARANG</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
