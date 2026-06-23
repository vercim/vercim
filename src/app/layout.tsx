import type { Metadata, Viewport } from 'next';
import { JetBrains_Mono } from 'next/font/google';
import './globals.css';

const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
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
    <html lang="en">
      <body className={mono.className}>{children}</body>
    </html>
  );
}
