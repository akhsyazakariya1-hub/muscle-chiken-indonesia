import React from 'react';
import { useApp } from '../../context/AppContext';
import { Crown, MapPin, Phone, Camera, Clock, Mail, ArrowUp } from 'lucide-react';


export const Footer = () => {
  const { settings, setActiveCategory } = useApp();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#071B2A] text-[#F7F3EA] pt-20 pb-28 lg:pb-12 border-t border-[#D8C7A1]/20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* TOP SECTION: BRAND & FOOTER LINKS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-16 border-b border-[#D8C7A1]/15">
          
          {/* BRAND COLUMN */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#063B32] border border-[#D8C7A1] flex items-center justify-center shadow-lg">
                <Crown className="w-5 h-5 text-[#D8C7A1]" />
              </div>
              <div>
                <h3 className="font-serif tracking-widest text-xl font-bold text-[#F7F3EA] leading-none">
                  MUSCLE CHICKEN
                </h3>
                <span className="text-[10px] tracking-[0.25em] text-[#D8C7A1] uppercase font-semibold mt-1 block">
                  INDONESIA
                </span>
              </div>
            </div>

            <p className="text-xs text-[#F7F3EA]/70 leading-relaxed font-sans max-w-sm">
              "Premium Chicken. Crafted for Greatness." <br />
              Pengalaman kuliner ayam gourmet tanpa kompromi. Nutrisi tinggi, cita rasa mewah, dan bahan-bahan alami terbaik.
            </p>

            <div className="space-y-2 pt-2 text-xs text-[#D8C7A1]">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 shrink-0 text-[#D8C7A1]" />
                <span>{settings.address || 'SCBD Lot 28, Jakarta Selatan'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 shrink-0 text-[#D8C7A1]" />
                <span>{settings.openingHours || '10:00 - 22:00 WIB Everyday'}</span>
              </div>
            </div>
          </div>

          {/* MENU COLUMN */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-bold text-[#D8C7A1] uppercase tracking-wider">
              OUR MENU
            </h4>
            <ul className="space-y-2 text-xs text-[#F7F3EA]/80 font-sans">
              <li>
                <button onClick={() => { setActiveCategory('fried'); scrollTo('signature-menu'); }} className="hover:text-[#D8C7A1] transition-colors">
                  Fried Chicken
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveCategory('grilled'); scrollTo('signature-menu'); }} className="hover:text-[#D8C7A1] transition-colors">
                  Charcoal Grilled
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveCategory('roasted'); scrollTo('signature-menu'); }} className="hover:text-[#D8C7A1] transition-colors">
                  Herb Roasted Whole
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveCategory('burger'); scrollTo('signature-menu'); }} className="hover:text-[#D8C7A1] transition-colors">
                  Chicken Burgers
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveCategory('rice-bowl'); scrollTo('signature-menu'); }} className="hover:text-[#D8C7A1] transition-colors">
                  Protein Rice Bowls
                </button>
              </li>
            </ul>
          </div>

          {/* COMPANY COLUMN */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-bold text-[#D8C7A1] uppercase tracking-wider">
              COMPANY
            </h4>
            <ul className="space-y-2 text-xs text-[#F7F3EA]/80 font-sans">
              <li>
                <button onClick={() => scrollTo('brand-story')} className="hover:text-[#D8C7A1] transition-colors">
                  The Muscle Standard
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('promotions')} className="hover:text-[#D8C7A1] transition-colors">
                  Promotions & Offers
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('best-sellers')} className="hover:text-[#D8C7A1] transition-colors">
                  The Crowd Favorites
                </button>
              </li>
              <li>
                <a href="#admin-portal" className="hover:text-[#D8C7A1] transition-colors">
                  Partnership & Catering
                </a>
              </li>
            </ul>
          </div>

          {/* CONTACT & SUPPORT COLUMN */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-bold text-[#D8C7A1] uppercase tracking-wider">
              CONTACT & SUPPORT
            </h4>
            <div className="space-y-2 text-xs text-[#F7F3EA]/80 font-sans">
              <a 
                href={`https://wa.me/${settings.whatsappNumber}`} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-2 hover:text-[#D8C7A1] transition-colors"
              >
                <Phone className="w-4 h-4 text-[#D8C7A1]" />
                <span>WhatsApp Hotline</span>
              </a>

              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-2 hover:text-[#D8C7A1] transition-colors"
              >
                <Camera className="w-4 h-4 text-[#D8C7A1]" />
                <span>{settings.instagram || '@musclechicken.id'}</span>

              </a>

              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#D8C7A1]" />
                <span>concierge@musclechicken.id</span>
              </div>
            </div>
          </div>

        </div>

        {/* BOTTOM COPYRIGHT */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#F7F3EA]/60 font-sans">
          <p>© 2026 Muscle Chicken Indonesia. All Rights Reserved.</p>
          
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-[#D8C7A1]">Privacy Policy</a>
            <a href="#" className="hover:text-[#D8C7A1]">Terms of Service</a>
            
            <button 
              onClick={scrollToTop}
              className="p-2.5 rounded-full bg-[#063B32] border border-[#D8C7A1]/40 text-[#D8C7A1] hover:bg-[#D8C7A1] hover:text-[#071B2A] transition-colors shadow-lg"
              title="Back to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
