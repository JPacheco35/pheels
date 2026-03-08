import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import {
  AppShell,
  Box,
  Button,
  Center,
  Divider,
  Group,
  Menu,
  Text,
  useComputedColorScheme,
  useMantineColorScheme,
} from '@mantine/core';

import FadeInPageTransition from '../../Animations/FadeInPageTransition/FadeInPageTransition.tsx';
import JournalTab from '../../Tabs/JournalTab/JournalTab.tsx';
import MoodTab from '../../Tabs/MoodTab/MoodTab.tsx';
import Settings from '../../Pages/Settings/Settings.tsx';
import Logo from '../../Logo/Logo.tsx';
import TabButton from '../../UI/TabButton/TabButton.tsx';
import ThemeButton from '../../UI/ThemeButton/ThemeButton.tsx';

const API_URL = import.meta.env.VITE_API_URL;
const TABS = ['Journaling', 'Mood Diary'];

export default function Home() {
  // authentication state
  const [auth, setAuth] = useState<'loading' | 'valid' | 'invalid'>('loading');

  // current active tab
  const [activeTab, setActiveTab] = useState('Journaling');

  // username pulled from db for display
  const [username, setUsername] = useState('');

  // color scheme
  const { setColorScheme } = useMantineColorScheme();
  const colorScheme = useComputedColorScheme('dark');

  // on initial page load
  useEffect(() => {

    // get jwt, kick out if not valid
    const token = localStorage.getItem('authToken');
    if (!token) return setAuth('invalid');

    // verify jwt
    axios
      .get(`${API_URL}/api/verify`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => setAuth('valid'))
      .catch(() => {
        localStorage.removeItem('authToken');
        setAuth('invalid');
      });

    // get user profile
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

  // loading state
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

  // kick out if not logged in
  if (auth === 'invalid') return <Navigate to="/login" replace />;

  // regular home page
  return (
    <FadeInPageTransition>

      {/*fade up transition*/}
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <AppShell
        header={{
          height: 60
        }}
        style={{
          minHeight: '100vh'
        }}
      >

        {/*header*/}
        <AppShell.Header
          style={{
            borderBottom:
              '2px solid light-dark(rgba(0,0,0,0.08), rgba(214,216,213,0.12))',
            background: 'light-dark(rgba(255,255,255,0.6), rgba(15,16,20,0.4))',
            backdropFilter: 'blur(160px)',
          }}
        >

          {/*box spanning entire width of header*/}
          <Box
            style={{
              maxWidth: '100%',
              margin: '0 auto',
              padding: '0 24px',
              height: 60,
              display: 'flex',
              alignItems: 'center',
              gap: 24,
            }}
          >
            {/*pheels logo (top left)*/}
            <Logo fontSize={50} />

            {/* tabs list (Journaling, Mood Diary) */}
            <Group gap={4} style={{ flex: 1 }}>
              {TABS.map((tab) => (
                <TabButton tab={tab} activeTab={activeTab} setActiveTab={setActiveTab}/>
              ))}
            </Group>

            {/*light/dark mode toggle button*/}
            <ThemeButton colorScheme={colorScheme} setColorScheme={setColorScheme} />

            {/*account menu*/}
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
