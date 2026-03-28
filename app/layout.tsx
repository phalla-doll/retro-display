import type { Metadata, Viewport } from 'next';
import { Inter, Space_Mono, Geist_Mono } from 'next/font/google';
import './globals.css'; // Global styles

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const spaceMono = Space_Mono({ weight: ['400', '700'], subsets: ['latin'], variable: '--font-space-mono' });
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' });

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://retro-board.manthaa.dev/'),
  title: 'Retro Split-Flap Display',
  description: 'Turn your screen into a retro airport terminal split-flap display. Customize messages, colors, and textures.',
  keywords: ['split flap', 'vestaboard', 'retro display', 'airport terminal', 'message board'],
  authors: [{ name: 'AI Studio Builder' }],
  openGraph: {
    title: 'Retro Split-Flap Display',
    description: 'Turn your screen into a retro airport terminal split-flap display.',
    type: 'website',
    siteName: 'Split-Flap Display',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Retro Split-Flap Display',
    description: 'Turn your screen into a retro airport terminal split-flap display.',
  },
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceMono.variable} ${geistMono.variable}`}>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
