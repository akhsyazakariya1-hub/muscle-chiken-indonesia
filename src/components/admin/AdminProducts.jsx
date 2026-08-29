import React, { useState } from 'react';
import { dbService } from '../../services/db';
import { useApp } from '../../context/AppContext';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Copy, 
  Archive, 
  Check, 
  X, 
  Flame, 
  Star, 
  Utensils 
} from 'lucide-react';

export const AdminProducts = () => {
  const { products, refreshDataFromDB, showToast } = useApp();
  const [editingProduct, setEditingProduct] = useState(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    subtitle: '',
    category: 'fried',
    price: 45000,
    discountPrice: '',
    stock: 30,
    lowStockThreshold: 10,
    spicyLevel: 1,
    description: '',
    image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?q=80&w=800&auto=format&fit=crop',
    badge: 'NEW',
    isBestSeller: false,
    isFeatured: true
  });

  const handleOpenCreate = () => {
    setFormData({
      name: '',
      subtitle: '',
      category: 'fried',
      price: 48000,
      discountPrice: '',
      stock: 30,
      lowStockThreshold: 10,
      spicyLevel: 1,
      description: 'Dibuat dengan rempah rahasia Muscle Chicken Indonesia...',
      image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?q=80&w=800&auto=format&fit=crop',
      badge: 'NEW',
      isBestSeller: false,
      isFeatured: true
    });
    setEditingProduct(null);
    setIsCreatingNew(true);
  };

  const handleOpenEdit = (product) => {
    setFormData({ ...product, discountPrice: product.discountPrice || '' });
    setEditingProduct(product);
    setIsCreatingNew(false);
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      showToast('Mohon lengkapi nama dan harga produk.', 'error');
      return;
    }

    const payload = {
      ...formData,
      price: Number(formData.price),
      discountPrice: formData.discountPrice ? Number(formData.discountPrice) : null,
      stock: Number(formData.stock),
      lowStockThreshold: Number(formData.lowStockThreshold),
      spicyLevel: Number(formData.spicyLevel)
    };

    if (editingProduct) {
      dbService.updateProduct(editingProduct.id, payload);
      showToast(`Produk "${formData.name}" berhasil diperbarui!`, 'success');
    } else {
      dbService.addProduct(payload);
      showToast(`Produk "${formData.name}" berhasil ditambahkan!`, 'success');
    }

    refreshDataFromDB();
    setIsCreatingNew(false);
    setEditingProduct(null);
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Hapus produk "${name}" secara permanen?`)) {
      dbService.deleteProduct(id);
      refreshDataFromDB();
      showToast(`Produk "${name}" telah dihapus.`, 'info');
    }
  };

  const handleDuplicate = (id) => {
    const dup = dbService.duplicateProduct(id);
    refreshDataFromDB();
    showToast(`Produk duplikat "${dup.name}" dibuat!`, 'success');
  };

  const handleToggleArchive = (product) => {
    dbService.updateProduct(product.id, { isAvailable: !product.isAvailable });
    refreshDataFromDB();
    showToast(`Status ketersediaan "${product.name}" diubah.`, 'info');
  };

  const formatRupiah = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#063B32]/10 pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#B98262]">CATALOG MANAGMENT</span>
          <h1 className="font-serif text-3xl font-bold text-[#10201F]">PRODUCT CATALOG (CRUD)</h1>
        </div>

        <button 
          onClick={handleOpenCreate}
          className="px-5 py-3 rounded-xl bg-[#063B32] text-[#D8C7A1] text-xs font-bold uppercase tracking-wider hover:bg-[#071B2A] border border-[#D8C7A1] transition-all flex items-center gap-2 shadow-lg"
        >
          <Plus className="w-4 h-4 text-[#D8C7A1]" />
          <span>TAMBAH PRODUK BARU</span>
        </button>
      </div>

      {/* PRODUCTS TABLE */}
      <div className="rounded-2xl bg-[#F5F1E8] border border-[#063B32]/10 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#10201F]">
            <thead className="bg-[#063B32] text-[#D8C7A1] uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="p-4">PRODUK</th>
                <th className="p-4">KATEGORI & SKU</th>
                <th className="p-4">HARGA</th>
                <th className="p-4">STOK</th>
                <th className="p-4">BADGE</th>
                <th className="p-4">STATUS</th>
                <th className="p-4 text-right">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#063B32]/10">
              {products.map(product => (
                <tr key={product.id} className="hover:bg-[#E8E5DC]/60 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={product.image} alt={product.name} className="w-12 h-12 rounded-xl object-cover border border-[#063B32]/10" />
                      <div>
                        <h4 className="font-serif font-bold text-sm text-[#10201F]">{product.name}</h4>
                        <p className="text-[10px] text-[#B98262] uppercase font-semibold">{product.subtitle}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 uppercase font-semibold text-[#063B32]">
                    {product.category}
                    <span className="block text-[10px] font-mono text-gray-500">{product.sku}</span>
                  </td>
                  <td className="p-4 font-serif font-bold text-sm text-[#063B32]">
                    {formatRupiah(product.discountPrice || product.price)}
                    {product.discountPrice && (
                      <span className="block text-[10px] text-gray-400 line-through font-normal">{formatRupiah(product.price)}</span>
                    )}
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      product.stock <= product.lowStockThreshold ? 'bg-red-100 text-red-700 font-extrabold' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {product.stock} pcs
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded bg-[#063B32] text-[#D8C7A1] text-[10px] font-bold uppercase">
                      {product.badge || 'STANDARD'}
                    </span>
                  </td>
                  <td className="p-4">
                    <button 
                      onClick={() => handleToggleArchive(product)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        product.isAvailable ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {product.isAvailable ? 'Active' : 'Archived'}
                    </button>
                  </td>
                  <td className="p-4 text-right space-x-1">
                    <button 
                      onClick={() => handleOpenEdit(product)}
                      className="p-1.5 rounded-lg bg-white text-[#063B32] hover:bg-[#063B32] hover:text-[#D8C7A1] border border-[#063B32]/20"
                      title="Edit Produk"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDuplicate(product.id)}
                      className="p-1.5 rounded-lg bg-white text-[#071B2A] hover:bg-[#071B2A] hover:text-[#D8C7A1] border border-[#071B2A]/20"
                      title="Duplikat Produk"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(product.id, product.name)}
                      className="p-1.5 rounded-lg bg-red-100 text-red-700 hover:bg-red-700 hover:text-white"
                      title="Hapus Produk"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE / EDIT PRODUCT MODAL FORM */}
      {(isCreatingNew || editingProduct) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#071B2A]/85 backdrop-blur-md overflow-y-auto animate-fade-in">
          <div className="relative w-full max-w-xl rounded-3xl bg-[#F5F1E8] border border-[#D8C7A1] p-6 sm:p-8 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            
            <button 
              onClick={() => { setIsCreatingNew(false); setEditingProduct(null); }}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif text-2xl font-bold text-[#063B32]">
              {editingProduct ? `Edit Produk: ${editingProduct.name}` : 'Tambah Produk Baru'}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#10201F] mb-1">NAMA PRODUK *</label>
                  <input 
                    type="text" 
                    value={formData.name} 
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#063B32]/20 text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-[#10201F] mb-1">SUBTITLE / TAGLINE</label>
                  <input 
                    type="text" 
                    value={formData.subtitle} 
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })} 
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#063B32]/20 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#10201F] mb-1">KATEGORI *</label>
                  <select 
                    value={formData.category} 
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })} 
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#063B32]/20 text-xs"
                  >
                    <option value="fried">Fried Chicken</option>
                    <option value="grilled">Grilled Chicken</option>
                    <option value="roasted">Roasted Chicken</option>
                    <option value="burger">Chicken Burger</option>
                    <option value="rice-bowl">Rice Bowl</option>
                    <option value="sides">Sides</option>
                    <option value="sauces">Sauces</option>
                    <option value="beverages">Beverages</option>
                    <option value="family">Family Package</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-[#10201F] mb-1">HARGA (IDR) *</label>
                  <input 
                    type="number" 
                    value={formData.price} 
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })} 
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#063B32]/20 text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-[#10201F] mb-1">HARGA DISKON (OPTIONAL)</label>
                  <input 
                    type="number" 
                    value={formData.discountPrice} 
                    onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })} 
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#063B32]/20 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#10201F] mb-1">STOK *</label>
                  <input 
                    type="number" 
                    value={formData.stock} 
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })} 
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#063B32]/20 text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-[#10201F] mb-1">AMBANG LOW STOCK</label>
                  <input 
                    type="number" 
                    value={formData.lowStockThreshold} 
                    onChange={(e) => setFormData({ ...formData, lowStockThreshold: e.target.value })} 
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#063B32]/20 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-[#10201F] mb-1">SPICY LEVEL (0-5)</label>
                  <input 
                    type="number" 
                    min="0" 
                    max="5"
                    value={formData.spicyLevel} 
                    onChange={(e) => setFormData({ ...formData, spicyLevel: e.target.value })} 
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#063B32]/20 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#10201F] mb-1">URL GAMBAR FOTO *</label>
                <input 
                  type="url" 
                  value={formData.image} 
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })} 
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#063B32]/20 text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#10201F] mb-1">DESKRIPSI PRODUK *</label>
                <textarea 
                  rows="3"
                  value={formData.description} 
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#063B32]/20 text-xs"
                  required
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-xs font-bold">
                  <input 
                    type="checkbox" 
                    checked={formData.isBestSeller} 
                    onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })} 
                  />
                  <span>Tandai Best Seller</span>
                </label>
                <label className="flex items-center gap-2 text-xs font-bold">
                  <input 
                    type="checkbox" 
                    checked={formData.isFeatured} 
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })} 
                  />
                  <span>Tandai Featured</span>
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-[#063B32]/10">
                <button 
                  type="button" 
                  onClick={() => { setIsCreatingNew(false); setEditingProduct(null); }}
                  className="px-4 py-2 rounded-xl bg-gray-200 text-xs font-bold"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-2 rounded-xl bg-[#063B32] text-[#D8C7A1] text-xs font-bold uppercase tracking-wider"
                >
                  Simpan Produk
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
