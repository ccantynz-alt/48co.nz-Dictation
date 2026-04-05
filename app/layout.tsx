import type { Metadata, Viewport } from 'next'
import './globals.css'
import ServiceWorkerRegister from './sw-register'

export const metadata: Metadata = {
  title: 'AlecRae Voice — Professional Dictation',
  description: 'AI-powered dictation for legal and accounting professionals. Whisper transcription + Claude AI formatting.',
  manifest: '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'AlecRae Voice' },
  icons: {
    icon: [
      { url: '/icons/icon-48.png', sizes: '48x48', type: 'image/png' },
      { url: '/icons/icon-96.png', sizes: '96x96', type: 'image/png' },
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-384.png', sizes: '384x384', type: 'image/png' },
    ],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#111920',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-ink-950 text-ink-100 font-body antialiased">
        <ServiceWorkerRegister />
        {children}
      </body>
    </html>
  )
}
