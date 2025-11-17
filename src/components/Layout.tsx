import { ReactNode, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  MessageSquare, 
  Bell, 
  BarChart3, 
  Menu,
  X,
  GraduationCap,
  Trophy,
  LogOut
} from 'lucide-react';
import { getReminders } from '../utils/storage';
import { useAuth } from '../context/AuthContext';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const { logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [upcomingRemindersCount, setUpcomingRemindersCount] = useState(0);

  const handleLogout = () => {
    if (confirm('Are you sure you want to log out?')) {
      logout();
    }
  };

  useEffect(() => {
    const checkReminders = () => {
      const reminders = getReminders();
      const upcoming = reminders.filter(r => {
        if (r.completed) return false;
        const dueDate = new Date(r.dueDate);
        const now = new Date();
        const diffDays = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
        return diffDays >= 0 && diffDays <= 7;
      });
      setUpcomingRemindersCount(upcoming.length);
    };

    checkReminders();
    const interval = setInterval(checkReminders, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, [location]);

  const navItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/soccer', label: 'Soccer', icon: Trophy },
    { path: '/communications', label: 'Communications', icon: MessageSquare },
    { path: '/reminders', label: 'Reminders', icon: Bell, badge: upcomingRemindersCount },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/' || location.pathname.startsWith('/university/');
    }
    if (path === '/soccer') {
      return location.pathname === '/soccer';
    }
    return location.pathname === path;
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{
        backgroundColor: 'var(--bg-primary)',
        borderBottom: '1px solid var(--border)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div className="container" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '4rem',
          padding: '0 1.5rem'
        }}>
          {/* Logo */}
          <Link to="/" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            textDecoration: 'none',
            color: 'var(--text-primary)'
          }}>
            <GraduationCap size={32} color="var(--primary)" />
            <div>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--primary)' }}>
                Milo Ertugrul
              </h1>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0, fontWeight: 500 }}>
                College & Soccer Recruiting Hub
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav style={{
            display: 'flex',
            gap: '0.5rem'
          }} className="desktop-nav">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    borderRadius: 'var(--radius)',
                    textDecoration: 'none',
                    fontWeight: 500,
                    fontSize: '0.875rem',
                    transition: 'var(--transition)',
                    backgroundColor: active ? 'var(--primary)' : 'transparent',
                    color: active ? 'white' : 'var(--text-secondary)',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      e.currentTarget.style.backgroundColor = 'var(--gray-100)';
                      e.currentTarget.style.color = 'var(--text-primary)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = 'var(--text-secondary)';
                    }
                  }}
                >
                  <Icon size={18} />
                  {item.label}
                  {item.badge !== undefined && item.badge > 0 && (
                    <span style={{
                      backgroundColor: 'var(--danger)',
                      color: 'white',
                      fontSize: '0.625rem',
                      fontWeight: 700,
                      padding: '0.125rem 0.375rem',
                      borderRadius: '9999px',
                      minWidth: '1.25rem',
                      textAlign: 'center'
                    }}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Logout Button (Desktop) */}
          <button
            onClick={handleLogout}
            className="btn btn-secondary"
            style={{
              display: 'none',
              padding: '0.5rem 1rem',
              gap: '0.5rem'
            }}
            title="Logout"
          >
            <LogOut size={18} />
            <span className="logout-text">Logout</span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="mobile-menu-btn"
            style={{
              display: 'flex',
              padding: '0.5rem',
              backgroundColor: 'transparent',
              color: 'var(--text-primary)'
            }}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="mobile-nav" style={{
            padding: '1rem',
            borderTop: '1px solid var(--border)',
            backgroundColor: 'var(--bg-primary)'
          }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius)',
                    textDecoration: 'none',
                    fontWeight: 500,
                    marginBottom: '0.5rem',
                    backgroundColor: active ? 'var(--primary)' : 'transparent',
                    color: active ? 'white' : 'var(--text-primary)',
                  }}
                >
                  <Icon size={20} />
                  {item.label}
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="badge" style={{
                      backgroundColor: 'var(--danger)',
                      color: 'white',
                      marginLeft: 'auto'
                    }}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        )}
      </header>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '2rem 0' }}>
        <div className="container">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        backgroundColor: 'var(--bg-primary)',
        borderTop: '1px solid var(--border)',
        padding: '1.5rem 0',
        marginTop: 'auto'
      }}>
        <div className="container" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.875rem',
          color: 'var(--text-secondary)'
        }}>
          <p style={{ fontWeight: 600 }}>Built by Milo Ertugrul © 2025</p>
          <p>Tracking my journey to college and soccer success! 🎓⚽</p>
        </div>
      </footer>

      <style>{`
        .desktop-nav {
          display: none;
        }
        
        .btn.btn-secondary[title="Logout"] {
          display: none;
        }
        
        @media (min-width: 768px) {
          .desktop-nav {
            display: flex;
          }
          .mobile-menu-btn {
            display: none !important;
          }
          .btn.btn-secondary[title="Logout"] {
            display: flex;
          }
        }
        
        @media (max-width: 767px) {
          .desktop-nav {
            display: none;
          }
          .logout-text {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default Layout;

