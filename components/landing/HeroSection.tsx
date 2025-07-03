import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Zap } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative py-20 px-4 bg-gradient-to-b from-blue-50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <Badge className="mb-4" variant="secondary">
              <Zap className="w-3 h-3 mr-1" />
              Powered by AI & Real-time Analytics
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              Transform Your Logistics Operations
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              End-to-end truck management platform with real-time tracking, automated payments, 
              and intelligent SLA monitoring for the modern logistics industry.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/login">
                <Button size="lg" className="gap-2 w-full sm:w-auto">
                  Start Free Trial <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/demo">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  View Live Demo
                </Button>
              </Link>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-gray-200">
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold text-blue-600">500+</div>
                <div className="text-sm text-gray-600">Active Trucks</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold text-green-600">98.5%</div>
                <div className="text-sm text-gray-600">Uptime</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold text-purple-600">24/7</div>
                <div className="text-sm text-gray-600">Support</div>
              </div>
            </div>
          </div>

          {/* Right Content - Mobile Mockup */}
          <div className="relative">
            <div className="relative mx-auto w-72 h-[600px]">
              {/* Phone Frame */}
              <div className="absolute inset-0 bg-gray-900 rounded-[3rem] shadow-2xl">
                {/* Screen */}
                <div className="absolute top-4 left-4 right-4 bottom-4 bg-white rounded-[2.5rem] overflow-hidden">
                  {/* Status Bar */}
                  <div className="bg-gray-100 h-8 flex items-center justify-between px-6 text-xs font-medium">
                    <span>9:41</span>
                    <span>100%</span>
                  </div>
                  
                  {/* App Header */}
                  <div className="bg-blue-600 text-white p-4">
                    <div className="text-lg font-bold">SefTech Fleet</div>
                    <div className="text-sm opacity-90">Dashboard</div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-4 space-y-3">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-green-50 p-3 rounded-lg">
                        <div className="text-green-600 text-xs font-medium">Active</div>
                        <div className="text-lg font-bold text-green-700">18</div>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="text-blue-600 text-xs font-medium">Trips</div>
                        <div className="text-lg font-bold text-blue-700">12</div>
                      </div>
                    </div>
                    
                    {/* Trip List */}
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-gray-700">Recent Trips</div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm font-medium">Lagos → Abuja</div>
                            <div className="text-xs text-gray-500">Musa A.</div>
                          </div>
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        </div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm font-medium">Kano → PH</div>
                            <div className="text-xs text-gray-500">Folake A.</div>
                          </div>
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Map Preview */}
                    <div className="bg-gray-200 h-32 rounded-lg flex items-center justify-center">
                      <div className="text-gray-500 text-xs">Live Map</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 bg-green-500 text-white text-xs px-3 py-1 rounded-full">
                Real-time
              </div>
              <div className="absolute -bottom-4 -left-4 bg-blue-500 text-white text-xs px-3 py-1 rounded-full">
                GPS Tracking
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
