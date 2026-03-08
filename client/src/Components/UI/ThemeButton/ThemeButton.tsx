import { ActionIcon } from '@mantine/core';
import { IconMoonStars, IconSun } from '@tabler/icons-react';
import React from 'react';

interface ThemeButtonProps {
  colorScheme: string;
  setColorScheme: (MantineColorScheme: any) => void;
}

function ThemeButton({colorScheme,setColorScheme}:ThemeButtonProps) {
  return (
    <ActionIcon
      variant="subtle"
      size="lg"
      onClick={() => setColorScheme(colorScheme === 'dark' ? 'light' : 'dark')}
      style={{ fontSize: 18 }}
    >
      {colorScheme === 'dark' ? (
        <IconSun
          style={{ width: '70%', height: '70%' }}
          stroke={1.5}
          color="#ffcc00"
        />
      ) : (
        <IconMoonStars style={{ width: '70%', height: '70%' }} stroke={1.5} />
      )}
    </ActionIcon>
  );
}

export default ThemeButton;