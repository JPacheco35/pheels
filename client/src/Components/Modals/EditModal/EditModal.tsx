import React from 'react';
import { Button, Modal, Stack, Textarea, TextInput } from '@mantine/core';

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
  editJournal: Journal | null;
  setEditJournal: (journal: Journal | null) => void;
  handleEdit: (id: string, title: string, body: string) => void;
}

function EditModal({ dark, editJournal, setEditJournal, handleEdit }: Props) {
  return (
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
  );
}
export default EditModal;
