import React, { useState, useEffect } from 'react';
import { dbService, ORDER_STATUSES, normalizeOrderStatus, formatWIBDateTime } from '../../services/db';
import { realtimeService } from '../../services/realtime';
import { buildAdminToCustomerWALink } from '../../services/whatsapp';
import { useApp } from '../../context/AppContext';
import { 
  Search, 
  Filter, 
  Printer, 
  MessageSquare, 
  Eye, 
  RefreshCw,
  X,
  Phone,
  CheckCircle2,
  Clock,
  MapPin,
  ExternalLink
} from 'lucide-react';

export const AdminOrders = ({ initialSelectedOrder }) => {
  const { showToast, refreshDataFromDB } = useApp();
  const [orders, setOrders] = useState(dbService.getOrders());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedOrderForModal, setSelectedOrderForModal] = useState(initialSelectedOrder || null);
  const [newlyArrivedIds, setNewlyArrivedIds] = useState([]);

  const fetchLatestOrders = () => {
    const updated = dbService.getOrders();
    setOrders(updated);
  };

  useEffect(() => {
    fetchLatestOrders();

    // REALTIME EVENT LISTENERS
    const unsubscribeNewOrder = realtimeService.subscribe('NEW_ORDER', (newOrder) => {
      fetchLatestOrders();
      setNewlyArrivedIds(prev => [newOrder.id, ...prev]);

      // Highlight new order for 6 seconds
      setTimeout(() => {
        setNewlyArrivedIds(prev => prev.filter(id => id !== newOrder.id));
      }, 6000);
    });

    const unsubscribeStatus = realtimeService.subscribe('ORDER_STATUS_UPDATED', () => {
      fetchLatestOrders();
    });

    return () => {
      unsubscribeNewOrder();
      unsubscribeStatus();
    };
  }, []);

  const handleStatusChange = (orderId, newStatus) => {
    dbService.updateOrderStatus(orderId, newStatus);
    fetchLatestOrders();
    refreshDataFromDB();
    showToast(`Order #${orderId} status updated to ${newStatus}`, 'success');
  };

  const filteredOrders = orders.filter(order => {
    const custName = order.customer_name || order.customerName || '';
    const phone = order.customer_phone || order.whatsapp || '';
    const status = normalizeOrderStatus(order.order_status || order.status);

    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      custName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      phone.includes(searchQuery);

    const matchesStatus = statusFilter === 'ALL' || status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const formatRupiah = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* HEADER & CONTROLS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#063B32]/10 pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#B98262]">REALTIME ORDER MANAGEMENT</span>
          <h1 className="font-serif text-3xl font-bold text-[#10201F]">RECENT ORDERS QUEUE</h1>
        </div>

        <button 
          onClick={fetchLatestOrders}
          className="px-4 py-2.5 rounded-xl bg-[#063B32] text-[#D8C7A1] text-xs font-bold flex items-center gap-2 hover:bg-[#071B2A] transition-all shadow-md"
        >
          <RefreshCw className="w-4 h-4 text-[#D8C7A1]" />
          <span>SYNC QUEUE</span>
        </button>
      </div>

      {/* FILTERS & SEARCH BAR */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="relative sm:col-span-2">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Order ID, Customer Name, or Phone..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#063B32]/20 text-xs focus:outline-none focus:border-[#063B32]"
          />
        </div>

        <div className="relative">
          <Filter className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#063B32]/20 text-xs font-bold focus:outline-none"
          >
            <option value="ALL">All Order Statuses</option>
            {ORDER_STATUSES.map(st => (
              <option key={st.id} value={st.id}>{st.label}</option>
            ))}
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </div>
      </div>

      {/* ORDERS TABLE WITH HIGHLIGHT ANIMATION */}
      <div className="rounded-2xl bg-[#F5F1E8] border border-[#063B32]/10 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#10201F]">
            <thead className="bg-[#063B32] text-[#D8C7A1] uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="p-4">ORDER ID</th>
                <th className="p-4">CUSTOMER</th>
                <th className="p-4">ORDERED AT (WIB)</th>
                <th className="p-4">TOTAL</th>
                <th className="p-4">PAYMENT</th>
                <th className="p-4">STATUS PROGRESS</th>
                <th className="p-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#063B32]/10">
              {filteredOrders.map(order => {
                const isNewHighlight = newlyArrivedIds.includes(order.id);
                const currentStatus = normalizeOrderStatus(order.order_status || order.status);
                const custName = order.customer_name || order.customerName;
                const custPhone = order.customer_phone || order.whatsapp;
                const wibTime = formatWIBDateTime(order.created_at || order.createdAt);

                return (
                  <tr 
                    key={order.id} 
                    className={`transition-all duration-500 ${
                      isNewHighlight 
                        ? 'bg-amber-100/90 border-l-4 border-amber-500 font-medium scale-[1.002]' 
                        : 'hover:bg-[#E8E5DC]/60'
                    }`}
                  >
                    <td className="p-4 font-mono font-bold text-[#063B32] flex items-center gap-1.5">
                      #{order.id}
                      {isNewHighlight && (
                        <span className="px-1.5 py-0.5 rounded bg-amber-500 text-white text-[9px] font-bold animate-pulse">
                          NEW!
                        </span>
                      )}
                    </td>
                    <td className="p-4 font-semibold">
                      {custName}
                      <span className="block text-[10px] text-gray-500 font-normal">{custPhone}</span>
                    </td>
                    <td className="p-4 font-mono text-[11px] text-gray-600">
                      {wibTime.full}
                    </td>
                    <td className="p-4 font-serif font-bold text-sm text-[#063B32]">
                      {formatRupiah(order.total)}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded text-[10px] font-bold ${
                        (order.payment_status || order.paymentStatus) === 'PAID' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {order.payment_method || order.paymentMethod} ({order.payment_status || order.paymentStatus})
                      </span>
                    </td>
                    <td className="p-4">
                      <select
                        value={currentStatus}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className="px-2.5 py-1.5 rounded-lg bg-white border border-[#063B32]/20 text-[11px] font-bold text-[#063B32] focus:outline-none"
                      >
                        {ORDER_STATUSES.map(st => (
                          <option key={st.id} value={st.id}>{st.label}</option>
                        ))}
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>
                    <td className="p-4 text-right space-x-1">
                      <button 
                        onClick={() => setSelectedOrderForModal(order)}
                        className="p-1.5 rounded-lg bg-white text-[#063B32] hover:bg-[#063B32] hover:text-[#D8C7A1] border border-[#063B32]/20"
                        title="View Order Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      
                      <a 
                        href={buildAdminToCustomerWALink(order)}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 inline-block"
                        title="Contact Customer on WhatsApp"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL MODAL WITH STRUCTURED ADDRESS BREAKDOWN */}
      {selectedOrderForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#071B2A]/85 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg rounded-3xl bg-[#F5F1E8] border border-[#D8C7A1] p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            
            <button 
              onClick={() => setSelectedOrderForModal(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center border-b border-[#063B32]/10 pb-4">
              <span className="font-mono text-xs font-bold text-[#063B32]">ORDER DETAIL #{selectedOrderForModal.id}</span>
              <h3 className="font-serif text-xl font-bold text-[#10201F]">MUSCLE CHICKEN INDONESIA</h3>
              <p className="text-[11px] text-gray-600 font-mono mt-0.5">
                ORDERED AT: {formatWIBDateTime(selectedOrderForModal.created_at || selectedOrderForModal.createdAt).full}
              </p>
              <div className="mt-2 inline-block px-3 py-1 rounded-full bg-[#063B32] text-[#D8C7A1] text-[10px] font-bold tracking-wider uppercase">
                STATUS: {normalizeOrderStatus(selectedOrderForModal.order_status || selectedOrderForModal.status)}
              </div>
            </div>

            {/* CUSTOMER INFO & STRUCTURED ADDRESS */}
            <div className="space-y-2 text-xs bg-white/70 p-4 rounded-2xl border border-[#063B32]/10">
              <p className="font-bold text-[#063B32] uppercase text-[10px] tracking-wider">CUSTOMER INFORMATION</p>
              <p><strong>Name:</strong> {selectedOrderForModal.customer_name || selectedOrderForModal.customerName}</p>
              <p><strong>Phone / WhatsApp:</strong> {selectedOrderForModal.customer_phone || selectedOrderForModal.whatsapp}</p>
              <p><strong>Payment Method:</strong> {selectedOrderForModal.payment_method || selectedOrderForModal.paymentMethod} ({selectedOrderForModal.payment_status || selectedOrderForModal.paymentStatus})</p>

              <div className="pt-2 border-t border-[#063B32]/10">
                <p className="font-bold text-[#063B32] uppercase text-[10px] tracking-wider mb-1">DELIVERY ADDRESS BREAKDOWN</p>
                {selectedOrderForModal.structured_address && typeof selectedOrderForModal.structured_address === 'object' ? (
                  <div className="space-y-0.5 text-gray-700 pl-2 border-l-2 border-[#063B32]/20">
                    <p><strong>Province:</strong> {selectedOrderForModal.structured_address.provinceName || '-'}</p>
                    <p><strong>City / Regency:</strong> {selectedOrderForModal.structured_address.cityName || '-'}</p>
                    <p><strong>District:</strong> {selectedOrderForModal.structured_address.districtName || '-'}</p>
                    <p><strong>Village:</strong> {selectedOrderForModal.structured_address.villageName || '-'}</p>
                    <p><strong>Street:</strong> {selectedOrderForModal.structured_address.street || '-'}</p>
                    <p><strong>House Number:</strong> {selectedOrderForModal.structured_address.houseNumber || '-'}</p>
                    <p><strong>Postal Code:</strong> {selectedOrderForModal.structured_address.postalCode || '-'}</p>
                    {selectedOrderForModal.structured_address.additionalDetails && (
                      <p><strong>Additional Details:</strong> {selectedOrderForModal.structured_address.additionalDetails}</p>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-700 font-sans">{selectedOrderForModal.customer_address || selectedOrderForModal.address}</p>
                )}
              </div>

              {/* MAP LAT/LNG IF AVAILABLE */}
              {(selectedOrderForModal.latitude || selectedOrderForModal.longitude) && (
                <div className="pt-2">
                  <a 
                    href={`https://maps.google.com/?q=${selectedOrderForModal.latitude},${selectedOrderForModal.longitude}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-emerald-700 hover:underline flex items-center gap-1 font-bold"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>VIEW MAP PIN LOCATION ({selectedOrderForModal.latitude}, {selectedOrderForModal.longitude})</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>

            {/* ORDER ITEMS SNAPSHOT */}
            <div className="border-y border-[#063B32]/15 py-3 space-y-1.5 text-xs">
              <span className="font-bold text-[#063B32] block uppercase text-[10px]">PRODUCTS ORDERED (SNAPSHOT):</span>
              {(selectedOrderForModal.items || []).map((item, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <div>
                    <span className="font-medium">{item.name}</span>
                    <span className="text-[#10201F]/60 ml-2">x{item.quantity}</span>
                    {item.sauce && <span className="text-[10px] text-amber-700 block">Sauce: {item.sauce}</span>}
                  </div>
                  <span className="font-bold">{formatRupiah(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-1 text-xs font-bold text-[#063B32]">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{formatRupiah(selectedOrderForModal.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee:</span>
                <span>{formatRupiah(selectedOrderForModal.delivery_fee || selectedOrderForModal.deliveryFee || 0)}</span>
              </div>
              <div className="flex justify-between text-base font-serif border-t border-[#063B32]/10 pt-2">
                <span>TOTAL:</span>
                <span>{formatRupiah(selectedOrderForModal.total)}</span>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="pt-4 space-y-2">
              <a 
                href={buildAdminToCustomerWALink(selectedOrderForModal)}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 rounded-xl bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-md"
              >
                <Phone className="w-4 h-4" />
                <span>[ CONTACT CUSTOMER ON WHATSAPP ]</span>
              </a>

              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => window.print()} 
                  className="py-2.5 rounded-xl bg-[#063B32] text-[#D8C7A1] text-xs font-bold flex items-center justify-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  <span>PRINT RECEIPT</span>
                </button>
                <button 
                  onClick={() => setSelectedOrderForModal(null)} 
                  className="py-2.5 rounded-xl bg-gray-200 text-[#10201F] text-xs font-bold"
                >
                  CLOSE
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
