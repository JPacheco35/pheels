import { ActionIcon, Text } from '@mantine/core';
import React from 'react';
import { IconBrandGithub } from '@tabler/icons-react';

export default function Footer() {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        width: '100%',
        textAlign: 'center',
        padding: '5px',
        borderTop:
          '1px solid light-dark(rgba(0,0,0,0.08), rgba(255,255,255,0.08))',
        background: 'light-dark(rgba(255,255,255,0.65), rgba(15,16,20,0.65))',
        backdropFilter: 'blur(24px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
      }}
    >
      <Text style={{ fontSize: 13, color: 'light-dark(#666, #888)' }}>
        {new Date().getFullYear()} Pheels
      </Text>
      <ActionIcon
        variant="subtle"
        size="sm"
        component="a"
        href="https://github.com/JPacheco35/pheels"
        target="_blank"
        style={{ color: 'light-dark(#666, #888)' }}
      >
        <IconBrandGithub size={16} />
      </ActionIcon>
    </div>
  );
}
