import { UnstyledButton } from '@mantine/core';
import React from 'react';

interface TabButtonProps {
  tab: string;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

function TabButton({tab, activeTab, setActiveTab}: TabButtonProps) {
  return (
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
  );
}

export default TabButton;