'use client';

import { Box } from '@chakra-ui/react';
import { Providers } from '@/components/chakra-provider';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export function RootLayoutContent({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <Header />
      <Box as="main">
        {children}
      </Box>
      <Footer />
    </Providers>
  );
} 