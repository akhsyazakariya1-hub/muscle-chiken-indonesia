import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, ShieldCheck, QrCode } from 'lucide-react';

export const QRISModal = ({ totalAmount, orderId, onConfirm, onClose }) => {
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes countdown

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  const formatRupiah = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#071B2A]/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-sm rounded-3xl bg-[#F5F1E8] border border-[#D8C7A1] p-6 shadow-2xl text-center space-y-4">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-[#10201F]/60 hover:text-[#063B32]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-[#063B32] border border-[#D8C7A1] text-[#D8C7A1] flex items-center justify-center mx-auto shadow-md">
          <QrCode className="w-6 h-6" />
        </div>

        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#B98262]">QRIS NATIONAL PAYMENT</span>
          <h3 className="font-serif text-xl font-bold text-[#063B32]">Scan & Pay via E-Wallet / Mobile Banking</h3>
          <p className="text-xs text-[#10201F]/60 mt-0.5">Order #{orderId}</p>
        </div>

        {/* MOCK QR CODE GRAPHIC */}
        <div className="p-4 rounded-2xl bg-white border border-[#063B32]/10 inline-block shadow-inner">
          <img 
            src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=MUSCLECHICKEN_ORDER_${orderId}_AMOUNT_${totalAmount}`} 
            alt="QRIS Code" 
            className="w-44 h-44 mx-auto object-contain"
          />
          <div className="mt-2 text-[10px] font-bold text-gray-500 tracking-wider uppercase">
            NMID: ID102026MUSCLE01
          </div>
        </div>

        <div>
          <span className="text-xs text-[#10201F]/70">Total Pembayaran:</span>
          <p className="font-serif text-2xl font-bold text-[#063B32]">{formatRupiah(totalAmount)}</p>
          <div className="text-xs font-semibold text-amber-700 mt-1">
            Batas Waktu Bayar: <span className="font-mono font-bold text-[#071B2A]">{formattedTime}</span>
          </div>
        </div>

        <button
          onClick={onConfirm}
          className="w-full py-3.5 rounded-xl bg-[#063B32] text-[#D8C7A1] font-bold text-xs uppercase tracking-wider hover:bg-[#071B2A] border border-[#D8C7A1] transition-all flex items-center justify-center gap-2 shadow-lg"
        >
          <CheckCircle2 className="w-4 h-4 text-[#D8C7A1]" />
          <span>SAYA SUDAH BAYAR</span>
        </button>

        <p className="text-[10px] text-[#10201F]/50">
          Sistem akan secara otomatis memverifikasi pembayaran Anda setelah tombol ditekan.
        </p>

      </div>
    </div>
  );
};
