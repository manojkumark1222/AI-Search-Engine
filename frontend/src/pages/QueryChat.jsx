import React, {useState, useEffect} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function QueryChat(){
  const [query,setQuery]=useState('');
  const [response,setResponse]=useState(null);
  const [loading,setLoading]=useState(false);
  const [queryHistory, setQueryHistory] = useState([]);
  const [userPlan, setUserPlan] = useState('free');
  const [planInfo, setPlanInfo] = useState(null);
  const [aiInsights, setAiInsights] = useState(null);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const nav = useNavigate();

  const exampleQueries = [
    "Show top 10 customers by revenue",
    "What is the average sales by region?",
    "Count total orders this month",
    "Find customers with orders above $1000",
    "Display monthly sales trends"
  ];

  const handleQuery = async ()=>{
    if (!query.trim()) {
      alert('Please enter a query');
      return;
    }
    setLoading(true);
    setResponse(null);
    try{
      const res = await api.post('/query/run', { query_text: query, source_id: 'default' });
      setResponse(res.data);
      setQueryHistory([...queryHistory, query]);
      // Log to history (fail silently if this fails)
      try {
        await api.post('/history/log', undefined, { params: { query } });
      } catch (historyError) {
        console.warn('Failed to log query history:', historyError);
      }
    }catch(e){
      const errorMessage = e.response?.data?.detail || e.message;
      if (errorMessage.includes('Backend server is not running')) {
        alert('⚠️ Backend Connection Error:\n\n' + errorMessage);
      } else {
        alert('❌ Query failed: ' + errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleExampleClick = (example) => {
    setQuery(example);
  };

  useEffect(() => {
    // Get user plan from token
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserPlan(payload.plan || 'free');
      } catch (e) {
        setUserPlan('free');
      }
    }
    fetchPlanInfo();
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

  const handleExport = async (format) => {
    if (!response?.results || response.results.length === 0) {
      alert('No data to export');
      return;
    }
    
    try {
      const res = await api.post(`/export/${format}`, {
        data: response.results,
        format: format,
        filename: `query_results_${Date.now()}.${format}`
      }, {
        responseType: 'blob'
      });
      
      // Create download link
      const blob = new Blob([res.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `query_results_${Date.now()}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch(e) {
      const errorMessage = e.response?.data?.detail || e.message;
      if (errorMessage.includes('only available for Pro') || errorMessage.includes('only available for')) {
        alert('Export is only available for Pro and Business plans. Please upgrade to access this feature.');
        nav('/pricing');
      } else {
        alert('Export failed: ' + errorMessage);
      }
    }
  };

  const handleGetInsights = async () => {
    if (!response?.results || response.results.length === 0) {
      alert('No data to analyze');
      return;
    }
    
    setLoadingInsights(true);
    try {
      const res = await api.post('/ai/analyze', {
        data: response.results,
        query_text: query
      });
      setAiInsights(res.data);
    } catch(e) {
      const errorMessage = e.response?.data?.detail || e.message;
      if (errorMessage.includes('only available for Pro')) {
        alert('AI Insights is only available for Pro and Business plans. Please upgrade to access this feature.');
        nav('/pricing');
      } else {
        alert('Failed to generate insights: ' + errorMessage);
      }
    } finally {
      setLoadingInsights(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    nav('/');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0e27' }}>
      {/* Sidebar - Same as Dashboard */}
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
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            textDecoration: 'none',
            fontWeight: '500',
            transition: 'all 0.2s'
          }}>
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
        </nav>

        {/* Query History */}
        {queryHistory.length > 0 && (
          <div style={{
            marginTop: '24px',
            padding: '16px',
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{
              fontSize: '14px',
              fontWeight: '600',
              color: 'white',
              marginBottom: '12px'
            }}>
              📜 Recent Queries
            </div>
            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {queryHistory.slice(-5).reverse().map((q, i) => (
                <div
                  key={i}
                  onClick={() => setQuery(q)}
                  style={{
                    padding: '8px 12px',
                    marginBottom: '8px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: 'rgba(255, 255, 255, 0.8)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(102, 126, 234, 0.3)';
                    e.currentTarget.style.color = 'white';
                    e.currentTarget.style.borderColor = '#667eea';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  }}
                >
                  {q.length > 40 ? q.substring(0, 40) + '...' : q}
                </div>
              ))}
            </div>
          </div>
        )}

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
      <div style={{ flex: 1, padding: '32px', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
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
            AI Query Chat
          </h1>
          <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.7)', fontSize: '16px' }}>
            Ask questions about your connected data sources in natural language
          </p>
        </div>

        {/* Query Input */}
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
            Your Query
          </h2>
          <textarea
            placeholder="e.g., Show me the total sales for each product category last month"
            value={query}
            onChange={(e)=>setQuery(e.target.value)}
            rows="5"
            style={{
              width: '100%',
              padding: '14px 16px',
              marginBottom: '16px',
              border: '2px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              boxSizing: 'border-box',
              fontSize: '15px',
              background: 'rgba(255, 255, 255, 0.05)',
              color: 'white',
              transition: 'all 0.3s',
              outline: 'none',
              resize: 'vertical',
              fontFamily: 'inherit',
              backdropFilter: 'blur(5px)'
            }}
            onFocus={(e)=>e.target.style.borderColor = '#667eea'}
            onBlur={(e)=>e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
          />

          <button
            onClick={handleQuery}
            disabled={loading}
            style={{
              width: '100%',
              padding: '16px',
              background: loading ? 'rgba(158, 158, 158, 0.3)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              fontWeight: '600',
              transition: 'all 0.3s',
              boxShadow: loading ? 'none' : '0 4px 15px rgba(102, 126, 234, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.5)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
              }
            }}
          >
            {loading ? '⏳ Processing Query...' : '🚀 Run Query'}
          </button>
        </div>

        {/* Example Queries */}
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
            Example Queries
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            {exampleQueries.map((eq, idx) => (
              <button
                key={idx}
                onClick={() => handleExampleClick(eq)}
                style={{
                  padding: '10px 18px',
                  background: 'rgba(102, 126, 234, 0.2)',
                  border: '1px solid rgba(102, 126, 234, 0.3)',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: 'white',
                  fontWeight: '500',
                  transition: 'all 0.2s',
                  backdropFilter: 'blur(5px)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                  e.currentTarget.style.borderColor = '#667eea';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(102, 126, 234, 0.2)';
                  e.currentTarget.style.borderColor = 'rgba(102, 126, 234, 0.3)';
                }}
              >
                {eq}
              </button>
            ))}
          </div>
        </div>

        {/* Query Response */}
        {response && (
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
              AI Response
            </h2>
            {response.summary && (
              <div style={{
                background: 'rgba(76, 175, 80, 0.2)',
                border: '1px solid rgba(76, 175, 80, 0.3)',
                padding: '16px',
                borderRadius: '12px',
                marginBottom: '24px',
                fontSize: '15px',
                color: '#81c784',
                fontWeight: '500'
              }}>
                {response.summary}
              </div>
            )}

            {response.suggestions && response.suggestions.length > 0 && (
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{
                  margin: '0 0 16px 0',
                  fontSize: '18px',
                  fontWeight: '600',
                  color: 'white'
                }}>
                  💡 Suggestions
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                  {response.suggestions.map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleExampleClick(s)}
                      style={{
                        padding: '10px 18px',
                        background: 'rgba(102, 126, 234, 0.2)',
                        border: '1px solid rgba(102, 126, 234, 0.3)',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        color: 'white',
                        fontWeight: '500',
                        transition: 'all 0.2s',
                        backdropFilter: 'blur(5px)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                        e.currentTarget.style.borderColor = '#667eea';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(102, 126, 234, 0.2)';
                        e.currentTarget.style.borderColor = 'rgba(102, 126, 234, 0.3)';
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {response.results && Array.isArray(response.results) && response.results.length > 0 && (
              <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '16px',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}>
                  <h4 style={{
                    margin: 0,
                    fontSize: '18px',
                    fontWeight: '600',
                    color: 'white'
                  }}>
                    📋 Results ({response.results.length} rows)
                  </h4>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    flexWrap: 'wrap'
                  }}>
                    {/* Export Buttons - Pro/Business only */}
                    {(userPlan === 'pro' || userPlan === 'business') && (
                      <>
                        <button
                          onClick={() => handleExport('excel')}
                          style={{
                            padding: '8px 16px',
                            background: 'rgba(76, 175, 80, 0.2)',
                            border: '1px solid rgba(76, 175, 80, 0.3)',
                            borderRadius: '8px',
                            color: '#81c784',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(76, 175, 80, 0.3)';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(76, 175, 80, 0.2)';
                            e.currentTarget.style.transform = 'translateY(0)';
                          }}
                        >
                          📊 Export Excel
                        </button>
                        <button
                          onClick={() => handleExport('csv')}
                          style={{
                            padding: '8px 16px',
                            background: 'rgba(33, 150, 243, 0.2)',
                            border: '1px solid rgba(33, 150, 243, 0.3)',
                            borderRadius: '8px',
                            color: '#64b5f6',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(33, 150, 243, 0.3)';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(33, 150, 243, 0.2)';
                            e.currentTarget.style.transform = 'translateY(0)';
                          }}
                        >
                          📄 Export CSV
                        </button>
                      </>
                    )}
                    {/* AI Insights Button - Pro/Business only */}
                    {(userPlan === 'pro' || userPlan === 'business') && (
                      <button
                        onClick={handleGetInsights}
                        disabled={loadingInsights}
                        style={{
                          padding: '8px 16px',
                          background: loadingInsights ? 'rgba(158, 158, 158, 0.2)' : 'rgba(156, 39, 176, 0.2)',
                          border: `1px solid ${loadingInsights ? 'rgba(158, 158, 158, 0.3)' : 'rgba(156, 39, 176, 0.3)'}`,
                          borderRadius: '8px',
                          color: loadingInsights ? 'rgba(255, 255, 255, 0.5)' : '#ba68c8',
                          fontSize: '12px',
                          fontWeight: '600',
                          cursor: loadingInsights ? 'not-allowed' : 'pointer',
                          transition: 'all 0.2s',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                        onMouseEnter={(e) => {
                          if (!loadingInsights) {
                            e.currentTarget.style.background = 'rgba(156, 39, 176, 0.3)';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!loadingInsights) {
                            e.currentTarget.style.background = 'rgba(156, 39, 176, 0.2)';
                            e.currentTarget.style.transform = 'translateY(0)';
                          }
                        }}
                      >
                        {loadingInsights ? '⏳ Analyzing...' : '🤖 AI Insights'}
                      </button>
                    )}
                    <div style={{
                      padding: '4px 12px',
                      background: 'rgba(76, 175, 80, 0.2)',
                      color: '#81c784',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500',
                      border: '1px solid rgba(76, 175, 80, 0.3)'
                    }}>
                      ✅ Success
                    </div>
                  </div>
                </div>
                
                {/* AI Insights Display */}
                {aiInsights && (
                  <div style={{
                    background: 'rgba(156, 39, 176, 0.1)',
                    border: '1px solid rgba(156, 39, 176, 0.3)',
                    padding: '20px',
                    borderRadius: '12px',
                    marginBottom: '24px'
                  }}>
                    <h4 style={{
                      margin: '0 0 16px 0',
                      fontSize: '18px',
                      fontWeight: '600',
                      color: '#ba68c8',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      🤖 AI-Powered Insights
                    </h4>
                    
                    {aiInsights.insights && aiInsights.insights.length > 0 && (
                      <div style={{ marginBottom: '16px' }}>
                        <div style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: 'rgba(255, 255, 255, 0.9)',
                          marginBottom: '8px'
                        }}>
                          Key Insights:
                        </div>
                        <ul style={{
                          margin: 0,
                          paddingLeft: '20px',
                          color: 'rgba(255, 255, 255, 0.8)',
                          lineHeight: '1.8'
                        }}>
                          {aiInsights.insights.map((insight, idx) => (
                            <li key={idx} style={{ marginBottom: '4px' }}>{insight}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {aiInsights.recommendations && aiInsights.recommendations.length > 0 && (
                      <div>
                        <div style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: 'rgba(255, 255, 255, 0.9)',
                          marginBottom: '8px'
                        }}>
                          Recommendations:
                        </div>
                        <ul style={{
                          margin: 0,
                          paddingLeft: '20px',
                          color: 'rgba(255, 255, 255, 0.8)',
                          lineHeight: '1.8'
                        }}>
                          {aiInsights.recommendations.map((rec, idx) => (
                            <li key={idx} style={{ marginBottom: '4px' }}>{rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
                <div style={{
                  overflowX: 'auto',
                  borderRadius: '16px',
                  border: '2px solid rgba(102, 126, 234, 0.2)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                  position: 'relative',
                  backdropFilter: 'blur(10px)'
                }}>
                  <div style={{
                    position: 'sticky',
                    left: 0,
                    top: 0,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    padding: '12px 16px',
                    borderRadius: '14px 14px 0 0',
                    color: 'white',
                    fontWeight: '600',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    📊 Query Results
                  </div>
                  <table style={{
                    borderCollapse: 'collapse',
                    width: '100%',
                    minWidth: '600px',
                    background: 'transparent'
                  }}>
                    <thead>
                      <tr style={{
                        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                        borderBottom: '2px solid rgba(102, 126, 234, 0.3)'
                      }}>
                        {Object.keys(response.results[0]).map(k=>(
                          <th key={k} style={{
                            border: '1px solid rgba(255, 255, 255, 0.05)',
                            padding: '16px 20px',
                            textAlign: 'left',
                            fontWeight: '700',
                            color: '#667eea',
                            fontSize: '13px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            position: 'sticky',
                            top: 0,
                            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                            zIndex: 10
                          }}>
                            {k.replace(/_/g, ' ')}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {response.results.map((r,idx)=>(
                        <tr key={idx} style={{
                          background: idx % 2 === 0 ? 'rgba(255, 255, 255, 0.02)' : 'transparent',
                          transition: 'all 0.3s',
                          borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)';
                          e.currentTarget.style.transform = 'scale(1.01)';
                          e.currentTarget.style.boxShadow = '0 2px 8px rgba(102, 126, 234, 0.2)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = idx % 2 === 0 ? 'rgba(255, 255, 255, 0.02)' : 'transparent';
                          e.currentTarget.style.transform = 'scale(1)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                        >
                          {Object.values(r).map((v,i)=>(
                            <td key={i} style={{
                              border: '1px solid rgba(255, 255, 255, 0.05)',
                              padding: '14px 20px',
                              fontSize: '14px',
                              color: 'white',
                              fontWeight: '400'
                            }}>
                              {v !== null && v !== undefined ? (
                                <span style={{
                                  display: 'inline-block',
                                  maxWidth: '300px',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap'
                                }}>
                                  {String(v)}
                                </span>
                              ) : (
                                <span style={{ color: 'rgba(255, 255, 255, 0.5)', fontStyle: 'italic' }}>-</span>
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
