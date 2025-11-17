import { useState } from 'react';
import { GraduationCap, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { login } = useAuth();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const success = login(password);

    if (success) {
      setPassword('');
    } else {
      setError('Incorrect password. Please try again.');
      setAttempts(prev => prev + 1);
      setPassword('');
      
      // Shake animation on error
      const form = document.getElementById('login-form');
      form?.classList.add('shake');
      setTimeout(() => form?.classList.remove('shake'), 500);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--bg-secondary)',
      padding: '1rem',
      backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(236, 72, 153, 0.1) 0%, transparent 50%)'
    }}>
      <div id="login-form" style={{
        backgroundColor: 'var(--bg-primary)',
        padding: '3rem',
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--shadow-xl), var(--glow-pink)',
        maxWidth: '450px',
        width: '100%',
        border: '2px solid var(--primary)',
        transition: 'transform 0.3s ease'
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ 
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '80px',
            height: '80px',
            backgroundColor: 'var(--primary)',
            borderRadius: '50%',
            marginBottom: '1rem',
            boxShadow: 'var(--glow-pink)'
          }}>
            <GraduationCap size={48} color="white" />
          </div>
          <h1 style={{ 
            fontSize: '2rem', 
            marginBottom: '0.5rem',
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Milo Ertugrul
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            College & Soccer Recruiting Hub
          </p>
        </div>

        {/* Welcome Message */}
        <div style={{
          padding: '1rem',
          backgroundColor: 'rgba(236, 72, 153, 0.1)',
          border: '1px solid var(--primary)',
          borderRadius: 'var(--radius)',
          marginBottom: '2rem',
          textAlign: 'center'
        }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Welcome! Enter your password to access your<br/>
            <strong style={{ color: 'var(--primary)' }}>personal college application tracker</strong>
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="password" style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '0.5rem',
              fontWeight: 600
            }}>
              <Lock size={16} />
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              autoFocus
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                fontSize: '1rem'
              }}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div style={{
              padding: '0.75rem 1rem',
              backgroundColor: 'rgba(248, 113, 113, 0.1)',
              border: '1px solid var(--danger)',
              borderRadius: 'var(--radius)',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.875rem',
              color: 'var(--danger)'
            }}>
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: '0.75rem',
              fontSize: '1rem',
              fontWeight: 600
            }}
          >
            <Lock size={18} />
            Access My Hub
          </button>
        </form>

        {/* Hint */}
        {attempts >= 3 && (
          <div style={{
            marginTop: '1.5rem',
            padding: '1rem',
            backgroundColor: 'rgba(251, 191, 36, 0.1)',
            border: '1px solid var(--warning)',
            borderRadius: 'var(--radius)',
            fontSize: '0.75rem',
            color: 'var(--text-secondary)',
            textAlign: 'center'
          }}>
            <p style={{ marginBottom: '0.5rem' }}>
              💡 <strong>Hint:</strong> The password is set in the code
            </p>
            <p style={{ fontStyle: 'italic' }}>
              Default: Milo2025!
            </p>
          </div>
        )}

        {/* Footer */}
        <div style={{ 
          marginTop: '2rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid var(--border)',
          textAlign: 'center',
          fontSize: '0.75rem',
          color: 'var(--text-secondary)'
        }}>
          <p>Built by Milo Ertugrul © 2025</p>
          <p style={{ marginTop: '0.25rem' }}>
            🔒 Your data is private and secure
          </p>
        </div>
      </div>

      <style>{`
        .shake {
          animation: shake 0.5s;
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
          20%, 40%, 60%, 80% { transform: translateX(10px); }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;

