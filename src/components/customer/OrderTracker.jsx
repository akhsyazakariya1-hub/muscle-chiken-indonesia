import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { dbService } from '../../services/db';
import { notificationService } from '../../services/notification';
import { buildWhatsAppOrderMessage } from '../../services/whatsapp';
import { 
  X, 
  CheckCircle2, 
  Clock, 
  Flame, 
  ChefHat, 
  PackageCheck, 
  Bike, 
  CheckCheck,
  RefreshCw,
  MessageSquare,
  Copy,
  ExternalLink
} from 'lucide-react';

const TIMELINE_STEPS = [
  { key: 'ORDER_RECEIVED', label: 'ORDER RECEIVED', icon: Clock, desc: 'Pesanan telah diterima oleh dapur' },
  { key: 'PAYMENT_CONFIRMED', label: 'PAYMENT CONFIRMED', icon: CheckCircle2, desc: 'Pembayaran telah terverifikasi' },
  { key: 'PREPARING', label: 'PREPARING INGREDIENTS', icon: ChefHat, desc: 'Dada & paha ayam dimarinasi segar' },
  { key: 'COOKING', label: 'COOKING ON HIGH HEAT', icon: Flame, desc: 'Ayam sedang digoreng / digrill' },
  { key: 'READY', label: 'PACKED & READY', icon: PackageCheck, desc: 'Dikemas rapi dalam kemasan thermal' },
  { key: 'OUT_FOR_DELIVERY', label: 'OUT FOR DELIVERY', icon: Bike, desc: 'Kurir express sedang menuju ke tempat Anda' },
  { key: 'COMPLETED', label: 'COMPLETED', icon: CheckCheck, desc: 'Pesanan telah diserahkan. Selamat menikmati!' }
];

