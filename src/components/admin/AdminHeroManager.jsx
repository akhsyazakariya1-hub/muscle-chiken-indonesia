import React, { useState } from 'react';
import { dbService } from '../../services/db';
import { useApp } from '../../context/AppContext';
import { Sliders, Save, Eye } from 'lucide-react';

export const AdminHeroManager = () => {
  const { heroConfig, refreshDataFromDB, showToast } = useApp();

  const [heading, setHeading] = useState(heroConfig.heading || 'THE ART OF\nPREMIUM CHICKEN.');
  const [subheading, setSubheading] = useState(heroConfig.subheading || 'Crafted with premium ingredients, bold flavors, and uncompromising quality.');
  const [ctaPrimary, setCtaPrimary] = useState(heroConfig.ctaPrimary || 'ORDER NOW');
  const [ctaSecondary, setCtaSecondary] = useState(heroConfig.ctaSecondary || 'EXPLORE MENU');
  const [bgImageUrl, setBgImageUrl] = useState(heroConfig.bgImageUrl || 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?q=80&w=1600&auto=format&fit=crop');

  const handleSaveHero = (e) => {
    e.preventDefault();
    dbService.saveHeroConfig({
      heading,
      subheading,
      ctaPrimary,
      ctaSecondary,
      bgImageUrl
    });
    refreshDataFromDB();
    showToast('Hero Section berhasil diperbarui secara live!', 'success');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      <div className="border-b border-[#063B32]/10 pb-6">
        <span className="text-xs font-bold uppercase tracking-widest text-[#B98262]">FRONT PAGE CMS</span>
        <h1 className="font-serif text-3xl font-bold text-[#10201F]">HERO BANNER & CONTENT MANAGER</h1>
      </div>

      <form onSubmit={handleSaveHero} className="p-8 rounded-3xl bg-[#F5F1E8] border border-[#063B32]/20 shadow-xl space-y-6 max-w-2xl">
        
        <div>
          <label className="block text-xs font-bold uppercase text-[#10201F] mb-1">HERO HEADLINE TEXT</label>
          <textarea 
            rows="2"
            value={heading} 
            onChange={(e) => setHeading(e.target.value)} 
            className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#063B32]/20 text-sm font-serif font-bold"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-[#10201F] mb-1">SUBHEADING DESKRIPSI</label>
          <textarea 
            rows="3"
            value={subheading} 
            onChange={(e) => setSubheading(e.target.value)} 
            className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#063B32]/20 text-xs"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-[#10201F] mb-1">TEKS CTA UTAMA</label>
            <input 
              type="text" 
              value={ctaPrimary} 
              onChange={(e) => setCtaPrimary(e.target.value)} 
              className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#063B32]/20 text-xs font-bold"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-[#10201F] mb-1">TEKS CTA KEDUA</label>
            <input 
              type="text" 
              value={ctaSecondary} 
              onChange={(e) => setCtaSecondary(e.target.value)} 
              className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#063B32]/20 text-xs font-bold"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-[#10201F] mb-1">URL BACKGROUND FOOD PHOTOGRAPHY (4K)</label>
          <input 
            type="url" 
            value={bgImageUrl} 
            onChange={(e) => setBgImageUrl(e.target.value)} 
            className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#063B32]/20 text-xs font-mono"
            required
          />
        </div>

        <div className="pt-4 flex justify-end">
          <button 
            type="submit"
            className="px-8 py-3.5 rounded-xl bg-[#063B32] text-[#D8C7A1] font-bold text-xs uppercase tracking-wider hover:bg-[#071B2A] border border-[#D8C7A1] transition-all flex items-center gap-2 shadow-lg"
          >
            <Save className="w-4 h-4 text-[#D8C7A1]" />
            <span>SIMPAN PERUBAHAN HERO</span>
          </button>
        </div>

      </form>

    </div>
  );
};
