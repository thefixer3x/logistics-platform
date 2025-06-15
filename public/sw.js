// Service Worker for Push Notifications and Offline Support
const CACHE_NAME = 'seftech-logistics-v1'
const OFFLINE_URL = '/offline'

// URLs to cache for offline functionality
const urlsToCache = [
  '/',
  '/dashboard',
  '/login',
  '/offline',
  '/manifest.json',
  // Add critical CSS and JS files
]

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching files')
        return cache.addAll(urlsToCache)
      })
      .then(() => {
        console.log('Service Worker: Installed')
        return self.skipWaiting()
      })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    }).then(() => {
      console.log('Service Worker: Activated')
      return self.clients.claim()
    })
  )
})

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request)
      })
      .catch(() => {
        // If both cache and network fail, show offline page
        if (event.request.destination === 'document') {
          return caches.match(OFFLINE_URL)
        }
      })
  )
})

// Push event - handle push notifications
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push event received')

  let notificationData = {}
  
  if (event.data) {
    try {
      notificationData = event.data.json()
    } catch (e) {
      console.log('Push event data is not valid JSON:', e)
      notificationData = {
        title: 'SefTech Logistics',
        body: event.data.text() || 'New notification',
        icon: '/icons/notification-icon.png',
        badge: '/icons/badge-icon.png'
      }
    }
  }

  const {
    title = 'SefTech Logistics',
    body = 'New notification',
    icon = '/icons/notification-icon.png',
    badge = '/icons/badge-icon.png',
    tag = 'default',
    data = {},
    actions = [],
    requireInteraction = false
  } = notificationData

  const options = {
    body,
    icon,
    badge,
    tag,
    data,
    actions,
    requireInteraction,
    vibrate: [200, 100, 200], // Vibration pattern
    timestamp: Date.now(),
    renotify: true
  }

  event.waitUntil(
    self.registration.showNotification(title, options)
  )
})

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked')
  
  event.notification.close()

  const { action, data = {} } = event
  let urlToOpen = '/'

  // Handle different actions
  switch (action) {
    case 'view_trip':
      urlToOpen = `/dashboard/trips/${data.tripId}`
      break
    case 'view_maintenance':
      urlToOpen = `/dashboard/maintenance/${data.maintenanceId}`
      break
    case 'view_payment':
      urlToOpen = `/dashboard/payments/${data.paymentId}`
      break
    default:
      urlToOpen = data.url || '/dashboard'
  }

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Check if there's already a window/tab open with the target URL
        for (const client of clientList) {
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus()
          }
        }
        
        // If no window/tab is open, open a new one
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen)
        }
      })
  )
})

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync triggered')
  
  if (event.tag === 'truck-location-sync') {
    event.waitUntil(syncTruckLocations())
  }
  
  if (event.tag === 'trip-update-sync') {
    event.waitUntil(syncTripUpdates())
  }
})

// Sync truck locations when back online
async function syncTruckLocations() {
  try {
    // Get stored location updates from IndexedDB
    const locationUpdates = await getStoredLocationUpdates()
    
    for (const update of locationUpdates) {
      await fetch('/api/trucks/location', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(update)
      })
    }
    
    // Clear stored updates after successful sync
    await clearStoredLocationUpdates()
    
    console.log('Service Worker: Location sync completed')
  } catch (error) {
    console.error('Service Worker: Location sync failed:', error)
  }
}

// Sync trip updates when back online
async function syncTripUpdates() {
  try {
    // Get stored trip updates from IndexedDB
    const tripUpdates = await getStoredTripUpdates()
    
    for (const update of tripUpdates) {
      await fetch('/api/trips/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(update)
      })
    }
    
    // Clear stored updates after successful sync
    await clearStoredTripUpdates()
    
    console.log('Service Worker: Trip sync completed')
  } catch (error) {
    console.error('Service Worker: Trip sync failed:', error)
  }
}

// Helper functions for IndexedDB operations
async function getStoredLocationUpdates() {
  // Implement IndexedDB operations
  return []
}

async function clearStoredLocationUpdates() {
  // Implement IndexedDB operations
}

async function getStoredTripUpdates() {
  // Implement IndexedDB operations
  return []
}

async function clearStoredTripUpdates() {
  // Implement IndexedDB operations
}

// Message event - handle messages from the main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})
