import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

// Hardcoded admin credentials for initial frontend-only implementation
const ADMIN_CREDENTIALS = {
  userId: 'admin',
  password: 'admin123',
};

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState(() => {
    // Restore from sessionStorage on mount
    const stored = sessionStorage.getItem('omnibin_auth');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return { isAuthenticated: false, userRole: null };
      }
    }
    return { isAuthenticated: false, userRole: null };
  });

  // Sync to sessionStorage whenever auth state changes
  useEffect(() => {
    sessionStorage.setItem('omnibin_auth', JSON.stringify(authState));
  }, [authState]);

  const login = (userId, password) => {
    if (userId === ADMIN_CREDENTIALS.userId && password === ADMIN_CREDENTIALS.password) {
      setAuthState({ isAuthenticated: true, userRole: 'admin' });
      return { success: true };
    }
    return { success: false, error: 'Invalid User ID or Password. Please try again.' };
  };

  const continueAsGuest = () => {
    setAuthState({ isAuthenticated: true, userRole: 'guest' });
  };

  const logout = () => {
    setAuthState({ isAuthenticated: false, userRole: null });
    sessionStorage.removeItem('omnibin_auth');
  };

  return (
    <AuthContext.Provider value={{
      ...authState,
      login,
      continueAsGuest,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
