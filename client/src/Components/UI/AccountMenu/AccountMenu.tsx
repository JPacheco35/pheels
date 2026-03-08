import React from 'react';
import { Box, Button, Divider, Menu } from '@mantine/core';

interface AccountMenuProps {
  username: string;
  setActiveTab: (tab: string) => void;
}

function AccountMenu({username, setActiveTab}: AccountMenuProps) {
  return (
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
                background: 'linear-gradient(135deg, #1efcde33, #ff02d733)',
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
        <Menu.Item onClick={() => setActiveTab('Settings')}>Settings</Menu.Item>
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
  );
}

export default AccountMenu;