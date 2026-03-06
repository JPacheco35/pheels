import React from 'react';
import { Paper } from '@mantine/core';

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
export default GlassCard;