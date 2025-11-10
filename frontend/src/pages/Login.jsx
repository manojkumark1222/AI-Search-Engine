import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate, Link } from 'react-router-dom';

export default function Login(){
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [isRegister,setIsRegister]=useState(false);
  const [loading,setLoading]=useState(false);
  const nav = useNavigate();

  const handleLogin = async ()=>{
    if (!email || !password) {
      alert('Please enter both email and password');
      return;
    }
    setLoading(true);
    try{
      const res = await api.post('/auth/login',{ email, password });
      if(res.data.token){
        localStorage.setItem('token', res.data.token);
        nav('/dashboard');
      }
    }catch(e){
      const errorMessage = e.response?.data?.detail || e.message;
      if (errorMessage.includes('Backend server is not running')) {
        alert('⚠️ Backend Connection Error:\n\n' + errorMessage + '\n\nPlease make sure your backend API server is running. Check the backend terminal for the port number.');
      } else {
        alert('Login failed: ' + errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async ()=>{
    if (!email || !password) {
      alert('Please enter both email and password');
      return;
    }
    if (password.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }
    setLoading(true);
    try{
      await api.post('/auth/register',{ email, password });
      alert('Registration successful! Please login.');
      setIsRegister(false);
      setPassword('');
    }catch(e){
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
      <header style={{
        padding: '20px 40px',
        background: 'rgba(10, 14, 39, 0.8)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
      }}>
        <Link to="/" style={{
          display: 'flex',
          alignItems: 'center',
          textDecoration: 'none',
          color: 'white',
          fontSize: '20px',
          fontWeight: 'bold'
        }}>
          <div style={{
            width: '36px',
            height: '36px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '12px',
            fontSize: '20px'
          }}>
            🗄️
          </div>
          <span>AI Insight Hub</span>
        </Link>

        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '32px'
        }}>
          <Link to="/" style={{
            color: 'rgba(255, 255, 255, 0.8)',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.color = 'white'}
          onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.8)'}
          >
            Features
          </Link>
          <Link to="/pricing" style={{
            color: 'rgba(255, 255, 255, 0.8)',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.color = 'white'}
          onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.8)'}
          >
            Pricing
          </Link>
          <Link to="/" style={{
            color: 'rgba(255, 255, 255, 0.8)',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.color = 'white'}
          onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.8)'}
          >
            How It Works
          </Link>
        </nav>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <Link to="/pricing" style={{
            padding: '10px 20px',
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '8px',
            color: 'white',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.1)';
          }}
          >
            View Pricing
          </Link>
        </div>
      </header>

      {/* Top Section - Login Form */}
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #1e3c72 50%, #2a5298 75%, #667eea 100%)',
        backgroundSize: '400% 400%',
        animation: 'gradient 15s ease infinite',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '100px 20px 20px 20px'
      }}>
        {/* Animated background particles */}
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          top: 0,
          left: 0
        }}>
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: Math.random() * 4 + 2 + 'px',
                height: Math.random() * 4 + 2 + 'px',
                background: 'rgba(255, 255, 255, 0.6)',
                borderRadius: '50%',
                top: Math.random() * 100 + '%',
                left: Math.random() * 100 + '%',
                animation: `float ${Math.random() * 3 + 2}s ease-in-out infinite`,
                animationDelay: Math.random() * 2 + 's'
              }}
            />
          ))}
        </div>

        <style>{`
          @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.6; }
            50% { transform: translateY(-20px) translateX(10px); opacity: 1; }
          }
        `}</style>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          maxWidth: '1200px',
          width: '100%',
          gap: '40px',
          alignItems: 'center',
          zIndex: 1,
          position: 'relative'
        }}>
          {/* Left Side - Hero Content */}
          <div style={{ color: 'white', padding: '20px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '40px',
              fontSize: '24px',
              fontWeight: 'bold'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '12px',
                backdropFilter: 'blur(10px)'
              }}>
                <span style={{ fontSize: '24px' }}>🗄️</span>
              </div>
              <span>AI Insight Hub</span>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              padding: '8px 16px',
              borderRadius: '20px',
              display: 'inline-block',
              marginBottom: '24px',
              fontSize: '14px',
              fontWeight: '500',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              ✨ Natural Language Database Queries
            </div>

            <h1 style={{
              fontSize: '56px',
              fontWeight: '800',
              margin: '0 0 24px 0',
              lineHeight: '1.2',
              background: 'linear-gradient(135deg, #ffffff 0%, #a8edea 50%, #fed6e3 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Query Your Data<br />
              <span style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>Like a Conversation</span>
            </h1>

            <p style={{
              fontSize: '18px',
              lineHeight: '1.6',
              marginBottom: '32px',
              color: 'rgba(255, 255, 255, 0.9)',
              maxWidth: '500px'
            }}>
              Transform complex database queries into simple questions. Connect to any data source and get instant insights using natural language powered by AI.
            </p>

            {/* Feature Icons */}
            <div style={{
              display: 'flex',
              gap: '32px',
              marginTop: '40px',
              alignItems: 'center'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                fontSize: '32px'
              }}>
                📊
              </div>
              <div style={{
                width: '80px',
                height: '80px',
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px dashed rgba(255, 255, 255, 0.3)',
                fontSize: '32px'
              }}>
                🤖
              </div>
              <div style={{
                width: '80px',
                height: '80px',
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                fontSize: '32px'
              }}>
                ✅
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            padding: '48px',
            borderRadius: '24px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            maxWidth: '480px',
            width: '100%',
            margin: '0 auto'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <h2 style={{
                fontSize: '32px',
                fontWeight: '700',
                margin: '0 0 8px 0',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                {isRegister ? 'Create Account' : 'Welcome Back'}
              </h2>
              <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>
                {isRegister ? 'Sign up to get started' : 'Sign in to continue to AI Insight Hub'}
              </p>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#333',
                fontWeight: '500',
                fontSize: '14px'
              }}>
                Email Address
              </label>
        <input 
                placeholder="Enter your email" 
                type="email"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  margin: '0',
                  border: '2px solid #e0e0e0',
                  borderRadius: '12px',
                  boxSizing: 'border-box',
                  fontSize: '16px',
                  transition: 'all 0.3s',
                  outline: 'none'
                }}
          value={email} 
          onChange={(e)=>setEmail(e.target.value)}
          onKeyPress={(e)=>e.key === 'Enter' && (isRegister ? handleRegister() : handleLogin())}
                onFocus={(e)=>e.target.style.borderColor = '#667eea'}
                onBlur={(e)=>e.target.style.borderColor = '#e0e0e0'}
              />
            </div>

            <div style={{ marginBottom: '32px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#333',
                fontWeight: '500',
                fontSize: '14px'
              }}>
                Password
              </label>
        <input 
                placeholder="Enter your password" 
          type="password" 
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  margin: '0',
                  border: '2px solid #e0e0e0',
                  borderRadius: '12px',
                  boxSizing: 'border-box',
                  fontSize: '16px',
                  transition: 'all 0.3s',
                  outline: 'none'
                }}
          value={password} 
          onChange={(e)=>setPassword(e.target.value)}
          onKeyPress={(e)=>e.key === 'Enter' && (isRegister ? handleRegister() : handleLogin())}
                onFocus={(e)=>e.target.style.borderColor = '#667eea'}
                onBlur={(e)=>e.target.style.borderColor = '#e0e0e0'}
        />
            </div>

        <button 
          onClick={isRegister ? handleRegister : handleLogin} 
          disabled={loading}
              style={{
                width: '100%',
                padding: '16px',
                marginBottom: '16px',
                background: loading ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '16px',
                fontWeight: '600',
                transition: 'all 0.3s',
                boxShadow: loading ? 'none' : '0 4px 15px rgba(102, 126, 234, 0.4)'
              }}
              onMouseEnter={(e)=>{
                if (!loading) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.5)';
                }
              }}
              onMouseLeave={(e)=>{
                if (!loading) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
                }
              }}
            >
            {loading ? '⏳ Please wait...' : (isRegister ? '🚀 Create Account' : '🔑 Sign In')}
          </button>

          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <button 
              onClick={()=>{setIsRegister(!isRegister); setPassword('');}} 
              style={{
                background: 'none',
                border: 'none',
                color: '#667eea',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                textDecoration: 'underline'
              }}
            >
              {isRegister ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>

          {/* Sign Up Call to Action */}
          {!isRegister && (
            <div style={{
              marginTop: '24px',
              padding: '16px',
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
              borderRadius: '12px',
              border: '1px solid rgba(102, 126, 234, 0.2)',
              textAlign: 'center'
            }}>
              <p style={{
                margin: '0 0 12px 0',
                fontSize: '14px',
                color: '#666',
                fontWeight: '500'
              }}>
                New to AI Insight Hub?
              </p>
              <button
                onClick={() => setIsRegister(true)}
                style={{
                  padding: '10px 24px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.3s',
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
                }}
              >
                ✨ Sign Up Now
              </button>
            </div>
          )}

            {!isRegister && (
              <div style={{
                marginTop: '32px',
                padding: '16px',
                background: 'rgba(102, 126, 234, 0.1)',
                borderRadius: '12px',
                fontSize: '12px',
                color: '#666',
                textAlign: 'center'
              }}>
                <strong>Demo Credentials:</strong><br />
                Email: admin@example.com<br />
                Password: admin
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Scrollable Content Below Login Form */}
      <div style={{
        background: '#0a0e27',
        color: 'white',
        padding: '80px 40px'
      }}>
        {/* Features Section */}
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto 80px auto'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{
              fontSize: '48px',
              fontWeight: '800',
              margin: '0 0 16px 0',
              background: 'linear-gradient(135deg, #ffffff 0%, #667eea 50%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Powerful Features
            </h2>
            <p style={{
              fontSize: '20px',
              color: 'rgba(255, 255, 255, 0.7)',
              margin: 0
            }}>
              Everything you need to analyze your data with AI
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '32px'
          }}>
            {[
              {
                icon: '🤖',
                title: 'AI-Powered Queries',
                description: 'Ask questions in natural language and get instant answers from your data. No SQL knowledge required.'
              },
              {
                icon: '🔗',
                title: 'Multiple Data Sources',
                description: 'Connect to CSV, Excel, PostgreSQL, MySQL, and MongoDB. All your data in one place.'
              },
              {
                icon: '📊',
                title: 'Real-time Analytics',
                description: 'Get instant insights and visualizations. Make data-driven decisions faster than ever.'
              },
              {
                icon: '🔒',
                title: 'Secure & Private',
                description: 'Your data is encrypted and stored securely. We never share your data with third parties.'
              },
              {
                icon: '⚡',
                title: 'Lightning Fast',
                description: 'Query results in milliseconds. Optimized for speed and performance.'
              },
              {
                icon: '📈',
                title: 'Advanced Insights',
                description: 'Get AI-powered insights and recommendations to optimize your business decisions.'
              }
            ].map((feature, idx) => (
              <div
                key={idx}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '20px',
                  padding: '32px',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.borderColor = 'rgba(102, 126, 234, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                }}
              >
                <div style={{
                  fontSize: '48px',
                  marginBottom: '20px'
                }}>
                  {feature.icon}
                </div>
                <h3 style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  margin: '0 0 12px 0',
                  color: 'white'
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  fontSize: '16px',
                  color: 'rgba(255, 255, 255, 0.7)',
                  margin: 0,
                  lineHeight: '1.6'
                }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works Section */}
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto 80px auto',
          padding: '60px 40px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{
              fontSize: '48px',
              fontWeight: '800',
              margin: '0 0 16px 0',
              color: 'white'
            }}>
              How It Works
            </h2>
            <p style={{
              fontSize: '20px',
              color: 'rgba(255, 255, 255, 0.7)',
              margin: 0
            }}>
              Get started in minutes, not hours
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '40px',
            position: 'relative'
          }}>
            {[
              {
                step: '1',
                title: 'Connect Your Data',
                description: 'Add your data sources - CSV files, Excel spreadsheets, or database connections. We support all major data formats.'
              },
              {
                step: '2',
                title: 'Ask Questions',
                description: 'Type your question in natural language. For example: "Show me top 10 customers by revenue" or "What is the average sales this month?"'
              },
              {
                step: '3',
                title: 'Get Insights',
                description: 'AI analyzes your data and returns instant results with visualizations and insights. Export or share your findings.'
              }
            ].map((step, idx) => (
              <div key={idx} style={{ textAlign: 'center' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '32px',
                  fontWeight: 'bold',
                  margin: '0 auto 24px auto',
                  boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)'
                }}>
                  {step.step}
                </div>
                <h3 style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  margin: '0 0 16px 0',
                  color: 'white'
                }}>
                  {step.title}
                </h3>
                <p style={{
                  fontSize: '16px',
                  color: 'rgba(255, 255, 255, 0.7)',
                  margin: 0,
                  lineHeight: '1.6'
                }}>
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials Section */}
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto 80px auto'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{
              fontSize: '48px',
              fontWeight: '800',
              margin: '0 0 16px 0',
              color: 'white'
            }}>
              What Our Users Say
            </h2>
            <p style={{
              fontSize: '20px',
              color: 'rgba(255, 255, 255, 0.7)',
              margin: 0
            }}>
              Trusted by data analysts and businesses worldwide
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '32px'
          }}>
            {[
              {
                name: 'Sarah Johnson',
                role: 'Data Analyst',
                company: 'Tech Corp',
                quote: 'AI Insight Hub transformed how we analyze data. What used to take hours now takes minutes!',
                rating: 5
              },
              {
                name: 'Michael Chen',
                role: 'Business Manager',
                company: 'StartupXYZ',
                quote: 'The natural language queries are a game-changer. No more SQL learning curve for our team.',
                rating: 5
              },
              {
                name: 'Emily Rodriguez',
                role: 'Marketing Director',
                company: 'Growth Inc',
                quote: 'We can now answer business questions instantly. This tool paid for itself in the first week.',
                rating: 5
              }
            ].map((testimonial, idx) => (
              <div
                key={idx}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '20px',
                  padding: '32px',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                }}
              >
                <div style={{
                  marginBottom: '20px',
                  fontSize: '20px',
                  color: '#ffc107'
                }}>
                  {'⭐'.repeat(testimonial.rating)}
                </div>
                <p style={{
                  fontSize: '16px',
                  color: 'rgba(255, 255, 255, 0.9)',
                  margin: '0 0 24px 0',
                  lineHeight: '1.6',
                  fontStyle: 'italic'
                }}>
                  "{testimonial.quote}"
                </p>
                <div>
                  <div style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    color: 'white',
                    marginBottom: '4px'
                  }}>
                    {testimonial.name}
                  </div>
                  <div style={{
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.6)'
                  }}>
                    {testimonial.role} at {testimonial.company}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '80px 40px',
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontSize: '48px',
            fontWeight: '800',
            margin: '0 0 24px 0',
            color: 'white'
          }}>
            Ready to Transform Your Data Analysis?
          </h2>
          <p style={{
            fontSize: '20px',
            color: 'rgba(255, 255, 255, 0.8)',
            margin: '0 0 40px 0',
            maxWidth: '600px',
            margin: '0 auto 40px auto'
          }}>
            Join thousands of users who are already making data-driven decisions with AI-powered insights.
          </p>
          <div style={{
            display: 'flex',
            gap: '20px',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <Link to="/pricing" style={{
              padding: '18px 36px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '12px',
              fontSize: '18px',
              fontWeight: '600',
              transition: 'all 0.3s',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
              display: 'inline-block'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
            }}
            >
              View Pricing
            </Link>
            <button
              onClick={() => nav('/dashboard')}
              style={{
                padding: '18px 36px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '12px',
                color: 'white',
                fontSize: '18px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
              }}
            >
              Start Free Trial
          </button>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          maxWidth: '1200px',
          margin: '80px auto 0 auto',
          paddingTop: '40px',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          textAlign: 'center'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '32px',
            marginBottom: '24px',
            flexWrap: 'wrap'
          }}>
            <Link to="/" style={{
              color: 'rgba(255, 255, 255, 0.7)',
              textDecoration: 'none',
              fontSize: '14px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.color = 'white'}
            onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.7)'}
            >
              Features
            </Link>
            <Link to="/pricing" style={{
              color: 'rgba(255, 255, 255, 0.7)',
              textDecoration: 'none',
              fontSize: '14px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.color = 'white'}
            onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.7)'}
            >
              Pricing
            </Link>
            <Link to="/" style={{
              color: 'rgba(255, 255, 255, 0.7)',
              textDecoration: 'none',
              fontSize: '14px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.color = 'white'}
            onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.7)'}
            >
              Documentation
            </Link>
            <Link to="/" style={{
              color: 'rgba(255, 255, 255, 0.7)',
              textDecoration: 'none',
              fontSize: '14px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.color = 'white'}
            onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.7)'}
            >
              Support
            </Link>
          </div>
          <p style={{
            fontSize: '14px',
            color: 'rgba(255, 255, 255, 0.5)',
            margin: 0
          }}>
            © 2024 AI Insight Hub. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
