import React from 'react';
import { createPortal } from 'react-dom';
import { IconPlus } from '@tabler/icons-react';

interface AddJournalFABProps {
  onClick: () => void;
}

function AddJournalFAB({ onClick }: AddJournalFABProps) {
  return createPortal(
    <button
      className="fab-btn"
      onClick={onClick}
      style={{
        position: 'fixed',
        bottom: 40,
        right: 35,
        width: 56,
        height: 56,
        borderRadius: '50%',
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
  );
}

export default AddJournalFAB;
