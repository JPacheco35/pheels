import { Group, Stack, Text } from '@mantine/core';
import { useMantineColorScheme } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { IconCheck, IconX } from '@tabler/icons-react';

const MOODS = ['😄', '🙂', '😐', '😔', '😢'] as const;
type Mood = (typeof MOODS)[number];

import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;

interface MoodEntry {
  _id: string;
  mood: string;
  createdAt: string;
}

function MoodTab() {
  const authToken = localStorage.getItem('authToken');

  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';
  const contentColor = dark ? '#666' : '#333';

  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [moodList, setMoodList] = useState<MoodEntry[]>([]);

  const [hoveredMood, setHoveredMood] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get(`${API_URL}/api/moods`, {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      .then((res) => {
        setMoodList(
          res.data.sort(
            (a: MoodEntry, b: MoodEntry) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          ),
        );
      })
      .catch((err) => console.log(err));
  }, []);

  function formatMoodDate(dateStr: string) {
    const date = new Date(dateStr);
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const yyyy = date.getFullYear();
    const hours = date.getHours();
    const hh = String(hours % 12 || 12).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    return `${mm}/${dd}/${yyyy} ${hh}:${min} ${ampm}`;
  }

  const handleMoodSubmit = () => {
    if (!selectedMood) return;
    axios
      .post(
        `${API_URL}/api/moods`,
        { mood: selectedMood },
        {
          headers: { Authorization: `Bearer ${authToken}` },
        },
      )
      .then((res) => {
        setMoodList((prev) => [res.data, ...prev]);
        setSelectedMood(null);
      })
      .catch((err) => console.log(err));
  };

  const handleDeleteMood = (id: string) => {
    axios
      .delete(`${API_URL}/api/moods/${id}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      .then(() => setMoodList((prev) => prev.filter((m) => m._id !== id)))
      .catch((err) => console.log(err));
  };

  return (
    <Stack gap={16} justify={''} align={'center'}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes gradientShift {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
      `}</style>

      <Text
        ff="Beautiful Every Time, sans-serif"
        fz={60}
        c={dark ? '#bbb' : '#000'}
        mb={8}
        mt={20}
        style={{ animation: 'fadeIn 0.8s ease forwards' }}
      >
        How are you{' '}
        <span
          style={{
            background: 'linear-gradient(90deg, #1efcde, #ff02d7, #1efcde)',
            backgroundSize: '200% auto',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animation: 'gradientShift 3s linear infinite',
          }}
        >
          feeling?
        </span>{' '}
      </Text>

      <Group justify="center" gap={12} mt={8}>
        {MOODS.map((mood) => (
          <button
            key={mood}
            onClick={() => setSelectedMood(mood)}
            style={{
              fontSize: 42,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 8,
              borderRadius: '50%',
              transition: 'all 0.2s ease',
              filter:
                selectedMood === mood
                  ? 'drop-shadow(0 0 8px #1efcde)'
                  : 'grayscale(0.4) opacity(0.6)',
              transform: selectedMood === mood ? 'scale(1.3)' : 'scale(1)',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.filter =
                'drop-shadow(0 0 6px #ff02d7)';
              (e.currentTarget as HTMLButtonElement).style.transform =
                'scale(1.2)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.filter =
                selectedMood === mood
                  ? 'drop-shadow(0 0 8px #1efcde)'
                  : 'grayscale(0.4) opacity(0.6)';
              (e.currentTarget as HTMLButtonElement).style.transform =
                selectedMood === mood ? 'scale(1.3)' : 'scale(1)';
            }}
          >
            {mood}
          </button>
        ))}
      </Group>
      <div
        style={{
          height: 56,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {selectedMood && (
          <Group
            gap={8}
            mt={8}
            style={{ animation: 'fadeIn 0.3s ease forwards' }}
          >
            <button
              onClick={handleMoodSubmit}
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: 'rgba(30,252,222,0.15)',
                color: '#1efcde',
                border: '1px solid rgba(30,252,222,0.3)',
                fontSize: 18,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
              }}
            >
              <IconCheck />
            </button>

            <button
              onClick={() => setSelectedMood(null)}
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: 'rgba(250,82,82,0.15)',
                color: '#fa5252',
                border: '1px solid rgba(250,82,82,0.3)',
                fontSize: 18,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
              }}
            >
              <IconX />
            </button>
          </Group>
        )}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
          gap: 8,
          width: '100%',
          marginTop: 16,
        }}
      >
        {moodList.map((entry) => (
          // on each entry div:
          <div
            key={entry._id}
            onMouseEnter={() => setHoveredMood(entry._id)}
            onMouseLeave={() => setHoveredMood(null)}
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
            <span style={{ fontSize: 28 }}>{entry.mood}</span>
            <Text
              c={contentColor}
              ff="Beautiful Every Time, sans-serif"
              fz={11}
            >
              {formatMoodDate(entry.createdAt)}
            </Text>

            {hoveredMood === entry._id && (
              <button
                onClick={() => handleDeleteMood(entry._id)}
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
                  lineHeight: 1,
                }}
              >
                <IconX />
              </button>
            )}
          </div>
        ))}
      </div>
    </Stack>
  );
}

export default MoodTab;