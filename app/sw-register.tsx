'use client'

import { useEffect, useState } from 'react'

export default function ServiceWorkerRegister() {
  const [offline, setOffline] = useState(false)
  const [show, setShow] = useState(false)

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          // Check for updates every 30 minutes
          setInterval(() => reg.update(), 30 * 60 * 1000)
        })
        .catch(() => {
          // SW registration failed — not critical, app still works
        })

      // Listen for online status messages from SW
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data?.type === 'ONLINE_STATUS') {
          setOffline(!event.data.online)
        }
      })
    }

    // Browser online/offline events
    const goOffline = () => {
      setOffline(true)
      setShow(true)
    }
    const goOnline = () => {
      setOffline(false)
      // Keep the banner visible briefly so user sees the transition
      setTimeout(() => setShow(false), 2000)
    }

    window.addEventListener('offline', goOffline)
    window.addEventListener('online', goOnline)

    // Check initial state
    if (!navigator.onLine) {
      setOffline(true)
      setShow(true)
    }

    return () => {
      window.removeEventListener('offline', goOffline)
      window.removeEventListener('online', goOnline)
    }
  }, [])

  // Show banner when going offline, briefly when coming back online
  useEffect(() => {
    if (offline) setShow(true)
  }, [offline])

  if (!show) return null

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed top-0 left-0 right-0 z-[9999] flex items-center justify-center px-4 py-2 text-sm font-medium transition-all duration-300 ${
        offline
          ? 'bg-amber-900/90 text-amber-100 backdrop-blur-sm'
          : 'bg-emerald-900/90 text-emerald-100 backdrop-blur-sm'
      }`}
    >
      <span className="mr-2">
        {offline ? (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="inline-block">
            <path d="M1 1L15 15M3.5 6.5C4.7 5.5 6.3 4.9 8 4.9C9.7 4.9 11.3 5.5 12.5 6.5M5.5 9C6.3 8.3 7.1 7.9 8 7.9C8.9 7.9 9.7 8.3 10.5 9M8 12a1 1 0 100-2 1 1 0 000 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="inline-block">
            <path d="M8 12a1 1 0 100-2 1 1 0 000 2zM5.5 9C6.3 8.3 7.1 7.9 8 7.9C8.9 7.9 9.7 8.3 10.5 9M3.5 6.5C4.7 5.5 6.3 4.9 8 4.9C9.7 4.9 11.3 5.5 12.5 6.5M1.5 4C3.3 2.5 5.5 1.5 8 1.5C10.5 1.5 12.7 2.5 14.5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </span>
      {offline
        ? 'You\'re offline — dictation history is available, but transcription requires a connection'
        : 'Connection restored'}
    </div>
  )
}
