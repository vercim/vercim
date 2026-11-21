import type { Metadata, Viewport } from 'next';
import { Geist } from 'next/font/google';
import { siteUrl } from '@/data/site';
import './globals.css';

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
  weight: ['400', '500', '600'],
});

export const metadata: Metadata = {
  title: 'Hello, i\'m vercim',
  description: 'Explore my Minecraft mods and Roblox development work. Have a mod or game in mind? Send me a short note about what you want players to do.',
  alternates: { canonical: siteUrl },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${geist.variable} font-sans font-semibold text-ink antialiased`}>
        {children}
      </body>
    </html>
  );
}
