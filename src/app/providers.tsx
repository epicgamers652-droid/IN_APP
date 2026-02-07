'use client';

import { ThemeProvider } from 'next-themes';
import { ReactNode } from 'react';
import { ConvexClientProvider } from '@/providers/ConvexClientProvider';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ConvexClientProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
      </ThemeProvider>
    </ConvexClientProvider>
  );
}
