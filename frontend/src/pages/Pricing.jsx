import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Pricing() {
  const nav = useNavigate();
  const token = localStorage.getItem('token');

  const handlePlanSelect = (planName) => {
    if (token) {
      // User is logged in - could navigate to upgrade/billing page
      alert(`You selected the ${planName} plan. This feature will be available soon!`);
    } else {
      // User is not logged in - redirect to login
      nav('/');
    }
  };

  const plans = [
    {
      name: 'Free',
      subtitle: 'Perfect for getting started',
      price: '$0',
      period: 'forever',
      buttonText: 'Start Free',
      buttonColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      popular: false,
      features: [
        { text: '1 data connection', included: true },
        { text: '50 queries per month', included: true },
        { text: 'Basic NLP queries', included: true },
        { text: '7 days query history', included: true },
        { text: '5MB file size limit', included: true },
        { text: 'Community support', included: true },
        { text: 'Limited exports', included: false },
        { text: 'No AI insights', included: false },
        { text: 'No custom visualizations', included: false }
      ]
    },
    {
      name: 'Pro',
      subtitle: 'For professionals and small teams',
      price: '$19',
      period: 'per month',
      buttonText: 'Start Pro Trial',
      buttonColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      popular: true,
      features: [
        { text: '10 data connections', included: true },
        { text: 'Unlimited queries', included: true },
        { text: 'Advanced NLP queries', included: true },
        { text: '90 days history', included: true },
        { text: '50MB file size', included: true },
        { text: 'AI-powered insights', included: true },
        { text: 'Export to PDF/Excel', included: true },
        { text: 'Custom visualizations', included: true },
        { text: 'Email support', included: true }
      ]
    },
    {
      name: 'Business',
      subtitle: 'For growing businesses',
      price: '$49',
      period: 'per month',
      buttonText: 'Start Business Trial',
      buttonColor: 'linear-gradient(135deg, #ff9800 0%, #f44336 100%)',
      popular: false,
      features: [
        { text: 'Unlimited connections', included: true },
        { text: 'Unlimited queries', included: true },
        { text: 'Unlimited history', included: true },
        { text: 'Unlimited file size', included: true },
        { text: 'Team collaboration (5 users)', included: true },
        { text: 'API access', included: true },
        { text: 'Scheduled reports', included: true },
        { text: 'Custom dashboards', included: true },
        { text: 'Priority support', included: true },
        { text: 'White-label options', included: true }
      ]
    }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: '#ffffff',
      color: '#0f172a',
      position: 'relative'
    }}>
      {/* Navigation Header */}
      <header style={{
        padding: '20px 40px',
        background: '#f8fbff',
        borderBottom: '1px solid #e6effa',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <Link to="/" style={{
          display: 'flex',
          alignItems: 'center',
          textDecoration: 'none',
          color: '#0f172a',
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
            color: '#334155',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.color = '#0f172a'}
          onMouseLeave={(e) => e.target.style.color = '#334155'}
          >
            Features
          </Link>
          <Link to="/pricing" style={{
            color: '#0f172a',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: '600'
          }}>
            Pricing
          </Link>
          <Link to="/" style={{
            color: '#334155',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.color = '#0f172a'}
          onMouseLeave={(e) => e.target.style.color = '#334155'}
          >
            How It Works
          </Link>
        </nav>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          {token ? (
            <Link to="/dashboard" style={{
              padding: '10px 20px',
              background: '#ffffff',
              border: '1px solid #e6effa',
              borderRadius: '8px',
              color: '#0f172a',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#f1f5f9';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = '#ffffff';
            }}
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link to="/" style={{
                color: '#334155',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.color = '#0f172a'}
              onMouseLeave={(e) => e.target.style.color = '#334155'}
              >
                Login
              </Link>
              <Link to="/" style={{
                padding: '10px 20px',
                background: '#2563eb',
                borderRadius: '8px',
                color: 'white',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'all 0.2s',
                boxShadow: '0 4px 15px rgba(37, 99, 235, 0.35)'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(37, 99, 235, 0.45)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(37, 99, 235, 0.35)';
              }}
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '80px 40px'
      }}>
        {/* Header Section */}
        <div style={{
          textAlign: 'center',
          marginBottom: '80px'
        }}>
          <h1 style={{
            fontSize: '56px',
            fontWeight: '800',
            margin: '0 0 16px 0',
            background: 'linear-gradient(135deg, #ffffff 0%, #667eea 50%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Choose Your Plan
          </h1>
          <p style={{
            fontSize: '20px',
            color: '#475569',
            margin: 0,
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Select the perfect plan for your data analytics needs. Start free and upgrade anytime.
          </p>
        </div>

        {/* Pricing Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '32px',
          marginBottom: '80px'
        }}>
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              style={{
                background: '#ffffff',
                border: plan.popular ? '2px solid #bfdbfe' : '1px solid #e6effa',
                borderRadius: '20px',
                padding: '40px',
                position: 'relative',
                transition: 'all 0.3s',
                boxShadow: plan.popular ? '0 20px 40px rgba(37, 99, 235, 0.1)' : '0 8px 24px rgba(15, 23, 42, 0.06)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(15, 23, 42, 0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {plan.popular && (
                <div style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  background: '#2563eb',
                  color: 'white',
                  padding: '6px 16px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  Most Popular
                </div>
              )}

              <div style={{
                marginBottom: '24px'
              }}>
                <h3 style={{
                  fontSize: '32px',
                  fontWeight: '700',
                  margin: '0 0 8px 0',
                  color: '#0f172a'
                }}>
                  {plan.name}
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: '#64748b',
                  margin: 0
                }}>
                  {plan.subtitle}
                </p>
              </div>

              <div style={{
                marginBottom: '32px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: '8px',
                  marginBottom: '8px'
                }}>
                  <span style={{
                    fontSize: '48px',
                    fontWeight: '800',
                    color: '#0f172a'
                  }}>
                    {plan.price}
                  </span>
                  {plan.period !== 'forever' && (
                    <span style={{
                      fontSize: '16px',
                      color: '#64748b'
                    }}>
                      /{plan.period}
                    </span>
                  )}
                </div>
                {plan.period === 'forever' && (
                  <span style={{
                    fontSize: '14px',
                    color: '#64748b'
                  }}>
                    Free forever
                  </span>
                )}
              </div>

              <button
                onClick={() => handlePlanSelect(plan.name)}
                style={{
                  width: '100%',
                  padding: '16px',
                  marginBottom: '32px',
                  background: plan.name === 'Business' ? '#f97316' : '#2563eb',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  boxShadow: '0 4px 15px rgba(37, 99, 235, 0.35)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 20px rgba(37, 99, 235, 0.45)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 15px rgba(37, 99, 235, 0.35)';
                }}
              >
                {plan.buttonText}
              </button>

              <div style={{
                borderTop: '1px solid #e6effa',
                paddingTop: '32px'
              }}>
                <div style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#0f172a',
                  marginBottom: '20px'
                }}>
                  Features:
                </div>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px'
                }}>
                  {plan.features.map((feature, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        fontSize: '14px'
                      }}
                    >
                      <div style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        background: feature.included ? '#16a34a' : '#fee2e2',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        border: feature.included ? 'none' : '2px solid #fecaca'
                      }}>
                        {feature.included ? (
                          <span style={{ color: 'white', fontSize: '12px', fontWeight: 'bold' }}>✓</span>
                        ) : (
                          <span style={{ color: '#ef4444', fontSize: '12px', fontWeight: 'bold' }}>✗</span>
                        )}
                      </div>
                      <span style={{
                        color: feature.included ? '#0f172a' : '#94a3b8',
                        textDecoration: feature.included ? 'none' : 'line-through'
                      }}>
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          padding: '60px 40px',
          background: '#ffffff',
          borderRadius: '20px',
          border: '1px solid #e6effa'
        }}>
          <h2 style={{
            fontSize: '32px',
            fontWeight: '700',
            textAlign: 'center',
            marginBottom: '40px',
            color: '#0f172a'
          }}>
            Frequently Asked Questions
          </h2>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
          }}>
            {[
              {
                q: 'Can I change my plan later?',
                a: 'Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.'
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept all major credit cards, debit cards, and PayPal. Enterprise plans also support invoice billing.'
              },
              {
                q: 'Is there a free trial?',
                a: 'Yes! All paid plans come with a 14-day free trial. No credit card required to start your trial.'
              },
              {
                q: 'What happens to my data if I cancel?',
                a: 'Your data is safe. You can export all your data before canceling. We keep your data for 30 days after cancellation in case you want to reactivate.'
              }
            ].map((faq, idx) => (
              <div key={idx} style={{
                padding: '24px',
                background: '#ffffff',
                borderRadius: '12px',
                border: '1px solid #e6effa'
              }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  margin: '0 0 12px 0',
                  color: '#0f172a'
                }}>
                  {faq.q}
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: '#475569',
                  margin: 0,
                  lineHeight: '1.6'
                }}>
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div style={{
          textAlign: 'center',
          marginTop: '80px',
          padding: '60px 40px',
          background: '#eff6ff',
          borderRadius: '20px',
          border: '1px solid #bfdbfe'
        }}>
          <h2 style={{
            fontSize: '40px',
            fontWeight: '700',
            margin: '0 0 16px 0',
            color: '#0f172a'
          }}>
            Ready to get started?
          </h2>
          <p style={{
            fontSize: '18px',
            color: '#475569',
            margin: '0 0 32px 0'
          }}>
            Join thousands of users who are already analyzing their data with AI
          </p>
          <Link to={token ? "/dashboard" : "/"} style={{
            display: 'inline-block',
            padding: '16px 32px',
            background: '#2563eb',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: '600',
            transition: 'all 0.3s',
            boxShadow: '0 4px 15px rgba(37, 99, 235, 0.35)'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 20px rgba(37, 99, 235, 0.45)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 15px rgba(37, 99, 235, 0.35)';
          }}
          >
            {token ? 'Go to Dashboard' : 'Start Free Trial'}
          </Link>
        </div>
      </div>
    </div>
  );
}

