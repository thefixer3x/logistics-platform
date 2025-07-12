"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Truck,
  DollarSign,
  BarChart3,
  Users,
  MapPin,
  Shield,
  Zap,
  Globe,
} from "lucide-react";
import Link from "next/link";
import { isDemoMode, demoConfig } from "@/lib/demo-config";

export default function DemoLandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 text-white p-2 rounded-lg">
                <Truck className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {demoConfig.company.name}
                </h1>
                <p className="text-sm text-gray-600">Live Demo Platform</p>
              </div>
            </div>
            <Badge
              variant="outline"
              className="bg-green-50 text-green-700 border-green-200"
            >
              Live Demo
            </Badge>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Experience the Future of Logistics Management
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Explore our comprehensive logistics platform with real-time fleet
            tracking, automated payment processing, and intelligent route
            optimization.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/demo">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                <BarChart3 className="h-5 w-5 mr-2" />
                Launch Live Demo
              </Button>
            </Link>
            <Button variant="outline" size="lg">
              <Globe className="h-5 w-5 mr-2" />
              View Documentation
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="bg-blue-100 text-blue-600 p-2 rounded-lg w-fit">
                <Truck className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg">Fleet Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm">
                Track {demoConfig.company.fleet.totalTrucks} trucks across{" "}
                {demoConfig.company.fleet.locations.length} major cities with
                real-time GPS monitoring.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="bg-green-100 text-green-600 p-2 rounded-lg w-fit">
                <DollarSign className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg">Payment Processing</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm">
                Automated payment system handling ₦
                {(demoConfig.company.metrics.totalRevenue / 1000000).toFixed(1)}
                M+ monthly with integrated mobile money.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="bg-purple-100 text-purple-600 p-2 rounded-lg w-fit">
                <BarChart3 className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg">Analytics Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm">
                Real-time insights with{" "}
                {demoConfig.company.metrics.onTimeDeliveries}% on-time delivery
                rate and predictive maintenance alerts.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="bg-orange-100 text-orange-600 p-2 rounded-lg w-fit">
                <MapPin className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg">Route Optimization</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm">
                AI-powered route planning reducing fuel costs by 15% and
                improving delivery efficiency.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Demo Preview */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Interactive Demo Preview
            </h3>
            <p className="text-gray-600">
              Click below to explore the full logistics management interface
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 border-2 border-dashed border-gray-300">
            <div className="text-center">
              <div className="bg-blue-100 text-blue-600 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Zap className="h-8 w-8" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Ready to Explore?
              </h4>
              <p className="text-gray-600 mb-4">
                Experience the complete logistics platform with live data
                simulation
              </p>
              <Link href="/demo">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Start Interactive Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Technical Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Shield className="h-5 w-5 mr-2 text-green-600" />
                Secure & Reliable
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• End-to-end encryption</li>
                <li>• 99.9% uptime guarantee</li>
                <li>• Automated backups</li>
                <li>• SOC 2 compliant</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Users className="h-5 w-5 mr-2 text-blue-600" />
                Multi-User Platform
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Driver mobile apps</li>
                <li>• Supervisor dashboards</li>
                <li>• Admin control panels</li>
                <li>• Customer portals</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Globe className="h-5 w-5 mr-2 text-purple-600" />
                Integration Ready
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• REST API access</li>
                <li>• Webhook notifications</li>
                <li>• Third-party integrations</li>
                <li>• Mobile SDK available</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-400">
            © 2025 {demoConfig.company.name}. This is a demonstration platform
            showcasing logistics management capabilities.
          </p>
        </div>
      </div>
    </div>
  );
}
