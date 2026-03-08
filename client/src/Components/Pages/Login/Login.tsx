import React, { useState } from 'react';
import { Text, TextInput, Button, Title, Stack, Group } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useForm } from '@mantine/form';
import axios from 'axios';
import FadeInPageTransition from '../../Animations/FadeInPageTransition/FadeInPageTransition.tsx';
import GlassCard from '../../UI/GlassCard/GlassCard.tsx';
import Logo from '../../UI/Logo/Logo.tsx';
import '../../../main.css';
import './Login.css';

const API_URL = import.meta.env.VITE_API_URL;

// styling for login form
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

function Login() {
  const navigate = useNavigate();

  // loading state
  const [loading, setLoading] = useState(false);

  // input field errors
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  // form data object
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: { email: '', password: '' },
    validate: { email: (v) => (/^\S+@\S+$/.test(v) ? null : 'Invalid email') },
  });

  // form submission handler --> attempt login
  const handleSubmit = async (email: string, password: string) => {
    setLoading(true);
    setPasswordError(null);
    setEmailError(null);
    try {
      const res = await axios.post(`${API_URL}/api/login`, { email, password });
      if (res.data.authToken) {
        localStorage.setItem('authToken', res.data.authToken);
        navigate('/home');
      }
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Something went wrong.';
      msg.includes('email') ? setEmailError(msg) : setPasswordError(msg);
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
          width: '100%',
          marginTop: '-50px',
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
          <Stack gap="xs" justify="center" align="center" mb={24}>
            <Logo fontSize={200} />
            <Group mt={-20} justify="center">
              <Title
                order={3}
                size={30}
                style={{
                  fontFamily: 'Bisikan Senja, serif',
                  fontStyle: 'italic',
                }}
              >
                a personal diary app
              </Title>
            </Group>
          </Stack>

          {/* Login Form */}
          <GlassCard style={{ padding: '48px 40px', borderRadius: 24 }}>

            {/* subheader */}
            <Text
              style={{
                fontSize: 22,
                fontWeight: 700,
                letterSpacing: '-0.5px',
                color: 'light-dark(#0f1014, #f0f2ff)',
                fontFamily: 'Ubuntu, sans-serif',
              }}
            >
              Welcome Back :)
            </Text>
            <Text
              style={{
                fontSize: 13,
                color: 'light-dark(#666, #888)',
                marginTop: 4,
                marginBottom: 32,
                fontFamily: 'Ubuntu, sans-serif',
              }}
            >
              Sign in to continue
            </Text>

            {/* login form */}
            <form
              onSubmit={form.onSubmit((v) => handleSubmit(v.email, v.password))}
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

                {/*password*/}
                <TextInput
                  label="Password"
                  placeholder="••••••••"
                  type="password"
                  key={form.key('password')}
                  {...form.getInputProps('password')}
                  error={passwordError}
                  styles={inputStyles}
                />
              </div>

              {/*submit button*/}
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
                Sign in
              </Button>

              {/*create account prompt*/}
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'Ubuntu, sans-serif',
                  textAlign: 'center',
                  marginTop: 20,
                  color: 'light-dark(#666, #888)',
                }}
              >
                Don't have an account?{' '}
                <span
                  style={{
                    color: '#6494ff',
                    cursor: 'pointer',
                    fontWeight: 500,
                  }}
                  onClick={() => navigate('/signup')}
                >
                  Create one
                </span>
              </Text>
            </form>
          </GlassCard>
        </div>
      </div>
    </FadeInPageTransition>
  );
}

export default Login;