'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'
import { toast } from '@/hooks/use-toast'

interface NotificationContextType {
  notifications: any[]
  unreadCount: number
  requestPermission: () => Promise<boolean>
  sendNotification: (title: string, body: string, options?: NotificationOptions) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<any[]>([])
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const { user } = useAuth()

  const unreadCount = notifications.filter(n => !n.read_at).length

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission)
    }
  }, [])

  const requestPermission = async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications')
      return false
    }

    const result = await Notification.requestPermission()
    setPermission(result)
    return result === 'granted'
  }

  const sendNotification = (title: string, body: string, options?: NotificationOptions) => {
    if (permission !== 'granted') return

    const notification = new Notification(title, {
      body,
      icon: '/icons/truck-icon.png',
      badge: '/icons/badge-icon.png',
      ...options,
    })

    notification.onclick = () => {
      window.focus()
      notification.close()
    }

    // Also show toast notification
    toast({
      title,
      description: body,
      variant: 'default',
    })
  }

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, read_at: new Date().toISOString() }
          : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({
        ...notification,
        read_at: notification.read_at || new Date().toISOString()
      }))
    )
  }

  const value = {
    notifications,
    unreadCount,
    requestPermission,
    sendNotification,
    markAsRead,
    markAllAsRead,
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotification() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider')
  }
  return context
}
