import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

function StatCard({title, value, icon, color, subtitle}) {
  const colorMap = {
    blue: { bg: 'rgba(33, 150, 243, 0.2)', iconBg: '#2196f3', text: '#64b5f6' },
    purple: { bg: 'rgba(156, 39, 176, 0.2)', iconBg: '#9c27b0', text: '#ba68c8' },
    green: { bg: 'rgba(76, 175, 80, 0.2)', iconBg: '#4caf50', text: '#81c784' },
    orange: { bg: 'rgba(255, 152, 0, 0.2)', iconBg: '#ff9800', text: '#ffb74d' }
  };
  const theme = colorMap[color] || colorMap.blue;

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(10px)',
      padding: '24px',
      borderRadius: '16px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      transition: 'all 0.3s',
      position: 'relative',
      overflow: 'hidden'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
    }}
    >
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '60px',
        height: '60px',
        background: `${theme.bg}`,
        borderRadius: '0 0 0 60px',
        opacity: 0.3
      }} />
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{
          width: '48px',
          height: '48px',
          background: theme.bg,
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px'
        }}>
          {icon}
        </div>
        {subtitle && (
          <div style={{
            fontSize: '12px',
            color: theme.text,
            fontWeight: '500',
            background: theme.bg,
            padding: '4px 8px',
            borderRadius: '12px'
          }}>
            {subtitle}
          </div>
        )}
      </div>
      <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '8px', fontWeight: '500' }}>{title}</div>
      <div style={{ fontWeight: '700', fontSize: '32px', color: 'white' }}>{value}</div>
    </div>
  );
}

