// Secure Cryptographic Password Hashing & Authentication Service

// Safe SHA-256 Hashing helper with HTTP/Non-Secure context fallback
export const hashPassword = async (password, salt = 'muscle_chicken_salt_2026') => {
  const str = password + salt;
  try {
    if (window.crypto && window.crypto.subtle && window.crypto.subtle.digest) {
      const encoder = new TextEncoder();
      const data = encoder.encode(str);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
  } catch (e) {
    console.warn('crypto.subtle unavailable, using fallback hash:', e);
  }

  // Fallback hash implementation for non-secure HTTP contexts
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return 'fb_' + Math.abs(hash).toString(16) + '_' + str.length;
};

// Initial hashed credentials
const INITIAL_ADMIN_EMAIL = 'adminmuschle@gmail.com';
const INITIAL_SALT = 'muscle_chicken_salt_2026';

const KEYS = {
  ADMIN_HASH: 'mc_admin_password_hash_v2',
  ADMIN_EMAIL: 'mc_admin_email_v2',
  ADMIN_SESSION: 'mc_admin_session_v2'
};

export const cryptoAuthService = {
  // Initialize initial admin credentials safely
  initAdminCredentials: async () => {
    if (!localStorage.getItem(KEYS.ADMIN_HASH)) {
      const initialHash = await hashPassword('zakariya2000', INITIAL_SALT);
      localStorage.setItem(KEYS.ADMIN_HASH, initialHash);
      localStorage.setItem(KEYS.ADMIN_EMAIL, INITIAL_ADMIN_EMAIL);
    }
  },

  // Authenticate Admin securely
  loginAdmin: async (email, password) => {
    await cryptoAuthService.initAdminCredentials();

    const storedEmail = localStorage.getItem(KEYS.ADMIN_EMAIL) || INITIAL_ADMIN_EMAIL;
    const storedHash = localStorage.getItem(KEYS.ADMIN_HASH);

    if (email.trim().toLowerCase() !== storedEmail.trim().toLowerCase()) {
      return { success: false, message: 'Invalid email or password.' };
    }

    const inputHash = await hashPassword(password, INITIAL_SALT);
    if (inputHash !== storedHash) {
      return { success: false, message: 'Invalid email or password.' };
    }

    // Generate secure session payload
    const adminSession = {
      id: 'adm-super-01',
      name: 'Super Admin Executive',
      email: storedEmail,
      role: 'SUPER_ADMIN',
      token: `token_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      expiresAt: Date.now() + 86400000 // 24 hours
    };

    localStorage.setItem(KEYS.ADMIN_SESSION, JSON.stringify(adminSession));
    window.dispatchEvent(new Event('mc_admin_auth_changed'));

    return { success: true, admin: adminSession };
  },

  getAdminSession: () => {
    const raw = localStorage.getItem(KEYS.ADMIN_SESSION);
    if (!raw) return null;
    try {
      const session = JSON.parse(raw);
      if (session.expiresAt && Date.now() > session.expiresAt) {
        cryptoAuthService.logoutAdmin();
        return null;
      }
      return session;
    } catch (e) {
      return null;
    }
  },

  logoutAdmin: () => {
    localStorage.removeItem(KEYS.ADMIN_SESSION);
    window.dispatchEvent(new Event('mc_admin_auth_changed'));
  },

  changeAdminPassword: async (currentPassword, newPassword) => {
    const storedHash = localStorage.getItem(KEYS.ADMIN_HASH);
    const inputCurrentHash = await hashPassword(currentPassword, INITIAL_SALT);

    if (inputCurrentHash !== storedHash) {
      return { success: false, message: 'Password lama Anda tidak sesuai.' };
    }

    if (newPassword.length < 8) {
      return { success: false, message: 'Password baru minimal 8 karakter.' };
    }

    const newHash = await hashPassword(newPassword, INITIAL_SALT);
    localStorage.setItem(KEYS.ADMIN_HASH, newHash);

    return { success: true, message: 'Password Admin berhasil diperbarui!' };
  }
};
