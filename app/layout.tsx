import type { Metadata, Viewport } from 'next';
import './globals.css'; // Global styles

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
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
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
