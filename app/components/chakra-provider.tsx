'use client';

import { ChakraProvider } from '@chakra-ui/react';
import { extendTheme } from "@chakra-ui/react"

import React from 'react';

// You can extend the theme here if needed
const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  fonts: {
    heading: 'Inter, sans-serif',
    body: 'Inter, sans-serif',
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ChakraProvider theme={theme}>
      {children}
    </ChakraProvider>
  );
} 