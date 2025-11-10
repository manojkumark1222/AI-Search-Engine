import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

function StatCard({ title, value, icon, color, subtitle }) {
  // Convert hex color to rgba with opacity
  const hexToRgba = (hex, alpha = 0.2) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(10px)',
      padding: '24px',
      borderRadius: '16px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      flex: 1,
      minWidth: '200px'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '16px'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          background: hexToRgba(color, 0.2),
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          border: `1px solid ${color}40`
        }}>
          {icon}
        </div>
        {subtitle && (
          <div style={{
            fontSize: '12px',
            color: 'rgba(255, 255, 255, 0.7)',
            fontWeight: '500'
          }}>
            {subtitle}
          </div>
        )}
      </div>
      <div style={{
        fontSize: '32px',
        fontWeight: '700',
        color: 'white',
        marginBottom: '8px'
      }}>
        {value}
      </div>
      <div style={{
        fontSize: '14px',
        color: 'rgba(255, 255, 255, 0.7)'
      }}>
        {title}
      </div>
    </div>
  );
}

export default function Settings() {
  const [usageStats, setUsageStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('User');
  const [userPlan, setUserPlan] = useState('free');
  const [planInfo, setPlanInfo] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    // Get user email and plan from token
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserEmail(payload.email || 'User');
        setUserPlan(payload.plan || 'free');
      } catch (e) {
        setUserEmail('User');
        setUserPlan('free');
      }
    }
    fetchUsageStats();
    fetchPlanInfo();
  }, []);

  const fetchUsageStats = async () => {
    try {
      const res = await api.get('/connections/stats/usage');
      setUsageStats(res.data);
    } catch (e) {
      console.error('Failed to fetch usage stats:', e);
    } finally {
      setLoading(false);
    }
  };

  const fetchPlanInfo = async () => {
    try {
      const res = await api.get('/subscription/current');
      setPlanInfo(res.data);
      setUserPlan(res.data.plan || 'free');
    } catch (e) {
      console.error('Failed to fetch plan info:', e);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    nav('/');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0e27' }}>
      {/* Sidebar */}
      <div style={{
        width: '260px',
        background: 'rgba(10, 14, 39, 0.8)',
        backdropFilter: 'blur(10px)',
        borderRight: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '2px 0 16px rgba(0,0,0,0.3)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '32px',
          fontSize: '20px',
          fontWeight: 'bold',
          color: 'white'
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
        </div>

        <nav style={{ flex: 1 }}>
          <Link to="/dashboard" style={{
            display: 'flex',
            alignItems: 'center',
            padding: '12px 16px',
            marginBottom: '8px',
            borderRadius: '12px',
            color: 'rgba(255, 255, 255, 0.8)',
            textDecoration: 'none',
            fontWeight: '500',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(102, 126, 234, 0.2)';
            e.currentTarget.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
          }}
          >
            <span style={{ marginRight: '12px', fontSize: '20px' }}>📊</span>
            Dashboard
          </Link>
          <Link to="/connections" style={{
            display: 'flex',
            alignItems: 'center',
            padding: '12px 16px',
            marginBottom: '8px',
            borderRadius: '12px',
            color: 'rgba(255, 255, 255, 0.8)',
            textDecoration: 'none',
            fontWeight: '500',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(102, 126, 234, 0.2)';
            e.currentTarget.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
          }}
          >
            <span style={{ marginRight: '12px', fontSize: '20px' }}>🔗</span>
            Connections
          </Link>
          <Link to="/chat" style={{
            display: 'flex',
            alignItems: 'center',
            padding: '12px 16px',
            marginBottom: '8px',
            borderRadius: '12px',
            color: 'rgba(255, 255, 255, 0.8)',
            textDecoration: 'none',
            fontWeight: '500',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(102, 126, 234, 0.2)';
            e.currentTarget.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
          }}
          >
            <span style={{ marginRight: '12px', fontSize: '20px' }}>💬</span>
            Query Chat
          </Link>
          <Link to="/settings" style={{
            display: 'flex',
            alignItems: 'center',
            padding: '12px 16px',
            marginBottom: '8px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            textDecoration: 'none',
            fontWeight: '500',
            transition: 'all 0.2s'
          }}>
            <span style={{ marginRight: '12px', fontSize: '20px' }}>⚙️</span>
            Settings
          </Link>
          <Link to="/pricing" style={{
            display: 'flex',
            alignItems: 'center',
            padding: '12px 16px',
            marginBottom: '8px',
            borderRadius: '12px',
            color: 'rgba(255, 255, 255, 0.8)',
            textDecoration: 'none',
            fontWeight: '500',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(102, 126, 234, 0.2)';
            e.currentTarget.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
          }}
          >
            <span style={{ marginRight: '12px', fontSize: '20px' }}>💎</span>
            Pricing
          </Link>
        </nav>

        <button 
          onClick={handleLogout}
          style={{
            marginTop: '24px',
            width: '100%',
            padding: '12px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            cursor: 'pointer',
            color: '#ff6b6b',
            fontWeight: '500',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 107, 107, 0.2)';
            e.currentTarget.style.borderColor = '#ff6b6b';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
          }}
        >
          <span style={{ marginRight: '8px' }}>🚪</span>
          Sign Out
        </button>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{
            margin: '0 0 8px 0',
            fontSize: '32px',
            fontWeight: '700',
            color: 'white',
            background: 'linear-gradient(135deg, #ffffff 0%, #667eea 50%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Settings & Usage
          </h1>
          <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.7)', fontSize: '16px' }}>
            Manage your account and view usage statistics
          </p>
        </div>

        {/* Account Information */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          padding: '32px',
          borderRadius: '20px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          marginBottom: '32px'
        }}>
          <h2 style={{
            margin: '0 0 24px 0',
            fontSize: '24px',
            fontWeight: '600',
            color: 'white'
          }}>
            Account Information
          </h2>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                Email Address
              </label>
              <input
                type="email"
                value={userEmail}
                disabled
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  border: '2px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  fontSize: '15px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  color: 'rgba(255, 255, 255, 0.7)'
                }}
              />
            </div>
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                Plan
              </label>
              <div style={{
                padding: '14px 16px',
                border: '2px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                fontSize: '15px',
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                color: 'rgba(255, 255, 255, 0.9)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
                  <span style={{ 
                    fontSize: '16px', 
                    fontWeight: '600',
                    color: userPlan === 'free' ? '#667eea' : userPlan === 'pro' ? '#9c27b0' : '#ff9800'
                  }}>
                    {userPlan.charAt(0).toUpperCase() + userPlan.slice(1)} Plan
                  </span>
                  {planInfo && (
                    <div style={{
                      fontSize: '12px',
                      color: 'rgba(255, 255, 255, 0.6)',
                      marginTop: '4px'
                    }}>
                      Connections: {usageStats?.total_connections || 0} / {planInfo.limits.max_connections === -1 ? '∞' : planInfo.limits.max_connections} | 
                      Queries: {usageStats?.queries_this_month || 0} / {planInfo.limits.max_queries_per_month === -1 ? '∞' : planInfo.limits.max_queries_per_month}
                    </div>
                  )}
                </div>
                {userPlan === 'free' && (
                  <Link to="/pricing">
                    <button style={{
                      padding: '8px 16px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500',
                      transition: 'all 0.3s',
                      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
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
                      Upgrade
                    </button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Usage Statistics */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          padding: '32px',
          borderRadius: '20px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          marginBottom: '32px'
        }}>
          <h2 style={{
            margin: '0 0 24px 0',
            fontSize: '24px',
            fontWeight: '600',
            color: 'white'
          }}>
            Usage Statistics
          </h2>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255, 255, 255, 0.7)' }}>
              Loading statistics...
            </div>
          ) : usageStats ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px'
            }}>
              <StatCard
                title="Total Connections"
                value={usageStats.total_connections || 0}
                icon="🔗"
                color="#667eea"
              />
              <StatCard
                title="Active Connections"
                value={usageStats.active_connections || 0}
                icon="✅"
                color="#4caf50"
              />
              <StatCard
                title="Total Queries"
                value={usageStats.total_queries || 0}
                icon="📊"
                color="#2196f3"
              />
              <StatCard
                title="Queries Today"
                value={usageStats.queries_today || 0}
                icon="📅"
                color="#ff9800"
              />
              <StatCard
                title="Queries This Month"
                value={usageStats.queries_this_month || 0}
                icon="📈"
                color="#9c27b0"
              />
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255, 255, 255, 0.7)' }}>
              Failed to load statistics
            </div>
          )}
        </div>

        {/* Features & Support */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          padding: '32px',
          borderRadius: '20px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <h2 style={{
            margin: '0 0 24px 0',
            fontSize: '24px',
            fontWeight: '600',
            color: 'white'
          }}>
            Features & Support
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '16px'
          }}>
            <div style={{
              padding: '20px',
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <div style={{
                fontSize: '32px',
                marginBottom: '12px'
              }}>🤖</div>
              <h3 style={{
                margin: '0 0 8px 0',
                fontSize: '18px',
                fontWeight: '600',
                color: 'white'
              }}>
                AI-Powered Queries
              </h3>
              <p style={{
                margin: 0,
                fontSize: '14px',
                color: 'rgba(255, 255, 255, 0.7)'
              }}>
                Query your data using natural language powered by advanced AI
              </p>
            </div>
            <div style={{
              padding: '20px',
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <div style={{
                fontSize: '32px',
                marginBottom: '12px'
              }}>🔗</div>
              <h3 style={{
                margin: '0 0 8px 0',
                fontSize: '18px',
                fontWeight: '600',
                color: 'white'
              }}>
                Multiple Data Sources
              </h3>
              <p style={{
                margin: 0,
                fontSize: '14px',
                color: 'rgba(255, 255, 255, 0.7)'
              }}>
                Connect to CSV, Excel, PostgreSQL, MySQL, and MongoDB
              </p>
            </div>
            <div style={{
              padding: '20px',
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <div style={{
                fontSize: '32px',
                marginBottom: '12px'
              }}>📊</div>
              <h3 style={{
                margin: '0 0 8px 0',
                fontSize: '18px',
                fontWeight: '600',
                color: 'white'
              }}>
                Real-time Analytics
              </h3>
              <p style={{
                margin: 0,
                fontSize: '14px',
                color: 'rgba(255, 255, 255, 0.7)'
              }}>
                Get instant insights and visualizations from your data
              </p>
            </div>
            <div style={{
              padding: '20px',
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <div style={{
                fontSize: '32px',
                marginBottom: '12px'
              }}>🔒</div>
              <h3 style={{
                margin: '0 0 8px 0',
                fontSize: '18px',
                fontWeight: '600',
                color: 'white'
              }}>
                Secure & Private
              </h3>
              <p style={{
                margin: 0,
                fontSize: '14px',
                color: 'rgba(255, 255, 255, 0.7)'
              }}>
                Your data is encrypted and stored securely
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

