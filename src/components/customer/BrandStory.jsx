import React from 'react';
import { ShieldCheck, Flame, Award, HeartHandshake, CheckCircle2 } from 'lucide-react';

export const BrandStory = () => {
  return (
    <section id="brand-story" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#F5F1E8] relative overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        
        {/* LEFT COLUMN: EDITORIAL PHOTO MASHUP */}
        <div className="relative">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-[#D8C7A1]/40 aspect-[4/5]">
            <img 
              src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1000&auto=format&fit=crop" 
              alt="Gourmet Kitchen Prep"
              className="w-full h-full object-cover object-center filter brightness-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#071B2A]/90 via-transparent to-transparent" />
            
            {/* Overlay Badge */}
            <div className="absolute bottom-6 left-6 right-6 p-6 rounded-2xl bg-[#063B32]/90 backdrop-blur-md border border-[#D8C7A1]/40 text-[#F7F3EA]">
              <p className="font-serif text-lg font-bold text-[#D8C7A1] mb-1 italic">
                "We don't compromise on fuel for the human body."
              </p>
              <p className="text-xs text-[#F7F3EA]/80 font-sans">
                — Head Culinary Master, Muscle Chicken Indonesia
              </p>
            </div>
          </div>

          {/* FLOATING MINI PHOTO */}
          <div className="hidden sm:block absolute -bottom-8 -right-8 w-48 h-48 rounded-2xl overflow-hidden shadow-2xl border-4 border-[#F5F1E8]">
            <img 
              src="https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?q=80&w=600&auto=format&fit=crop" 
              alt="Artisan Charcoal Grill"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* RIGHT COLUMN: BRAND PHILOSOPHY & OUR STANDARD */}
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#063B32]/10 border border-[#063B32]/20 text-[#063B32] text-xs font-bold uppercase tracking-widest">
            <HeartHandshake className="w-3.5 h-3.5 text-[#B98262]" />
            <span>THE MUSCLE CHICKEN MANIFESTO</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#10201F] leading-tight">
            Crafted For Greatness. <br />
            <span className="italic font-serif text-[#063B32]">Not Just Another Chicken Joint.</span>
          </h2>

          <p className="text-sm sm:text-base text-[#10201F]/80 leading-relaxed font-sans">
            Muscle Chicken Indonesia lahir dari standar tanpa kompromi. Kami menggabungkan kenikmatan kuliner gourmet kelas tinggi dengan kebutuhan gaya hidup aktif dan nutrisi optimal.
          </p>

          <p className="text-xs sm:text-sm text-[#10201F]/70 leading-relaxed font-sans">
            Setiap porsi dibuat segar dari ayam bebas hormon, dimarinasi 24 jam dengan 18 rempah alami pilihan, dan dimasak dengan teknik presisi tinggi agar nutrisi protein tetap terjaga sempurna.
          </p>

          {/* OUR STANDARD GRID */}
          <div className="pt-6 border-t border-[#063B32]/15">
            <h3 className="font-serif text-xl font-bold text-[#063B32] mb-4">OUR STANDARD</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#E8E5DC] border border-[#063B32]/10">
                <CheckCircle2 className="w-5 h-5 text-[#063B32] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-[#10201F] uppercase tracking-wider">Premium Ingredients</h4>
                  <p className="text-[11px] text-[#10201F]/70 mt-0.5">Ayam segar pilihan tanpa bahan pengawet sintesis.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#E8E5DC] border border-[#063B32]/10">
                <CheckCircle2 className="w-5 h-5 text-[#063B32] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-[#10201F] uppercase tracking-wider">Fresh Preparation</h4>
                  <p className="text-[11px] text-[#10201F]/70 mt-0.5">Dimasak langsung saat pesanan Anda dikonfirmasi.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#E8E5DC] border border-[#063B32]/10">
                <CheckCircle2 className="w-5 h-5 text-[#063B32] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-[#10201F] uppercase tracking-wider">Quality Control</h4>
                  <p className="text-[11px] text-[#10201F]/70 mt-0.5">Standar kebersihan & suhu dapur bersertifikasi.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#E8E5DC] border border-[#063B32]/10">
                <CheckCircle2 className="w-5 h-5 text-[#063B32] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-[#10201F] uppercase tracking-wider">Bold Flavors</h4>
                  <p className="text-[11px] text-[#10201F]/70 mt-0.5">Racikan 18 bumbu rahasia bernuansa harum & gurih.</p>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
