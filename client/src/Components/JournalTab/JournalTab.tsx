import { ActionIcon, Group, Stack, Text } from '@mantine/core';
import { useMantineColorScheme, Pagination } from '@mantine/core';
import GlassCard from '../GlassCard/GlassCard.tsx';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import '../../main.css';
import { IconEdit, IconTrash } from '@tabler/icons-react';

const API_URL = import.meta.env.VITE_API_URL;
const PAGE_SIZE = 10;

// interface for journal entry
interface Journal {
  _id: string;
  title: string;
  body: string;
  createdAt: string;
}

function JournalTab() {
  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';

  const labelColor = dark ? '#bbb' : '#000';
  const contentColor = dark ? '#777' : '#333';

  const [journalList, setJournalList] = useState<Journal[]>([]);
  // const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const paginated = journalList.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    document.querySelector('main')?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const authToken = localStorage.getItem('authToken');

  // turn createAt date into readable format (ie. January 1st, 1970}
  function formatDate(dateStr: string) {
    const date = new Date(dateStr);
    const day = date.getDate();
    const suffix = ['th', 'st', 'nd', 'rd'][((day % 100) - 20) % 10] ?? 'th';
    const month = date.toLocaleDateString('en-US', { month: 'long' });
    const year = date.getFullYear();
    return `${month} ${day}${suffix}, ${year}`;
  }

  // get user journals
  useEffect(() => {
    axios
      .get(`${API_URL}/api/journals`, {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      .then((res) =>
      {
        setJournalList(res.data);
        console.log(res.data);
      })
      .catch((err) => console.log(err))
      // .finally(() => setLoading(false));
  },[]);


  return (
    <div>
      <AnimatePresence mode="wait">
        <motion.div
          key={page}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Stack gap={16} style={{ overflowY: 'auto', maxHeight: '100%' }}>
            {paginated.map((journal) => (
              <GlassCard key={journal._id}>
                <Group justify="" align="center" mb={8} gap={5}>
                  <Text
                    c={labelColor}
                    ff="Beautiful Every Time, sans-serif"
                    fz={35}
                  >
                    {journal.title}
                    {/*{formatDate(journal.createdAt)}*/}
                  </Text>

                  <ActionIcon
                    variant="subtle"
                    aria-label="Settings"
                    size="md"
                    color="blue"
                  >
                    <IconEdit
                      style={{ width: '70%', height: '70%' }}
                      stroke={1.5}
                    />
                  </ActionIcon>

                  <ActionIcon
                    variant="subtle"
                    aria-label="Settings"
                    size="md"
                    color="red"
                  >
                    <IconTrash
                      style={{ width: '70%', height: '70%' }}
                      stroke={1.5}
                    />
                  </ActionIcon>
                </Group>

                <Text
                  c={labelColor}
                  ff="Beautiful Every Time, sans-serif"
                  fz={20}
                >
                  {/*{journal.title}*/}
                  {formatDate(journal.createdAt)}
                </Text>
                <Text
                  c={contentColor}
                  fz={12}
                  mt={8}
                  ff="Beautiful Every Time, sans-serif"
                >
                  {journal.body}
                </Text>
              </GlassCard>
            ))}
          </Stack>
        </motion.div>
      </AnimatePresence>
      <Group
        justify="space-between"
        align="center"
        mt={16}
        style={{
          borderTop: `1px solid light-dark(rgba(0,0,0,0.08), rgba(214,216,213,0.12))`,
          paddingTop: 16,
          paddingBottom: 20,
        }}
      >
        <Text
          c="light-dark(#999,#555)"
          ff="Beautiful Every Time, sans-serif"
          fz={13}
        >
          Showing {(page - 1) * PAGE_SIZE + 1}–
          {Math.min(page * PAGE_SIZE, journalList.length)} of{' '}
          {journalList.length} journals
        </Text>
        <Pagination
          total={Math.ceil(journalList.length / PAGE_SIZE)}
          value={page}
          color={'#de5ae8'}
          onChange={handlePageChange}
          size="sm"
          radius="md"
          withEdges
          styles={{
            control: {
              fontFamily: 'Ubuntu, serif',
              fontSize: 13,
              border:
                '1px solid light-dark(rgba(0,0,0,0.08), rgba(214,216,213,0.12))',
            },
          }}
        />
      </Group>
    </div>
  );
}

export default JournalTab;
