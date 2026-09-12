import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { dbService, ORDER_STATUSES, normalizeOrderStatus, formatWIBDateTime } from '../../services/db';
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
  Sparkles,
  MapPin
} from 'lucide-react';

const STATUS_ICONS = {
  ORDER_RECEIVED: Clock,
  PAYMENT_CONFIRMED: CheckCircle2,
  PREPARING_INGREDIENTS: ChefHat,
  COOKING_ON_HIGH_HEAT: Flame,
  PACKED_READY: PackageCheck,
  OUT_FOR_DELIVERY: Bike,
  COMPLETED: CheckCheck
};

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

  const currentStatusId = normalizeOrderStatus(order.order_status || order.status);
  const currentStepIndex = ORDER_STATUSES.findIndex(s => s.id === currentStatusId);
  const isCancelled = currentStatusId === 'CANCELLED';

  const handleSimulateNextStatus = () => {
    if (currentStepIndex < ORDER_STATUSES.length - 1) {
      const nextStatusId = ORDER_STATUSES[currentStepIndex + 1].id;
      const updated = dbService.updateOrderStatus(order.id, nextStatusId);
      setOrder(updated);
      notificationService.notifyOrderStatusChange(order.id, nextStatusId);
      showToast(`Status Order #${order.id} updated to ${nextStatusId}`, 'success');
    }
  };

  const formatRupiah = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
  const wibCreated = formatWIBDateTime(order.created_at || order.createdAt);
  const wibUpdated = formatWIBDateTime(order.updated_at || order.updatedAt);

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
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#D8C7A1] flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#D8C7A1] animate-spin" />
                REALTIME ORDER PROGRESS
              </span>
            </div>
            <h2 className="font-serif text-2xl font-bold tracking-wide mt-1">LIVE ORDER TRACKER</h2>
            <p className="text-[11px] font-mono text-[#D8C7A1]/80 mt-0.5">Order Time: {wibCreated.full}</p>
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
          
          {/* SIMULATION CONTROL BAR */}
          <div className="p-4 rounded-2xl bg-[#071B2A] text-[#F7F3EA] border border-[#D8C7A1]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#D8C7A1]">LIVE SIMULATION CONTROL</span>
              <p className="text-xs text-[#F7F3EA]/80 font-sans">Simulasikan pergantian status dapur secara realtime</p>
            </div>
            
            <button
              onClick={handleSimulateNextStatus}
              disabled={currentStepIndex >= ORDER_STATUSES.length - 1 || isCancelled}
              className="px-4 py-2.5 rounded-xl bg-[#D8C7A1] text-[#071B2A] text-xs font-bold uppercase tracking-wider hover:bg-[#F7F3EA] disabled:opacity-50 transition-all flex items-center justify-center gap-2 shrink-0 shadow-md"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>ADVANCE STATUS</span>
            </button>
          </div>

          {/* ORDER OVERVIEW CARD */}
          <div className="p-4 rounded-2xl bg-[#E8E5DC] border border-[#063B32]/10 space-y-3 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-[#10201F]/60">Customer:</span>
                <p className="font-bold text-[#10201F]">{order.customer_name || order.customerName} ({order.customer_phone || order.whatsapp})</p>
              </div>
              <div>
                <span className="text-[#10201F]/60">Payment Method:</span>
                <p className="font-bold text-[#063B32]">{order.payment_method || order.paymentMethod} ({order.payment_status || order.paymentStatus})</p>
              </div>
              <div>
                <span className="text-[#10201F]/60">Total Feast:</span>
                <p className="font-serif text-base font-bold text-[#063B32]">{formatRupiah(order.total)}</p>
              </div>
            </div>

            {/* Delivery Address Display */}
            <div className="pt-2 border-t border-[#063B32]/10 flex items-start gap-2 text-[11px] text-[#10201F]/90">
              <MapPin className="w-4 h-4 text-[#063B32] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Delivery Location: </span>
                <span>{order.customer_address || order.address}</span>
              </div>
            </div>
          </div>

          {/* VISUAL TIMELINE OF 7 UNIFIED STEPS */}
          <div className="relative pl-6 space-y-6 before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#063B32]/20">
            {ORDER_STATUSES.map((stepItem, idx) => {
              const IconComponent = STATUS_ICONS[stepItem.id] || Clock;
              const isPassed = currentStepIndex > idx;
              const isCurrent = currentStepIndex === idx;
              const isUpcoming = currentStepIndex < idx;

              return (
                <div key={stepItem.id} className="relative flex items-start gap-4 group">
                  
                  {/* Step Node Icon */}
                  <div className={`absolute -left-6 top-0 w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all shadow-md z-10 ${
                    isCurrent
                      ? 'bg-[#063B32] text-[#D8C7A1] border-[#D8C7A1] scale-110 ring-4 ring-[#063B32]/20 animate-pulse'
                      : isPassed
                        ? 'bg-[#063B32] text-[#D8C7A1] border-[#063B32]'
                        : 'bg-[#E8E5DC] text-gray-400 border-gray-300'
                  }`}>
                    {isPassed ? (
                      <span className="font-bold text-xs">✓</span>
                    ) : isCurrent ? (
                      <span className="text-xs">●</span>
                    ) : (
                      <span className="text-xs text-gray-400">○</span>
                    )}
                  </div>

                  {/* Step Description */}
                  <div className={`flex-1 p-3.5 rounded-2xl border transition-all ${
                    isCurrent 
                      ? 'bg-[#063B32] text-[#F7F3EA] border-[#D8C7A1] shadow-md'
                      : isPassed
                        ? 'bg-[#E8E5DC] text-[#10201F] border-[#063B32]/20'
                        : 'bg-white/50 text-gray-400 border-gray-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <IconComponent className={`w-4 h-4 ${isCurrent ? 'text-[#D8C7A1]' : isPassed ? 'text-[#063B32]' : 'text-gray-400'}`} />
                        <h4 className="font-bold text-xs uppercase tracking-wider">{stepItem.label}</h4>
                      </div>
                      
                      {isCurrent && (
                        <span className="text-[10px] uppercase font-bold font-mono px-2 py-0.5 rounded bg-[#D8C7A1] text-[#071B2A] tracking-widest">
                          CURRENT
                        </span>
                      )}

                      {isPassed && (
                        <span className="text-[10px] font-bold text-emerald-700">COMPLETED ✓</span>
                      )}
                    </div>

                    <p className={`text-xs mt-1 font-sans ${isCurrent ? 'text-[#F7F3EA]/90' : 'text-gray-600'}`}>
                      {stepItem.desc}
                    </p>

                    {isCurrent && (
                      <p className="text-[10px] text-[#D8C7A1] font-mono mt-1 pt-1 border-t border-[#D8C7A1]/20">
                        Updated at: {wibUpdated.time}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ORDER ITEMS BREAKDOWN */}
          <div className="p-4 rounded-2xl bg-white border border-[#063B32]/10 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#063B32] block border-b pb-1">
              FEAST ITEMS SNAPSHOT
            </span>
            <div className="space-y-1.5 text-xs">
              {(order.items || []).map((item, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <div>
                    <span className="font-bold text-[#10201F]">{item.name}</span>
                    <span className="text-[#10201F]/60 ml-2">x{item.quantity}</span>
                    {item.sauce && <span className="text-[10px] text-amber-700 block italic">Sauce: {item.sauce}</span>}
                  </div>
                  <span className="font-semibold text-[#063B32]">{formatRupiah(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* FOOTER */}
        <div className="p-4 bg-[#E8E5DC] border-t border-[#063B32]/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={() => {
              const waData = buildWhatsAppOrderMessage(order);
              window.open(waData.whatsappUrl, '_blank');
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <MessageSquare className="w-4 h-4" />
            <span>CONTACT KITCHEN ON WHATSAPP</span>
          </button>

          <button 
            onClick={() => setActiveTrackingOrderId(null)}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#063B32] text-[#D8C7A1] text-xs font-bold uppercase tracking-wider hover:bg-[#071B2A] transition-all"
          >
            CLOSE TRACKER
          </button>
        </div>

      </div>
    </div>
  );
};
