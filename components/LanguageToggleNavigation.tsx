'use client';

import React from 'react';
import { useI18nContext, LanguageToggle } from '@seftechub/ui-kit';

interface LanguageToggleNavigationProps {
  className?: string;
}

/**
 * Navigation component with language toggle for logistics platform
 * Example implementation for Next.js logistics app
 */
export const LanguageToggleNavigation: React.FC<LanguageToggleNavigationProps> = ({ 
  className = '' 
}) => {
  const { t, currentLanguage } = useI18nContext();

  return (
    <nav className={`bg-gray-900 text-white ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and main navigation */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold">
                {t('logistics.title', 'Logistics Platform')}
              </h1>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a
                  href="/dashboard"
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
                >
                  {t('nav.dashboard', 'Dashboard')}
                </a>
                <a
                  href="/shipments"
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
                >
                  {t('nav.shipments', 'Shipments')}
                </a>
                <a
                  href="/tracking"
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
                >
                  {t('nav.tracking', 'Tracking')}
                </a>
                <a
                  href="/analytics"
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
                >
                  {t('nav.analytics', 'Analytics')}
                </a>
                <a
                  href="/reports"
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
                >
                  {t('nav.reports', 'Reports')}
                </a>
              </div>
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Language Toggle */}
            <LanguageToggle
              currentLanguage={currentLanguage}
              onLanguageChange={() => {}} // Handled by context
              variant="dropdown"
              className="mr-2"
            />

            {/* User menu */}
            <div className="relative">
              <button className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-white">
                <span className="sr-only">{t('user.menu', 'User menu')}</span>
                <div className="h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center">
                  <span className="text-sm font-medium">U</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

/**
 * Logistics dashboard stats component with translations
 */
export const LogisticsDashboardStats: React.FC = () => {
  const { t } = useI18nContext();

  const stats = [
    {
      key: 'active_shipments',
      value: '1,234',
      icon: '📦',
      color: 'text-blue-600'
    },
    {
      key: 'delivered_today',
      value: '89',
      icon: '✅',
      color: 'text-green-600'
    },
    {
      key: 'in_transit',
      value: '567',
      icon: '🚛',
      color: 'text-yellow-600'
    },
    {
      key: 'pending_pickup',
      value: '23',
      icon: '⏳',
      color: 'text-red-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat) => (
        <div key={stat.key} className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">{stat.icon}</span>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {t(`stats.${stat.key}.label`, stat.key.replace('_', ' '))}
                  </dt>
                  <dd className={`text-lg font-medium ${stat.color}`}>
                    {stat.value}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * Shipment tracking component with translations
 */
interface ShipmentTrackingProps {
  trackingNumber?: string;
}

export const ShipmentTracking: React.FC<ShipmentTrackingProps> = ({ 
  trackingNumber = 'TRK123456789' 
}) => {
  const { t } = useI18nContext();

  const trackingSteps = [
    { key: 'order_placed', completed: true },
    { key: 'picked_up', completed: true },
    { key: 'in_transit', completed: true },
    { key: 'out_for_delivery', completed: false },
    { key: 'delivered', completed: false }
  ];

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        {t('tracking.title', 'Shipment Tracking')}
      </h3>
      
      <div className="mb-4">
        <span className="text-sm text-gray-500">
          {t('tracking.number', 'Tracking Number')}: 
        </span>
        <span className="ml-2 font-mono text-sm font-medium">
          {trackingNumber}
        </span>
      </div>

      <div className="space-y-4">
        {trackingSteps.map((step, index) => (
          <div key={step.key} className="flex items-center">
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
              step.completed 
                ? 'bg-green-100 text-green-600' 
                : 'bg-gray-100 text-gray-400'
            }`}>
              {step.completed ? '✓' : index + 1}
            </div>
            <div className="ml-4">
              <p className={`text-sm font-medium ${
                step.completed ? 'text-gray-900' : 'text-gray-500'
              }`}>
                {t(`tracking.steps.${step.key}`, step.key.replace('_', ' '))}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LanguageToggleNavigation;
