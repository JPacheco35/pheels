import React, { useState } from 'react';
import { Button, Modal, Stack, Textarea, TextInput } from '@mantine/core';

interface Props {
  dark: boolean;
  addJournal: boolean;
  setAddJournal: (open: boolean) => void;
  handleAdd: (title: string, body: string) => void;
}

function AddModal({ dark, addJournal, setAddJournal, handleAdd }: Props) {
  const [newTitle, setNewTitle] = useState('');
  const [newBody, setNewBody] = useState('');

  const handleSubmit = () => {
    handleAdd(newTitle, newBody);
    setNewTitle('');
    setNewBody('');
  };

  return (
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
              background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
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
              background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
              border: `1px solid ${dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
              color: dark ? '#bbb' : '#000',
            },
          }}
        />
        <Button
          onClick={handleSubmit}
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
  );
}

export default AddModal;
