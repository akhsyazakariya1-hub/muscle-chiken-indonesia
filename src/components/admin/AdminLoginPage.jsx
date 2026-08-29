import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Lock, Mail, ArrowRight, Crown, CheckCircle2 } from 'lucide-react';

export const AdminLoginPage = ({ onLoginSuccess }) => {
  const { loginAdmin } = useAuth();
  const { showToast } = useApp();

  const [email, setEmail] = useState('adminmuschle@gmail.com');
  const [password, setPassword] = useState('zakariya2000');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await loginAdmin(email, password);
      if (res.success) {
        showToast(`Login berhasil! Selamat datang, ${res.admin.name}`, 'success');
        if (onLoginSuccess) onLoginSuccess();
      } else {
        showToast(res.message || 'Invalid email or password.', 'error');
      }
    } catch (err) {
      showToast('Gagal memproses authentication. Silakan coba lagi.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#071B2A] text-[#F7F3EA] flex items-center justify-center p-4 sm:p-6 selection:bg-[#D8C7A1] selection:text-[#071B2A]">
      <div className="w-full max-w-md rounded-3xl bg-gradient-to-b from-[#063B32] via-[#071B2A] to-[#071B2A] border-2 border-[#D8C7A1]/60 p-8 shadow-2xl space-y-6 relative overflow-hidden">
        
        {/* BACKGROUND SHIMMER */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D8C7A1]/10 rounded-full blur-3xl pointer-events-none" />

        {/* HEADER BRAND */}
        <div className="text-center space-y-2 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-[#063B32] border border-[#D8C7A1] text-[#D8C7A1] flex items-center justify-center mx-auto shadow-xl">
            <Crown className="w-8 h-8 text-[#D8C7A1]" />
          </div>
          <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#D8C7A1] block mt-2">
            MUSCLE CHICKEN INDONESIA
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#F7F3EA] tracking-wide">
            ADMIN PORTAL
          </h1>
          <p className="text-xs text-[#F7F3EA]/70 font-sans">
            Executive Operations & Dapur Realtime Control
          </p>
        </div>

        {/* LOGIN FORM */}
        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#D8C7A1] mb-1.5">
              EMAIL ADMIN
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#D8C7A1] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="adminmuschle@gmail.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#071B2A]/80 border border-[#D8C7A1]/40 text-sm text-[#F7F3EA] focus:outline-none focus:border-[#D8C7A1]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#D8C7A1] mb-1.5">
              PASSWORD
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#D8C7A1] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#071B2A]/80 border border-[#D8C7A1]/40 text-sm text-[#F7F3EA] focus:outline-none focus:border-[#D8C7A1]"
                required
              />
            </div>
          </div>

          {/* INITIAL ADMIN ACCOUNT DISPLAY (REQUIREMENT #3) */}
          <div className="p-4 rounded-2xl bg-[#063B32]/70 border border-[#D8C7A1]/40 text-xs text-[#D8C7A1] space-y-1.5 shadow-inner">
            <div className="flex items-center gap-1.5 font-bold uppercase text-[11px] text-[#F7F3EA]">
              <CheckCircle2 className="w-4 h-4 text-[#D8C7A1]" />
              <span>INITIAL ADMIN ACCOUNT (PROVISIONED):</span>
            </div>
            <div className="pl-5 space-y-0.5 font-mono text-[11px] text-gray-200">
              <p>Email: <strong className="text-[#D8C7A1]">adminmuschle@gmail.com</strong></p>
              <p>Password: <strong className="text-[#D8C7A1]">zakariya2000</strong></p>
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full py-4 rounded-xl bg-[#D8C7A1] text-[#071B2A] font-bold text-xs uppercase tracking-widest hover:bg-[#F7F3EA] transition-all flex items-center justify-center gap-2 shadow-2xl border border-[#D8C7A1] active:scale-98"
          >
            <span>{isLoading ? 'AUTHENTICATING...' : 'SIGN IN TO DASHBOARD'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* BACK TO STOREFRONT LINK */}
        <div className="text-center pt-2 relative z-10">
          <a 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              window.location.hash = '';
              window.history.pushState({}, '', '/');
              window.dispatchEvent(new Event('popstate'));
            }}
            className="text-xs font-semibold text-[#D8C7A1] hover:underline"
          >
            ← Kembali ke Website Customer
          </a>
        </div>

      </div>
    </div>
  );
};
