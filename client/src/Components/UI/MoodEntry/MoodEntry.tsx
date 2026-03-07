import { IconX } from '@tabler/icons-react';
import { Text } from '@mantine/core';
import React, { useState } from 'react';

interface MoodEntryProps {
  mood: any;
  dark: boolean;
  contentColor: string;
  formatMoodDate: (date: string) => string;
  handleDeleteMood: (id: string) => void;
}

function MoodEntry({
  mood,
  dark,
  contentColor,
  formatMoodDate,
  handleDeleteMood,
}: MoodEntryProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
        padding: '8px 4px',
        borderRadius: 12,
        border: `1px solid ${dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
      }}
    >
      <span style={{ fontSize: 28 }}>{mood.mood}</span>
      <Text c={contentColor} ff="Beautiful Every Time, sans-serif" fz={12}>
        {formatMoodDate(mood.createdAt)}
      </Text>

      {hovered && (
        <button
          onClick={() => handleDeleteMood(mood._id)}
          style={{
            position: 'absolute',
            top: 4,
            right: 4,
            width: 25,
            height: 25,
            borderRadius: '50%',
            background: 'rgba(250,82,82,0.15)',
            color: '#fa5252',
            border: '1px solid rgba(250,82,82,0.3)',
            fontSize: 11,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <IconX size={12} stroke={2} />
        </button>
      )}
    </div>
  );
}

export default MoodEntry;
