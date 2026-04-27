'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export function NotificationHandler() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js')
        .then((registration) => console.log('Service Worker registered with scope:', registration.scope))
        .catch((error) => console.error('Service Worker registration failed:', error))
    }
  }, [])

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission()
      if (permission === 'granted') {
        console.log('Notification permission granted')
        subscribeToPushNotifications()
      }
    }
  }

  const subscribeToPushNotifications = async () => {
    const registration = await navigator.serviceWorker.ready
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: 'YOUR_PUBLIC_VAPID_KEY'
    })

    // Send the subscription to your server
    await fetch('/api/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscription),
    })
  }

  return (
    <Button onClick={requestNotificationPermission}>
      Enable Notifications
    </Button>
  )
}

