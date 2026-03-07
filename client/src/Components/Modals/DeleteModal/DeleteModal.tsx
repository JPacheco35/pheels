import React from 'react';
import { Button, Group, Modal, Stack, Text } from '@mantine/core';

// interface for journal entry
interface Journal {
  _id: string;
  title: string;
  body: string;
  createdAt: string;
}

interface Props {
  dark: boolean;
  labelColor: string;
  deleteJournal: Journal | null;
  setDeleteJournal: (journal: Journal | null) => void;
  handleDelete: (id: string) => void;
}

function DeleteModal({
  dark,
  labelColor,
  deleteJournal,
  setDeleteJournal,
  handleDelete,
}: Props) {
  return (
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
          <Text c={labelColor} ff="Beautiful Every Time, sans-serif">
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
  );
}
export default DeleteModal;
