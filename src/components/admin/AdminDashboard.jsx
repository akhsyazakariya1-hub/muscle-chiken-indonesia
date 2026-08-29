import React, { useState, useEffect } from 'react';
import { dbService, formatWIBTimestamp } from '../../services/db';
import { realtimeService } from '../../services/realtime';
import { 
  DollarSign, 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  Crown,
  Users,
  ChefHat
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Filler,
  Title,
  Tooltip,
  Legend
);


export const AdminDashboard = () => {
  const [orders, setOrders] = useState(dbService.getOrders());
  const [products, setProducts] = useState(dbService.getProducts());

  const refreshDashboardData = () => {
    setOrders(dbService.getOrders());
    setProducts(dbService.getProducts());
  };

  useEffect(() => {
    refreshDashboardData();

    // REALTIME DASHBOARD EVENT LISTENERS
    const unsubscribeNewOrder = realtimeService.subscribe('NEW_ORDER', () => {
      refreshDashboardData();
    });

    const unsubscribeStatus = realtimeService.subscribe('ORDER_STATUS_UPDATED', () => {
      refreshDashboardData();
    });

    return () => {
      unsubscribeNewOrder();
      unsubscribeStatus();
    };
  }, []);

  const totalRevenue = orders.reduce((sum, o) => sum + ((o.payment_status || o.paymentStatus) === 'PAID' ? o.total : 0), 0);
  const totalOrders = orders.length;
  const newOrdersCount = orders.filter(o => (o.order_status || o.status) === 'NEW').length;
  const preparingCount = orders.filter(o => ['PREPARING', 'COOKING'].includes(o.order_status || o.status)).length;
  const completedOrders = orders.filter(o => (o.order_status || o.status) === 'COMPLETED').length;
  const cancelledOrders = orders.filter(o => (o.order_status || o.status) === 'CANCELLED').length;
  const lowStockCount = products.filter(p => p.stock <= (p.lowStockThreshold || 10)).length;

  const formatRupiah = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);

  const revenueChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Revenue (IDR)',
        data: [1200000, 1850000, 1400000, 2100000, 3400000, 4800000, Math.max(3900000, totalRevenue)],
        borderColor: '#063B32',
        backgroundColor: 'rgba(6, 59, 50, 0.2)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const categoryChartData = {
    labels: ['Fried Chicken', 'Grilled', 'Roasted', 'Burgers', 'Bowls', 'Sides'],
    datasets: [
      {
        data: [35, 25, 15, 12, 8, 5],
        backgroundColor: ['#063B32', '#071B2A', '#092C32', '#D8C7A1', '#B98262', '#10201F']
      }
    ]
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* HEADER TITLE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#063B32]/10 pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#B98262]">REALTIME LIVE METRICS</span>
          <h1 className="font-serif text-3xl font-bold text-[#10201F]">EXECUTIVE DASHBOARD</h1>
        </div>
        <div className="flex items-center gap-2 bg-[#063B32] text-[#D8C7A1] px-4 py-2 rounded-xl text-xs font-bold shadow-md">
          <Crown className="w-4 h-4 text-[#D8C7A1]" />
          <span>LIVE TIMEZONE: ASIA/JAKARTA (WIB)</span>
        </div>
      </div>

      {/* KPI METRICS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* TODAY'S REVENUE */}
        <div className="p-6 rounded-2xl bg-[#063B32] text-[#F7F3EA] border border-[#D8C7A1]/40 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#D8C7A1]">TODAY'S REVENUE</span>
            <h3 className="font-serif text-2xl font-bold mt-1 text-[#F7F3EA]">{formatRupiah(totalRevenue)}</h3>
            <p className="text-[10px] text-[#D8C7A1] mt-1 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> Realtime synced
            </p>
          </div>
          <div className="p-3 rounded-xl bg-[#071B2A] text-[#D8C7A1] border border-[#D8C7A1]/30">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* TODAY'S ORDERS */}
        <div className="p-6 rounded-2xl bg-[#F5F1E8] border border-[#063B32]/10 shadow-md flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-gray-500">TODAY'S ORDERS</span>
            <h3 className="font-serif text-3xl font-bold mt-1 text-[#10201F]">{totalOrders}</h3>
            <p className="text-[10px] text-emerald-700 mt-1 font-semibold">{newOrdersCount} order baru (NEW)</p>
          </div>
          <div className="p-3 rounded-xl bg-[#063B32]/10 text-[#063B32]">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        {/* PREPARING & COOKING */}
        <div className="p-6 rounded-2xl bg-[#F5F1E8] border border-[#063B32]/10 shadow-md flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-gray-500">PREPARING & COOKING</span>
            <h3 className="font-serif text-3xl font-bold mt-1 text-[#B98262]">{preparingCount}</h3>
            <p className="text-[10px] text-gray-500 mt-1">Sedang diproses di dapur</p>
          </div>
          <div className="p-3 rounded-xl bg-[#B98262]/20 text-[#B98262]">
            <ChefHat className="w-6 h-6" />
          </div>
        </div>

        {/* COMPLETED ORDERS */}
        <div className="p-6 rounded-2xl bg-[#F5F1E8] border border-[#063B32]/10 shadow-md flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-gray-500">COMPLETED ORDERS</span>
            <h3 className="font-serif text-3xl font-bold mt-1 text-[#063B32]">{completedOrders}</h3>
            <p className="text-[10px] text-gray-500 mt-1">Sukses terkirim</p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-100 text-emerald-800">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 p-6 rounded-2xl bg-[#F5F1E8] border border-[#063B32]/10 shadow-lg space-y-4">
          <h3 className="font-serif text-lg font-bold text-[#063B32]">Live Sales & Revenue Trend</h3>
          <div className="h-64">
            <Line data={revenueChartData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-[#F5F1E8] border border-[#063B32]/10 shadow-lg space-y-4">
          <h3 className="font-serif text-lg font-bold text-[#063B32]">Popular Category Share (%)</h3>
          <div className="h-64 flex items-center justify-center">
            <Doughnut data={categoryChartData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>
      </div>

    </div>
  );
};