export const OrderTracker = () => {
  const { activeTrackingOrderId, setActiveTrackingOrderId, showToast } = useApp();
  const [order, setOrder] = useState(null);

  const fetchOrder = () => {
    if (!activeTrackingOrderId) return;
    const orders = dbService.getOrders();
    const found = orders.find(o => o.id === activeTrackingOrderId) || orders[0];
    setOrder(found);
  };

  useEffect(() => {
    fetchOrder();
    const handleUpdate = () => fetchOrder();
    window.addEventListener('mc_db_updated', handleUpdate);
    return () => window.removeEventListener('mc_db_updated', handleUpdate);
  }, [activeTrackingOrderId]);

  if (!activeTrackingOrderId || !order) return null;

  const currentStepIndex = TIMELINE_STEPS.findIndex(s => s.key === order.status);
  const isCancelled = order.status === 'CANCELLED';

  const handleSimulateNextStatus = () => {
    if (currentStepIndex < TIMELINE_STEPS.length - 1) {
      const nextStatus = TIMELINE_STEPS[currentStepIndex + 1].key;
      const updated = dbService.updateOrderStatus(order.id, nextStatus);
      setOrder(updated);
      notificationService.notifyOrderStatusChange(order.id, nextStatus);
      showToast(`Status Order #${order.id} diperbarui ke ${nextStatus}`, 'success');
    }
  };

  const handleOpenWhatsApp = () => {
    const waData = buildWhatsAppOrderMessage(order);
    window.open(waData.whatsappUrl, '_blank');
  };

  const formatRupiah = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#071B2A]/85 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#F5F1E8] border border-[#D8C7A1]/50 shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col justify-between">
        
        {/* HEADER */}
        <div className="p-6 bg-[#063B32] text-[#F7F3EA] border-b border-[#D8C7A1]/20 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#071B2A] text-[#D8C7A1] text-[11px] font-mono font-bold">
                #{order.id}
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#D8C7A1]">REALTIME TRACKER</span>
            </div>
            <h2 className="font-serif text-2xl font-bold tracking-wide mt-1">ORDER PROGRESS</h2>
          </div>

          <button 
            onClick={() => setActiveTrackingOrderId(null)}
            className="p-2 rounded-full hover:bg-[#071B2A] text-[#F7F3EA] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* TRACKER BODY */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1">
          
          {/* SIMULATION BAR FOR LIVE TESTING */}
          <div className="p-4 rounded-2xl bg-[#071B2A] text-[#F7F3EA] border border-[#D8C7A1]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#D8C7A1]">LIVE SIMULATION CONTROL</span>
              <p className="text-xs text-[#F7F3EA]/80 font-sans">Simulasikan progres dapur secara realtime</p>
            </div>
            
            <button
              onClick={handleSimulateNextStatus}
              disabled={currentStepIndex >= TIMELINE_STEPS.length - 1 || isCancelled}
              className="px-4 py-2.5 rounded-xl bg-[#D8C7A1] text-[#071B2A] text-xs font-bold uppercase tracking-wider hover:bg-[#F7F3EA] disabled:opacity-50 transition-all flex items-center justify-center gap-2 shrink-0"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>ADVANCE STATUS</span>
            </button>
          </div>

          {/* ORDER OVERVIEW CARD */}
          <div className="p-4 rounded-2xl bg-[#E8E5DC] border border-[#063B32]/10 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div>
              <span className="text-[#10201F]/60">Customer:</span>
              <p className="font-bold text-[#10201F]">{order.customerName} ({order.whatsapp})</p>
            </div>
            <div>
              <span className="text-[#10201F]/60">Metode Bayar:</span>
              <p className="font-bold text-[#063B32]">{order.paymentMethod} ({order.paymentStatus})</p>
            </div>
            <div>
              <span className="text-[#10201F]/60">Total:</span>
              <p className="font-serif text-base font-bold text-[#063B32]">{formatRupiah(order.total)}</p>
            </div>
          </div>

          {/* VISUAL TIMELINE */}
          <div className="relative pl-6 space-y-6 before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#063B32]/20">
            {TIMELINE_STEPS.map((stepItem, idx) => {
              const Icon = stepItem.icon;
              const isCompleted = currentStepIndex >= idx;
              const isCurrent = currentStepIndex === idx;

              return (
                <div key={stepItem.key} className="relative flex items-start gap-4 group">
                  {/* Timeline Icon Node */}
                  <div className={`absolute -left-6 top-0 w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all shadow-md z-10 ${
                    isCurrent
                      ? 'bg-[#063B32] text-[#D8C7A1] border-[#D8C7A1] scale-115 ring-4 ring-[#063B32]/20 animate-pulse'
                      : isCompleted
                        ? 'bg-[#063B32] text-[#D8C7A1] border-[#063B32]'
                        : 'bg-[#E8E5DC] text-gray-400 border-gray-300'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="pl-6">
                    <div className="flex items-center gap-2">
                      <h4 className={`font-serif text-sm font-bold tracking-wide ${
                        isCurrent ? 'text-[#063B32] text-base' : isCompleted ? 'text-[#10201F]' : 'text-gray-400'
                      }`}>
                        {stepItem.label}
                      </h4>
                      {isCurrent && (
                        <span className="px-2 py-0.5 rounded-full bg-[#B98262] text-white text-[9px] font-extrabold uppercase tracking-wider">
                          IN PROGRESS
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#10201F]/70 font-sans mt-0.5">
                      {stepItem.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ITEMS DETAIL ACCORDION */}
          <div className="p-4 rounded-2xl bg-[#E8E5DC] border border-[#063B32]/10">
            <h4 className="text-xs font-bold uppercase text-[#063B32] mb-2">ITEMS DALAM PESANAN:</h4>
            <div className="space-y-1.5 text-xs text-[#10201F]/80">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between border-b border-[#063B32]/5 pb-1">
                  <span>{item.name} x{item.quantity}</span>
                  <span className="font-bold">{formatRupiah(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* FOOTER ACTIONS */}
        <div className="p-6 bg-[#E8E5DC] border-t border-[#063B32]/15 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={handleOpenWhatsApp}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#25D366] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#1ebd59] transition-all flex items-center justify-center gap-2 shadow-lg"
          >
            <MessageSquare className="w-4 h-4" />
            <span>KIRIM ORDER KE WHATSAPP ADMIN</span>
          </button>

          <button
            onClick={() => setActiveTrackingOrderId(null)}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#063B32] text-[#D8C7A1] font-bold text-xs uppercase tracking-wider hover:bg-[#071B2A]"
          >
            TUTUP TRACKER
          </button>
        </div>

      </div>
    </div>
  );
};
