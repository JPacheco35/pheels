import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '@mantine/form';

import axios from 'axios';
import { IconArrowLeft } from '@tabler/icons-react';
import {
  Text,
  TextInput,
  Button,
  Title,
  ActionIcon,
  Stack,
  Tooltip,
} from '@mantine/core';

const API_URL = import.meta.env.VITE_API_URL;

import '../../../main.css';
import Logo from '../../UI/Logo/Logo.tsx';
import GlassCard from '../../UI/GlassCard/GlassCard.tsx';
import FadeInPageTransition from '../../Animations/FadeInPageTransition/FadeInPageTransition.tsx';

const inputStyles = {
  label: {
    fontSize: 12,
    fontFamily: 'Ubuntu, sans-serif',
    fontWeight: 600,
    letterSpacing: '0.5px',
    textTransform: 'uppercase' as const,
    color: 'light-dark(#444, #aaa)',
    marginBottom: 6,
  },
  input: {
    borderRadius: 10,
    border: '1px solid light-dark(rgba(0,0,0,0.12), rgba(255,255,255,0.1))',
    background: 'light-dark(rgba(0,0,0,0.03), rgba(255,255,255,0.05))',
    fontSize: 14,
    fontFamily: 'Ubuntu, sans-serif',
    height: 44,
  },
};

function Signup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // error state management
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      username: (value) =>
        value.length >= 3 ? null : 'Username must be at least 3 characters',
      password: (value) => {
        if (value.length < 8) return 'Password must be at least 8 characters';
        if (!/[A-Z]/.test(value))
          return 'Password must contain at least one uppercase letter';
        if (!/[^a-zA-Z0-9]/.test(value))
          return 'Password must contain at least one special character';
        return null;
      },
      confirmPassword: (value, values) =>
        value === values.password ? null : 'Passwords do not match',
    },
  });

  // send signup form and create new account
  const handleSubmit = async (
    email: string,
    username: string,
    password: string,
  ) => {
    setLoading(true);
    setPasswordError(null);
    setEmailError(null);
    try {
      const res = await axios.post(`${API_URL}/api/signup`, {
        email,
        username,
        password,
      });
      if (res.data.authToken) {
        localStorage.setItem('authToken', res.data.authToken);
        navigate('/home');
      }
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Something went wrong.';
      if (msg.toLowerCase().includes('email')) {
        setEmailError(msg);
      } else {
        setPasswordError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <FadeInPageTransition>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          marginTop: '-20px',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: 480,
            padding: '0 16px',
            boxSizing: 'border-box',
          }}
        >
          {/* Header */}
          <Stack gap="xs" justify="center" align="center">
            <Logo fontSize={200} />
            <Title
              order={3}
              size={30}
              style={{
                fontFamily: 'Bisikan Senja, serif',
                fontStyle: 'italic',
                marginTop: -20,
                marginBottom: 10,
              }}
            >
              a personal diary app
            </Title>
          </Stack>

          <GlassCard>

              {/* Back button — top right */}
              <div style={{ position: 'absolute', top: 16, left: 16 }}>
                <Tooltip label="Back to Login" position="left">
                  <ActionIcon
                    variant="subtle"
                    size="lg"
                    onClick={() => navigate('/login')}
                    style={{ color: 'light-dark(#666, #888)' }}
                  >
                    <IconArrowLeft size={20} />
                  </ActionIcon>
                </Tooltip>
              </div>

            {/*subheader*/}
              <div style={{ marginBottom: 32, textAlign: 'center' }}>
                <Text
                  style={{
                    fontSize: 22,
                    fontWeight: 700,
                    letterSpacing: '-0.5px',
                    color: 'light-dark(#0f1014, #f0f2ff)',
                    fontFamily: 'Ubuntu, sans-serif',
                    textAlign: 'center',
                  }}
                >
                  Create an Account
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    color: 'light-dark(#666, #888)',
                    marginTop: 4,
                    fontFamily: 'Ubuntu, sans-serif',
                    textAlign: 'center',
                  }}
                >
                  Start Journaling Today!
                </Text>
              </div>

              {/*create account form*/}
              <form
                onSubmit={form.onSubmit((values) =>
                  handleSubmit(values.email, values.username, values.password),
                )}
              >
                <div
                  style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
                >
                  {/*email*/}
                  <TextInput
                    label="Email"
                    placeholder="you@example.com"
                    key={form.key('email')}
                    {...form.getInputProps('email')}
                    error={emailError || form.errors.email}
                    styles={inputStyles}
                  />

                  {/*username*/}
                  <TextInput
                    label="Username"
                    placeholder="yourname"
                    key={form.key('username')}
                    {...form.getInputProps('username')}
                    styles={inputStyles}
                  />

                  {/*password*/}
                  <TextInput
                    label="Password"
                    placeholder="••••••••"
                    type="password"
                    key={form.key('password')}
                    {...form.getInputProps('password')}
                    error={passwordError || form.errors.password}
                    styles={inputStyles}
                  />

                  {/*password verify*/}
                  <TextInput
                    label="Retype Password"
                    placeholder="••••••••"
                    type="password"
                    key={form.key('confirmPassword')}
                    {...form.getInputProps('confirmPassword')}
                    styles={inputStyles}
                  />
                </div>

                <Button
                  type="submit"
                  fullWidth
                  mt="xl"
                  loading={loading}
                  disabled={loading}
                  style={{
                    height: 46,
                    borderRadius: 12,
                    background: 'linear-gradient(135deg, #1efcde, #ff02d7)',
                    border: 'none',
                    fontSize: 30,
                    fontWeight: 600,
                    fontFamily: 'Bisikan Senja, serif',
                    letterSpacing: '0.3px',
                    boxShadow: '0 4px 20px rgba(100,148,255,0.35)',
                    transition: 'transform 0.15s, box-shadow 0.15s',
                  }}
                >
                  Create Account
                </Button>
              </form>
          </GlassCard>
        </div>
      </div>
    </FadeInPageTransition>
  );
}

export default Signup;