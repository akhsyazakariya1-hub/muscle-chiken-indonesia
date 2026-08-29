import React, { createContext, useContext, useState, useEffect } from 'react';
import { dbService } from '../services/db';
import { cryptoAuthService } from '../services/cryptoAuth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Customer session
  const [admin, setAdmin] = useState(null); // Admin session
  const [isAdminMode, setIsAdminMode] = useState(false);

  useEffect(() => {
    // Initialize Crypto Auth Default Admin
    cryptoAuthService.initAdminCredentials();

    // Check saved Customer session
    const savedUser = dbService.getCurrentUser();
    if (savedUser) setUser(savedUser);

    // Check valid Admin Session
    const activeAdmin = cryptoAuthService.getAdminSession();
    if (activeAdmin) {
      setAdmin(activeAdmin);
    }

    const handleAuthChanged = () => {
      const updatedAdmin = cryptoAuthService.getAdminSession();
      setAdmin(updatedAdmin);
      if (!updatedAdmin) setIsAdminMode(false);
    };

    window.addEventListener('mc_admin_auth_changed', handleAuthChanged);
    return () => window.removeEventListener('mc_admin_auth_changed', handleAuthChanged);
  }, []);

  const loginCustomer = (name, whatsapp, address, email = '') => {
    const newUser = {
      id: `usr-${Date.now()}`,
      name,
      whatsapp,
      address,
      email,
      joinedAt: new Date().toISOString()
    };
    setUser(newUser);
    dbService.setCurrentUser(newUser);
    return newUser;
  };

  const logoutCustomer = () => {
    setUser(null);
    dbService.setCurrentUser(null);
  };

  const loginAdmin = async (email, password) => {
    const res = await cryptoAuthService.loginAdmin(email, password);
    if (res.success) {
      setAdmin(res.admin);
      setIsAdminMode(true);
    }
    return res;
  };

  const logoutAdmin = () => {
    cryptoAuthService.logoutAdmin();
    setAdmin(null);
    setIsAdminMode(false);
  };

  return (
    <AuthContext.Provider value={{
      user,
      admin,
      isAdminMode,
      setIsAdminMode,
      loginCustomer,
      logoutCustomer,
      loginAdmin,
      logoutAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
