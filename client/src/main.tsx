import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MantineProvider, ColorSchemeScript } from '@mantine/core';
import '@mantine/core/styles.css';
import './main.css';

import App from './Components/Pages/App/App.tsx';
import BackgroundAnimation from './Components/Animations/BackgroundAnimation/BackgroundAnimation.tsx';
import React from 'react';

// dark mode default
const typeTheme = 'dark';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ColorSchemeScript defaultColorScheme={typeTheme} />
    <MantineProvider defaultColorScheme={typeTheme}>
      <BackgroundAnimation>
        <App />
      </BackgroundAnimation>
    </MantineProvider>
  </StrictMode>,
);