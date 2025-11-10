import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Profile() {
  const [userEmail, setUserEmail] = useState('User');
  const [usageStats, setUsageStats] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    // Get user email from token
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserEmail(payload.email || 'User');
      } catch (e) {
        setUserEmail('User');
      }
    }
    fetchUsageStats();
  }, []);

  const fetchUsageStats = async () => {
    try {
      const res = await api.get('/connections/stats/usage');
      setUsageStats(res.data);
    } catch(e) {
      console.error('Failed to fetch usage stats:', e);
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
          <Link to="/profile" style={{
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
            <span style={{ marginRight: '12px', fontSize: '20px' }}>👤</span>
            Profile
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
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px',
          padding: '16px 24px',
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: 'white' }}>
              My Profile
            </h1>
            <p style={{ margin: '4px 0 0 0', color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>
              Manage your account and view your activity
            </p>
          </div>
        </div>

        {/* Profile Card */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          padding: '32px',
          borderRadius: '20px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          marginBottom: '32px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            marginBottom: '32px'
          }}>
            <div style={{
              width: '100px',
              height: '100px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '40px',
              fontWeight: 'bold',
              boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)'
            }}>
              {userEmail.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 style={{
                margin: '0 0 8px 0',
                fontSize: '28px',
                fontWeight: '700',
                color: 'white'
              }}>
                {userEmail}
              </h2>
              <div style={{
                display: 'inline-block',
                padding: '6px 12px',
                background: 'rgba(156, 39, 176, 0.2)',
                color: '#ba68c8',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: '600',
                border: '1px solid rgba(156, 39, 176, 0.3)'
              }}>
                Free Plan
              </div>
            </div>
          </div>

          <div style={{
            padding: '24px',
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            marginBottom: '24px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <h3 style={{
              margin: '0 0 16px 0',
              fontSize: '18px',
              fontWeight: '600',
              color: 'white'
            }}>
              Account Information
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '16px'
            }}>
              <div>
                <div style={{
                  fontSize: '12px',
                  color: 'rgba(255, 255, 255, 0.7)',
                  marginBottom: '4px',
                  fontWeight: '500'
                }}>
                  Email Address
                </div>
                <div style={{
                  fontSize: '16px',
                  color: 'white',
                  fontWeight: '600'
                }}>
                  {userEmail}
                </div>
              </div>
              <div>
                <div style={{
                  fontSize: '12px',
                  color: 'rgba(255, 255, 255, 0.7)',
                  marginBottom: '4px',
                  fontWeight: '500'
                }}>
                  Account Type
                </div>
                <div style={{
                  fontSize: '16px',
                  color: 'white',
                  fontWeight: '600'
                }}>
                  Free Plan
                </div>
              </div>
            </div>
          </div>

          <Link to="/pricing">
            <button style={{
              width: '100%',
              padding: '16px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
            }}
            >
              <span>💎</span>
              <span>Upgrade to Pro</span>
            </button>
          </Link>
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
          <h3 style={{
            margin: '0 0 24px 0',
            fontSize: '20px',
            fontWeight: '600',
            color: 'white'
          }}>
            Usage Statistics
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px'
          }}>
            <div style={{
              padding: '20px',
              background: 'rgba(33, 150, 243, 0.2)',
              backdropFilter: 'blur(10px)',
              borderRadius: '12px',
              border: '1px solid rgba(33, 150, 243, 0.3)'
            }}>
              <div style={{
                fontSize: '12px',
                color: '#64b5f6',
                marginBottom: '8px',
                fontWeight: '500'
              }}>
                Total Connections
              </div>
              <div style={{
                fontSize: '32px',
                fontWeight: '700',
                color: '#64b5f6'
              }}>
                {usageStats?.total_connections || 0}
              </div>
            </div>
            <div style={{
              padding: '20px',
              background: 'rgba(76, 175, 80, 0.2)',
              backdropFilter: 'blur(10px)',
              borderRadius: '12px',
              border: '1px solid rgba(76, 175, 80, 0.3)'
            }}>
              <div style={{
                fontSize: '12px',
                color: '#81c784',
                marginBottom: '8px',
                fontWeight: '500'
              }}>
                Active Connections
              </div>
              <div style={{
                fontSize: '32px',
                fontWeight: '700',
                color: '#81c784'
              }}>
                {usageStats?.active_connections || 0}
              </div>
            </div>
            <div style={{
              padding: '20px',
              background: 'rgba(255, 152, 0, 0.2)',
              backdropFilter: 'blur(10px)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 152, 0, 0.3)'
            }}>
              <div style={{
                fontSize: '12px',
                color: '#ffb74d',
                marginBottom: '8px',
                fontWeight: '500'
              }}>
                Total Queries
              </div>
              <div style={{
                fontSize: '32px',
                fontWeight: '700',
                color: '#ffb74d'
              }}>
                {usageStats?.total_queries || 0}
              </div>
            </div>
            <div style={{
              padding: '20px',
              background: 'rgba(156, 39, 176, 0.2)',
              backdropFilter: 'blur(10px)',
              borderRadius: '12px',
              border: '1px solid rgba(156, 39, 176, 0.3)'
            }}>
              <div style={{
                fontSize: '12px',
                color: '#ba68c8',
                marginBottom: '8px',
                fontWeight: '500'
              }}>
                Queries This Month
              </div>
              <div style={{
                fontSize: '32px',
                fontWeight: '700',
                color: '#ba68c8'
              }}>
                {usageStats?.queries_this_month || 0}
              </div>
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          padding: '32px',
          borderRadius: '20px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <h3 style={{
            margin: '0 0 24px 0',
            fontSize: '20px',
            fontWeight: '600',
            color: 'white'
          }}>
            Account Actions
          </h3>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <Link to="/settings">
              <button style={{
                width: '100%',
                padding: '14px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '15px',
                fontWeight: '500',
                color: 'white',
                transition: 'all 0.2s',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(102, 126, 234, 0.3)';
                e.currentTarget.style.borderColor = '#667eea';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              }}
              >
                <span style={{ fontSize: '20px' }}>⚙️</span>
                <span>Account Settings</span>
              </button>
            </Link>
            <Link to="/pricing">
              <button style={{
                width: '100%',
                padding: '14px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '15px',
                fontWeight: '500',
                color: 'white',
                transition: 'all 0.2s',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(102, 126, 234, 0.3)';
                e.currentTarget.style.borderColor = '#667eea';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              }}
              >
                <span style={{ fontSize: '20px' }}>💎</span>
                <span>Upgrade Plan</span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

