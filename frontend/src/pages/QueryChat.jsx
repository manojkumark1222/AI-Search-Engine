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
    <div style={{ display: 'flex', minHeight: '100vh', background: '#ffffff' }}>
      {/* Sidebar - Same as Dashboard */}
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
            background: '#2563eb',
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

        {/* Query History */}
        {queryHistory.length > 0 && (
          <div style={{
            marginTop: '24px',
            padding: '16px',
            background: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e6effa'
          }}>
            <div style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#0f172a',
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
                    background: '#ffffff',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#334155',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    border: '1px solid #e6effa'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#e6effa';
                    e.currentTarget.style.color = '#1e3a8a';
                    e.currentTarget.style.borderColor = '#bfdbfe';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#ffffff';
                    e.currentTarget.style.color = '#334155';
                    e.currentTarget.style.borderColor = '#e6effa';
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
      <div style={{ flex: 1, padding: '32px', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{
            margin: '0 0 8px 0',
            fontSize: '32px',
            fontWeight: '700',
            color: '#0f172a',
            background: 'linear-gradient(135deg, #ffffff 0%, #667eea 50%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            AI Query Chat
          </h1>
          <p style={{ margin: 0, color: '#475569', fontSize: '16px' }}>
            Ask questions about your connected data sources in natural language
          </p>
        </div>

        {/* Query Input */}
        <div style={{
          background: '#ffffff',
          padding: '32px',
          borderRadius: '20px',
          boxShadow: '0 8px 24px rgba(15, 23, 42, 0.06)',
          border: '1px solid #e6effa',
          marginBottom: '32px'
        }}>
          <h2 style={{
            margin: '0 0 24px 0',
            fontSize: '24px',
            fontWeight: '600',
            color: '#0f172a'
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
              border: '2px solid #e6effa',
              borderRadius: '12px',
              boxSizing: 'border-box',
              fontSize: '15px',
              background: '#ffffff',
              color: '#0f172a',
              transition: 'all 0.3s',
              outline: 'none',
              resize: 'vertical',
              fontFamily: 'inherit',
              backdropFilter: 'none'
            }}
            onFocus={(e)=>e.target.style.borderColor = '#bfdbfe'}
            onBlur={(e)=>e.target.style.borderColor = '#e6effa'}
          />

          <button
            onClick={handleQuery}
            disabled={loading}
            style={{
              width: '100%',
              padding: '16px',
              background: loading ? 'rgba(148, 163, 184, 0.3)' : '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              fontWeight: '600',
              transition: 'all 0.3s',
              boxShadow: loading ? 'none' : '0 4px 15px rgba(37, 99, 235, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(37, 99, 235, 0.45)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(37, 99, 235, 0.35)';
              }
            }}
          >
            {loading ? '⏳ Processing Query...' : '🚀 Run Query'}
          </button>
        </div>

        {/* Example Queries */}
        <div style={{
          background: '#ffffff',
          padding: '32px',
          borderRadius: '20px',
          boxShadow: '0 8px 24px rgba(15, 23, 42, 0.06)',
          border: '1px solid #e6effa',
          marginBottom: '32px'
        }}>
          <h2 style={{
            margin: '0 0 24px 0',
            fontSize: '24px',
            fontWeight: '600',
            color: '#0f172a'
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
                  background: '#e6effa',
                  border: '1px solid #bfdbfe',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: '#1e3a8a',
                  fontWeight: '500',
                  transition: 'all 0.2s',
                  backdropFilter: 'none'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#dbeafe';
                  e.currentTarget.style.borderColor = '#93c5fd';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#e6effa';
                  e.currentTarget.style.borderColor = '#bfdbfe';
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
            background: '#ffffff',
            padding: '32px',
            borderRadius: '20px',
            boxShadow: '0 8px 24px rgba(15, 23, 42, 0.06)',
            border: '1px solid #e6effa'
          }}>
            <h2 style={{
              margin: '0 0 24px 0',
              fontSize: '24px',
              fontWeight: '600',
              color: '#0f172a'
            }}>
              AI Response
            </h2>
            {response.summary && (
              <div style={{
                background: '#ecfdf5',
                border: '1px solid #bbf7d0',
                padding: '16px',
                borderRadius: '12px',
                marginBottom: '24px',
                fontSize: '15px',
                color: '#065f46',
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
                  color: '#0f172a'
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
                        background: '#e6effa',
                        border: '1px solid #bfdbfe',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        color: '#1e3a8a',
                        fontWeight: '500',
                        transition: 'all 0.2s',
                        backdropFilter: 'none'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#dbeafe';
                        e.currentTarget.style.borderColor = '#93c5fd';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#e6effa';
                        e.currentTarget.style.borderColor = '#bfdbfe';
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
                    color: '#0f172a'
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
                            background: '#ecfdf5',
                            border: '1px solid #bbf7d0',
                            borderRadius: '8px',
                            color: '#065f46',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#d1fae5';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#ecfdf5';
                            e.currentTarget.style.transform = 'translateY(0)';
                          }}
                        >
                          📊 Export Excel
                        </button>
                        <button
                          onClick={() => handleExport('csv')}
                          style={{
                            padding: '8px 16px',
                            background: '#eff6ff',
                            border: '1px solid #bfdbfe',
                            borderRadius: '8px',
                            color: '#1e3a8a',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#dbeafe';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#eff6ff';
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
                          background: loadingInsights ? 'rgba(148, 163, 184, 0.2)' : '#fae8ff',
                          border: `1px solid ${loadingInsights ? 'rgba(148, 163, 184, 0.3)' : '#f5d0fe'}`,
                          borderRadius: '8px',
                          color: loadingInsights ? '#64748b' : '#7e22ce',
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
                            e.currentTarget.style.background = '#f3e8ff';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!loadingInsights) {
                            e.currentTarget.style.background = '#fae8ff';
                            e.currentTarget.style.transform = 'translateY(0)';
                          }
                        }}
                      >
                        {loadingInsights ? '⏳ Analyzing...' : '🤖 AI Insights'}
                      </button>
                    )}
                    <div style={{
                      padding: '4px 12px',
                      background: '#ecfdf5',
                      color: '#065f46',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500',
                      border: '1px solid #bbf7d0'
                    }}>
                      ✅ Success
                    </div>
                  </div>
                </div>
                
                {/* AI Insights Display */}
                {aiInsights && (
                  <div style={{
                    background: '#faf5ff',
                    border: '1px solid #e9d5ff',
                    padding: '20px',
                    borderRadius: '12px',
                    marginBottom: '24px'
                  }}>
                    <h4 style={{
                      margin: '0 0 16px 0',
                      fontSize: '18px',
                      fontWeight: '600',
                      color: '#7e22ce',
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
                          color: '#0f172a',
                          marginBottom: '8px'
                        }}>
                          Key Insights:
                        </div>
                        <ul style={{
                          margin: 0,
                          paddingLeft: '20px',
                          color: '#334155',
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
                          color: '#0f172a',
                          marginBottom: '8px'
                        }}>
                          Recommendations:
                        </div>
                        <ul style={{
                          margin: 0,
                          paddingLeft: '20px',
                          color: '#334155',
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
                  border: '2px solid #bfdbfe',
                  background: '#ffffff',
                  boxShadow: '0 8px 24px rgba(15, 23, 42, 0.06)',
                  position: 'relative',
                  backdropFilter: 'none'
                }}>
                  <div style={{
                    position: 'sticky',
                    left: 0,
                    top: 0,
                    background: '#2563eb',
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
                        background: '#eff6ff',
                        borderBottom: '2px solid #bfdbfe'
                      }}>
                        {Object.keys(response.results[0]).map(k=>(
                          <th key={k} style={{
                            border: '1px solid #e6effa',
                            padding: '16px 20px',
                            textAlign: 'left',
                            fontWeight: '700',
                            color: '#1e3a8a',
                            fontSize: '13px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            position: 'sticky',
                            top: 0,
                            background: '#eff6ff',
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
                          background: idx % 2 === 0 ? '#ffffff' : '#f8fafc',
                          transition: 'all 0.3s',
                          borderBottom: '1px solid #e6effa'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#eff6ff';
                          e.currentTarget.style.transform = 'scale(1.01)';
                          e.currentTarget.style.boxShadow = '0 2px 8px rgba(37, 99, 235, 0.15)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = idx % 2 === 0 ? '#ffffff' : '#f8fafc';
                          e.currentTarget.style.transform = 'scale(1)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                        >
                          {Object.values(r).map((v,i)=>(
                            <td key={i} style={{
                              border: '1px solid #e6effa',
                              padding: '14px 20px',
                              fontSize: '14px',
                              color: '#0f172a',
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
                                <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>-</span>
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
