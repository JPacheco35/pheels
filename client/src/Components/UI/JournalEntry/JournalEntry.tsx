import React from 'react';
import GlassCard from '../GlassCard/GlassCard.tsx';
import { ActionIcon, Group, Text } from '@mantine/core';
import { IconEdit, IconTrash } from '@tabler/icons-react';

interface JournalEntryProps {
  journal: any;
  labelColor: string;
  contentColor: string;
  formatDate: (date: string) => string;
  setEditJournal: (journal: any) => void;
  setDeleteJournal: (journal: any) => void;
}

function JournalEntry({
  journal,
  labelColor,
  contentColor,
  formatDate,
  setEditJournal,
  setDeleteJournal,
}: JournalEntryProps) {
  return (
    <GlassCard key={journal._id}>
      <Group justify="" align="center" mb={8} gap={5}>
        <Text
          c={labelColor}
          ff="Beautiful Every Time, sans-serif"
          fz={35}
          fs="bold"
          fw={650}
        >
          {journal.title}
        </Text>

        <ActionIcon
          variant="subtle"
          aria-label="Settings"
          size="md"
          color="blue"
          onClick={() => setEditJournal(journal)}
        >
          <IconEdit style={{ width: '70%', height: '70%' }} stroke={1.5} />
        </ActionIcon>

        <ActionIcon
          variant="subtle"
          aria-label="Settings"
          size="md"
          color="red"
          onClick={() => setDeleteJournal(journal)}
        >
          <IconTrash style={{ width: '70%', height: '70%' }} stroke={1.5} />
        </ActionIcon>
      </Group>

      <Text c={labelColor} ff="Beautiful Every Time, sans-serif" fz={20}>
        {formatDate(journal.createdAt)}
      </Text>
      <Text
        c={contentColor}
        fz={14}
        mt={8}
        ff="Beautiful Every Time, sans-serif"
      >
        {journal.body}
      </Text>
    </GlassCard>
  );
}
export default JournalEntry;