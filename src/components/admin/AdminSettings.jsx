import React, { useState } from 'react';
import { dbService } from '../../services/db';
import { cryptoAuthService } from '../../services/cryptoAuth';
import { audioService } from '../../services/audio';
import { notificationService } from '../../services/notification';
import { useApp } from '../../context/AppContext';
import { Settings, Save, ShieldCheck, Lock, Volume2, Bell } from 'lucide-react';

export const AdminSettings = () => {
  const { settings, refreshDataFromDB, showToast } = useApp();
  const [activeTab, setActiveTab] = useState('general'); // 'general', 'security', 'notifications'

  // General Settings State
  const [businessName, setBusinessName] = useState(settings.businessName || 'Muscle Chicken Indonesia');
  const [whatsappNumber, setWhatsappNumber] = useState(settings.whatsappNumber || '6281234567890');
  const [instagram, setInstagram] = useState(settings.instagram || '@musclechicken.id');
  const [address, setAddress] = useState(settings.address || 'SCBD Lot 28, Jl. Jend. Sudirman No.52, Jakarta');
  const [openingHours, setOpeningHours] = useState(settings.openingHours || '10:00 - 22:00 WIB Everyday');
  const [baseDeliveryFee, setBaseDeliveryFee] = useState(settings.baseDeliveryFee || 12000);
  const [deliveryFeePerKm, setDeliveryFeePerKm] = useState(settings.deliveryFeePerKm || 3000);
  const [freeDeliveryThreshold, setFreeDeliveryThreshold] = useState(settings.freeDeliveryThreshold || 200000);

  // Security / Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Notification & Sound State
  const [soundEnabled, setSoundEnabled] = useState(settings.soundEnabled ?? true);
  const [newOrderNotification, setNewOrderNotification] = useState(settings.newOrderNotification ?? true);
  const [browserNotification, setBrowserNotification] = useState(settings.browserNotification ?? true);

  const handleSaveGeneral = (e) => {
    e.preventDefault();
    dbService.saveSettings({
      ...settings,
      businessName,
      whatsappNumber,
      instagram,
      address,
      openingHours,
      baseDeliveryFee: Number(baseDeliveryFee),
      deliveryFeePerKm: Number(deliveryFeePerKm),
      freeDeliveryThreshold: Number(freeDeliveryThreshold),
      soundEnabled,
      newOrderNotification,
      browserNotification
    });
    audioService.setSoundEnabled(soundEnabled);
    refreshDataFromDB();
    showToast('Pengaturan bisnis berhasil diperbarui!', 'success');
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast('Password baru dan konfirmasi password tidak cocok.', 'error');
      return;
    }

    const res = await cryptoAuthService.changeAdminPassword(currentPassword, newPassword);
    if (res.success) {
      showToast(res.message, 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      showToast(res.message, 'error');
    }
  };

  const handleTestSound = () => {
    audioService.setSoundEnabled(true);
    audioService.playNewOrderChime();
    showToast('Memainkan sampel suara notifikasi pesanan baru 🔔', 'info');
  };

  const handleEnableWebPush = async () => {
    const granted = await notificationService.requestPermission();
    if (granted) {
      showToast('Web Push Notification diaktifkan untuk browser ini!', 'success');
    } else {
      showToast('Permission Web Push ditolak atau tidak didukung.', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      <div className="border-b border-[#063B32]/10 pb-6">
        <span className="text-xs font-bold uppercase tracking-widest text-[#B98262]">SYSTEM CONFIGURATION</span>
        <h1 className="font-serif text-3xl font-bold text-[#10201F]">ADMIN SETTINGS & SECURITY</h1>
      </div>

      {/* TABS SWITCHER */}
      <div className="flex items-center gap-3 border-b border-[#063B32]/10 pb-3">
        <button
          onClick={() => setActiveTab('general')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'general' ? 'bg-[#063B32] text-[#D8C7A1]' : 'bg-[#E8E5DC] text-[#10201F]'
          }`}
        >
          Informasi & Ongkir
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'notifications' ? 'bg-[#063B32] text-[#D8C7A1]' : 'bg-[#E8E5DC] text-[#10201F]'
          }`}
        >
          Notifikasi & Suara
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'security' ? 'bg-[#063B32] text-[#D8C7A1]' : 'bg-[#E8E5DC] text-[#10201F]'
          }`}
        >
          Security & Password
        </button>
      </div>

      {/* GENERAL TAB */}
      {activeTab === 'general' && (
        <form onSubmit={handleSaveGeneral} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="p-6 rounded-3xl bg-[#F5F1E8] border border-[#063B32]/20 shadow-xl space-y-4">
            <h3 className="font-serif text-xl font-bold text-[#063B32]">Informasi Bisnis</h3>

            <div>
              <label className="block text-xs font-bold uppercase text-[#10201F] mb-1">NAMA BISNIS</label>
              <input type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)} className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#063B32]/20 text-xs font-bold" required />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-[#10201F] mb-1">NOMOR WHATSAPP ADMIN (NOTIFIKASI ORDER) *</label>
              <input type="text" value={whatsappNumber} onChange={(e) => setWhatsappNumber(e.target.value)} className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#063B32]/20 text-xs font-mono font-bold" required />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-[#10201F] mb-1">INSTAGRAM HANDLE</label>
              <input type="text" value={instagram} onChange={(e) => setInstagram(e.target.value)} className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#063B32]/20 text-xs" />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-[#10201F] mb-1">ALAMAT STORE</label>
              <textarea rows="2" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#063B32]/20 text-xs" />
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-[#F5F1E8] border border-[#063B32]/20 shadow-xl space-y-4">
            <h3 className="font-serif text-xl font-bold text-[#063B32]">Pengaturan Delivery Fee</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-[#10201F] mb-1">BASE FEE (IDR)</label>
                <input type="number" value={baseDeliveryFee} onChange={(e) => setBaseDeliveryFee(e.target.value)} className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#063B32]/20 text-xs font-bold" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-[#10201F] mb-1">PER KM FEE (IDR)</label>
                <input type="number" value={deliveryFeePerKm} onChange={(e) => setDeliveryFeePerKm(e.target.value)} className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#063B32]/20 text-xs font-bold" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-[#10201F] mb-1">FREE DELIVERY MINIMUM (IDR)</label>
              <input type="number" value={freeDeliveryThreshold} onChange={(e) => setFreeDeliveryThreshold(e.target.value)} className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#063B32]/20 text-xs font-bold text-[#063B32]" />
            </div>

            <button type="submit" className="w-full py-3.5 rounded-xl bg-[#063B32] text-[#D8C7A1] font-bold text-xs uppercase tracking-wider hover:bg-[#071B2A] border border-[#D8C7A1]">
              Simpan Pengaturan General
            </button>
          </div>
        </form>
      )}

      {/* NOTIFICATIONS & SOUND TAB */}
      {activeTab === 'notifications' && (
        <form onSubmit={handleSaveGeneral} className="p-8 rounded-3xl bg-[#F5F1E8] border border-[#063B32]/20 shadow-xl max-w-2xl space-y-6">
          <h3 className="font-serif text-xl font-bold text-[#063B32]">Notifikasi & Pengaturan Suara</h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-[#063B32]/10">
              <div>
                <h4 className="text-xs font-bold text-[#10201F]">SUARA NOTIFIKASI ORDER BARU</h4>
                <p className="text-[10px] text-gray-500">Mainkan chime lembut saat order masuk secara realtime</p>
              </div>
              <input 
                type="checkbox" 
                checked={soundEnabled} 
                onChange={(e) => {
                  setSoundEnabled(e.target.checked);
                  audioService.setSoundEnabled(e.target.checked);
                }} 
                className="w-5 h-5"
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-[#063B32]/10">
              <div>
                <h4 className="text-xs font-bold text-[#10201F]">TOAST POP-UP DASHBOARD</h4>
                <p className="text-[10px] text-gray-500">Tampilkan toast melayang saat customer checkout</p>
              </div>
              <input 
                type="checkbox" 
                checked={newOrderNotification} 
                onChange={(e) => setNewOrderNotification(e.target.checked)} 
                className="w-5 h-5"
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-[#063B32]/10">
              <div>
                <h4 className="text-xs font-bold text-[#10201F]">WEB BROWSER PUSH NOTIFICATION</h4>
                <p className="text-[10px] text-gray-500">Kirim notifikasi OS browser meskipun tab sedang tidak fokus</p>
              </div>
              <input 
                type="checkbox" 
                checked={browserNotification} 
                onChange={(e) => setBrowserNotification(e.target.checked)} 
                className="w-5 h-5"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleTestSound}
              className="px-5 py-3 rounded-xl bg-[#071B2A] text-[#D8C7A1] text-xs font-bold uppercase tracking-wider flex items-center gap-2"
            >
              <Volume2 className="w-4 h-4 text-[#D8C7A1]" />
              <span>ENABLE & TEST NOTIFICATION SOUND</span>
            </button>

            <button
              type="button"
              onClick={handleEnableWebPush}
              className="px-5 py-3 rounded-xl bg-[#063B32] text-[#D8C7A1] text-xs font-bold uppercase tracking-wider flex items-center gap-2"
            >
              <Bell className="w-4 h-4 text-[#D8C7A1]" />
              <span>REQUEST BROWSER PERMISSION</span>
            </button>
          </div>

          <button type="submit" className="w-full py-3.5 rounded-xl bg-[#063B32] text-[#D8C7A1] font-bold text-xs uppercase tracking-wider hover:bg-[#071B2A] border border-[#D8C7A1]">
            Simpan Pengaturan Notifikasi
          </button>
        </form>
      )}

      {/* SECURITY / CHANGE PASSWORD TAB */}
      {activeTab === 'security' && (
        <form onSubmit={handleChangePassword} className="p-8 rounded-3xl bg-[#071B2A] text-[#F7F3EA] border border-[#D8C7A1]/40 shadow-2xl max-w-md space-y-4">
          <div className="flex items-center gap-3 border-b border-[#D8C7A1]/20 pb-3">
            <ShieldCheck className="w-6 h-6 text-[#D8C7A1]" />
            <h3 className="font-serif text-xl font-bold text-[#F7F3EA]">SECURITY — CHANGE PASSWORD</h3>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-[#D8C7A1] mb-1">PASSWORD SAAT INI *</label>
            <input 
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Masukkan password lama..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#063B32]/60 border border-[#D8C7A1]/30 text-xs text-white"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-[#D8C7A1] mb-1">PASSWORD BARU (MIN 8 CHARS) *</label>
            <input 
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Masukkan password baru..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#063B32]/60 border border-[#D8C7A1]/30 text-xs text-white"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-[#D8C7A1] mb-1">KONFIRMASI PASSWORD BARU *</label>
            <input 
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Ulangi password baru..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#063B32]/60 border border-[#D8C7A1]/30 text-xs text-white"
              required
            />
          </div>

          <button 
            type="submit"
            className="w-full py-3.5 rounded-xl bg-[#D8C7A1] text-[#071B2A] font-bold text-xs uppercase tracking-widest hover:bg-[#F7F3EA] border border-[#D8C7A1] shadow-lg mt-2"
          >
            UPDATE SECURE PASSWORD
          </button>
        </form>
      )}

    </div>
  );
};
