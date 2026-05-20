'use client';
import { ThemeProvider } from '@/contexts/ThemeContext';

export default function ThemeProviderClient({ children }: { children: React.ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
