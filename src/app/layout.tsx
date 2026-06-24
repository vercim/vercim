import type { Metadata, Viewport } from 'next';
import { JetBrains_Mono } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { GifProvider } from '@/hooks/useGifEnabled';
import { MotionProvider } from '@/hooks/useMotionEnabled';
import { SidebarProvider } from '@/hooks/useSidebarEnabled';
import { config } from '@/data/config';
import './globals.css';

const mono = JetBrains_Mono({
  subsets: ['latin'],
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
  try{
    var gifs=${JSON.stringify(config.gifUrls)};
    if(gifs.length){
      var enabled=localStorage.getItem('gif_enabled')!=='false';
      var cur=gifs[0];
      if(enabled){var s=sessionStorage.getItem('hero_next_gif');if(s&&gifs.indexOf(s)>=0)cur=s;}
      var l=document.createElement('link');l.rel='preload';l.as='image';l.href=cur;document.head.appendChild(l);
    }
  }catch(e){}
})()` }} />
      </head>
      <body className={mono.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" themes={['dark', 'light']}>
          <MotionProvider>
            <SidebarProvider>
              <GifProvider>
                {children}
              </GifProvider>
            </SidebarProvider>
          </MotionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
