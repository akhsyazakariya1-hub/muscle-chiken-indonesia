import React from 'react';
import { dbService } from '../../services/db';
import { Users, Phone, MapPin, ShoppingBag } from 'lucide-react';

export const AdminCustomers = () => {
  const orders = dbService.getOrders();

  // Aggregate customer metrics from orders
  const customerMap = {};
  orders.forEach(ord => {
    if (!customerMap[ord.whatsapp]) {
      customerMap[ord.whatsapp] = {
        name: ord.customerName,
        whatsapp: ord.whatsapp,
        address: ord.address,
        totalOrders: 0,
        totalSpent: 0,
        lastOrderDate: ord.createdAt
      };
    }
    customerMap[ord.whatsapp].totalOrders += 1;
    customerMap[ord.whatsapp].totalSpent += ord.total;
  });

  const customerList = Object.values(customerMap);
  const formatRupiah = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);

  return (
    <div className="space-y-6 animate-fade-in">
      
      <div className="border-b border-[#063B32]/10 pb-6">
        <span className="text-xs font-bold uppercase tracking-widest text-[#B98262]">CRM & PATRON DIRECTORY</span>
        <h1 className="font-serif text-3xl font-bold text-[#10201F]">REGISTERED CUSTOMERS</h1>
      </div>

      <div className="rounded-2xl bg-[#F5F1E8] border border-[#063B32]/10 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#10201F]">
            <thead className="bg-[#063B32] text-[#D8C7A1] uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="p-4">NAMA CUSTOMER</th>
                <th className="p-4">WHATSAPP</th>
                <th className="p-4">ALAMAT UTAMA</th>
                <th className="p-4">TOTAL ORDER</th>
                <th className="p-4">TOTAL BELANJA</th>
                <th className="p-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#063B32]/10">
              {customerList.map((cust, idx) => (
                <tr key={idx} className="hover:bg-[#E8E5DC]/60">
                  <td className="p-4 font-bold text-[#10201F]">{cust.name}</td>
                  <td className="p-4 font-mono">{cust.whatsapp}</td>
                  <td className="p-4 truncate max-w-[200px]">{cust.address}</td>
                  <td className="p-4 font-bold text-[#063B32]">{cust.totalOrders} pesanan</td>
                  <td className="p-4 font-serif font-bold text-sm text-[#063B32]">
                    {formatRupiah(cust.totalSpent)}
                  </td>
                  <td className="p-4 text-right">
                    <a 
                      href={`https://wa.me/${cust.whatsapp.replace(/\D/g, '')}`} 
                      target="_blank" 
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-[10px] inline-flex items-center gap-1 hover:bg-emerald-700"
                    >
                      <Phone className="w-3 h-3" />
                      <span>Chat WA</span>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
