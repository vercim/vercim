import type { Metadata, Viewport } from 'next';
import { Inter_Tight } from 'next/font/google';
import './globals.css';

const interTight = Inter_Tight({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['500', '600', '700'],
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
      <body className={interTight.variable}>
        {children}
      </body>
    </html>
  );
}
