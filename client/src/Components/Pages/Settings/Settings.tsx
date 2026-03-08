import React, { useEffect, useState } from 'react';
import {
  Stack,
  Text,
  TextInput,
  Button,
  Group,
  Modal,
  PasswordInput,
} from '@mantine/core';
import { useMantineColorScheme } from '@mantine/core';
import GlassCard from '../../UI/GlassCard/GlassCard.tsx';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
const CARD_WIDTH = '85%';

function Settings() {
  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';
  const labelColor = dark ? '#bbb' : '#000';
  const contentColor = dark ? '#777' : '#333';
  const authToken = localStorage.getItem('authToken');
  const ff = 'Beautiful Every Time, sans-serif';

  // update username
  const [newUsername, setNewUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [usernameSuccess, setUsernameSuccess] = useState('');

  // update password
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // delete account
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleteError, setDeleteError] = useState('');

  // userId from profile
  const [userId, setUserId] = useState<string | null>(null);

  // auth status from jwt verify
  const [, setAuth] = useState<'loading' | 'valid' | 'invalid'>('loading');

  // settings cards styling
  const inputStyles = {
    label: { fontFamily: ff, color: dark ? '#bbb' : '#000', fontSize: 16 },
    input: {
      fontFamily: ff,
      background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
      border: `1px solid ${dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
      color: dark ? '#bbb' : '#000',
    },
  };

  // delete account modal styling
  const modalStyles = {
    content: {
      background: dark ? 'rgba(15,16,20,0.65)' : 'rgba(214,216,213,0.8)',
      backdropFilter: 'blur(24px)',
      border: `1px solid ${dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
      borderRadius: 20,
      boxShadow: '0 8px 20px rgba(0,0,0,0.6)',
    },
    overlay: { backdropFilter: 'blur(4px)' },
    title: {
      fontFamily: ff,
      fontSize: 24,
      fontWeight: 900,
      color: dark ? '#bbb' : '#000',
    },
    header: { background: 'transparent' },
    body: { background: 'transparent' },
  };

  // section title
  const sectionTitle = (text: string, color?: string) => (
    <Text ff={ff} fz={26} fw={700} c={color ?? labelColor} mb={4}>
      {text}
    </Text>
  );

  // button styling
  const btnStyle = (bg: string, color: string, border: string) => ({
    fontFamily: ff,
    background: bg,
    color,
    border,
  });

  // check auth status and userId from profile on page load
  useEffect(() => {

    // get auth token --> kick out if not found
    const token = localStorage.getItem('authToken');
    if (!token) return setAuth('invalid');

    // verify retrived jwt
    axios
      .get(`${API_URL}/api/verify`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => setAuth('valid'))
      .catch(() => {
        localStorage.removeItem('authToken');
        setAuth('invalid');
      });

    // get profile data --> kick out if not found
    axios
      .get(`${API_URL}/api/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUserId(res.data.userId))
      .catch(() => {
        localStorage.removeItem('authToken');
        setAuth('invalid');
      });
  }, []);

  // handle username change
  const handleUsernameChange = () => {
    setUsernameError('');
    setUsernameSuccess('');

    if (!newUsername.trim())
      return setUsernameError('Username cannot be empty.');

    axios
      .patch(
        `${API_URL}/api/profile`,
        { username: newUsername },
        { headers: { Authorization: `Bearer ${authToken}` } },
      )
      .then(() => {
        setUsernameSuccess('Username updated successfully.');
        setNewUsername('');
      })
      .catch((err) =>
        setUsernameError(
          err.response?.data?.message === 'Username already in use'
            ? 'That username is already taken.'
            : 'Failed to update username.',
        ),
      );
  };

  // handle password change
  const handlePasswordChange = () => {
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword.length < 8)
      return setPasswordError('Password must be at least 8 characters.');

    if (!/[A-Z]/.test(newPassword))
      return setPasswordError('Password must contain at least 1 uppercase letter.',);

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword))
      return setPasswordError('Password must contain at least 1 special character.',);

    // update password in database
    axios
      .patch(
        `${API_URL}/api/user/password`,
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${authToken}` } },
      )
      .then(() => {
        setPasswordSuccess('Password updated successfully.');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      })
      .catch((err) =>
        setPasswordError(
          err.response?.data?.message === 'Incorrect password'
            ? 'Current password is incorrect.'
            : 'Failed to update password.',
        ),
      );
  };

  // handle delete account
  const handleDeleteAccount = () => {
    setDeleteError('');

    if (deleteConfirmText !== 'delete my account')
      return setDeleteError('Please type "delete my account" exactly.');

    // delete user and all of their data from the database
    axios
      .delete(`${API_URL}/api/user/${userId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      .then(() => {
        localStorage.removeItem('authToken');
        window.location.href = '/login';
      })
      .catch(() => setDeleteError('Failed to delete account.'));
  };

  return (
    <Stack
      gap={24}
      style={{
        width: '100%',
        margin: '0 auto',
        paddingTop: 32,
        paddingBottom: 64,
        alignItems: 'center',
      }}
    >
      {/*change username section*/}
      <GlassCard style={{ width: CARD_WIDTH }}>
        {sectionTitle('Change Username')}
        <Text c={contentColor} ff={ff} fz={13} mb={12}>
          Pick a new username. It must not already be in use.
        </Text>
        <Stack gap={10}>
          <TextInput
            label="New Username"
            placeholder="Enter new username"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            styles={inputStyles}
          />
          {usernameError && (
            <Text c="#fa5252" fz={12} ff={ff}>
              {usernameError}
            </Text>
          )}
          {usernameSuccess && (
            <Text c="#1efcde" fz={12} ff={ff}>
              {usernameSuccess}
            </Text>
          )}
          <Button
            onClick={handleUsernameChange}
            style={btnStyle(
              'rgba(30,252,100,0.15)',
              '#1efc64',
              '1px solid rgba(30,252,100,0.3)',
            )}
          >
            Update Username
          </Button>
        </Stack>
      </GlassCard>

      {/*change password section*/}
      <GlassCard style={{ width: CARD_WIDTH }}>
        {sectionTitle('Change Password')}
        <Text c={contentColor} ff={ff} fz={13} mb={12}>
          Enter your current password, then your new password twice.
        </Text>
        <Stack gap={10}>
          <PasswordInput
            label="Current Password"
            placeholder="••••••••"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            styles={inputStyles}
          />
          <PasswordInput
            label="New Password"
            placeholder="••••••••"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            styles={inputStyles}
          />
          <PasswordInput
            label="Confirm New Password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            styles={inputStyles}
          />
          {passwordError && (
            <Text c="#fa5252" fz={12} ff={ff}>
              {passwordError}
            </Text>
          )}
          {passwordSuccess && (
            <Text c="#1efcde" fz={12} ff={ff}>
              {passwordSuccess}
            </Text>
          )}
          <Button
            onClick={handlePasswordChange}
            style={btnStyle(
              'rgba(255,140,0,0.15)',
              '#ff8c00',
              '1px solid rgba(255,140,0,0.3)',
            )}
          >
            Update Password
          </Button>
        </Stack>
      </GlassCard>

      {/*sign out of account section*/}
      <GlassCard style={{ width: CARD_WIDTH }}>
        {sectionTitle('Sign Out')}
        <Text c={contentColor} ff={ff} fz={13} mb={12}>
          Sign out of your account on this device.
        </Text>
        <Button
          onClick={() => {
            localStorage.removeItem('authToken');
            window.location.href = '/login';
          }}
          style={btnStyle(
            'rgba(150,150,150,0.15)',
            '#999',
            '1px solid rgba(150,150,150,0.3)',
          )}
        >
          Sign Out
        </Button>
      </GlassCard>

      {/*delete account section*/}
      <GlassCard style={{ width: CARD_WIDTH }}>
        {sectionTitle('Delete Account', '#fa5252')}
        <Text c={contentColor} ff={ff} fz={13} mb={12}>
          Permanently delete your account and all associated data. This cannot
          be undone.
        </Text>
        <Button
          onClick={() => setDeleteModalOpen(true)}
          style={btnStyle(
            'rgba(250,82,82,0.15)',
            '#fa5252',
            '1px solid rgba(250,82,82,0.3)',
          )}
        >
          Delete Account
        </Button>
      </GlassCard>

      {/*delete account modal*/}
      <Modal
        opened={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setDeleteConfirmText('');
          setDeleteError('');
        }}
        title={
          <>
            <span style={{ color: '#fa5252' }}>Delete</span> Account?
          </>
        }
        centered
        styles={modalStyles}
      >
        <Stack gap={12}>
          <Text c={labelColor} ff={ff} fz={14}>
            This will permanently delete your account and all your data. Type{' '}
            <span style={{ color: '#fa5252' }}>delete my account</span> to
            confirm.
          </Text>
          <TextInput
            placeholder="delete my account"
            value={deleteConfirmText}
            onChange={(e) => setDeleteConfirmText(e.target.value)}
            styles={inputStyles}
          />
          {deleteError && (
            <Text c="#fa5252" fz={12} ff={ff}>
              {deleteError}
            </Text>
          )}
          <Group justify="center">
            <Button
              onClick={() => {
                setDeleteModalOpen(false);
                setDeleteConfirmText('');
              }}
              style={btnStyle(
                dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
                dark ? '#bbb' : '#000',
                `1px solid ${dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
              )}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteAccount}
              style={btnStyle(
                'rgba(250,82,82,0.15)',
                '#fa5252',
                '1px solid rgba(250,82,82,0.3)',
              )}
            >
              Delete Forever
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}

export default Settings;