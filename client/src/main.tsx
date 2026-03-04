import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './Components/App/App.tsx';
import React from 'react';
import Background from './Components/Background/Background.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Background>
      <App/>
    </Background>
  </StrictMode>,
);