export default function Dashboard(){
  const [connections, setConnections] = useState([]);
  const [usageStats, setUsageStats] = useState(null);
  const [userEmail, setUserEmail] = useState('User');
  const [userPlan, setUserPlan] = useState('free');
  const [planInfo, setPlanInfo] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    fetchConnections();
    fetchUsageStats();
    fetchPlanInfo();
    // Try to get user email from token or localStorage
    const token = localStorage.getItem('token');
    if (token) {
      // Decode basic info (in real app, decode JWT properly)
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserEmail(payload.email || 'User');
        setUserPlan(payload.plan || 'free');
      } catch (e) {
        setUserEmail('User');
        setUserPlan('free');
      }
    }
  }, []);

  const fetchPlanInfo = async () => {
    try {
      const res = await api.get('/subscription/current');
      setPlanInfo(res.data);
      setUserPlan(res.data.plan || 'free');
    } catch(e) {
      console.error('Failed to fetch plan info:', e);
    }
  };

  const fetchConnections = async () => {
    try {
      const res = await api.get('/connections/all');
      setConnections(res.data || []);
    } catch(e) {
      console.error('Failed to fetch connections:', e);
    }
  };

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

  const activeConnections = connections.filter(c => c.status === 'active');
  const activeConnection = activeConnections.length > 0 ? activeConnections[0] : (connections.length > 0 ? connections[0] : null);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#ffffff' }}>
      {/* Sidebar */}
      <div style={{
        width: '260px',
        background: '#f8fbff',
        borderRight: '1px solid #e6effa',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '2px 0 16px rgba(15, 23, 42, 0.04)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '32px',
          fontSize: '20px',
          fontWeight: 'bold',
          color: '#0f172a'
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
            background: '#2563eb',
            color: 'white',
            textDecoration: 'none',
            fontWeight: '500',
            transition: 'all 0.2s'
          }}>
            <span style={{ marginRight: '12px', fontSize: '20px' }}>📊</span>
            Dashboard
          </Link>
          <Link to="/connections" style={{
            display: 'flex',
            alignItems: 'center',
            padding: '12px 16px',
            marginBottom: '8px',
            borderRadius: '12px',
            color: '#0f172a',
            textDecoration: 'none',
            fontWeight: '500',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#e6effa';
            e.currentTarget.style.color = '#1e3a8a';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = '#0f172a';
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
            color: '#0f172a',
            textDecoration: 'none',
            fontWeight: '500',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#e6effa';
            e.currentTarget.style.color = '#1e3a8a';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = '#0f172a';
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
            color: '#0f172a',
            textDecoration: 'none',
            fontWeight: '500',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#e6effa';
            e.currentTarget.style.color = '#1e3a8a';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = '#0f172a';
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
            color: '#0f172a',
            textDecoration: 'none',
            fontWeight: '500',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#e6effa';
            e.currentTarget.style.color = '#1e3a8a';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = '#0f172a';
          }}
          >
            <span style={{ marginRight: '12px', fontSize: '20px' }}>💎</span>
            Pricing
          </Link>
        </nav>

        {/* Quick Stats */}
        <div style={{
          marginTop: '24px',
          padding: '16px',
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e6effa'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '12px',
            fontSize: '14px',
            fontWeight: '600',
            color: '#0f172a'
          }}>
            <span style={{ marginRight: '8px' }}>📈</span>
            Quick Stats
          </div>
          <div style={{ fontSize: '12px', color: '#334155', marginBottom: '8px' }}>
            Queries Today: <strong style={{ color: '#667eea' }}>{usageStats?.queries_today || 0}</strong>
          </div>
          <div style={{ fontSize: '12px', color: '#334155' }}>
            Active Connections: <strong style={{ color: '#667eea' }}>{usageStats?.active_connections || activeConnections.length}</strong>
          </div>
        </div>

        <button 
          onClick={handleLogout}
          style={{
            marginTop: '24px',
            width: '100%',
            padding: '12px',
            border: '1px solid #e6effa',
            background: '#ffffff',
            borderRadius: '12px',
            cursor: 'pointer',
            color: '#b91c1c',
            fontWeight: '500',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#fee2e2';
            e.currentTarget.style.borderColor = '#fecaca';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#ffffff';
            e.currentTarget.style.borderColor = '#e6effa';
          }}
        >
          <span style={{ marginRight: '8px' }}>🚪</span>
          Sign Out
        </button>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
        {/* Top Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px',
          padding: '16px 24px',
          background: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 8px 24px rgba(15, 23, 42, 0.06)',
          border: '1px solid #e6effa'
        }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: '#0f172a' }}>
              Dashboard
            </h1>
            <p style={{ margin: '4px 0 0 0', color: '#475569', fontSize: '14px' }}>
              Manage your data connections and queries
            </p>
          </div>
          <Link to="/profile" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            padding: '8px 16px',
            background: '#ffffff',
            borderRadius: '12px',
            textDecoration: 'none',
            transition: 'all 0.2s',
            cursor: 'pointer',
            border: '1px solid #e6effa'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#e6effa';
            e.currentTarget.style.transform = 'scale(1.02)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#ffffff';
            e.currentTarget.style.transform = 'scale(1)';
          }}
          >
            <div style={{
              width: '32px',
              height: '32px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold'
            }}>
              {userEmail.charAt(0).toUpperCase()}
            </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>
                    {userEmail}
                  </div>
                  <Link to="/pricing" style={{
                    fontSize: '12px',
                    color: userPlan === 'free' ? '#667eea' : userPlan === 'pro' ? '#9c27b0' : '#ff9800',
                    textDecoration: 'none',
                    fontWeight: '500'
                  }}
                  onClick={(e) => e.stopPropagation()}
                  >
                    {userPlan.charAt(0).toUpperCase() + userPlan.slice(1)} Plan {userPlan === 'free' && '- Upgrade'}
                  </Link>
                </div>
          </Link>
        </div>

        {/* Welcome Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
          padding: '32px',
          borderRadius: '20px',
          marginBottom: '32px',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 8px 24px rgba(37, 99, 235, 0.3)'
        }}>
          <div style={{
            position: 'absolute',
            right: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '120px',
            opacity: 0.1
          }}>
            🗄️
          </div>
          <h2 style={{
            margin: '0 0 8px 0',
            fontSize: '32px',
            fontWeight: '700'
          }}>
            Welcome back! 👋
          </h2>
          <p style={{
            margin: 0,
            fontSize: '16px',
            opacity: 0.95,
            maxWidth: '600px'
          }}>
            {activeConnection 
              ? `Connected to ${activeConnection.name || 'Data Source'}. Ready to analyze your data!`
              : 'Get started by adding your first data connection to begin analyzing your data with AI-powered queries.'}
          </p>
        </div>

        {/* Active Connection Card */}
        {activeConnection && (
          <div style={{
            background: '#ffffff',
            padding: '20px',
            borderRadius: '16px',
            marginBottom: '32px',
            boxShadow: '0 8px 24px rgba(15, 23, 42, 0.06)',
            border: '1px solid #e6effa',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'rgba(4, 120, 87, 0.1)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px'
              }}>
                📄
              </div>
              <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '4px'
                }}>
                  <span style={{
                    fontSize: '12px',
                    color: '#075985',
                    fontWeight: '600',
                    background: '#e0f2fe',
                    padding: '4px 8px',
                    borderRadius: '8px'
                  }}>
                    ✅ Active Connection
                  </span>
                </div>
                <div style={{ fontSize: '18px', fontWeight: '600', color: '#0f172a' }}>
                  {activeConnection.name || 'Data Source'}
                </div>
                <div style={{ fontSize: '14px', color: '#475569', marginTop: '4px' }}>
                  {activeConnection.type ? activeConnection.type.toUpperCase() : 'Unknown'}
                </div>
              </div>
            </div>
            <Link to="/connections">
              <button style={{
                padding: '10px 20px',
                background: '#2563eb',
                border: '1px solid #2563eb',
                borderRadius: '10px',
                cursor: 'pointer',
                color: 'white',
                fontWeight: '500',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#1e40af';
                e.currentTarget.style.borderColor = '#1e40af';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#2563eb';
                e.currentTarget.style.borderColor = '#2563eb';
              }}
              >
                Manage Connections
              </button>
            </Link>
          </div>
        )}

            {/* Plan Limits Info */}
            {planInfo && (
              <div style={{
                background: '#ffffff',
                padding: '20px',
                borderRadius: '16px',
                marginBottom: '32px',
                boxShadow: '0 8px 24px rgba(15, 23, 42, 0.06)',
                border: '1px solid #e6effa'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '16px'
                }}>
                  <div>
                    <div style={{ fontSize: '14px', color: '#475569', marginBottom: '4px' }}>
                      Plan Limits
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: '600', color: '#0f172a' }}>
                      Connections: {connections.length} / {planInfo.limits.max_connections === -1 ? '∞' : planInfo.limits.max_connections}
                    </div>
                    <div style={{ fontSize: '14px', color: '#475569', marginTop: '4px' }}>
                      Queries this month: {usageStats?.queries_this_month || 0} / {planInfo.limits.max_queries_per_month === -1 ? '∞' : planInfo.limits.max_queries_per_month}
                    </div>
                  </div>
                  {userPlan === 'free' && (
                    <Link to="/pricing">
                      <button style={{
                        padding: '10px 20px',
                        background: '#2563eb',
                        color: 'white',
                        border: 'none',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '600',
                        transition: 'all 0.3s',
                        boxShadow: '0 4px 15px rgba(37, 99, 235, 0.3)'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 6px 20px rgba(37, 99, 235, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 4px 15px rgba(37, 99, 235, 0.3)';
                      }}
                      >
                        🚀 Upgrade Plan
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            )}

            {/* Stats Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '20px',
              marginBottom: '32px'
            }}>
              <StatCard
                title="Queries Today"
                value={usageStats?.queries_today || 0}
                icon="📊"
                color="blue"
                subtitle={`${usageStats?.queries_today || 0} today`}
              />
              <StatCard
                title="Active Connections"
                value={usageStats?.active_connections || activeConnections.length}
                icon="🔗"
                color="purple"
                subtitle={`${usageStats?.active_connections || activeConnections.length}/${usageStats?.total_connections || connections.length}`}
              />
              <StatCard
                title="Total Queries"
                value={usageStats?.total_queries || 0}
                icon="✅"
                color="green"
                subtitle="All time"
              />
              <StatCard
                title="This Month"
                value={usageStats?.queries_this_month || 0}
                icon="📈"
                color="orange"
                subtitle={planInfo?.limits.max_queries_per_month === -1 ? 'Unlimited' : `/${planInfo?.limits.max_queries_per_month || 50}`}
              />
            </div>

        {/* Quick Actions */}
        <div style={{
          background: '#ffffff',
          padding: '24px',
          borderRadius: '16px',
          boxShadow: '0 8px 24px rgba(15, 23, 42, 0.06)',
          border: '1px solid #e6effa',
          marginBottom: '32px'
        }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '20px', fontWeight: '600', color: '#0f172a' }}>
            Quick Actions
          </h3>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <Link to="/connections">
              <button style={{
                padding: '14px 28px',
                background: '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600',
                boxShadow: '0 4px 15px rgba(37, 99, 235, 0.3)',
                transition: 'all 0.3s',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(37, 99, 235, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(37, 99, 235, 0.3)';
              }}
              >
                ➕ Add Data Connection
              </button>
            </Link>
            <Link to="/chat">
              <button style={{
                padding: '14px 28px',
                background: '#16a34a',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600',
                boxShadow: '0 4px 15px rgba(22, 163, 74, 0.3)',
                transition: 'all 0.3s',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(22, 163, 74, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(22, 163, 74, 0.3)';
              }}
              >
                💬 Start a Query
              </button>
            </Link>
          </div>
        </div>

        {/* Getting Started Guide */}
        {connections.length === 0 && (
          <div style={{
            background: '#fffbeb',
            padding: '24px',
            borderRadius: '16px',
            border: '1px solid #fde68a',
            boxShadow: '0 8px 24px rgba(15, 23, 42, 0.06)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '16px'
            }}>
              <span style={{ fontSize: '24px', marginRight: '12px' }}>🚀</span>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#0f172a' }}>
                Getting Started
              </h3>
            </div>
            <ol style={{
              margin: 0,
              paddingLeft: '20px',
              color: '#334155',
              lineHeight: '1.8'
            }}>
              <li>Go to <Link to="/connections" style={{ color: '#2563eb', fontWeight: '600', textDecoration: 'none' }}>Connections</Link> to add your first data source</li>
              <li>Connect a CSV file, Excel file, or database (PostgreSQL, MySQL, MongoDB)</li>
              <li>Navigate to <Link to="/chat" style={{ color: '#2563eb', fontWeight: '600', textDecoration: 'none' }}>Query Chat</Link> to start asking questions about your data</li>
              <li>Use natural language to query your data - AI will handle the rest!</li>
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}
