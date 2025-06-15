'use client'

import { useAuth } from '@/contexts/AuthContext'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { 
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

interface NavItem {
  href: string
  label: string
  icon: React.ReactNode
  roles: string[]
  badge?: string
}

const navigationItems: NavItem[] = [
  {
    href: '/dashboard',
    label: 'Overview',
    icon: <Home className="h-5 w-5" />,
    roles: ['driver', 'supervisor', 'contractor', 'admin']
  },
  {
    href: '/dashboard/trucks',
    label: 'Fleet Management',
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
    href: '/dashboard/verification',
    label: 'Verification',
    icon: <AlertTriangle className="h-5 w-5" />,
    roles: ['driver', 'supervisor', 'contractor', 'admin'],
    badge: 'New'
  },
  {
    href: '/dashboard/payment-test',
    label: 'Payment Test',
    icon: <CreditCard className="h-5 w-5" />,
    roles: ['driver', 'supervisor', 'contractor', 'admin'],
    badge: 'New'
  },
  {
    href: '/dashboard/maintenance',
    label: 'Maintenance',
    icon: <AlertTriangle className="h-5 w-5" />,
    roles: ['supervisor', 'contractor', 'admin']
  },
  {
    href: '/dashboard/contracts',
    label: 'Contracts',
    icon: <FileText className="h-5 w-5" />,
    roles: ['contractor', 'admin']
  },
  {
    href: '/dashboard/payments',
    label: 'Payments',
    icon: <CreditCard className="h-5 w-5" />,
    roles: ['driver', 'contractor', 'admin']
  },
  {
    href: '/dashboard/reports',
    label: 'Reports & Analytics',
    icon: <BarChart3 className="h-5 w-5" />,
    roles: ['supervisor', 'contractor', 'admin']
  },
  {
    href: '/dashboard/schedule',
    label: 'Schedule',
    icon: <Calendar className="h-5 w-5" />,
    roles: ['driver', 'supervisor', 'admin']
  },
  {
    href: '/dashboard/financial',
    label: 'Financial Overview',
    icon: <DollarSign className="h-5 w-5" />,
    roles: ['contractor', 'admin']
  }
]

export function DashboardSidebar() {
  const { profile } = useAuth()
  const pathname = usePathname()

  if (!profile) return null

  const allowedItems = navigationItems.filter(item => 
    item.roles.includes(profile.role)
  )

  return (
    <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
      <div className="flex flex-col flex-grow bg-white border-r border-gray-200 pt-5 overflow-y-auto">
        {/* Logo */}
        <div className="flex items-center flex-shrink-0 px-4">
          <div className="flex items-center">
            <div className="p-2 bg-logistics-600 text-white rounded-lg">
              <Truck className="h-6 w-6" />
            </div>
            <div className="ml-3">
              <h1 className="text-lg font-semibold text-gray-900">
                SefTech Logistics
              </h1>
              <p className="text-xs text-gray-500 capitalize">
                {profile.role} Portal
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-8 flex-1 px-2 space-y-1">
          {allowedItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/dashboard' && pathname.startsWith(item.href))

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive
                    ? "bg-logistics-100 text-logistics-900"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <span className={cn(
                  "mr-3 flex-shrink-0",
                  isActive ? "text-logistics-600" : "text-gray-400 group-hover:text-gray-500"
                )}>
                  {item.icon}
                </span>
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className="ml-3 inline-block py-0.5 px-2 text-xs font-medium bg-gray-200 text-gray-800 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Bottom Section */}
        <div className="flex-shrink-0 border-t border-gray-200 p-4">
          <Link
            href="/dashboard/settings"
            className="group flex items-center px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900"
          >
            <Settings className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
            Settings
          </Link>
        </div>
      </div>
    </div>
  )
}
