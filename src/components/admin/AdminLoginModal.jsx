import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Lock, Mail, ArrowRight, X } from 'lucide-react';

export const AdminLoginModal = ({ isOpen, onClose }) => {
  const { loginAdmin } = useAuth();
  const { showToast } = useApp();

  const [email, setEmail] = useState('admin@musclechicken.id');
  const [password, setPassword] = useState('muscle2026');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const res = loginAdmin(email, password);
    if (res.success) {
      showToast(`Login berhasil! Selamat datang, ${res.admin.name}`, 'success');
      onClose();
    } else {
      showToast(res.message, 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#071B2A]/90 backdrop-blur-lg animate-fade-in">
      <div className="relative w-full max-w-md rounded-3xl bg-[#071B2A] border border-[#D8C7A1] p-8 shadow-2xl space-y-6 text-[#F7F3EA]">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-[#D8C7A1]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-[#063B32] border border-[#D8C7A1] text-[#D8C7A1] flex items-center justify-center mx-auto shadow-xl">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#D8C7A1]">EXECUTIVE MANAGEMENT PORTAL</span>
          <h2 className="font-serif text-2xl font-bold text-[#F7F3EA]">ADMIN AUTHENTICATION</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-[#D8C7A1] mb-1">EMAIL ADMIN</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#D8C7A1] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@musclechicken.id"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#063B32]/60 border border-[#D8C7A1]/30 text-sm text-[#F7F3EA] focus:outline-none focus:border-[#D8C7A1]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-[#D8C7A1] mb-1">PASSWORD</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#D8C7A1] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#063B32]/60 border border-[#D8C7A1]/30 text-sm text-[#F7F3EA] focus:outline-none focus:border-[#D8C7A1]"
                required
              />
            </div>
          </div>

          {/* DEMO CREDENTIAL HINT FOR EASY EVALUATION */}
          <div className="p-3 rounded-xl bg-[#063B32]/40 border border-[#D8C7A1]/20 text-[11px] text-[#D8C7A1] space-y-0.5">
            <p className="font-bold">Credential Admin Default:</p>
            <p>Email: <code className="text-white">admin@musclechicken.id</code></p>
            <p>Password: <code className="text-white">muscle2026</code></p>
          </div>

          <button 
            type="submit"
            className="w-full py-4 rounded-xl bg-[#D8C7A1] text-[#071B2A] font-bold text-xs uppercase tracking-widest hover:bg-[#F7F3EA] transition-all flex items-center justify-center gap-2 shadow-xl"
          >
            <span>MASUK ADMIN DASHBOARD</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
