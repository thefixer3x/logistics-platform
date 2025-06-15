'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { 
  Menu, 
  X, 
  Truck,
  Home, 
  Users, 
  BarChart3, 
  FileText, 
  Settings,
  MapPin,
  CreditCard,
  AlertTriangle,
  Calendar,
  DollarSign
} from 'lucide-react'

const navigationItems = [
  {
    href: '/dashboard',
    label: 'Overview',
    icon: <Home className="h-5 w-5" />,
    roles: ['driver', 'supervisor', 'contractor', 'admin']
  },
  {
    href: '/dashboard/trucks',
    label: 'Fleet',
    icon: <Truck className="h-5 w-5" />,
    roles: ['supervisor', 'contractor', 'admin']
  },
  {
    href: '/dashboard/drivers',
    label: 'Drivers',
    icon: <Users className="h-5 w-5" />,
    roles: ['supervisor', 'contractor', 'admin']
  },
  {
    href: '/dashboard/trips',
    label: 'Trips',
    icon: <MapPin className="h-5 w-5" />,
    roles: ['driver', 'supervisor', 'contractor', 'admin']
  },
  {
    href: '/dashboard/payments',
    label: 'Payments',
    icon: <CreditCard className="h-5 w-5" />,
    roles: ['driver', 'contractor', 'admin']
  },
  {
    href: '/dashboard/reports',
    label: 'Reports',
    icon: <BarChart3 className="h-5 w-5" />,
    roles: ['supervisor', 'contractor', 'admin']
  }
]

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)
  const { profile } = useAuth()
  const pathname = usePathname()

  if (!profile) return null

  const allowedItems = navigationItems.filter(item => 
    item.roles.includes(profile.role)
  )

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="bg-white shadow-md"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile menu overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile menu */}
      <div className={cn(
        "lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-logistics-600 text-white rounded-lg">
                <Truck className="h-5 w-5" />
              </div>
              <div className="ml-3">
                <h1 className="text-sm font-semibold text-gray-900">
                  SefTech Logistics
                </h1>
                <p className="text-xs text-gray-500 capitalize">
                  {profile.role}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-2">
            {allowedItems.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== '/dashboard' && pathname.startsWith(item.href))

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive
                      ? "bg-logistics-100 text-logistics-900"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <span className={cn(
                    "mr-3",
                    isActive ? "text-logistics-600" : "text-gray-400"
                  )}>
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* Bottom section */}
          <div className="border-t border-gray-200 p-4">
            <Link
              href="/dashboard/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900"
            >
              <Settings className="mr-3 h-5 w-5 text-gray-400" />
              Settings
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
