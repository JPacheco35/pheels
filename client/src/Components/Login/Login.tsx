// LOGIN FORM
import Logo from '../Logo/Logo.tsx';

const API_URL = import.meta.env.VITE_API_URL;
import React, { useState } from 'react';
import {
  Text,
  TextInput,
  Button,
  Title,
  Stack, Group,
} from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useForm } from '@mantine/form';
import PageTransition from '../PageTransition/PageTransition';
import '../../main.css';
import './Login.css';
import axios from 'axios';


function Login() {
  // const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: { email: '', password: '' },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    },
  });

  const handleSubmit = async (email: string, password: string ) => {
    // POST
    setLoading(true);
    setPasswordError(null);
    setEmailError(null);
    try {
      const res = await axios.post(`${API_URL}/api/login`, {email, password} );
      console.log(res.data);

      // store JWT in local storage and redirect to home page
      if (res.data.authToken) {
        localStorage.setItem('authToken', res.data.authToken); // save for later requests
        navigate('/home');
      }
    }
    catch (err: any) {
      const msg = err.response?.data?.error || 'Something went wrong.';
      if (msg.includes('email')) { setEmailError(msg); }
      else { setPasswordError(msg); }
    }
    finally { setLoading(false); }
  };

  return (
    <PageTransition>
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
            padding: '0 16px', // 👈 side padding on small screens
            boxSizing: 'border-box',
          }}
        >
          {/* Header — outside the card */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 24,
            }}
          >
            <Stack gap="xs" justify={'center'} align={'center'}>
              <Logo fontSize={200}/>

              <Group mt={-20} justify="center">
                <Title
                  order={3}
                  size={30}
                  style={{
                    // fontFamily: 'Ubuntu, serif',
                    fontFamily: 'Bisikan Senja, serif',
                    fontStyle: 'italic',
                  }}
                >
                  a personal diary app
                </Title>
              </Group>
            </Stack>
          </div>

          {/* Glass card */}
          <div
            style={{
              padding: '48px 40px',
              borderRadius: 24,
              background:
                'light-dark(rgba(255,255,255,0.65), rgba(15,16,20,0.65))',
              backdropFilter: 'blur(24px)',
              border:
                '1px solid light-dark(rgba(0,0,0,0.08), rgba(255,255,255,0.08))',
              boxShadow:
                'light-dark(0 8px 48px rgba(0,0,0,0.12), 0 8px 48px rgba(0,0,0,0.6))',
            }}
          >
            <div style={{ marginBottom: 32 }}>
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
                  fontFamily: 'Ubuntu, sans-serif',
                }}
              >
                Sign in to continue
              </Text>
            </div>

            <form
              onSubmit={form.onSubmit((values) => {
                console.log(values);
                handleSubmit(values.email, values.password);
              })}
            >
              <div
                style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
              >
                <TextInput
                  label="Email"
                  placeholder="you@example.com"
                  key={form.key('email')}
                  {...form.getInputProps('email')}
                  error={emailError || form.errors.email}
                  styles={{
                    label: {
                      fontSize: 12,
                      fontFamily: 'Ubuntu, sans-serif',
                      fontWeight: 600,
                      letterSpacing: '0.5px',
                      textTransform: 'uppercase',
                      color: 'light-dark(#444, #aaa)',
                      marginBottom: 6,
                    },
                    input: {
                      borderRadius: 10,
                      border:
                        '1px solid light-dark(rgba(0,0,0,0.12), rgba(255,255,255,0.1))',
                      background:
                        'light-dark(rgba(0,0,0,0.03), rgba(255,255,255,0.05))',
                      fontSize: 14,
                      fontFamily: 'Ubuntu, sans-serif',
                      height: 44,
                    },
                  }}
                />
                <TextInput
                  label="Password"
                  placeholder="••••••••"
                  type="password"
                  key={form.key('password')}
                  {...form.getInputProps('password')}
                  error={passwordError}
                  styles={{
                    label: {
                      fontSize: 12,
                      fontWeight: 600,
                      letterSpacing: '0.5px',
                      textTransform: 'uppercase',
                      color: 'light-dark(#444, #aaa)',
                      marginBottom: 6,
                      fontFamily: 'Ubuntu, sans-serif',
                    },
                    input: {
                      borderRadius: 10,
                      border:
                        '1px solid light-dark(rgba(0,0,0,0.12), rgba(255,255,255,0.1))',
                      background:
                        'light-dark(rgba(0,0,0,0.03), rgba(255,255,255,0.05))',
                      fontSize: 14,
                      height: 44,
                    },
                  }}
                />
              </div>

              <Button
                type="submit"
                fullWidth
                mt="xl"
                loading={loading}
                disabled={loading}
                style={{
                  temp: 12,
                  height: 46,
                  borderRadius: 12,
                  background: 'linear-gradient(135deg, #1efcde, #ff02d7)',
                  border: 'none',
                  fontSize: 30,
                  // fontStyle: 'bold',
                  fontWeight: 600,
                  fontFamily: 'Bisikan Senja, serif',
                  letterSpacing: '0.3px',
                  boxShadow: '0 4px 20px rgba(100,148,255,0.35)',
                  transition: 'transform 0.15s, box-shadow 0.15s',
                }}
              >
                Sign in
              </Button>

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
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

export default Login;
