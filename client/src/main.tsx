import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MantineProvider, createTheme, ColorSchemeScript } from '@mantine/core';
import '@mantine/core/styles.css';
import './main.css';

import App from './Components/Pages/App/App.tsx';
import BackgroundAnimation from './Components/Animations/BackgroundAnimation/BackgroundAnimation.tsx';
import React from 'react';

const theme = createTheme({
  colors: {
    deepBlue: [
      '#eef3ff', '#dce4f5', '#b9c7e2', '#94a8d0', '#748dc1',
      '#5f7cb8', '#5474b4', '#44639f', '#39588f', '#2d4b81',
    ],
    blue: [
      '#eef3ff', '#dee2f2', '#bdc2de', '#98a0ca', '#7a84ba',
      '#6672b0', '#5c68ac', '#4c5897', '#424e88', '#364379',
    ],
  },
  shadows: {
    md: '1px 1px 3px rgba(0, 0, 0, .25)',
    xl: '5px 5px 3px rgba(0, 0, 0, .25)',
  },
  headings: {
    fontFamily: 'Ubuntu, sans-serif',
    sizes: {
      h1: { fontSize: '36px' },
    },
  },
});

// const theme = 'dark';
const typeTheme = 'dark';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ColorSchemeScript defaultColorScheme={typeTheme}/>
    <MantineProvider
      defaultColorScheme={typeTheme}
     theme={theme}
     cssVariablesResolver={() => ({
       variables: {},
       light: {
         // '--mantine-color-body': '#ededed', // ✅ Light mode background
       },
       dark: {},
     })}>
      <BackgroundAnimation>
        <App />
      </BackgroundAnimation>
    </MantineProvider>
  </StrictMode>,
);