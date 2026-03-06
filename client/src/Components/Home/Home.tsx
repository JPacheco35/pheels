import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import PageTransition from '../PageTransition/PageTransition.tsx';
import {
  AppShell,
  Box,
  Button,
  Center,
  Divider,
  Group,
  Menu,
  Paper,
  Stack,
  Text,
  UnstyledButton,
} from '@mantine/core';

const API_URL = import.meta.env.VITE_API_URL;

const TABS = ['Tab 1', 'Tab 2'];

// ---------------------------------------------------------------------------
// GlassCard
// ---------------------------------------------------------------------------
function GlassCard({
  children,
  style = {},
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <Paper
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
    </Paper>
  );
}

// ---------------------------------------------------------------------------
// Tab content
// ---------------------------------------------------------------------------
function Tab1() {
  return (
    <Stack gap={16}>
      <GlassCard>
        <Text c="#aaa" ff="Ubuntu, sans-serif" fz={13}>
          Tab 1 — Section A
        </Text>
        <Text c="#555" fz={12} mt={8} ff="Ubuntu, sans-serif">
          Content goes here
        </Text>
      </GlassCard>
      <GlassCard>
        <Text c="#aaa" ff="Ubuntu, sans-serif" fz={13}>
          Tab 1 — Section B
        </Text>
        <Text c="#555" fz={12} mt={8} ff="Ubuntu, sans-serif">
          Content goes here
        </Text>
      </GlassCard>
    </Stack>
  );
}

function Tab2() {
  return (
    <Stack gap={16}>
      <GlassCard>
        <Text c="#aaa" ff="Ubuntu, sans-serif" fz={13}>
          Tab 2 — Section A
        </Text>
        <Text c="#555" fz={12} mt={8} ff="Ubuntu, sans-serif">
          Content goes here
        </Text>
      </GlassCard>
      <GlassCard>
        <Text c="#aaa" ff="Ubuntu, sans-serif" fz={13}>
          Tab 2 — Section B
        </Text>
        <Text c="#555" fz={12} mt={8} ff="Ubuntu, sans-serif">
          Content goes here
        </Text>
      </GlassCard>
    </Stack>
  );
}


export default function Home() {
  const [auth, setAuth] = useState<'loading' | 'valid' | 'invalid'>('loading');
  const [activeTab, setActiveTab] = useState('Tab 1');

  // check if jwt is valid --> back to login if not
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

  // loading animation
  if (auth === 'loading') {
    return (
      <PageTransition>
        <Center mih="100vh">
          <Text c="#555" ff="Ubuntu, sans-serif" fz={13}>
            Loading...
          </Text>
        </Center>
      </PageTransition>
    );
  }

  // redirect to login if not authenticated
  if (auth === 'invalid') return <Navigate to="/login" replace />;

  return (
    <PageTransition>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <AppShell header={{ height: 60 }} style={{ minHeight: '100vh' }}>
        {/* ---------------------------------------------------------------- */}
        {/* HEADER                                                           */}
        {/* ---------------------------------------------------------------- */}
        <AppShell.Header
          style={{
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            background: 'rgba(15,16,20,0.8)',
            backdropFilter: 'blur(16px)',
          }}
        >
          <Box
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
            <Text
              component="span"
              style={{
                fontFamily: 'Bisikan Senja, serif',
                fontStyle: 'italic',
                fontSize: 28,
                background: 'linear-gradient(135deg, #1efcde, #ff02d7)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginRight: 8,
                lineHeight: 1,
              }}
            >
              Pheels
            </Text>

            {/* Tabs */}
            <Group gap={4} style={{ flex: 1 }}>
              {TABS.map((tab) => (
                <UnstyledButton
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    background:
                      activeTab === tab ? 'rgba(255,255,255,0.06)' : 'none',
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
                </UnstyledButton>
              ))}
            </Group>

            {/* Account menu */}
            <Menu
              position="bottom-end"
              offset={8}
              styles={{
                dropdown: {
                  background: 'rgba(15,16,20,0.95)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 12,
                  padding: 6,
                  minWidth: 150,
                  animation: 'fadeUp 0.15s ease both',
                },
                item: {
                  color: '#888',
                  fontFamily: 'Ubuntu, sans-serif',
                  fontSize: 13,
                  borderRadius: 8,
                  background: 'none',
                  '&:hover': {
                    color: '#f0f2ff',
                    background: 'rgba(255,255,255,0.04)',
                  },
                },
              }}
            >
              <Menu.Target>
                <Button
                  variant="subtle"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: '#aaa',
                    fontFamily: 'Ubuntu, sans-serif',
                    fontSize: 13,
                    padding: '6px 14px',
                    borderRadius: 20,
                    cursor: 'pointer',
                    height: 'auto',
                  }}
                  leftSection={
                    <Box
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: '50%',
                        background:
                          'linear-gradient(135deg, #1efcde33, #ff02d733)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 11,
                        color: '#ccc',
                      }}
                    >
                      U
                    </Box>
                  }
                >
                  Account
                </Button>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item>Profile</Menu.Item>
                <Menu.Item>Settings</Menu.Item>
                <Divider
                  style={{
                    borderColor: 'rgba(255,255,255,0.06)',
                    margin: '4px 0',
                  }}
                />
                <Menu.Item
                  style={{ color: '#888' }}
                  styles={{
                    item: {
                      '&:hover': {
                        color: '#ff6b6b',
                        background: 'rgba(255,107,107,0.06)',
                      },
                    },
                  }}
                  onClick={() => {
                    localStorage.removeItem('authToken');
                    window.location.href = '/login';
                  }}
                >
                  Log out
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Box>
        </AppShell.Header>

        {/* ---------------------------------------------------------------- */}
        {/* CONTENT                                                          */}
        {/* ---------------------------------------------------------------- */}
        <AppShell.Main>
          <Box
            style={{
              maxWidth: 900,
              margin: '0 auto',
              padding: '32px 24px',
            }}
          >
            <Box key={activeTab} style={{ animation: 'fadeUp 0.2s ease both' }}>
              {activeTab === 'Tab 1' ? <Tab1 /> : <Tab2 />}
            </Box>
          </Box>
        </AppShell.Main>
      </AppShell>
    </PageTransition>
  );
}
