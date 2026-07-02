import type { Metadata, Viewport } from 'next';
import { Geist } from 'next/font/google';
import { JetBrains_Mono } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { MotionProvider } from '@/hooks/useMotionEnabled';
import { SidebarProvider } from '@/hooks/useSidebarEnabled';
import './globals.css';

const geist = Geist({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  weight: ['400', '500', '600', '700'],
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
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){
  try{if(localStorage.getItem('motion_enabled')==='false')document.documentElement.classList.add('no-motion')}catch(e){}
})()` }} />
      </head>
      <body className={`${geist.className} ${jetbrainsMono.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="dark" themes={['dark', 'light']}>
          <MotionProvider>
            <SidebarProvider>
              {children}
            </SidebarProvider>
          </MotionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
