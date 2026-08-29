import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { X, User, Phone, MapPin, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

export const CustomerAuthModal = () => {
  const { isAuthOpen, setIsAuthOpen, showToast, setIsProfileOpen } = useApp();
  const { loginCustomer } = useAuth();

  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');

  if (!isAuthOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !whatsapp) {
      showToast('Mohon isi nama dan nomor WhatsApp Anda.', 'error');
      return;
    }

    loginCustomer(name, whatsapp, address, email);
    showToast(`Selamat datang, ${name}! Profil Anda berhasil disimpan.`, 'success');
    setIsAuthOpen(false);
    setIsProfileOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#071B2A]/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md rounded-3xl bg-[#F5F1E8] border border-[#D8C7A1]/40 p-6 sm:p-8 shadow-2xl space-y-6">
        
        <button 
          onClick={() => setIsAuthOpen(false)}
          className="absolute top-4 right-4 p-2.5 rounded-full bg-[#071B2A]/10 text-[#10201F] hover:bg-[#063B32] hover:text-[#D8C7A1] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#063B32] border border-[#D8C7A1] text-[#D8C7A1] flex items-center justify-center mx-auto mb-3 shadow-lg">
            <User className="w-6 h-6" />
          </div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#B98262]">MUSCLE CHICKEN INDONESIA</span>
          <h2 className="font-serif text-2xl font-bold text-[#063B32]">QUICK CUSTOMER ACCESS</h2>
          <p className="text-xs text-[#10201F]/70 mt-1 font-sans">
            Akses pesanan, simpan alamat, & lacak histori tanpa ribet hafalan password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-[#10201F] mb-1">NAMA LENGKAP *</label>
            <div className="relative">
              <User className="w-4 h-4 text-[#063B32] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Pratama Wijaya"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-[#063B32]/20 text-sm focus:outline-none focus:border-[#063B32]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-[#10201F] mb-1">NOMOR WHATSAPP *</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-[#063B32] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="Contoh: 081298765432"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-[#063B32]/20 text-sm focus:outline-none focus:border-[#063B32]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-[#10201F] mb-1">ALAMAT UTAMA (OPTIONAL)</label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-[#063B32] absolute left-3.5 top-3" />
              <textarea 
                rows="2"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Alamat rumah/apartemen/kantor..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#063B32]/20 text-sm focus:outline-none focus:border-[#063B32]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-[#10201F] mb-1">EMAIL (OPTIONAL)</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#063B32] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@domain.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-[#063B32]/20 text-sm focus:outline-none focus:border-[#063B32]"
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full py-4 rounded-xl bg-[#063B32] text-[#D8C7A1] font-bold text-xs uppercase tracking-widest hover:bg-[#071B2A] border border-[#D8C7A1] transition-all flex items-center justify-center gap-2 shadow-lg pt-4"
          >
            <span>MASUK / DAFTAR</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
