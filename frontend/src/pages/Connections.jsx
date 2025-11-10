import React, {useState, useEffect} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

function ConnectionCard({connection, onDelete, onTest, onEdit, onDisconnect, onConnect, onRefresh}) {
  const [testing, setTesting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const getTypeIcon = (type) => {
    const icons = {
      csv: '📄',
      excel: '📊',
      postgres: '🐘',
      mysql: '🗄️',
      mongodb: '🍃',
      supabase: '⚡',
      firebase: '🔥'
    };
    return icons[type] || '📁';
  };

  const getTypeColor = (type) => {
    const colors = {
      csv: { bg: 'rgba(33, 150, 243, 0.2)', border: '#2196f3', text: '#64b5f6' },
      excel: { bg: 'rgba(76, 175, 80, 0.2)', border: '#4caf50', text: '#81c784' },
      postgres: { bg: 'rgba(255, 152, 0, 0.2)', border: '#ff9800', text: '#ffb74d' },
      mysql: { bg: 'rgba(156, 39, 176, 0.2)', border: '#9c27b0', text: '#ba68c8' },
      mongodb: { bg: 'rgba(0, 150, 136, 0.2)', border: '#009688', text: '#4db6ac' },
      supabase: { bg: 'rgba(3, 169, 244, 0.2)', border: '#03a9f4', text: '#4fc3f7' },
      firebase: { bg: 'rgba(255, 152, 0, 0.2)', border: '#ff9800', text: '#ffb74d' }
    };
    return colors[type] || { bg: 'rgba(158, 158, 158, 0.2)', border: '#9e9e9e', text: '#bdbdbd' };
  };

  const getStatusColor = (status) => {
    const colors = {
      active: { bg: 'rgba(76, 175, 80, 0.2)', text: '#81c784', dot: '#4caf50' },
      inactive: { bg: 'rgba(158, 158, 158, 0.2)', text: '#bdbdbd', dot: '#9e9e9e' },
      error: { bg: 'rgba(244, 67, 54, 0.2)', text: '#e57373', dot: '#f44336' }
    };
    return colors[status] || colors.inactive;
  };

  const handleTest = async () => {
    setTesting(true);
    try {
      const result = await onTest(connection.id);
      if (result.success) {
        alert('✅ Connection test successful!');
        onRefresh();
      } else {
        alert('❌ Connection test failed: ' + result.message);
      }
    } catch (error) {
      alert('❌ Error testing connection: ' + (error.response?.data?.detail || error.message));
    } finally {
      setTesting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete connection "${connection.name}"? This action cannot be undone.`)) {
      return;
    }
    setDeleting(true);
    try {
      await onDelete(connection.id);
      alert('✅ Connection deleted successfully!');
      onRefresh();
    } catch (error) {
      alert('❌ Error deleting connection: ' + (error.response?.data?.detail || error.message));
      setDeleting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await onDisconnect(connection.id);
      alert('✅ Connection disconnected successfully!');
      onRefresh();
    } catch (error) {
      alert('❌ Error disconnecting: ' + (error.response?.data?.detail || error.message));
    }
  };

  const handleConnect = async () => {
    try {
      await onConnect(connection.id);
      alert('✅ Connection activated successfully!');
      onRefresh();
    } catch (error) {
      alert('❌ Error connecting: ' + (error.response?.data?.detail || error.message));
    }
  };

  const connectionName = connection.name || 'Unnamed Connection';
  const connectionType = connection.type || 'csv';
  const status = connection.status || 'active';
  const colorTheme = getTypeColor(connectionType);
  const statusTheme = getStatusColor(status);

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  };

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(10px)',
      padding: '24px',
      borderRadius: '16px',
      border: `2px solid ${colorTheme.border}`,
      boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
      marginBottom: '16px',
      transition: 'all 0.3s',
      position: 'relative',
      overflow: 'hidden'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.4)';
      e.currentTarget.style.borderColor = colorTheme.border;
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.3)';
    }}
    >
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '80px',
        height: '80px',
        background: colorTheme.bg,
        borderRadius: '0 0 0 80px',
        opacity: 0.3
      }} />
      
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', flex: 1 }}>
          <div style={{
            width: '56px',
            height: '56px',
            background: colorTheme.bg,
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '28px',
            border: `2px solid ${colorTheme.border}`,
            flexShrink: 0
          }}>
            {getTypeIcon(connectionType)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: '20px',
              fontWeight: '600',
              color: 'white',
              marginBottom: '8px'
            }}>
              {connectionName}
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              flexWrap: 'wrap',
              marginBottom: '12px'
            }}>
              <div style={{
                display: 'inline-block',
                fontSize: '12px',
                fontWeight: '500',
                color: colorTheme.text,
                background: colorTheme.bg,
                padding: '4px 12px',
                borderRadius: '12px',
                textTransform: 'uppercase',
                border: `1px solid ${colorTheme.border}`
              }}>
                {connectionType}
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                fontWeight: '500',
                color: statusTheme.text,
                background: statusTheme.bg,
                padding: '4px 12px',
                borderRadius: '12px',
                border: `1px solid ${statusTheme.dot}`
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  background: statusTheme.dot,
                  borderRadius: '50%',
                  boxShadow: `0 0 8px ${statusTheme.dot}40`
                }} />
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </div>
            </div>
            <div style={{
              fontSize: '12px',
              color: 'rgba(255, 255, 255, 0.6)',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}>
              {connection.last_used && (
                <div>Last used: {formatDate(connection.last_used)}</div>
              )}
              {connection.last_tested && (
                <div>Last tested: {formatDate(connection.last_tested)}</div>
              )}
              <div>Created: {formatDate(connection.created_at)}</div>
            </div>
            {connection.details && (
              <div style={{
                marginTop: '12px',
                fontSize: '12px',
                color: 'rgba(255, 255, 255, 0.7)',
                fontFamily: 'monospace',
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                padding: '8px',
                borderRadius: '8px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                {connection.details.file_path || connection.details.host || connection.details.database || 'Configured'}
              </div>
            )}
          </div>
        </div>
        
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          flexShrink: 0
        }}>
          <div style={{
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap'
          }}>
            {status === 'active' ? (
              <button
                onClick={handleDisconnect}
                style={{
                  padding: '8px 16px',
                  background: 'rgba(255, 152, 0, 0.2)',
                  border: '1px solid #ff9800',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '500',
                  color: '#ffb74d',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#ff9800';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 152, 0, 0.2)';
                  e.currentTarget.style.color = '#ffb74d';
                }}
              >
                🔌 Disconnect
              </button>
            ) : (
              <button
                onClick={handleConnect}
                style={{
                  padding: '8px 16px',
                  background: 'rgba(76, 175, 80, 0.2)',
                  border: '1px solid #4caf50',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '500',
                  color: '#81c784',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#4caf50';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(76, 175, 80, 0.2)';
                  e.currentTarget.style.color = '#81c784';
                }}
              >
                ✅ Connect
              </button>
            )}
            <button
              onClick={handleTest}
              disabled={testing}
              style={{
                padding: '8px 16px',
                background: testing ? 'rgba(158, 158, 158, 0.3)' : 'rgba(33, 150, 243, 0.2)',
                border: '1px solid #2196f3',
                borderRadius: '8px',
                cursor: testing ? 'not-allowed' : 'pointer',
                fontSize: '12px',
                fontWeight: '500',
                color: testing ? 'rgba(255, 255, 255, 0.5)' : '#64b5f6',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => {
                if (!testing) {
                  e.currentTarget.style.background = '#2196f3';
                  e.currentTarget.style.color = 'white';
                }
              }}
              onMouseLeave={(e) => {
                if (!testing) {
                  e.currentTarget.style.background = 'rgba(33, 150, 243, 0.2)';
                  e.currentTarget.style.color = '#64b5f6';
                }
              }}
            >
              {testing ? '⏳ Testing...' : '🧪 Test'}
            </button>
            <button
              onClick={() => onEdit(connection)}
              style={{
                padding: '8px 16px',
                background: 'rgba(156, 39, 176, 0.2)',
                border: '1px solid #9c27b0',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '500',
                color: '#ba68c8',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#9c27b0';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(156, 39, 176, 0.2)';
                e.currentTarget.style.color = '#ba68c8';
              }}
            >
              ✏️ Edit
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              style={{
                padding: '8px 16px',
                background: deleting ? 'rgba(158, 158, 158, 0.3)' : 'rgba(244, 67, 54, 0.2)',
                border: '1px solid #f44336',
                borderRadius: '8px',
                cursor: deleting ? 'not-allowed' : 'pointer',
                fontSize: '12px',
                fontWeight: '500',
                color: deleting ? 'rgba(255, 255, 255, 0.5)' : '#e57373',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => {
                if (!deleting) {
                  e.currentTarget.style.background = '#f44336';
                  e.currentTarget.style.color = 'white';
                }
              }}
              onMouseLeave={(e) => {
                if (!deleting) {
                  e.currentTarget.style.background = 'rgba(244, 67, 54, 0.2)';
                  e.currentTarget.style.color = '#e57373';
                }
              }}
            >
              {deleting ? '⏳ Deleting...' : '🗑️ Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Connections(){
  const [name,setName]=useState('');
  const [type,setType]=useState('csv');
  const [list,setList]=useState([]);
  const [details,setDetails]=useState({});
  const [showDetails,setShowDetails]=useState(false);
  const [loading, setLoading] = useState(false);
  const [editingConnection, setEditingConnection] = useState(null);
  const nav = useNavigate();

  const fetchList = async ()=>{ 
    try {
      const res = await api.get('/connections/all');
      setList(res.data || []);
    } catch(e){
      console.error('Failed to fetch connections:', e.message);
    }
  };

  useEffect(()=>{ fetchList(); }, []);

  const getConnectionDetailsInputs = () => {
    const inputStyle = {
      width: '100%',
      padding: '14px 16px',
      marginBottom: '12px',
      border: '2px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '12px',
      boxSizing: 'border-box',
      fontSize: '15px',
      transition: 'all 0.3s',
      outline: 'none',
      fontFamily: 'inherit',
      background: 'rgba(255, 255, 255, 0.05)',
      color: 'white',
      backdropFilter: 'blur(10px)'
    };

    if (type === 'csv' || type === 'excel') {
      return (
        <div style={{marginTop: '16px'}}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            color: 'rgba(255, 255, 255, 0.9)',
            fontWeight: '500',
            fontSize: '14px'
          }}>
            File Path
          </label>
          <input 
            placeholder='e.g., C:/data/file.csv or /path/to/file.xlsx' 
            style={inputStyle}
            value={details.file_path || ''}
            onChange={(e)=>setDetails({...details, file_path: e.target.value})}
            onFocus={(e)=>e.target.style.borderColor = '#667eea'}
            onBlur={(e)=>e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
          />
          {type === 'excel' && (
            <>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: 'rgba(255, 255, 255, 0.9)',
                fontWeight: '500',
                fontSize: '14px'
              }}>
                Sheet Name (Optional)
              </label>
              <input 
                placeholder='Leave empty to use first sheet' 
                style={inputStyle}
                value={details.sheet_name || ''}
                onChange={(e)=>setDetails({...details, sheet_name: e.target.value})}
                onFocus={(e)=>e.target.style.borderColor = '#667eea'}
                onBlur={(e)=>e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
              />
            </>
          )}
        </div>
      );
    } else if (type === 'postgres' || type === 'mysql') {
      return (
        <div style={{marginTop: '16px'}}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            color: 'rgba(255, 255, 255, 0.9)',
            fontWeight: '500',
            fontSize: '14px'
          }}>
            Host
          </label>
          <input 
            placeholder='localhost or IP address' 
            style={inputStyle}
            value={details.host || ''}
            onChange={(e)=>setDetails({...details, host: e.target.value})}
            onFocus={(e)=>e.target.style.borderColor = '#667eea'}
            onBlur={(e)=>e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
          />
          <label style={{
            display: 'block',
            marginBottom: '8px',
            color: 'rgba(255, 255, 255, 0.9)',
            fontWeight: '500',
            fontSize: '14px'
          }}>
            Port
          </label>
          <input 
            placeholder={type === 'postgres' ? '5432' : '3306'} 
            type='number' 
            style={inputStyle}
            value={details.port || ''}
            onChange={(e)=>setDetails({...details, port: parseInt(e.target.value)})}
            onFocus={(e)=>e.target.style.borderColor = '#667eea'}
            onBlur={(e)=>e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
          />
          <label style={{
            display: 'block',
            marginBottom: '8px',
            color: 'rgba(255, 255, 255, 0.9)',
            fontWeight: '500',
            fontSize: '14px'
          }}>
            Database Name
          </label>
          <input 
            placeholder='Database name' 
            style={inputStyle}
            value={details.database || ''}
            onChange={(e)=>setDetails({...details, database: e.target.value})}
            onFocus={(e)=>e.target.style.borderColor = '#667eea'}
            onBlur={(e)=>e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
          />
          <label style={{
            display: 'block',
            marginBottom: '8px',
            color: 'rgba(255, 255, 255, 0.9)',
            fontWeight: '500',
            fontSize: '14px'
          }}>
            Username
          </label>
          <input 
            placeholder='Database username' 
            style={inputStyle}
            value={details.username || ''}
            onChange={(e)=>setDetails({...details, username: e.target.value})}
            onFocus={(e)=>e.target.style.borderColor = '#667eea'}
            onBlur={(e)=>e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
          />
          <label style={{
            display: 'block',
            marginBottom: '8px',
            color: 'rgba(255, 255, 255, 0.9)',
            fontWeight: '500',
            fontSize: '14px'
          }}>
            Password
          </label>
          <input 
            placeholder='Database password' 
            type='password' 
            style={inputStyle}
            value={details.password || ''}
            onChange={(e)=>setDetails({...details, password: e.target.value})}
            onFocus={(e)=>e.target.style.borderColor = '#667eea'}
            onBlur={(e)=>e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
          />
        </div>
      );
    } else if (type === 'mongodb') {
      return (
        <div style={{marginTop: '16px'}}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            color: 'rgba(255, 255, 255, 0.9)',
            fontWeight: '500',
            fontSize: '14px'
          }}>
            Host
          </label>
          <input 
            placeholder='localhost or IP address' 
            style={inputStyle}
            value={details.host || ''}
            onChange={(e)=>setDetails({...details, host: e.target.value})}
            onFocus={(e)=>e.target.style.borderColor = '#667eea'}
            onBlur={(e)=>e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
          />
          <label style={{
            display: 'block',
            marginBottom: '8px',
            color: 'rgba(255, 255, 255, 0.9)',
            fontWeight: '500',
            fontSize: '14px'
          }}>
            Port
          </label>
          <input 
            placeholder='27017' 
            type='number' 
            style={inputStyle}
            value={details.port || ''}
            onChange={(e)=>setDetails({...details, port: parseInt(e.target.value)})}
            onFocus={(e)=>e.target.style.borderColor = '#667eea'}
            onBlur={(e)=>e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
          />
          <label style={{
            display: 'block',
            marginBottom: '8px',
            color: 'rgba(255, 255, 255, 0.9)',
            fontWeight: '500',
            fontSize: '14px'
          }}>
            Database Name
          </label>
          <input 
            placeholder='MongoDB database name' 
            style={inputStyle}
            value={details.database || ''}
            onChange={(e)=>setDetails({...details, database: e.target.value})}
            onFocus={(e)=>e.target.style.borderColor = '#667eea'}
            onBlur={(e)=>e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
          />
          <label style={{
            display: 'block',
            marginBottom: '8px',
            color: '#333',
            fontWeight: '500',
            fontSize: '14px'
          }}>
            Collection Name
          </label>
          <input 
            placeholder='Collection name' 
            style={inputStyle}
            value={details.collection || ''}
            onChange={(e)=>setDetails({...details, collection: e.target.value})}
            onFocus={(e)=>e.target.style.borderColor = '#667eea'}
            onBlur={(e)=>e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
          />
          <label style={{
            display: 'block',
            marginBottom: '8px',
            color: '#333',
            fontWeight: '500',
            fontSize: '14px'
          }}>
            Username (Optional)
          </label>
          <input 
            placeholder='MongoDB username' 
            style={inputStyle}
            value={details.username || ''}
            onChange={(e)=>setDetails({...details, username: e.target.value})}
            onFocus={(e)=>e.target.style.borderColor = '#667eea'}
            onBlur={(e)=>e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
          />
          <label style={{
            display: 'block',
            marginBottom: '8px',
            color: '#333',
            fontWeight: '500',
            fontSize: '14px'
          }}>
            Password (Optional)
          </label>
          <input 
            placeholder='MongoDB password' 
            type='password' 
            style={inputStyle}
            value={details.password || ''}
            onChange={(e)=>setDetails({...details, password: e.target.value})}
            onFocus={(e)=>e.target.style.borderColor = '#667eea'}
            onBlur={(e)=>e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
          />
        </div>
      );
    } else if (type === 'supabase') {
      return (
        <div style={{marginTop: '16px'}}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: 'rgba(255, 255, 255, 0.9)',
                fontWeight: '500',
                fontSize: '14px'
              }}>
                Project URL
              </label>
          <input 
            placeholder='https://xxxxx.supabase.co' 
            style={inputStyle}
            value={details.project_url || details.host || ''}
            onChange={(e)=>setDetails({...details, project_url: e.target.value, host: e.target.value})}
            onFocus={(e)=>e.target.style.borderColor = '#667eea'}
            onBlur={(e)=>e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
          />
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: 'rgba(255, 255, 255, 0.9)',
                fontWeight: '500',
                fontSize: '14px'
              }}>
                Database Password
              </label>
          <input 
            placeholder='Database password' 
            type='password' 
            style={inputStyle}
            value={details.password || ''}
            onChange={(e)=>setDetails({...details, password: e.target.value})}
            onFocus={(e)=>e.target.style.borderColor = '#667eea'}
            onBlur={(e)=>e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
          />
          <label style={{
            display: 'block',
            marginBottom: '8px',
            color: 'rgba(255, 255, 255, 0.9)',
            fontWeight: '500',
            fontSize: '14px'
          }}>
            Database Name
          </label>
          <input 
            placeholder='postgres (default)' 
            style={inputStyle}
            value={details.database || 'postgres'}
            onChange={(e)=>setDetails({...details, database: e.target.value})}
            onFocus={(e)=>e.target.style.borderColor = '#667eea'}
            onBlur={(e)=>e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
          />
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: 'rgba(255, 255, 255, 0.9)',
                fontWeight: '500',
                fontSize: '14px'
              }}>
                Database User
              </label>
          <input 
            placeholder='postgres (default)' 
            style={inputStyle}
            value={details.username || 'postgres'}
            onChange={(e)=>setDetails({...details, username: e.target.value})}
            onFocus={(e)=>e.target.style.borderColor = '#667eea'}
            onBlur={(e)=>e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
          />
          <label style={{
            display: 'block',
            marginBottom: '8px',
            color: 'rgba(255, 255, 255, 0.9)',
            fontWeight: '500',
            fontSize: '14px'
          }}>
            Port
          </label>
          <input 
            placeholder='5432 (default)' 
            type='number' 
            style={inputStyle}
            value={details.port || '5432'}
            onChange={(e)=>setDetails({...details, port: parseInt(e.target.value) || 5432})}
            onFocus={(e)=>e.target.style.borderColor = '#667eea'}
            onBlur={(e)=>e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
          />
            <div style={{
              marginTop: '12px',
              padding: '12px',
              background: 'rgba(3, 169, 244, 0.2)',
              backdropFilter: 'blur(10px)',
              borderRadius: '8px',
              fontSize: '12px',
              color: '#4fc3f7',
              border: '1px solid rgba(3, 169, 244, 0.3)'
            }}>
              💡 Tip: Find your database password in Supabase Dashboard → Project Settings → Database
            </div>
        </div>
      );
    } else if (type === 'firebase') {
      return (
        <div style={{marginTop: '16px'}}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: 'rgba(255, 255, 255, 0.9)',
                fontWeight: '500',
                fontSize: '14px'
              }}>
                Project ID
              </label>
          <input 
            placeholder='your-project-id' 
            style={inputStyle}
            value={details.project_id || ''}
            onChange={(e)=>setDetails({...details, project_id: e.target.value})}
            onFocus={(e)=>e.target.style.borderColor = '#667eea'}
            onBlur={(e)=>e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
          />
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: 'rgba(255, 255, 255, 0.9)',
                fontWeight: '500',
                fontSize: '14px'
              }}>
                Service Account Key (JSON)
              </label>
          <textarea 
            placeholder='Paste your Firebase service account JSON key here...' 
            style={{
              ...inputStyle,
              minHeight: '120px',
              fontFamily: 'monospace',
              fontSize: '12px'
            }}
            value={details.service_account_key || ''}
            onChange={(e)=>setDetails({...details, service_account_key: e.target.value})}
            onFocus={(e)=>e.target.style.borderColor = '#667eea'}
            onBlur={(e)=>e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
          />
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: 'rgba(255, 255, 255, 0.9)',
                fontWeight: '500',
                fontSize: '14px'
              }}>
                Database ID (Optional)
              </label>
          <input 
            placeholder='(default) - Leave empty for default database' 
            style={inputStyle}
            value={details.database_id || ''}
            onChange={(e)=>setDetails({...details, database_id: e.target.value})}
            onFocus={(e)=>e.target.style.borderColor = '#667eea'}
            onBlur={(e)=>e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
          />
            <div style={{
              marginTop: '12px',
              padding: '12px',
              background: 'rgba(255, 152, 0, 0.2)',
              backdropFilter: 'blur(10px)',
              borderRadius: '8px',
              fontSize: '12px',
              color: '#ffb74d',
              border: '1px solid rgba(255, 152, 0, 0.3)'
            }}>
              💡 Tip: Get your service account key from Firebase Console → Project Settings → Service Accounts
            </div>
        </div>
      );
    }
    return null;
  };

  const add = async ()=>{
    if (!name.trim()) {
      alert('Please enter a connection name');
      return;
    }
    setLoading(true);
    try {
      const connectionDetails = { ...details };
      if (type === 'postgres' || type === 'mysql' || type === 'supabase') {
        connectionDetails.type = type;
      }
      await api.post('/connections/add', { name, type, details: connectionDetails });
      setName(''); 
      setDetails({});
      setShowDetails(false);
      fetchList();
      alert('✅ Connection added successfully!');
    } catch(e){
      const errorMessage = e.response?.data?.detail || e.message;
      if (errorMessage.includes('Backend server is not running')) {
        alert('⚠️ Backend Connection Error:\n\n' + errorMessage);
      } else {
        alert('❌ Add connection failed: ' + errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const update = async () => {
    if (!name.trim()) {
      alert('Please enter a connection name');
      return;
    }
    setLoading(true);
    try {
      const connectionDetails = { ...details };
      if (type === 'postgres' || type === 'mysql' || type === 'supabase') {
        connectionDetails.type = type;
      }
      await api.put(`/connections/${editingConnection.id}`, { 
        name, 
        type, 
        details: connectionDetails 
      });
      setName(''); 
      setDetails({});
      setShowDetails(false);
      setEditingConnection(null);
      fetchList();
      alert('✅ Connection updated successfully!');
    } catch(e){
      const errorMessage = e.response?.data?.detail || e.message;
      alert('❌ Update connection failed: ' + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (connectionId) => {
    await api.delete(`/connections/${connectionId}`);
    fetchList();
  };

  const handleTest = async (connectionId) => {
    const res = await api.post(`/connections/${connectionId}/test`);
    return res.data;
  };

  const handleEdit = (connection) => {
    setEditingConnection(connection);
    setName(connection.name);
    setType(connection.type);
    setDetails(connection.details || {});
    setShowDetails(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDisconnect = async (connectionId) => {
    await api.post(`/connections/${connectionId}/disconnect`);
    fetchList();
  };

  const handleConnect = async (connectionId) => {
    await api.post(`/connections/${connectionId}/connect`);
    fetchList();
  };

  const handleCancelEdit = () => {
    setEditingConnection(null);
    setName('');
    setType('csv');
    setDetails({});
    setShowDetails(false);
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
            background: '#2563eb',
            color: 'white',
            textDecoration: 'none',
            fontWeight: '500',
            transition: 'all 0.2s'
          }}>
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
        {/* Header */}
        <div style={{
          marginBottom: '32px'
        }}>
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
            {editingConnection ? 'Edit Connection' : 'Data Connections'}
          </h1>
          <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.7)', fontSize: '16px' }}>
            {editingConnection 
              ? 'Update your connection details' 
              : 'Connect to your data sources to start querying with AI'}
          </p>
        </div>

        {/* Add/Edit Connection Form */}
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
            marginBottom: '24px'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              marginRight: '16px'
            }}>
              {editingConnection ? '✏️' : '➕'}
            </div>
            <h2 style={{
              margin: 0,
              fontSize: '24px',
              fontWeight: '600',
              color: 'white'
            }}>
              {editingConnection ? 'Edit Connection' : 'Add New Connection'}
            </h2>
          </div>

          <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            color: 'rgba(255, 255, 255, 0.9)',
            fontWeight: '500',
            fontSize: '14px'
          }}>
            Connection Name
          </label>
          <input 
            placeholder='e.g., Sales Data, Customer Database' 
            value={name} 
            onChange={(e)=>setName(e.target.value)}
            style={{
              width: '100%',
              padding: '14px 16px',
              border: '2px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              boxSizing: 'border-box',
              fontSize: '15px',
              transition: 'all 0.3s',
              outline: 'none',
              background: 'rgba(255, 255, 255, 0.05)',
              color: 'white',
              backdropFilter: 'blur(10px)'
            }}
            onFocus={(e)=>e.target.style.borderColor = '#667eea'}
            onBlur={(e)=>e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
          />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#333',
              fontWeight: '500',
              fontSize: '14px'
            }}>
              Connection Type
            </label>
            <select 
              value={type} 
              onChange={(e)=>{setType(e.target.value); setDetails({}); setShowDetails(true);}} 
              style={{
                width: '100%',
                padding: '14px 16px',
                border: '2px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                boxSizing: 'border-box',
                fontSize: '15px',
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.3s',
                outline: 'none'
              }}
              onFocus={(e)=>e.target.style.borderColor = '#667eea'}
              onBlur={(e)=>e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
              disabled={!!editingConnection}
            >
              <option value='csv'>📄 CSV File</option>
              <option value='excel'>📊 Excel File</option>
              <option value='postgres'>🐘 PostgreSQL Database</option>
              <option value='mysql'>🗄️ MySQL Database</option>
              <option value='mongodb'>🍃 MongoDB</option>
              <option value='supabase'>⚡ Supabase</option>
              <option value='firebase'>🔥 Firebase</option>
            </select>
          </div>
          
          {showDetails && getConnectionDetailsInputs()}
          
          <div style={{
            display: 'flex',
            gap: '12px',
            marginTop: '24px'
          }}>
            <button 
              onClick={editingConnection ? update : add}
              disabled={loading}
              style={{
                flex: 1,
                padding: '16px',
                background: loading ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
              {loading ? '⏳ Processing...' : (editingConnection ? '✅ Update Connection' : '✅ Add Connection')}
            </button>
            {editingConnection && (
              <button 
                onClick={handleCancelEdit}
                style={{
                  padding: '16px 24px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  color: 'rgba(255, 255, 255, 0.8)',
                  border: '2px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '600',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e)=>{
                  e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                }}
                onMouseLeave={(e)=>{
                  e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* Connections List */}
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '24px'
          }}>
            <h2 style={{
              margin: 0,
              fontSize: '24px',
              fontWeight: '600',
              color: 'white'
            }}>
              Your Connections ({list.length})
            </h2>
            {list.length > 0 && (
              <div style={{
                padding: '6px 12px',
                background: 'rgba(76, 175, 80, 0.2)',
                color: '#81c784',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '500',
                border: '1px solid rgba(76, 175, 80, 0.3)'
              }}>
                {list.filter(c => c.status === 'active').length} Active
              </div>
            )}
          </div>

          {list.length === 0 ? (
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              padding: '48px',
              borderRadius: '20px',
              textAlign: 'center',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              border: '2px dashed rgba(255, 255, 255, 0.2)'
            }}>
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔗</div>
              <h3 style={{
                margin: '0 0 8px 0',
                fontSize: '20px',
                fontWeight: '600',
                color: 'white'
              }}>
                No connections yet
              </h3>
              <p style={{
                margin: 0,
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '14px'
              }}>
                Add your first data connection above to get started
              </p>
            </div>
          ) : (
            <div>
              {list.map((connection, i) => (
                <ConnectionCard 
                  key={connection.id || i} 
                  connection={connection} 
                  index={i}
                  onDelete={handleDelete}
                  onTest={handleTest}
                  onEdit={handleEdit}
                  onDisconnect={handleDisconnect}
                  onConnect={handleConnect}
                  onRefresh={fetchList}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
