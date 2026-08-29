import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { dbService } from '../../services/db';
import { Star, CheckCircle, MessageSquarePlus, Send, Sparkles } from 'lucide-react';

export const ReviewSection = () => {
  const { reviews, products, refreshDataFromDB, showToast } = useApp();
  const [isAddingReview, setIsAddingReview] = useState(false);

  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [productName, setProductName] = useState(products[0]?.name || 'MUSCLE CRISPY SIGNATURE');
  const [comment, setComment] = useState('');

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!name || !comment) {
      showToast('Mohon isi nama dan komentar Anda.', 'error');
      return;
    }
    dbService.addReview({
      customerName: name,
      rating,
      productName,
      comment,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop'
    });
    refreshDataFromDB();
    showToast('Terima kasih! Ulasan Anda berhasil diterbitkan.', 'success');
    setName('');
    setComment('');
    setIsAddingReview(false);
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#E8E5DC]">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 border-b border-[#063B32]/10 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#063B32]/10 border border-[#063B32]/20 text-[#063B32] text-xs font-bold uppercase tracking-widest mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#B98262]" />
              <span>TESTIMONIALS & CRITICS</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#10201F] tracking-tight">
              WHAT OUR PATRONS SAY
            </h2>
          </div>

          <button
            onClick={() => setIsAddingReview(!isAddingReview)}
            className="mt-4 sm:mt-0 px-5 py-3 rounded-xl bg-[#063B32] text-[#D8C7A1] font-bold text-xs uppercase tracking-wider hover:bg-[#071B2A] transition-all flex items-center gap-2 shadow-lg"
          >
            <MessageSquarePlus className="w-4 h-4 text-[#D8C7A1]" />
            <span>TULIS ULASAN</span>
          </button>
        </div>

        {/* WRITE REVIEW FORM MODAL / COLLAPSIBLE */}
        {isAddingReview && (
          <form onSubmit={handleSubmitReview} className="mb-12 p-6 sm:p-8 rounded-3xl bg-[#F5F1E8] border border-[#063B32]/20 shadow-xl space-y-4 animate-fade-down">
            <h3 className="font-serif text-2xl font-bold text-[#063B32]">Bagikan Pengalaman Kuliner Anda</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-[#10201F] mb-1">NAMA LENGKAP</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="Contoh: Budi Santoso"
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#063B32]/20 text-sm focus:outline-none focus:border-[#063B32]"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-[#10201F] mb-1">PRODUK YANG DIPESAN</label>
                <select 
                  value={productName} 
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#063B32]/20 text-sm focus:outline-none focus:border-[#063B32]"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.name}>{p.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-[#10201F] mb-1">RATING</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button 
                    key={star} 
                    type="button" 
                    onClick={() => setRating(star)}
                    className="p-1 text-[#D8C7A1] focus:outline-none"
                  >
                    <Star className={`w-6 h-6 ${star <= rating ? 'fill-[#D8C7A1]' : 'text-gray-300'}`} />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-[#10201F] mb-1">ULASAN ANDA</label>
              <textarea 
                rows="3" 
                value={comment} 
                onChange={(e) => setComment(e.target.value)}
                placeholder="Tulis ulasan Anda mengenai kualitas, kerenyahan, atau pelayanan..."
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#063B32]/20 text-sm focus:outline-none focus:border-[#063B32]"
                required
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button 
                type="button" 
                onClick={() => setIsAddingReview(false)}
                className="px-5 py-2.5 rounded-xl bg-gray-200 text-xs font-bold uppercase text-gray-700 hover:bg-gray-300"
              >
                Batal
              </button>
              <button 
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#063B32] text-[#D8C7A1] text-xs font-bold uppercase tracking-wider hover:bg-[#071B2A] flex items-center gap-2 shadow-lg"
              >
                <Send className="w-4 h-4" />
                <span>Kirim Ulasan</span>
              </button>
            </div>
          </form>
        )}

        {/* REVIEWS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map(rev => (
            <div key={rev.id} className="p-6 rounded-2xl bg-[#F5F1E8] border border-[#063B32]/10 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <img src={rev.avatar} alt={rev.customerName} className="w-10 h-10 rounded-full object-cover border border-[#063B32]/20" />
                    <div>
                      <h4 className="text-sm font-bold text-[#10201F]">{rev.customerName}</h4>
                      <p className="text-[10px] font-semibold text-[#063B32]">{rev.productName}</p>
                    </div>
                  </div>

                  {rev.verifiedPurchase && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-[#063B32] bg-[#063B32]/10 px-2 py-0.5 rounded-full">
                      <CheckCircle className="w-3 h-3 text-[#063B32]" />
                      <span>Verified</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#D8C7A1] text-[#D8C7A1]" />
                  ))}
                </div>

                <p className="text-xs text-[#10201F]/80 leading-relaxed font-sans italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#063B32]/10 text-right">
                <span className="text-[10px] text-[#10201F]/50">{rev.date}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
