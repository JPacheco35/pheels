import { Title } from '@mantine/core';
import React from 'react';

interface LogoProps {
  fontSize?: number;
}

function Logo({ fontSize }: LogoProps) {
  return (
    <Title
      className={'gradient-glow'}
      order={1}
      size={100}
      style={{
        fontFamily: 'Bisikan Senja, serif',
        fontStyle: 'italic',
        fontSize: fontSize || 100,
        lineHeight: 1,
        paddingRight: 20,
      }}
    >
      Pheels
    </Title>
  );
}

export default Logo;