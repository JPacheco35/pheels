import { ActionIcon, Button, Group, Modal, Stack, Text, Textarea, TextInput } from '@mantine/core';
import { useMantineColorScheme, Pagination } from '@mantine/core';
import GlassCard from '../GlassCard/GlassCard.tsx';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import '../../main.css';
import './JournalTab.css';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { createPortal } from 'react-dom';

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
  const [newTitle, setNewTitle] = useState('');
  const [newBody, setNewBody] = useState('');

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

  // edit journal entry
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

  // delete journal entry
  const handleDelete = (id: string) => {
    axios
      .delete(`${API_URL}/api/journals/${id}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      .then(() => {
        setJournalList(prev => prev.filter(j => j._id !== id))
        setDeleteJournal(null);
      })
  }

  const handleAdd = () => {
    axios
      .post(
        `${API_URL}/api/journals`,
        { title: newTitle, body: newBody },
        {
          headers: { Authorization: `Bearer ${authToken}` },
        },
      )
      .then((res) => {
        setJournalList((prev) => [res.data, ...prev]);
        setNewTitle('');
        setNewBody('');
        setAddJournal(false);
      })
      .catch((err) => console.log(err));
  }

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

      {/*// edit and delete modals*/}
      <Modal
        opened={!!editJournal}
        onClose={() => setEditJournal(null)}
        title={
          <>
            <span style={{ color: '#1efcde' }}>Edit</span> Journal
          </>
        }
        size="xl"
        centered
        styles={{
          content: {
            background: dark ? 'rgba(15,16,20,0.65)' : 'rgba(214,216,213,0.8)',
            backdropFilter: 'blur(24px)',
            border: `1px solid ${dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
            borderRadius: 20,
            boxShadow: '0 8px 20px rgba(0,0,0,0.6)',
          },
          overlay: { backdropFilter: 'blur(4px)' },
          title: {
            fontFamily: 'Beautiful Every Time, sans-serif',
            fontSize: 24,
            fontWeight: 900,
            color: dark ? '#bbb' : '#000',
          },
          header: { background: 'transparent' },
          body: { background: 'transparent' },
        }}
      >
        {editJournal && (
          <Stack gap={12}>
            <TextInput
              label="Title:"
              value={editJournal.title}
              onChange={(e) =>
                setEditJournal({ ...editJournal, title: e.target.value })
              }
              styles={{
                label: {
                  fontFamily: 'Beautiful Every Time, sans-serif',
                  color: dark ? '#bbb' : '#000',
                  fontSize: 18,
                  fontWeight: 500,
                },
                input: {
                  fontFamily: 'Beautiful Every Time, sans-serif',
                  background: dark
                    ? 'rgba(255,255,255,0.06)'
                    : 'rgba(0,0,0,0.06)',
                  border: `1px solid ${dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
                  color: dark ? '#bbb' : '#000',
                },
              }}
            />
            <Textarea
              label="Content:"
              autosize
              minRows={4}
              value={editJournal.body}
              onChange={(e) =>
                setEditJournal({ ...editJournal, body: e.target.value })
              }
              styles={{
                label: {
                  fontFamily: 'Beautiful Every Time, sans-serif',
                  color: dark ? '#bbb' : '#000',
                  fontSize: 18,
                  fontWeight: 500,
                },
                input: {
                  fontFamily: 'Beautiful Every Time, sans-serif',
                  background: dark
                    ? 'rgba(255,255,255,0.06)'
                    : 'rgba(0,0,0,0.06)',
                  border: `1px solid ${dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
                  color: dark ? '#bbb' : '#000',
                },
              }}
            />
            <Button
              variant="subtle"
              onClick={() =>
                handleEdit(editJournal._id, editJournal.title, editJournal.body)
              }
              style={{
                fontFamily: 'Beautiful Every Time, sans-serif',
                background: 'rgba(30,252,222,0.15)',
                color: '#1efcde',
                border: '1px solid rgba(30,252,222,0.3)',
              }}
            >
              Save
            </Button>
          </Stack>
        )}
      </Modal>

      <Modal
        opened={!!deleteJournal}
        onClose={() => setDeleteJournal(null)}
        title={
          <>
            <span style={{ color: '#fa5252' }}>Delete</span> Journal?
          </>
        }
        centered
        styles={{
          content: {
            background: dark ? 'rgba(15,16,20,0.65)' : 'rgba(214,216,213,0.8)',
            backdropFilter: 'blur(24px)',
            border: `1px solid ${dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
            borderRadius: 20,
            boxShadow: '0 8px 20px rgba(0,0,0,0.6)',
          },
          overlay: {
            backdropFilter: 'blur(4px)',
          },
          title: {
            fontFamily: 'Beautiful Every Time, sans-serif',
            fontSize: 24,
            fontWeight: 900,
            color: dark ? '#bbb' : '#000',
          },
          header: {
            background: 'transparent',
          },
          body: {
            background: 'transparent',
          },
        }}
      >
        {deleteJournal && (
          <Stack gap={12}>
            <Text
              // c="light-dark(#999,#555)"
              c={labelColor}
              ff="Beautiful Every Time, sans-serif"
            >
              Are you sure you want to delete this journal entry?
            </Text>
            <Group justify="center">
              <Button
                variant="subtle"
                onClick={() => setDeleteJournal(null)}
                style={{
                  fontFamily: 'Beautiful Every Time, sans-serif',
                  color: dark ? '#bbb' : '#000',
                  border: `2px solid ${dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
                  background: dark
                    ? 'rgba(255,255,255,0.06)'
                    : 'rgba(0,0,0,0.06)',
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleDelete(deleteJournal._id)}
                style={{
                  fontFamily: 'Beautiful Every Time, sans-serif',
                  background: 'rgba(250,82,82,0.15)',
                  color: '#fa5252',
                  border: '1px solid rgba(250,82,82,0.3)',
                }}
              >
                Delete
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>

      <Modal
        opened={addJournal}
        onClose={() => setAddJournal(false)}
        title={
          <>
            <span style={{ color: '#ff02d7' }}>New</span> Journal
          </>
        }
        size="xl"
        centered
        styles={{
          content: {
            background: dark ? 'rgba(15,16,20,0.65)' : 'rgba(214,216,213,0.8)',
            backdropFilter: 'blur(24px)',
            border: `1px solid ${dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
            borderRadius: 20,
            boxShadow: '0 8px 20px rgba(0,0,0,0.6)',
          },
          overlay: { backdropFilter: 'blur(4px)' },
          title: {
            fontFamily: 'Beautiful Every Time, sans-serif',
            fontSize: 24,
            fontWeight: 900,
            color: dark ? '#bbb' : '#000',
          },
          header: { background: 'transparent' },
          body: { background: 'transparent' },
        }}
      >
        <Stack gap={12}>
          <TextInput
            label="Title:"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            styles={{
              label: {
                fontFamily: 'Beautiful Every Time, sans-serif',
                color: dark ? '#bbb' : '#000',
                fontSize: 18,
              },
              input: {
                fontFamily: 'Beautiful Every Time, sans-serif',
                background: dark
                  ? 'rgba(255,255,255,0.06)'
                  : 'rgba(0,0,0,0.06)',
                border: `1px solid ${dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
                color: dark ? '#bbb' : '#000',
              },
            }}
          />
          <Textarea
            label="Content:"
            autosize
            minRows={4}
            value={newBody}
            onChange={(e) => setNewBody(e.target.value)}
            styles={{
              label: {
                fontFamily: 'Beautiful Every Time, sans-serif',
                color: dark ? '#bbb' : '#000',
                fontSize: 18,
              },
              input: {
                fontFamily: 'Beautiful Every Time, sans-serif',
                background: dark
                  ? 'rgba(255,255,255,0.06)'
                  : 'rgba(0,0,0,0.06)',
                border: `1px solid ${dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
                color: dark ? '#bbb' : '#000',
              },
            }}
          />
          <Button
            onClick={handleAdd}
            style={{
              fontFamily: 'Beautiful Every Time, sans-serif',
              background: 'linear-gradient(90deg, #1efcde, #ff02d7)',
              border: 'none',
              color: '#fff',
            }}
          >
            Create
          </Button>
        </Stack>
      </Modal>

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
          +
        </button>,
        document.body,
      )}
    </div>
  );
}

export default JournalTab;
