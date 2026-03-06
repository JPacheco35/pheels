import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import PageTransition from '../PageTransition/PageTransition.tsx';

const API_URL = import.meta.env.VITE_API_URL;

const TABS = ['Tab 1', 'Tab 2'];

function GlassCard({
  children,
  style = {},
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        background: 'rgba(15,16,20,0.65)',
        backdropFilter: 'blur(24px)',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 8px 48px rgba(0,0,0,0.6)',
        borderRadius: 20,
        padding: '28px 32px',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Tab1() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <GlassCard>
        <p
          style={{
            color: '#aaa',
            fontFamily: 'Ubuntu, sans-serif',
            fontSize: 13,
          }}
        >
          Tab 1 — Section A
        </p>
        <p
          style={{
            color: '#555',
            fontSize: 12,
            marginTop: 8,
            fontFamily: 'Ubuntu, sans-serif',
          }}
        >
          Content goes here
        </p>
      </GlassCard>
      <GlassCard>
        <p
          style={{
            color: '#aaa',
            fontFamily: 'Ubuntu, sans-serif',
            fontSize: 13,
          }}
        >
          Tab 1 — Section B
        </p>
        <p
          style={{
            color: '#555',
            fontSize: 12,
            marginTop: 8,
            fontFamily: 'Ubuntu, sans-serif',
          }}
        >
          Content goes here
        </p>
      </GlassCard>
    </div>
  );
}

function Tab2() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <GlassCard>
        <p
          style={{
            color: '#aaa',
            fontFamily: 'Ubuntu, sans-serif',
            fontSize: 13,
          }}
        >
          Tab 2 — Section A
        </p>
        <p
          style={{
            color: '#555',
            fontSize: 12,
            marginTop: 8,
            fontFamily: 'Ubuntu, sans-serif',
          }}
        >
          Content goes here
        </p>
      </GlassCard>
      <GlassCard>
        <p
          style={{
            color: '#aaa',
            fontFamily: 'Ubuntu, sans-serif',
            fontSize: 13,
          }}
        >
          Tab 2 — Section B
        </p>
        <p
          style={{
            color: '#555',
            fontSize: 12,
            marginTop: 8,
            fontFamily: 'Ubuntu, sans-serif',
          }}
        >
          Content goes here
        </p>
      </GlassCard>
    </div>
  );
}

export default function Home() {
  const [auth, setAuth] = useState<'loading' | 'valid' | 'invalid'>('loading');
  const [activeTab, setActiveTab] = useState('Tab 1');
  const [accountOpen, setAccountOpen] = useState(false);

  // verify the user's token --> send user back to login if invalid
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) return setAuth('invalid');

    axios
      .get(`${API_URL}/api/verify`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => setAuth('valid'))
      .catch(() => {
        localStorage.removeItem('authToken');
        setAuth('invalid');
      });
  }, []);

  if (auth === 'loading')
    return (
      <PageTransition>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            color: '#555',
            fontFamily: 'Ubuntu, sans-serif',
            fontSize: 13,
          }}
        >
          Loading...
        </div>
      </PageTransition>
    );

  if (auth === 'invalid') return <Navigate to="/login" replace />;

  return (
    <PageTransition>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div style={{ minHeight: '100vh'}}>
        {/* HEADER */}
        <div
          style={{
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            background: 'rgba(15,16,20,0.8)',
            backdropFilter: 'blur(16px)',
            position: 'sticky',
            top: 0,
            zIndex: 50,
          }}
        >
          <div
            style={{
              maxWidth: 900,
              margin: '0 auto',
              padding: '0 24px',
              height: 60,
              display: 'flex',
              alignItems: 'center',
              gap: 24,
            }}
          >
            {/* Logo */}
            <span
              style={{
                fontFamily: 'Bisikan Senja, serif',
                fontStyle: 'italic',
                fontSize: 28,
                background: 'linear-gradient(135deg, #1efcde, #ff02d7)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginRight: 8,
              }}
            >
              Pheels
            </span>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 4, flex: 1 }}>
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    background:
                      activeTab === tab ? 'rgba(255,255,255,0.06)' : 'none',
                    border: 'none',
                    color: activeTab === tab ? '#f0f2ff' : '#666',
                    fontFamily: 'Ubuntu, sans-serif',
                    fontSize: 13,
                    fontWeight: 500,
                    padding: '6px 16px',
                    borderRadius: 8,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Account */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setAccountOpen((o) => !o)}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: '#aaa',
                  fontFamily: 'Ubuntu, sans-serif',
                  fontSize: 13,
                  padding: '6px 14px',
                  borderRadius: 20,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #1efcde33, #ff02d733)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 11,
                    color: '#ccc',
                  }}
                >
                  U
                </div>
                Account
              </button>

              {accountOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    background: 'rgba(15,16,20,0.95)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 12,
                    padding: 6,
                    minWidth: 150,
                    animation: 'fadeUp 0.15s ease both',
                  }}
                >
                  {['Profile', 'Settings'].map((item) => (
                    <button
                      key={item}
                      style={{
                        display: 'block',
                        width: '100%',
                        background: 'none',
                        border: 'none',
                        color: '#888',
                        fontFamily: 'Ubuntu, sans-serif',
                        fontSize: 13,
                        padding: '9px 12px',
                        borderRadius: 8,
                        textAlign: 'left',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = '#f0f2ff')
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = '#888')
                      }
                    >
                      {item}
                    </button>
                  ))}
                  <div
                    style={{
                      height: 1,
                      background: 'rgba(255,255,255,0.06)',
                      margin: '4px 0',
                    }}
                  />
                  <button
                    style={{
                      display: 'block',
                      width: '100%',
                      background: 'none',
                      border: 'none',
                      color: '#888',
                      fontFamily: 'Ubuntu, sans-serif',
                      fontSize: 13,
                      padding: '9px 12px',
                      borderRadius: 8,
                      textAlign: 'left',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = '#ff6b6b')
                    }
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#888')}
                    onClick={() => {
                      localStorage.removeItem('authToken');
                      window.location.href = '/login';
                    }}
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px' }}>
          <div key={activeTab} style={{ animation: 'fadeUp 0.2s ease both' }}>
            {activeTab === 'Tab 1' ? <Tab1 /> : <Tab2 />}
          </div>
        </div>

        {/* Click outside to close account dropdown */}
        {accountOpen && (
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 49 }}
            onClick={() => setAccountOpen(false)}
          />
        )}
      </div>
    </PageTransition>
  );
}
