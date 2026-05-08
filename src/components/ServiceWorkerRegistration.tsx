'use client'

import { useEffect } from 'react'

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!('serviceWorker' in navigator)) return

    const registerSW = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
        })
        console.log('[PWA] Service Worker registered with scope:', registration.scope)

        // Listen for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  // New content available - could show update notification
                  console.log('[PWA] New content available, refresh to update')
                } else {
                  // Content cached for offline use
                  console.log('[PWA] Content cached for offline use')
                }
              }
            })
          }
        })

        // Handle controller change (after skipWaiting)
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          console.log('[PWA] Service Worker controller changed')
        })
      } catch (error) {
        console.error('[PWA] Service Worker registration failed:', error)
      }
    }

    registerSW()

    // Listen for online/offline events
    const handleOnline = () => {
      console.log('[PWA] Back online')
      window.dispatchEvent(new CustomEvent('pwa-connection-change', { detail: { online: true } }))
    }
    const handleOffline = () => {
      console.log('[PWA] Gone offline')
      window.dispatchEvent(new CustomEvent('pwa-connection-change', { detail: { online: false } }))
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return null
}
