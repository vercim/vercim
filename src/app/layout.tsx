import type { Metadata, Viewport } from 'next';
import { Geist, Syne } from 'next/font/google';
import './globals.css';

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['500', '600', '700'],
});

// Accent face for the phrases.
const syne = Syne({
  subsets: ['latin'],
  variable: '--font-accent',
  weight: ['700', '800'],
});

export const metadata: Metadata = {
  title: 'Vercim',
  description: 'Minecraft mods and Roblox games.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geist.variable} ${syne.variable}`}>
        {children}
      </body>
    </html>
  );
}
