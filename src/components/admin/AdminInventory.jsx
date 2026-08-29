import React, { useState } from 'react';
import { dbService } from '../../services/db';
import { useApp } from '../../context/AppContext';
import { Boxes, AlertTriangle, ArrowDownRight, ArrowUpRight, RefreshCw, PlusCircle } from 'lucide-react';

export const AdminInventory = () => {
  const { products, refreshDataFromDB, showToast } = useApp();
  const logs = dbService.getInventoryLogs();

  const [restockProduct, setRestockProduct] = useState(null);
  const [restockQty, setRestockQty] = useState(20);

  const handleApplyRestock = (e) => {
    e.preventDefault();
    if (!restockProduct) return;
    const target = products.find(p => p.id === restockProduct);
    if (target) {
      const newStock = target.stock + Number(restockQty);
      dbService.updateProduct(target.id, { stock: newStock });
      refreshDataFromDB();
      showToast(`Berhasil restock +${restockQty} porsi untuk ${target.name}`, 'success');
      setRestockProduct(null);
    }
  };

  const totalStockCount = products.reduce((sum, p) => sum + p.stock, 0);
  const lowStockProducts = products.filter(p => p.stock <= (p.lowStockThreshold || 10));
  const outOfStockProducts = products.filter(p => p.stock === 0);

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#063B32]/10 pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#B98262]">STOCK AUDIT & LOGISTICS</span>
          <h1 className="font-serif text-3xl font-bold text-[#10201F]">INVENTORY MANAGEMENT</h1>
        </div>

        <button 
          onClick={() => setRestockProduct(products[0]?.id)}
          className="px-5 py-3 rounded-xl bg-[#063B32] text-[#D8C7A1] text-xs font-bold uppercase tracking-wider hover:bg-[#071B2A] border border-[#D8C7A1] transition-all flex items-center gap-2 shadow-lg"
        >
          <PlusCircle className="w-4 h-4 text-[#D8C7A1]" />
          <span>TAMBAH STOK (RESTOCK)</span>
        </button>
      </div>

      {/* KPI METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-[#F5F1E8] border border-[#063B32]/10 shadow-md">
          <span className="text-[10px] font-bold text-gray-500 uppercase">TOTAL KETERSEDIAAN STOK</span>
          <h3 className="font-serif text-3xl font-bold text-[#063B32] mt-1">{totalStockCount} porsi</h3>
        </div>

        <div className="p-6 rounded-2xl bg-[#F5F1E8] border border-[#063B32]/10 shadow-md">
          <span className="text-[10px] font-bold text-amber-700 uppercase">LOW STOCK PRODUCTS</span>
          <h3 className="font-serif text-3xl font-bold text-amber-700 mt-1">{lowStockProducts.length} produk</h3>
        </div>

        <div className="p-6 rounded-2xl bg-[#F5F1E8] border border-[#063B32]/10 shadow-md">
          <span className="text-[10px] font-bold text-red-600 uppercase">OUT OF STOCK</span>
          <h3 className="font-serif text-3xl font-bold text-red-600 mt-1">{outOfStockProducts.length} produk</h3>
        </div>
      </div>

      {/* AUDIT LOG TABLE */}
      <div className="rounded-2xl bg-[#F5F1E8] border border-[#063B32]/10 shadow-lg p-6 space-y-4">
        <h3 className="font-serif text-lg font-bold text-[#063B32]">Stock Transaction Audit History</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#10201F]">
            <thead className="bg-[#063B32] text-[#D8C7A1] uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="p-3">WAKTU AUDIT</th>
                <th className="p-3">PRODUK</th>
                <th className="p-3">PERUBAHAN STOK</th>
                <th className="p-3">TIPE LOG</th>
                <th className="p-3">CATATAN / REASON</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#063B32]/10">
              {logs.map(log => (
                <tr key={log.id} className="hover:bg-[#E8E5DC]/60">
                  <td className="p-3 font-mono text-[10px] text-gray-500">
                    {new Date(log.timestamp).toLocaleString('id-ID')}
                  </td>
                  <td className="p-3 font-bold text-[#10201F]">{log.productName}</td>
                  <td className="p-3 font-serif font-bold">
                    <span className={`flex items-center gap-1 ${log.change > 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                      {log.change > 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                      {log.change > 0 ? `+${log.change}` : log.change} pcs
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-gray-200 text-[10px] font-mono font-bold">
                      {log.type}
                    </span>
                  </td>
                  <td className="p-3 text-gray-600 font-sans text-xs">{log.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* RESTOCK MODAL */}
      {restockProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#071B2A]/85 backdrop-blur-md animate-fade-in">
          <form onSubmit={handleApplyRestock} className="w-full max-w-sm rounded-3xl bg-[#F5F1E8] border border-[#D8C7A1] p-6 shadow-2xl space-y-4">
            <h3 className="font-serif text-xl font-bold text-[#063B32]">Restock Ayam / Porsi</h3>

            <div>
              <label className="block text-xs font-bold uppercase text-[#10201F] mb-1">PILIH PRODUK</label>
              <select 
                value={restockProduct}
                onChange={(e) => setRestockProduct(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#063B32]/20 text-xs"
              >
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.name} (Stok Saat Ini: {p.stock})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-[#10201F] mb-1">JUMLAH TAMBAHAN STOK (PCS)</label>
              <input 
                type="number" 
                value={restockQty} 
                onChange={(e) => setRestockQty(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#063B32]/20 text-xs"
                required
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button 
                type="button" 
                onClick={() => setRestockProduct(null)} 
                className="px-4 py-2 rounded-xl bg-gray-200 text-xs font-bold"
              >
                Batal
              </button>
              <button 
                type="submit" 
                className="px-5 py-2 rounded-xl bg-[#063B32] text-[#D8C7A1] text-xs font-bold uppercase"
              >
                Tambah Stok
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
