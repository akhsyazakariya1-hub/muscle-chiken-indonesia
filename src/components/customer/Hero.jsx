import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, ArrowRight, ShieldCheck, Flame, Award } from 'lucide-react';

export const Hero = () => {
  const { heroConfig, setActiveCategory } = useApp();

  const scrollToMenu = () => {
    setActiveCategory('all');
    const el = document.getElementById('signature-menu');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-[#071B2A]">
      
      {/* BACKGROUND IMAGE WITH CINEMATIC SLOW ZOOM */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroConfig.bgImageUrl || "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?q=80&w=1600&auto=format&fit=crop"} 
          alt="Muscle Chicken Culinary Masterpiece"
          className="w-full h-full object-cover object-center animate-slow-zoom scale-105 filter brightness-75 contrast-110"
        />
        
        {/* LUXURY GRADIENT OVERLAY (DEEP EMERALD & OBSIDIAN BLUE TRANSLUCENT) */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#071B2A] via-[#063B32]/70 to-[#071B2A]/60" />
        <div className="absolute inset-0 bg-radial from-transparent via-[#063B32]/40 to-[#071B2A]" />
      </div>

      {/* FLOATING LUXURY PARTICLES DECORATION */}
      <div className="absolute top-1/4 left-10 w-72 h-72 rounded-full bg-[#D8C7A1]/10 blur-3xl pointer-events-none animate-float" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 rounded-full bg-[#063B32]/40 blur-3xl pointer-events-none" />

      {/* HERO CONTENT CONTAINER */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24 pb-16 flex flex-col items-center">
        
        {/* BRAND BADGE */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#063B32]/80 border border-[#D8C7A1]/40 backdrop-blur-md mb-8 animate-fade-down shadow-xl">
          <Sparkles className="w-4 h-4 text-[#D8C7A1]" />
          <span className="text-xs font-bold tracking-[0.25em] text-[#D8C7A1] uppercase">
            EST. 2026 • JAKARTA, INDONESIA
          </span>
        </div>

        {/* MAIN HEADLINE */}
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-[#F7F3EA] leading-[1.05] tracking-tight mb-6 max-w-4xl drop-shadow-2xl">
          THE ART OF <br />
          <span className="shimmer-text italic font-serif">PREMIUM CHICKEN.</span>
        </h1>

        {/* SUBHEADLINE */}
        <p className="text-base sm:text-xl text-[#F7F3EA]/90 font-sans font-normal max-w-2xl leading-relaxed mb-10 text-shadow">
          {heroConfig.subheading || "Crafted with premium ingredients, bold flavors, and uncompromising quality."}
        </p>

        {/* CTAS */}
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-14 w-full sm:w-auto">
          <button 
            onClick={scrollToMenu}
            className="w-full sm:w-auto px-9 py-4 rounded-xl bg-[#D8C7A1] text-[#071B2A] font-sans font-bold text-base tracking-wider hover:bg-[#F7F3EA] hover:scale-105 transition-all duration-300 shadow-2xl flex items-center justify-center gap-3 border border-[#D8C7A1] group"
          >
            <span>{heroConfig.ctaPrimary || "ORDER NOW"}</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button 
            onClick={scrollToMenu}
            className="w-full sm:w-auto px-9 py-4 rounded-xl bg-[#063B32]/80 text-[#F7F3EA] font-sans font-semibold text-base tracking-wider hover:bg-[#071B2A] hover:border-[#D8C7A1] border border-[#D8C7A1]/40 backdrop-blur-md transition-all duration-300 shadow-xl"
          >
            {heroConfig.ctaSecondary || "EXPLORE MENU"}
          </button>
        </div>

        {/* TRUST INDICATORS BAR */}
        <div className="pt-6 border-t border-[#D8C7A1]/20 w-full max-w-3xl flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm font-medium text-[#D8C7A1]">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-[#B98262]" />
            <span>Freshly Prepared</span>
          </div>
          <span className="text-[#D8C7A1]/40">•</span>
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-[#D8C7A1]" />
            <span>100% Muscle Protein</span>
          </div>
          <span className="text-[#D8C7A1]/40">•</span>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#D8C7A1]" />
            <span>Thermal Express Delivery</span>
          </div>
        </div>

      </div>

      {/* BOTTOM SCROLL INDICATOR */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 opacity-70 hover:opacity-100 transition-opacity">
        <span className="text-[10px] tracking-widest text-[#D8C7A1] uppercase font-semibold">SCROLL TO DISCOVER</span>
        <div className="w-5 h-8 rounded-full border border-[#D8C7A1]/50 flex items-start justify-center p-1">
          <div className="w-1.5 h-2 rounded-full bg-[#D8C7A1] animate-bounce" />
        </div>
      </div>

    </section>
  );
};
