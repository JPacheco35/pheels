// LOGIN FORM

import React, { useState } from 'react';
import {
  Text,
  TextInput,
  Button,
  Title,
  ActionIcon,
  Stack, Group,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import '../../main.css';
import './Login.css';
import {
  useComputedColorScheme,
  useMantineColorScheme,
} from '@mantine/core';
import axios from 'axios';

function Login() {
  const { setColorScheme } = useMantineColorScheme();
  const colorScheme = useComputedColorScheme('dark');
  const [submitted, setSubmitted] = useState(false);

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: { email: '', password: '' },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    },
  });

  const handleSubmit = async (vals: { email: string; password: string }) => {
    // POST
    const res = await axios.post('http://localhost:3000/api/login', { vals });
    console.log(res.data);
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
      }}
    >
      <div style={{ width: 380 }}>
        {/* Header — outside the card */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 24,
          }}
        >
          <Stack gap="xs" justify={'center'} align={'center'}>
            <Title
              className={'gradient-glow'}
              order={1}
              size={100}
              style={{
                fontFamily: 'Bisikan Senja, serif',
                fontStyle: 'italic',
                fontSize: 200,
                lineHeight: 1,
              }}
            >
              Pheels
            </Title>

            <Group mt={-20} justify="cener">
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

              <ActionIcon
                variant="subtle"
                size="lg"
                onClick={() =>
                  setColorScheme(colorScheme === 'dark' ? 'light' : 'dark')
                }
                style={{ fontSize: 18 }}
              >
                {colorScheme === 'dark' ? '☀️' : '🌙'}
              </ActionIcon>
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
                fontFamily: 'Georgia, serif',
              }}
            >
              Welcome Back :)
            </Text>
            <Text
              style={{
                fontSize: 13,
                color: 'light-dark(#666, #888)',
                marginTop: 4,
                fontFamily: 'Georgia, serif',
              }}
            >
              Sign in to continue
            </Text>
          </div>

          <form
            onSubmit={form.onSubmit((values) => {
              console.log(values);
              setSubmitted(true);
            })}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <TextInput
                label="Email"
                placeholder="you@example.com"
                key={form.key('email')}
                {...form.getInputProps('email')}
                styles={{
                  label: {
                    fontSize: 12,
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
                styles={{
                  label: {
                    fontSize: 12,
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
                    height: 44,
                  },
                }}
              />
            </div>

            <Button
              type="submit"
              fullWidth
              mt="xl"
              style={{
                temp:12,
                height: 46,
                borderRadius: 12,
                background: 'linear-gradient(135deg, #6494ff, #a855f7)',
                border: 'none',
                fontSize: 14,
                fontWeight: 600,
                letterSpacing: '0.3px',
                boxShadow: '0 4px 20px rgba(100,148,255,0.35)',
                transition: 'transform 0.15s, box-shadow 0.15s',
              }}
              onClick={() => handleSubmit(form.values)}
            >
              {submitted ? '✓ Signed in' : 'Sign in'}
            </Button>

            <Text
              style={{
                fontSize: 13,
                textAlign: 'center',
                marginTop: 20,
                color: 'light-dark(#666, #888)',
              }}
            >
              Don't have an account?{' '}
              <span
                style={{ color: '#6494ff', cursor: 'pointer', fontWeight: 500 }}
              >
                Create one
              </span>
            </Text>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
