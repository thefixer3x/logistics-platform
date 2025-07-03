import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { Toaster } from '@/components/ui/toaster'
import { cn } from '@/lib/utils'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter'
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono'
})

export const metadata = {
  metadataBase: new URL('https://fleet.seftec.tech'),
  title: 'SefTech Logistics Platform',
  description: 'Comprehensive truck management and logistics platform with real-time tracking, automated payments, and intelligent SLA monitoring',
  keywords: 'logistics, truck management, fleet tracking, payment processing, SLA monitoring, Nigeria',
  authors: [{ name: 'SefTech Solutions' }],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'SefTech Logistics',
    startupImage: [
      '/icons/apple-touch-startup-image-750x1334.png',
      '/icons/apple-touch-startup-image-1242x2208.png',
    ],
  },
  openGraph: {
    type: 'website',
    siteName: 'SefTech Logistics Platform',
    title: 'SefTech Logistics Platform',
    description: 'Comprehensive truck management and logistics platform',
    url: 'https://fleet.seftec.tech',
    images: [
      {
        url: '/icons/og-image.png',
        width: 1200,
        height: 630,
        alt: 'SefTech Logistics Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SefTech Logistics Platform',
    description: 'Comprehensive truck management and logistics platform',
    images: ['/icons/og-image.png'],
  },
  icons: {
    icon: [
      { url: '/icons/icon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icons/icon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'mask-icon', url: '/icons/safari-pinned-tab.svg', color: '#2563eb' },
    ],
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#2563eb' },
    { media: '(prefers-color-scheme: dark)', color: '#1e40af' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(
        inter.variable,
        jetbrainsMono.variable,
        'font-sans antialiased'
      )}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  )
}
