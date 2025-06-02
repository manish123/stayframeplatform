import type { Metadata } from 'next';
import { Inter, Montserrat, Poppins, Roboto, Playfair_Display, Oswald, Lato } from 'next/font/google';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { SessionProvider } from 'next-auth/react';
import { auth } from '@/auth';
import './globals.css';

// Load Inter font (default)
const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
});

// Load Google Fonts - each must be a top-level const
export const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

export const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
});

export const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-roboto',
  display: 'swap',
});

export const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const oswald = Oswald({
  subsets: ['latin'],
  variable: '--font-oswald',
  display: 'swap',
});

export const lato = Lato({
  weight: ['300', '400', '700'],
  subsets: ['latin'],
  variable: '--font-lato',
  display: 'swap',
});

// Combine font variables
const fontVariables = [
  inter.variable,
  montserrat.variable,
  poppins.variable,
  roboto.variable,
  playfair.variable,
  oswald.variable,
  lato.variable,
].join(' ');

export const metadata: Metadata = {
  title: 'StayFrame - Create Stunning Content',
  description: 'Transform your ideas into viral content with our AI-powered tools',
  keywords: ['meme creator', 'quote maker', 'content creation', 'social media tools'],
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
  icons: {
    icon: [
      {
        media: '(prefers-color-scheme: light)',
        url: '/logo.png',
        href: '/logo.png',
      },
      {
        media: '(prefers-color-scheme: dark)',
        url: '/logo-dark.png',
        href: '/logo-dark.png',
      },
    ],
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://stayframe.com',
    title: 'StayFrame - Create Stunning Visual Content',
    description: 'The all-in-one platform for creating and sharing beautiful visual content, memes, and quotes.',
    siteName: 'StayFrame',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StayFrame - Create Stunning Visual Content',
    description: 'The all-in-one platform for creating and sharing beautiful visual content, memes, and quotes.',
    creator: '@stayframe',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="en" className={cn(fontVariables, inter.className)} suppressHydrationWarning>
      <body className={cn(
        'min-h-screen bg-background font-sans antialiased',
        inter.className
      )}>
        <SessionProvider session={session}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="relative flex min-h-screen flex-col">
              {children}
              <Toaster />
            </div>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
