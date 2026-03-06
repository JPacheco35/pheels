import React from 'react';
import { Paper } from '@mantine/core';
import { useMantineColorScheme } from '@mantine/core';

function GlassCard({
  children,
  style = {},
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';

  return (
    <Paper
      style={{
        background: dark ? 'rgba(15,16,20,0.65)' : 'rgba(255,255,255,0.65)',
        backdropFilter: 'blur(24px)',
        border: `1px solid ${dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,255,0.08)'}`,
        borderRadius: 20,
        padding: '28px 32px',
        ...style,
      }}
    >
      {children}
    </Paper>
  );
}

export default GlassCard;
