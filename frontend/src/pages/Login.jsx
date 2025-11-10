import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      alert('Please enter both email and password');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        nav('/dashboard');
      }
    } catch (e) {
      const errorMessage = e.response?.data?.detail || e.message;
      if (errorMessage.includes('Backend server is not running')) {
        alert(
          '⚠️ Backend Connection Error:\n\n' +
            errorMessage +
            '\n\nPlease make sure your backend API server is running. Check the backend terminal for the port number.'
        );
      } else {
        alert('Login failed: ' + errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!email || !password) {
      alert('Please enter both email and password');
      return;
    }
    if (password.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }
    setLoading(true);
    try {
      await api.post('/auth/register', { email, password });
      alert('Registration successful! Please login.');
      setIsRegister(false);
      setPassword('');
    } catch (e) {
      const errorMessage = e.response?.data?.detail || e.message;
      if (errorMessage.includes('Backend server is not running')) {
        alert('⚠️ Backend Connection Error:\n\n' + errorMessage);
      } else {
        alert('Registration failed: ' + errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Navigation Header */}
      <header
        style={{
          padding: '20px 40px',
          background: '#f8fbff',
          borderBottom: '1px solid #e6effa',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            color: '#0f172a',
            fontSize: '20px',
            fontWeight: 'bold',
          }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '12px',
              fontSize: '20px',
            }}
          >
            🗄️
          </div>
          <span>AI Insight Hub</span>
        </Link>

        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '32px',
          }}
        >
          <Link
            to="/"
            style={{
              color: '#334155',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => (e.target.style.color = '#0f172a')}
            onMouseLeave={(e) => (e.target.style.color = '#334155')}
          >
            Features
          </Link>
          <Link
            to="/pricing"
            style={{
              color: '#334155',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => (e.target.style.color = '#0f172a')}
            onMouseLeave={(e) => (e.target.style.color = '#334155')}
          >
            Pricing
          </Link>
          <Link
            to="/"
            style={{
              color: '#334155',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => (e.target.style.color = '#0f172a')}
            onMouseLeave={(e) => (e.target.style.color = '#334155')}
          >
            How It Works
          </Link>
        </nav>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          {/* Sign in / Sign up explicit links */}
          <button
            type="button"
            onClick={() => setIsRegister(false)}
            style={{
              padding: '8px 14px',
              background: isRegister ? 'transparent' : '#e6effa',
              border: '1px solid #bfdbfe',
              borderRadius: '8px',
              color: '#1e3a8a',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              if (isRegister) {
                e.currentTarget.style.background = '#eff6ff';
              }
            }}
            onMouseLeave={(e) => {
              if (isRegister) {
                e.currentTarget.style.background = 'transparent';
              }
            }}
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={() => setIsRegister(true)}
            style={{
              padding: '8px 14px',
              background: isRegister ? '#e6effa' : 'transparent',
              border: '1px solid #bfdbfe',
              borderRadius: '8px',
              color: '#1e3a8a',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              if (!isRegister) {
                e.currentTarget.style.background = '#eff6ff';
              }
            }}
            onMouseLeave={(e) => {
              if (!isRegister) {
                e.currentTarget.style.background = 'transparent';
              }
            }}
          >
            Sign up
          </button>
          <Link
            to="/pricing"
            style={{
              padding: '10px 20px',
              background: '#2563eb',
              border: '1px solid #2563eb',
              borderRadius: '8px',
              color: 'white',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#1e40af';
              e.target.style.borderColor = '#1e40af';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = '#2563eb';
              e.target.style.borderColor = '#2563eb';
            }}
          >
            View Pricing
          </Link>
        </div>
      </header>

      {/* Auth Card */}
      <div
        style={{
          maxWidth: '520px',
          margin: '120px auto 40px auto',
          padding: '32px',
          background: '#ffffff',
          border: '1px solid #e6effa',
          borderRadius: '16px',
          boxShadow: '0 8px 24px rgba(15, 23, 42, 0.06)',
        }}
      >
        <h1
          style={{
            margin: '0 0 8px 0',
            fontSize: '28px',
            fontWeight: 800,
            color: '#0f172a',
          }}
        >
          {isRegister ? 'Create your account' : 'Welcome back'}
        </h1>
        <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>
          {isRegister ? 'Sign up to get started' : 'Sign in to continue'}
        </p>

        <div style={{ marginTop: '20px' }}>
          <label style={{ display: 'block', fontSize: '13px', color: '#0f172a', marginBottom: '6px' }}>
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: '10px',
              border: '2px solid #e6effa',
              fontSize: '14px',
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = '#bfdbfe')}
            onBlur={(e) => (e.currentTarget.style.borderColor = '#e6effa')}
          />
        </div>

        <div style={{ marginTop: '14px' }}>
          <label style={{ display: 'block', fontSize: '13px', color: '#0f172a', marginBottom: '6px' }}>
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: '10px',
              border: '2px solid #e6effa',
              fontSize: '14px',
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = '#bfdbfe')}
            onBlur={(e) => (e.currentTarget.style.borderColor = '#e6effa')}
          />
        </div>

        <button
          onClick={isRegister ? handleRegister : handleLogin}
          disabled={loading}
          style={{
            marginTop: '18px',
            width: '100%',
            padding: '12px 16px',
            background: loading ? 'rgba(148,163,184,0.3)' : '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontSize: '16px',
            fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
            boxShadow: loading ? 'none' : '0 4px 12px rgba(37,99,235,0.35)',
          }}
          onMouseEnter={(e) => {
            if (!loading) e.currentTarget.style.background = '#1e40af';
          }}
          onMouseLeave={(e) => {
            if (!loading) e.currentTarget.style.background = '#2563eb';
          }}
        >
          {loading ? 'Please wait…' : isRegister ? 'Create account' : 'Sign in'}
        </button>

        <div style={{ marginTop: '14px', textAlign: 'center', fontSize: '14px', color: '#64748b' }}>
          {isRegister ? (
            <>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setIsRegister(false)}
                style={{ color: '#2563eb', background: 'transparent', border: 'none', cursor: 'pointer' }}
              >
                Sign in
              </button>
            </>
          ) : (
            <>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setIsRegister(true)}
                style={{ color: '#2563eb', background: 'transparent', border: 'none', cursor: 'pointer' }}
              >
                Sign up
              </button>
            </>
          )}
        </div>
      </div>

      {/* ✅ Fixed CTA Section */}
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '80px 40px',
          background: '#ffffff',
          borderRadius: '20px',
          border: '1px solid #e6effa',
          textAlign: 'center',
        }}
      >
        <h2
          style={{
            fontSize: '48px',
            fontWeight: '800',
            margin: '0 0 24px 0',
            color: '#0f172a',
          }}
        >
          Ready to Transform Your Data Analysis?
        </h2>

        {/* ✅ FIXED PARAGRAPH HERE */}
        <p
          style={{
            fontSize: '20px',
            color: '#475569',
            maxWidth: '600px',
            margin: '0 auto 40px auto', // ✅ single margin definition
          }}
        >
          Join thousands of users who are already making data-driven decisions
          with AI-powered insights.
        </p>

        <div
          style={{
            display: 'flex',
            gap: '20px',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <Link
            to="/pricing"
            style={{
              padding: '18px 36px',
              background: '#2563eb',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '12px',
              fontSize: '18px',
              fontWeight: '600',
              transition: 'all 0.3s',
              boxShadow: '0 4px 15px rgba(37, 99, 235, 0.35)',
              display: 'inline-block',
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow =
                '0 6px 20px rgba(37, 99, 235, 0.45)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow =
                '0 4px 15px rgba(37, 99, 235, 0.35)';
            }}
          >
            View Pricing
          </Link>

          <button
            onClick={() => nav('/dashboard')}
            style={{
              padding: '18px 36px',
              background: '#ffffff',
              border: '2px solid #e6effa',
              borderRadius: '12px',
              color: '#0f172a',
              fontSize: '18px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s',
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#f8fafc';
              e.target.style.borderColor = '#bfdbfe';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = '#ffffff';
              e.target.style.borderColor = '#e6effa';
            }}
          >
            Start Free Trial
          </button>
        </div>
      </div>

      {/* Footer section below remains unchanged */}
    </div>
  );
}
