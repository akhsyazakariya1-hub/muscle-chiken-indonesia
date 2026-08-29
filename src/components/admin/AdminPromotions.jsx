import React, { useState } from 'react';
import { dbService } from '../../services/db';
import { useApp } from '../../context/AppContext';
import { Tag, Plus, Check, X, Gift } from 'lucide-react';

export const AdminPromotions = () => {
  const { promotions, refreshDataFromDB, showToast } = useApp();
  const [isCreating, setIsCreating] = useState(false);

  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [discountType, setDiscountType] = useState('percentage'); // percentage or fixed
  const [discount, setDiscount] = useState(20);
  const [minPurchase, setMinPurchase] = useState(100000);
  const [maxDiscount, setMaxDiscount] = useState(50000);

  const handleCreateVoucher = (e) => {
    e.preventDefault();
    if (!code || !title) {
      showToast('Mohon lengkapi kode dan judul promo.', 'error');
      return;
    }
    dbService.addPromotion({
      code: code.toUpperCase(),
      title,
      type: discountType,
      discount: Number(discount),
      minPurchase: Number(minPurchase),
      maxDiscount: Number(maxDiscount),
      startDate: '2026-01-01',
      endDate: '2026-12-31',
      usageLimit: 1000,
      perUserLimit: 1
    });
    refreshDataFromDB();
    showToast(`Voucher "${code.toUpperCase()}" berhasil dibuat!`, 'success');
    setCode('');
    setTitle('');
    setIsCreating(false);
  };

  const formatRupiah = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);

  return (
    <div className="space-y-6 animate-fade-in">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#063B32]/10 pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#B98262]">DISCOUNT ENGINE</span>
          <h1 className="font-serif text-3xl font-bold text-[#10201F]">PROMOTIONS & VOUCHERS</h1>
        </div>

        <button 
          onClick={() => setIsCreating(true)}
          className="px-5 py-3 rounded-xl bg-[#063B32] text-[#D8C7A1] text-xs font-bold uppercase tracking-wider hover:bg-[#071B2A] border border-[#D8C7A1] transition-all flex items-center gap-2 shadow-lg"
        >
          <Plus className="w-4 h-4 text-[#D8C7A1]" />
          <span>BUAT VOUCHER BARU</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {promotions.map(promo => (
          <div key={promo.id} className="p-6 rounded-2xl bg-[#F5F1E8] border border-[#063B32]/20 shadow-lg flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-[#063B32] text-[#D8C7A1] text-xs font-mono font-bold tracking-wider">
                  KODE: {promo.code}
                </span>
                <span className="text-[10px] font-bold uppercase text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  {promo.isActive ? 'ACTIVE' : 'INACTIVE'}
                </span>
              </div>
              <h3 className="font-serif text-xl font-bold text-[#10201F] mt-3">{promo.title}</h3>
              <p className="text-xs text-[#10201F]/70 mt-1 font-sans">
                {promo.type === 'percentage' ? `Diskon ${promo.discount}% (Maks ${formatRupiah(promo.maxDiscount)})` : `Potongan ${formatRupiah(promo.discount)}`}
              </p>
            </div>

            <div className="pt-3 border-t border-[#063B32]/10 text-xs text-[#10201F]/60 flex items-center justify-between">
              <span>Min Beli: {formatRupiah(promo.minPurchase)}</span>
              <span>Terpakai: {promo.usedCount}x</span>
            </div>
          </div>
        ))}
      </div>

      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#071B2A]/85 backdrop-blur-md animate-fade-in">
          <form onSubmit={handleCreateVoucher} className="w-full max-w-md rounded-3xl bg-[#F5F1E8] border border-[#D8C7A1] p-6 shadow-2xl space-y-4">
            <h3 className="font-serif text-xl font-bold text-[#063B32]">Buat Voucher Baru</h3>

            <div>
              <label className="block text-xs font-bold uppercase text-[#10201F] mb-1">KODE VOUCHER *</label>
              <input 
                type="text" 
                value={code} 
                onChange={(e) => setCode(e.target.value)} 
                placeholder="Contoh: MUSCLE50"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#063B32]/20 font-mono text-sm uppercase"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-[#10201F] mb-1">JUDUL PROMO *</label>
              <input 
                type="text" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                placeholder="Contoh: Diskon Kemerdekaan 50%"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#063B32]/20 text-xs"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase text-[#10201F] mb-1">TIPE DISKON</label>
                <select 
                  value={discountType} 
                  onChange={(e) => setDiscountType(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#063B32]/20 text-xs"
                >
                  <option value="percentage">Persentase (%)</option>
                  <option value="fixed">Nominal Tetap (Rp)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#10201F] mb-1">NILAI DISKON</label>
                <input 
                  type="number" 
                  value={discount} 
                  onChange={(e) => setDiscount(e.target.value)} 
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#063B32]/20 text-xs"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase text-[#10201F] mb-1">MIN BELANJA (IDR)</label>
                <input 
                  type="number" 
                  value={minPurchase} 
                  onChange={(e) => setMinPurchase(e.target.value)} 
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#063B32]/20 text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#10201F] mb-1">MAKS DISKON (IDR)</label>
                <input 
                  type="number" 
                  value={maxDiscount} 
                  onChange={(e) => setMaxDiscount(e.target.value)} 
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#063B32]/20 text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <button 
                type="button" 
                onClick={() => setIsCreating(false)} 
                className="px-4 py-2 rounded-xl bg-gray-200 text-xs font-bold"
              >
                Batal
              </button>
              <button 
                type="submit" 
                className="px-5 py-2 rounded-xl bg-[#063B32] text-[#D8C7A1] text-xs font-bold uppercase"
              >
                Simpan Voucher
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
