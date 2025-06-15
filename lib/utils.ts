import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency: string = 'NGN'): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: currency === 'NGN' ? 'NGN' : 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(d)
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}

export function calculateSLA(completedTrips: number, targetTrips: number): number {
  if (targetTrips === 0) return 100
  return Math.min(100, Math.round((completedTrips / targetTrips) * 100))
}

export function getStatusColor(status: string): string {
  const statusColors = {
    active: 'status-active',
    pending: 'status-pending',
    inactive: 'status-inactive',
    completed: 'status-active',
    in_progress: 'status-pending',
    cancelled: 'status-danger',
    maintenance: 'status-pending',
  }
  return statusColors[status.toLowerCase() as keyof typeof statusColors] || 'status-inactive'
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function generateContractId(): string {
  const prefix = 'CTR'
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substr(2, 4).toUpperCase()
  return `${prefix}-${timestamp}-${random}`
}

export function calculateWeeklyProgress(trips: any[], startDate: Date): {
  completed: number
  target: number
  percentage: number
} {
  const weekEnd = new Date(startDate)
  weekEnd.setDate(weekEnd.getDate() + 7)
  
  const weeklyTrips = trips.filter(trip => {
    const tripDate = new Date(trip.created_at)
    return tripDate >= startDate && tripDate < weekEnd
  })
  
  const completed = weeklyTrips.filter(trip => trip.status === 'completed').length
  const target = 20 // Default weekly target
  
  return {
    completed,
    target,
    percentage: calculateSLA(completed, target)
  }
}
