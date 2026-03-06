import { Stack, Text } from '@mantine/core';
import { useMantineColorScheme } from '@mantine/core';
import GlassCard from '../GlassCard/GlassCard.tsx';
import React from 'react';

function MoodTab() {
  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';

  const labelColor = dark ? '#aaa' : '#555';
  const contentColor = dark ? '#666' : '#333';

  return (
    <Stack gap={16}>
      <GlassCard>
        <Text c={labelColor} ff="Ubuntu, sans-serif" fz={13}>
          Tab 2 — Section A
        </Text>
        <Text c={contentColor} fz={12} mt={8} ff="Ubuntu, sans-serif">
          Content goes here
        </Text>
      </GlassCard>
      <GlassCard>
        <Text c={labelColor} ff="Ubuntu, sans-serif" fz={13}>
          Tab 2 — Section B
        </Text>
        <Text c={contentColor} fz={12} mt={8} ff="Ubuntu, sans-serif">
          Content goes here
        </Text>
      </GlassCard>
    </Stack>
  );
}

export default MoodTab;
