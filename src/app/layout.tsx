import type { Metadata, Viewport } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400', '500', '600'],
});

export const metadata: Metadata = {
  title: 'Hello, i\'m vercim.',
  description: 'My personal internet page.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={geist.variable}>
        {children}
      </body>
    </html>
  );
}
