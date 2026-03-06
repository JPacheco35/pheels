import { Stack, Text } from '@mantine/core';
import GlassCard from '../GlassCard/GlassCard.tsx';
import React from 'react';

function MoodTab() {
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
export default MoodTab;