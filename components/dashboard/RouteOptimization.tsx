'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  MapPin, Navigation, Clock, Fuel, TrendingDown, Route, 
  Truck, AlertCircle, CheckCircle, RefreshCw, Settings 
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

interface RouteStop {
  id: string
  address: string
  coordinates: [number, number]
  deliveryWindow: {
    start: string
    end: string
  }
  priority: 'high' | 'medium' | 'low'
  estimatedDuration: number // minutes
  status: 'pending' | 'completed' | 'delayed'
  customerId: string
  customerName: string
}

interface OptimizedRoute {
  id: string
  truckId: string
  truckPlate: string
  driverId: string
  driverName: string
  stops: RouteStop[]
  totalDistance: number
  estimatedDuration: number
  fuelCost: number
  optimizationScore: number
  status: 'draft' | 'active' | 'completed'
  createdAt: string
}

interface OptimizationMetrics {
  totalDistanceSaved: number
  fuelSavings: number
  timeSavings: number
  costSavings: number
  efficiencyGain: number
}

export default function RouteOptimization() {
  const { user } = useAuth()
  const [routes, setRoutes] = useState<OptimizedRoute[]>([])
  const [selectedRoute, setSelectedRoute] = useState<OptimizedRoute | null>(null)
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [metrics, setMetrics] = useState<OptimizationMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  

  useEffect(() => {
    fetchRoutes()
    fetchOptimizationMetrics()
  }, [])

  const fetchRoutes = async () => {
    try {
      // In a real implementation, this would fetch from your routes table
      const mockRoutes: OptimizedRoute[] = [
        {
          id: '1',
          truckId: 'truck-001',
          truckPlate: 'ABC-123-XY',
          driverId: 'driver-001',
          driverName: 'John Doe',
          totalDistance: 85.4,
          estimatedDuration: 360,
          fuelCost: 12500,
          optimizationScore: 92,
          status: 'active',
          createdAt: new Date().toISOString(),
          stops: [
            {
              id: '1',
              address: '123 Victoria Island, Lagos',
              coordinates: [3.4273, 6.4281],
              deliveryWindow: { start: '09:00', end: '11:00' },
              priority: 'high',
              estimatedDuration: 30,
              status: 'completed',
              customerId: 'cust-001',
              customerName: 'Acme Corp'
            },
            {
              id: '2',  
              address: '456 Ikeja GRA, Lagos',
              coordinates: [3.3792, 6.5664],
              deliveryWindow: { start: '11:30', end: '13:30' },
              priority: 'medium',
              estimatedDuration: 45,
              status: 'pending',
              customerId: 'cust-002',
              customerName: 'Tech Solutions Ltd'
            },
            {
              id: '3',
              address: '789 Lekki Phase 1, Lagos',
              coordinates: [3.4700, 6.4500],
              deliveryWindow: { start: '14:00', end: '16:00' },
              priority: 'high',
              estimatedDuration: 25,
              status: 'pending',
              customerId: 'cust-003',
              customerName: 'Global Industries'
            }
          ]
        },
        {
          id: '2',
          truckId: 'truck-002', 
          truckPlate: 'DEF-456-XY',
          driverId: 'driver-002',
          driverName: 'Jane Smith',
          totalDistance: 92.7,
          estimatedDuration: 420,
          fuelCost: 15200,
          optimizationScore: 88,
          status: 'draft',
          createdAt: new Date().toISOString(),
          stops: [
            {
              id: '4',
              address: '321 Surulere, Lagos',
              coordinates: [3.3670, 6.5000],
              deliveryWindow: { start: '08:00', end: '10:00' },
              priority: 'medium',
              estimatedDuration: 35,
              status: 'pending',
              customerId: 'cust-004',
              customerName: 'Metro Logistics'
            },
            {
              id: '5',
              address: '654 Maryland, Lagos', 
              coordinates: [3.3700, 6.5500],
              deliveryWindow: { start: '10:30', end: '12:30' },
              priority: 'low',
              estimatedDuration: 40,
              status: 'pending',
              customerId: 'cust-005',
              customerName: 'City Supplies'
            }
          ]
        }
      ]
      
      setRoutes(mockRoutes)
      setSelectedRoute(mockRoutes[0])
    } catch (error) {
      console.error('Error fetching routes:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchOptimizationMetrics = async () => {
    try {
      // Mock optimization metrics
      setMetrics({
        totalDistanceSaved: 234.5,
        fuelSavings: 45600,
        timeSavings: 180, // minutes
        costSavings: 89500,
        efficiencyGain: 23.4
      })
    } catch (error) {
      console.error('Error fetching metrics:', error)
    }
  }

  const optimizeRoute = async (routeId: string) => {
    setIsOptimizing(true)
    try {
      // Simulate route optimization API call
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Update route with optimized values
      setRoutes(prevRoutes => 
        prevRoutes.map(route => 
          route.id === routeId 
            ? {
                ...route,
                totalDistance: route.totalDistance * 0.92, // 8% improvement
                estimatedDuration: route.estimatedDuration * 0.90, // 10% improvement
                fuelCost: route.fuelCost * 0.88, // 12% improvement
                optimizationScore: Math.min(98, route.optimizationScore + 5)
              }
            : route
        )
      )
      
      // In a real implementation, call your optimization API
      /*
      const response = await fetch('/api/routes/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ routeId })
      })
      const optimizedRoute = await response.json()
      */
      
    } catch (error) {
      console.error('Error optimizing route:', error)
    } finally {
      setIsOptimizing(false)
    }
  }

  const activateRoute = async (routeId: string) => {
    try {
      setRoutes(prevRoutes =>
        prevRoutes.map(route =>
          route.id === routeId
            ? { ...route, status: 'active' }
            : route
        )
      )
      
      // In real implementation, update route status in database
      /*
      await supabase
        .from('routes')
        .update({ status: 'active' })
        .eq('id', routeId)
      */
    } catch (error) {
      console.error('Error activating route:', error)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive'
      case 'medium': return 'secondary'
      case 'low': return 'outline'
      default: return 'outline'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'delayed': return <AlertCircle className="h-4 w-4 text-red-500" />
      default: return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-200 h-32 rounded-lg mb-4" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Route Optimization</h1>
          <p className="text-gray-600">AI-powered route planning and optimization</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button 
            size="sm"
            onClick={() => selectedRoute && optimizeRoute(selectedRoute.id)}
            disabled={isOptimizing}
          >
            {isOptimizing ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Route className="h-4 w-4 mr-2" />
            )}
            Optimize Routes
          </Button>
        </div>
      </div>

      {/* Optimization Metrics */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Distance Saved</p>
                  <p className="text-2xl font-bold text-green-600">{metrics.totalDistanceSaved} km</p>
                </div>
                <Navigation className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Fuel Savings</p>
                  <p className="text-2xl font-bold text-blue-600">₦{metrics.fuelSavings.toLocaleString()}</p>
                </div>
                <Fuel className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Time Saved</p>
                  <p className="text-2xl font-bold text-purple-600">{Math.floor(metrics.timeSavings / 60)}h {metrics.timeSavings % 60}m</p>
                </div>
                <Clock className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Cost Savings</p>
                  <p className="text-2xl font-bold text-orange-600">₦{metrics.costSavings.toLocaleString()}</p>
                </div>
                <TrendingDown className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Efficiency Gain</p>
                  <p className="text-2xl font-bold text-teal-600">{metrics.efficiencyGain}%</p>
                </div>
                <CheckCircle className="h-8 w-8 text-teal-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Routes List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Active Routes</CardTitle>
              <CardDescription>Current and planned delivery routes</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-2">
                {routes.map((route) => (
                  <div
                    key={route.id}
                    className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                      selectedRoute?.id === route.id ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                    onClick={() => setSelectedRoute(route)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Truck className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">{route.truckPlate}</span>
                      </div>
                      <Badge variant={route.status === 'active' ? 'default' : 'secondary'}>
                        {route.status}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Driver:</span>
                        <span>{route.driverName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Distance:</span>
                        <span>{route.totalDistance.toFixed(1)} km</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Stops:</span>
                        <span>{route.stops.length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Score:</span>
                        <div className="flex items-center space-x-2">
                          <Progress value={route.optimizationScore} className="w-16 h-2" />
                          <span className="text-xs">{route.optimizationScore}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Route Details */}
        <div className="lg:col-span-2">
          {selectedRoute ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Route Details - {selectedRoute.truckPlate}</CardTitle>
                    <CardDescription>
                      Driver: {selectedRoute.driverName} • {selectedRoute.stops.length} stops • {selectedRoute.totalDistance.toFixed(1)} km
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    {selectedRoute.status === 'draft' && (
                      <Button 
                        size="sm"
                        onClick={() => activateRoute(selectedRoute.id)}
                      >
                        Activate Route
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => optimizeRoute(selectedRoute.id)}
                      disabled={isOptimizing}
                    >
                      {isOptimizing ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <Route className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="stops" className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="stops">Stops</TabsTrigger>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="map">Map View</TabsTrigger>
                  </TabsList>

                  <TabsContent value="stops">
                    <div className="space-y-4">
                      {selectedRoute.stops.map((stop, index) => (
                        <div key={stop.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                          <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                            <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium">{stop.customerName}</h4>
                              <div className="flex items-center space-x-2">
                                <Badge variant={getPriorityColor(stop.priority)}>
                                  {stop.priority}
                                </Badge>
                                {getStatusIcon(stop.status)}
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{stop.address}</p>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-gray-500">Delivery Window:</span>
                                <div className="font-medium">
                                  {stop.deliveryWindow.start} - {stop.deliveryWindow.end}
                                </div>
                              </div>
                              <div>
                                <span className="text-gray-500">Est. Duration:</span>
                                <div className="font-medium">{stop.estimatedDuration} min</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="overview">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-medium">Route Metrics</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Total Distance:</span>
                            <span className="font-medium">{selectedRoute.totalDistance.toFixed(1)} km</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Estimated Duration:</span>
                            <span className="font-medium">
                              {Math.floor(selectedRoute.estimatedDuration / 60)}h {selectedRoute.estimatedDuration % 60}m
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Fuel Cost:</span>
                            <span className="font-medium">₦{selectedRoute.fuelCost.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Optimization Score:</span>
                            <div className="flex items-center space-x-2">
                              <Progress value={selectedRoute.optimizationScore} className="w-20 h-2" />
                              <span className="font-medium">{selectedRoute.optimizationScore}%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <h4 className="font-medium">Route Statistics</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Total Stops:</span>
                            <span className="font-medium">{selectedRoute.stops.length}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Completed:</span>
                            <span className="font-medium text-green-600">
                              {selectedRoute.stops.filter(s => s.status === 'completed').length}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Pending:</span>
                            <span className="font-medium text-blue-600">
                              {selectedRoute.stops.filter(s => s.status === 'pending').length}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">High Priority:</span>
                            <span className="font-medium text-red-600">
                              {selectedRoute.stops.filter(s => s.priority === 'high').length}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="map">
                    <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500">
                          Interactive map view would be implemented here using Mapbox GL JS or Google Maps
                        </p>
                        <p className="text-sm text-gray-400 mt-2">
                          Showing route: {selectedRoute.truckPlate} with {selectedRoute.stops.length} stops
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-96">
                <div className="text-center">
                  <Route className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Select a route to view details</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
