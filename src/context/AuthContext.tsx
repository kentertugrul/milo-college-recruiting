import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// The password hash - you can change this to your preferred password
// Current password: "Milo2025!"
// This is a simple hash - for production, use a proper auth service
const PASSWORD_HASH = 'milo_college_recruiting_2025';

const AUTH_KEY = 'milo_auth_token';
const AUTH_TIMESTAMP_KEY = 'milo_auth_timestamp';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem(AUTH_KEY);
    const timestamp = localStorage.getItem(AUTH_TIMESTAMP_KEY);

    if (token === PASSWORD_HASH && timestamp) {
      const loginTime = parseInt(timestamp);
      const now = Date.now();

      // Check if session is still valid (within 24 hours)
      if (now - loginTime < SESSION_DURATION) {
        setIsAuthenticated(true);
      } else {
        // Session expired
        logout();
      }
    }

    setIsChecking(false);
  };

  const login = (password: string): boolean => {
    // Simple password check - in production, use proper authentication
    if (password === 'Milo2025!') {
      localStorage.setItem(AUTH_KEY, PASSWORD_HASH);
      localStorage.setItem(AUTH_TIMESTAMP_KEY, Date.now().toString());
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(AUTH_TIMESTAMP_KEY);
    setIsAuthenticated(false);
  };

  if (isChecking) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: 'var(--bg-secondary)',
        color: 'var(--text-primary)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎓</div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

