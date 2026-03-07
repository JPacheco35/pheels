import { ActionIcon, Group, Stack, Text } from '@mantine/core';
import { useMantineColorScheme, Pagination } from '@mantine/core';
import GlassCard from '../../UI/GlassCard/GlassCard.tsx';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import './JournalTab.css';
import { IconEdit, IconPlus, IconTrash } from '@tabler/icons-react';
import { createPortal } from 'react-dom';
import DeleteModal from '../../Modals/DeleteModal/DeleteModal.tsx';
import EditModal from '../../Modals/EditModal/EditModal.tsx';
import AddModal from '../../Modals/AddModal/AddModal.tsx';

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

  // use state tracking whether edit/delete modals are open
  const [editJournal, setEditJournal] = useState<Journal | null>(null);
  const [deleteJournal, setDeleteJournal] = useState<Journal | null>(null);

  const [addJournal, setAddJournal] = useState(false);

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
    const time = date
      .toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })
      .toLowerCase();
    return `${month} ${day}${suffix}, ${year} ${time}`;
  }

  // get user journals
  useEffect(() => {
    axios
      .get(`${API_URL}/api/journals`, {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      .then((res) => {
        // sort journals from newest to oldest
        const sorted = res.data.sort(
          (a: Journal, b: Journal) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        setJournalList(sorted);
        console.log(sorted);
      })
      .catch((err) => console.log(err));
  }, []);

  // edit journal in database
  const handleEdit = (id: string, title: string, body: string) => {
    axios
      .patch(
        `${API_URL}/api/journals/${id}`,
        { title, body },
        {
          headers: { Authorization: `Bearer ${authToken}` },
        },
      )
      .then((res) => {
        setJournalList((prev) =>
          prev.map((j) => (j._id === id ? res.data : j)),
        );
        setEditJournal(null);
      })
      .catch((err) => console.log(err));
  };

  // remove journal from database
  const handleDelete = (id: string) => {
    axios
      .delete(`${API_URL}/api/journals/${id}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      .then(() => {
        setJournalList((prev) => prev.filter((j) => j._id !== id));
        setDeleteJournal(null);
      });
  };

  // add journal to database
  // replace handleAdd with this
  const handleAdd = (title: string, body: string) => {
    axios
      .post(
        `${API_URL}/api/journals`,
        { title, body },
        { headers: { Authorization: `Bearer ${authToken}` } },
      )
      .then((res) => {
        setJournalList((prev) => [res.data, ...prev]);
        setAddJournal(false);
      })
      .catch((err) => console.log(err));
  };

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
                    onClick={() => setDeleteJournal(journal)}
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

      {/*// add, edit and delete modals*/}
      <AddModal
        dark={dark}
        addJournal={addJournal}
        setAddJournal={setAddJournal}
        handleAdd={handleAdd}
      />
      <EditModal
        dark={dark}
        labelColor={labelColor}
        editJournal={editJournal}
        setEditJournal={setEditJournal}
        handleEdit={handleEdit}
      />
      <DeleteModal
        dark={dark}
        labelColor={labelColor}
        deleteJournal={deleteJournal}
        setDeleteJournal={setDeleteJournal}
        handleDelete={handleDelete}
      />

      {createPortal(
        <button
          className="fab-btn"
          onClick={() => setAddJournal(true)}
          style={{
            position: 'fixed',
            bottom: 40,
            right: 35,
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #1efcde, #ff02d7)',
            border: 'none',
            fontSize: 28,
            color: '#fff',
            cursor: 'pointer',
            boxShadow: '0 4px 24px rgba(255,2,215,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
        >
          <IconPlus />
        </button>,
        document.body,
      )}
    </div>
  );
}

export default JournalTab;
