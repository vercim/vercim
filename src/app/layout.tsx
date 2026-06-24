import type { Metadata, Viewport } from 'next';
import { JetBrains_Mono } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { GifProvider } from '@/hooks/useGifEnabled';
import { MotionProvider } from '@/hooks/useMotionEnabled';
import './globals.css';

const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: 'Profile',
  description: 'My profile page with links to my social media and my projects.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={mono.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" themes={['dark', 'light']}>
          <MotionProvider>
            <GifProvider>
              {children}
            </GifProvider>
          </MotionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
