import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import FadeInPageTransition from '../../Animations/FadeInPageTransition/FadeInPageTransition.tsx';
import {
  ActionIcon,
  AppShell,
  Box,
  Button,
  Center,
  Divider,
  Group,
  Menu,
  Text,
  UnstyledButton,
  useComputedColorScheme,
  useMantineColorScheme,
} from '@mantine/core';
import JournalTab from '../../Tabs/JournalTab/JournalTab.tsx';
import MoodTab from '../../Tabs/MoodTab/MoodTab.tsx';
import Settings from '../../Pages/Settings/Settings.tsx';
import Logo from '../../Logo/Logo.tsx';
import { IconMoonStars, IconSun } from '@tabler/icons-react';

const API_URL = import.meta.env.VITE_API_URL;

const TABS = ['Journaling', 'Mood Diary'];

export default function Home() {
  const [auth, setAuth] = useState<'loading' | 'valid' | 'invalid'>('loading');
  const [activeTab, setActiveTab] = useState('Journaling');
  const [username, setUsername] = useState('');

  const { setColorScheme } = useMantineColorScheme();
  const colorScheme = useComputedColorScheme('dark');
  // const navigate = useNavigate();

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

    axios
      .get(`${API_URL}/api/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUsername(res.data.username))
      .catch(() => {
        localStorage.removeItem('authToken');
        setAuth('invalid');
      });
  }, []);

  if (auth === 'loading') {
    return (
      <FadeInPageTransition>
        <Center mih="100vh">
          <Text c="#555" ff="Ubuntu, sans-serif" fz={13}>
            Loading...
          </Text>
        </Center>
      </FadeInPageTransition>
    );
  }

  if (auth === 'invalid') return <Navigate to="/login" replace />;

  return (
    <FadeInPageTransition>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <AppShell header={{ height: 60 }} style={{ minHeight: '100vh' }}>
        <AppShell.Header
          style={{
            borderBottom:
              '2px solid light-dark(rgba(0,0,0,0.08), rgba(214,216,213,0.12))',
            background: 'light-dark(rgba(255,255,255,0.6), rgba(15,16,20,0.4))',
            backdropFilter: 'blur(160px)',
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
            <Logo fontSize={50} />

            {/* visible tabs only */}
            <Group gap={4} style={{ flex: 1 }}>
              {TABS.map((tab) => (
                <UnstyledButton
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    background:
                      activeTab === tab
                        ? 'light-dark(rgba(0,0,0,0.06), rgba(255,255,255,0.06))'
                        : 'none',
                    color:
                      activeTab === tab
                        ? 'light-dark(#1a1b2e, #f0f2ff)'
                        : 'light-dark(#999, #666)',
                    fontFamily: 'Beautiful Every Time, sans-serif',
                    fontSize: 13,
                    fontWeight: 900,
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

            <ActionIcon
              variant="subtle"
              size="lg"
              onClick={() =>
                setColorScheme(colorScheme === 'dark' ? 'light' : 'dark')
              }
              style={{ fontSize: 18 }}
            >
              {colorScheme === 'dark' ? (
                <IconSun
                  style={{ width: '70%', height: '70%' }}
                  stroke={1.5}
                  color="#ffcc00"
                />
              ) : (
                <IconMoonStars
                  style={{ width: '70%', height: '70%' }}
                  stroke={1.5}
                />
              )}
            </ActionIcon>

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
                      {username.charAt(0).toUpperCase()}
                    </Box>
                  }
                >
                  {username}
                </Button>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item onClick={() => setActiveTab('Settings')}>
                  Settings
                </Menu.Item>
                <Divider
                  style={{
                    borderColor: 'rgba(255,255,255,0.06)',
                    margin: '4px 0',
                  }}
                />
                <Menu.Item
                  style={{ color: '#888' }}
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

        <AppShell.Main style={{ height: '100vh', overflowY: 'auto' }}>
          <Box
            style={{ maxWidth: '85%', margin: '0 auto', padding: '32px 24px' }}
          >
            <Box key={activeTab} style={{ animation: 'fadeUp 0.2s ease both' }}>
              {activeTab === 'Journaling' && <JournalTab />}
              {activeTab === 'Mood Diary' && <MoodTab />}
              {activeTab === 'Settings' && <Settings />}
            </Box>
          </Box>
        </AppShell.Main>
      </AppShell>
    </FadeInPageTransition>
  );
}
