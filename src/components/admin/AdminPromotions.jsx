import React, { useState } from 'react';
import { dbService } from '../../services/db';
import { useApp } from '../../context/AppContext';
import { Tag, Plus, Check, X, Gift, Edit3, Trash2, Power } from 'lucide-react';

export const AdminPromotions = () => {
  const { promotions, refreshDataFromDB, showToast } = useApp();
  const [isCreating, setIsCreating] = useState(false);
  const [editingPromo, setEditingPromo] = useState(null);

  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [discountType, setDiscountType] = useState('PERCENTAGE'); // PERCENTAGE or FIXED_AMOUNT
  const [discount, setDiscount] = useState(20);
  const [minPurchase, setMinPurchase] = useState(50000);
  const [maxDiscount, setMaxDiscount] = useState(25000);
  const [bannerUrl, setBannerUrl] = useState('https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?q=80&w=1000&auto=format&fit=crop');

  const handleOpenCreate = () => {
    setEditingPromo(null);
    setCode('');
    setName('');
    setDiscountType('PERCENTAGE');
    setDiscount(20);
    setMinPurchase(50000);
    setMaxDiscount(25000);
    setBannerUrl('https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?q=80&w=1000&auto=format&fit=crop');
    setIsCreating(true);
  };

  const handleOpenEdit = (promo) => {
    setEditingPromo(promo);
    setCode(promo.promo_code || promo.code || '');
    setName(promo.name || promo.title || '');
    setDiscountType(promo.discount_type || (promo.type === 'fixed' ? 'FIXED_AMOUNT' : 'PERCENTAGE'));
    setDiscount(promo.discount_value || promo.discount || 0);
    setMinPurchase(promo.minimum_purchase || promo.minPurchase || 0);
    setMaxDiscount(promo.maximum_discount || promo.maxDiscount || 0);
    setBannerUrl(promo.banner_url || promo.banner || '');
    setIsCreating(true);
  };

  const handleSavePromo = (e) => {
    e.preventDefault();
    if (!code || !name) {
      showToast('Please complete promo code and name.', 'error');
      return;
    }

    const payload = {
      promo_code: code.toUpperCase(),
      name,
      discount_type: discountType,
      discount_value: Number(discount),
      minimum_purchase: Number(minPurchase),
      maximum_discount: Number(maxDiscount),
      banner_url: bannerUrl,
      isActive: editingPromo ? editingPromo.isActive : true
    };

    if (editingPromo) {
      dbService.updatePromotion(editingPromo.id, payload);
      showToast(`Promotion "${code.toUpperCase()}" updated successfully!`, 'success');
    } else {
      dbService.addPromotion(payload);
      showToast(`Promotion "${code.toUpperCase()}" created successfully!`, 'success');
    }

    refreshDataFromDB();
    setIsCreating(false);
    setEditingPromo(null);
  };

  const handleDelete = (promo) => {
    if (window.confirm(`Are you sure you want to delete this promotion "${promo.promo_code || promo.code}"?`)) {
      dbService.deletePromotion(promo.id);
      refreshDataFromDB();
      showToast(`Promotion deleted.`, 'info');
    }
  };

  const handleToggleActive = (promo) => {
    dbService.updatePromotion(promo.id, { isActive: !promo.isActive });
    refreshDataFromDB();
    showToast(`Promotion status changed to ${!promo.isActive ? 'ACTIVE' : 'INACTIVE'}.`, 'success');
  };

  const formatRupiah = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#063B32]/10 pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#B98262]">PROMO ENGINE</span>
          <h1 className="font-serif text-3xl font-bold text-[#10201F]">PROMOTION MANAGEMENT</h1>
        </div>

        <button 
          onClick={handleOpenCreate}
          className="px-5 py-3 rounded-xl bg-[#063B32] text-[#D8C7A1] text-xs font-bold uppercase tracking-wider hover:bg-[#071B2A] border border-[#D8C7A1] transition-all flex items-center gap-2 shadow-lg"
        >
          <Plus className="w-4 h-4 text-[#D8C7A1]" />
          <span>ADD NEW PROMO</span>
        </button>
      </div>

      {/* PROMO CARDS LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {promotions.map(promo => {
          const promoCode = promo.promo_code || promo.code;
          const promoName = promo.name || promo.title;
          const isPct = (promo.discount_type || promo.type) === 'PERCENTAGE' || promo.type === 'percentage';
          const discountVal = promo.discount_value || promo.discount;
          const minPurch = promo.minimum_purchase || promo.minPurchase || 0;
          const maxDisc = promo.maximum_discount || promo.maxDiscount || 0;

          return (
            <div key={promo.id} className="p-6 rounded-2xl bg-[#F5F1E8] border border-[#063B32]/20 shadow-lg flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-[#063B32] text-[#D8C7A1] text-xs font-mono font-bold tracking-wider">
                    CODE: {promoCode}
                  </span>
                  
                  <button
                    onClick={() => handleToggleActive(promo)}
                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                      promo.isActive 
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                        : 'bg-gray-200 text-gray-600 border border-gray-300'
                    }`}
                  >
                    <Power className="w-3 h-3" />
                    <span>{promo.isActive ? 'ACTIVE' : 'INACTIVE'}</span>
                  </button>
                </div>

                <h3 className="font-serif text-xl font-bold text-[#10201F] mt-3">{promoName}</h3>
                <p className="text-xs text-[#10201F]/80 mt-1 font-sans">
                  {isPct ? `Discount ${discountVal}% (Max ${formatRupiah(maxDisc)})` : `Discount ${formatRupiah(discountVal)}`}
                </p>
              </div>

              <div className="pt-3 border-t border-[#063B32]/10 text-xs text-[#10201F]/70 flex items-center justify-between">
                <span>Min Purchase: {formatRupiah(minPurch)}</span>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleOpenEdit(promo)}
                    className="p-1.5 rounded-lg bg-white text-[#063B32] border border-[#063B32]/20 hover:bg-[#063B32] hover:text-[#D8C7A1]"
                    title="Edit Promo"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button 
                    onClick={() => handleDelete(promo)}
                    className="p-1.5 rounded-lg bg-red-100 text-red-700 hover:bg-red-200"
                    title="Delete Promo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CREATE / EDIT MODAL */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#071B2A]/85 backdrop-blur-md animate-fade-in">
          <form onSubmit={handleSavePromo} className="w-full max-w-md rounded-3xl bg-[#F5F1E8] border border-[#D8C7A1] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#063B32]/10 pb-3">
              <h3 className="font-serif text-xl font-bold text-[#063B32]">
                {editingPromo ? 'Edit Promotion' : 'Add New Promotion'}
              </h3>
              <button type="button" onClick={() => setIsCreating(false)} className="p-1 rounded-full hover:bg-gray-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-[#10201F] mb-1">PROMO CODE *</label>
              <input 
                type="text" 
                value={code} 
                onChange={(e) => setCode(e.target.value)} 
                placeholder="e.g. WEEKEND20"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#063B32]/20 font-mono text-sm uppercase font-bold"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-[#10201F] mb-1">PROMO NAME *</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="e.g. Weekend Gourmet Feast Deal"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#063B32]/20 text-xs"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase text-[#10201F] mb-1">DISCOUNT TYPE</label>
                <select 
                  value={discountType} 
                  onChange={(e) => setDiscountType(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#063B32]/20 text-xs font-bold"
                >
                  <option value="PERCENTAGE">PERCENTAGE (%)</option>
                  <option value="FIXED_AMOUNT">FIXED AMOUNT (Rp)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#10201F] mb-1">DISCOUNT VALUE</label>
                <input 
                  type="number" 
                  value={discount} 
                  onChange={(e) => setDiscount(e.target.value)} 
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#063B32]/20 text-xs font-bold"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase text-[#10201F] mb-1">MIN PURCHASE (IDR)</label>
                <input 
                  type="number" 
                  value={minPurchase} 
                  onChange={(e) => setMinPurchase(e.target.value)} 
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#063B32]/20 text-xs font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#10201F] mb-1">MAX DISCOUNT (IDR)</label>
                <input 
                  type="number" 
                  value={maxDiscount} 
                  onChange={(e) => setMaxDiscount(e.target.value)} 
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#063B32]/20 text-xs font-bold"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <button 
                type="button" 
                onClick={() => setIsCreating(false)} 
                className="px-4 py-2.5 rounded-xl bg-gray-200 text-xs font-bold"
              >
                CANCEL
              </button>
              <button 
                type="submit" 
                className="px-6 py-2.5 rounded-xl bg-[#063B32] text-[#D8C7A1] text-xs font-bold uppercase tracking-wider shadow-md"
              >
                SAVE PROMOTIONAL DEAL
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
