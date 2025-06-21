
"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Truck, Shield, BarChart3, Users, MapPin, Clock, CheckCircle, Check,
  ArrowRight, ChevronRight, Zap, Cloud, Gauge, Lock, Route,
  Package, Smartphone, Map
} from "lucide-react"
import { HeroSection } from "@/components/landing/HeroSection"

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("dashboard")

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Image
                src="/icons/seftec-shield-logo.svg"
                alt="Seftec Logo"
                width={32}
                height={32}
                className="h-8 w-8"
                priority
              />
              <span className="text-xl font-bold text-gray-900">Seftec Logistics</span>
            </div>
            <div className="flex space-x-4">
              <Link href="/demo">
                <Button variant="ghost" size="sm" className="text-xs">
                  Live Demo
                </Button>
              </Link>
              <Link href="/setup">
                <Button variant="ghost" size="sm" className="text-xs">
                  DB Setup
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/login">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Your Fleet
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Everything you need to manage your trucks, drivers, and shipments in one platform.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <MapPin className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>Real-Time Tracking</CardTitle>
                <CardDescription>
                  Monitor your trucks in real-time with GPS tracking and live updates.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Clock className="h-12 w-12 text-green-600 mb-4" />
                <CardTitle>Automated Scheduling</CardTitle>
                <CardDescription>
                  Optimize routes and schedules to reduce idle time and fuel costs.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <BarChart3 className="h-12 w-12 text-purple-600 mb-4" />
                <CardTitle>Performance Analytics</CardTitle>
                <CardDescription>
                  Gain insights into fleet performance with detailed reports and analytics.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-600">Active Trucks</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">98.5%</div>
              <div className="text-gray-600">Uptime</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">₦2.5B+</div>
              <div className="text-gray-600">Payments Processed</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-red-600 mb-2">24/7</div>
              <div className="text-gray-600">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Secondary Content Container */}
      <div>
        {/* Testimonials Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Trusted by Logistics Companies
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Hear from our customers about how Seftec Logistics transformed their operations.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                    <div>
                      <CardTitle>John Okoro</CardTitle>
                      <CardDescription>Fleet Manager, TransGlobal</CardDescription>
                    </div>
                  </div>
                  <CardContent>
                    <p className="text-gray-600">
                      "Seftec has reduced our operational costs by 30% while improving delivery times. The real-time tracking is a game-changer."
                    </p>
                  </CardContent>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                    <div>
                      <CardTitle>Aisha Bello</CardTitle>
                      <CardDescription>Operations Director, QuickShip</CardDescription>
                    </div>
                  </div>
                  <CardContent>
                    <p className="text-gray-600">
                      "The automated scheduling feature has eliminated our manual planning process. We've increased fleet utilization by 40%."
                    </p>
                  </CardContent>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                    <div>
                      <CardTitle>Chinedu Nwankwo</CardTitle>
                      <CardDescription>CTO, MegaHaul Logistics</CardDescription>
                    </div>
                  </div>
                  <CardContent>
                    <p className="text-gray-600">
                      "The API integration was seamless. We connected our existing systems in days, not weeks. The support team is exceptional."
                    </p>
                  </CardContent>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Partners Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Our Technology Partners
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                We integrate with the leading platforms in logistics and transportation.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-center">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-32 h-16 mx-auto" />
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-32 h-16 mx-auto" />
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-32 h-16 mx-auto" />
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-32 h-16 mx-auto" />
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8" id="pricing">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Simple, Transparent Pricing
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Pay per truck with no hidden fees. Scale up or down as your business needs change.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border-2 border-blue-200">
                <CardHeader className="text-center">
                  <CardTitle>Starter</CardTitle>
                  <div className="my-4">
                    <span className="text-4xl font-bold">₦15,000</span>
                    <span className="text-gray-600">/truck/month</span>
                  </div>
                  <Button variant="outline">Get Started</Button>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-2" />
                      <span>Up to 5 trucks</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-2" />
                      <span>Basic tracking features</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-2" />
                      <span>Email support</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="border-2 border-blue-500 shadow-lg relative">
                <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-4 py-1 rounded-bl-lg">
                  POPULAR
                </div>
                <CardHeader className="text-center">
                  <CardTitle>Professional</CardTitle>
                  <div className="my-4">
                    <span className="text-4xl font-bold">₦25,000</span>
                    <span className="text-gray-600">/truck/month</span>
                  </div>
                  <Button>Get Started</Button>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-2" />
                      <span>Up to 20 trucks</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-2" />
                      <span>Advanced tracking & analytics</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-2" />
                      <span>Route optimization</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-2" />
                      <span>Priority support</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="border-2 border-blue-200">
                <CardHeader className="text-center">
                  <CardTitle>Enterprise</CardTitle>
                  <div className="my-4">
                    <span className="text-4xl font-bold">Custom</span>
                  </div>
                  <Button variant="outline">Contact Sales</Button>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-2" />
                      <span>Unlimited trucks</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-2" />
                      <span>Custom integrations</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-2" />
                      <span>Dedicated account manager</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-2" />
                      <span>24/7 premium support</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-2" />
                      <span>On-site training</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50" id="faq">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Everything you need to know about Seftec Logistics Platform.
              </p>
            </div>
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-medium">How does the GPS tracking work?</h3>
                <p className="mt-2 text-gray-600">
                  Our platform uses advanced GPS technology to provide real-time location updates for your trucks. Each vehicle is equipped with a small device that transmits location data to our secure servers, which you can access through our web dashboard or mobile app.
                </p>
              </div>
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-medium">Can I integrate with my existing systems?</h3>
                <p className="mt-2 text-gray-600">
                  Yes, our platform offers robust API integration capabilities. We provide comprehensive documentation and developer support to help you connect with ERP, accounting, and other logistics systems you already use.
                </p>
              </div>
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-medium">What happens if I exceed my truck limit?</h3>
                <p className="mt-2 text-gray-600">
                  If you exceed your plan's truck limit, we'll automatically upgrade you to the next tier for the remainder of your billing cycle. You'll only pay the prorated difference for the additional trucks.
                </p>
              </div>
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-medium">How secure is my data?</h3>
                <p className="mt-2 text-gray-600">
                  We take security seriously. All data is encrypted both in transit and at rest. We undergo regular security audits and comply with industry-standard security protocols to ensure your information is always protected.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Platform Preview */}
        <section className="py-20 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                See the Platform in Action
              </h2>
              <p className="text-lg text-gray-600">
                Explore different user perspectives and features
              </p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="tracking">Live Tracking</TabsTrigger>
                <TabsTrigger value="reports">Analytics</TabsTrigger>
              </TabsList>

              <TabsContent value="dashboard" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                        <div>
                          <p className="text-sm text-gray-600">Active Vehicles</p>
                          <p className="text-2xl font-bold">47</p>
                        </div>
                        <Truck className="w-8 h-8 text-blue-600" />
                      </div>
                      <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                        <div>
                          <p className="text-sm text-gray-600">On-time Delivery</p>
                          <p className="text-2xl font-bold">94%</p>
                        </div>
                        <CheckCircle className="w-8 h-8 text-green-600" />
                      </div>
                      <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                        <div>
                          <p className="text-sm text-gray-600">Active Drivers</p>
                          <p className="text-2xl font-bold">52</p>
                        </div>
                        <Users className="w-8 h-8 text-purple-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="tracking" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
                      <div className="text-center">
                        <Map className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">Interactive map with real-time vehicle tracking</p>
                        <Link href="/demo">
                          <Button className="mt-4" variant="outline">
                            View Live Demo
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reports" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Fuel Efficiency</span>
                          <span className="text-sm text-gray-600">+12%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{ width: "78%" }}></div>
                        </div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Route Optimization</span>
                          <span className="text-sm text-gray-600">+18%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: "85%" }}></div>
                        </div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Driver Safety Score</span>
                          <span className="text-sm text-gray-600">+8%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-purple-600 h-2 rounded-full" style={{ width: "92%" }}></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 text-gray-400">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="w-6 h-6 text-blue-500" />
                <span className="text-white font-semibold">Seftec Logistics</span>
              </div>
              <p className="text-sm">
                Comprehensive truck management platform for modern logistics operations.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/features" className="hover:text-white">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
                <li><Link href="/demo" className="hover:text-white">Demo</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="hover:text-white">About</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
                <li><Link href="/careers" className="hover:text-white">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/docs" className="hover:text-white">Documentation</Link></li>
                <li><Link href="/support" className="hover:text-white">Help Center</Link></li>
                <li><Link href="/api" className="hover:text-white">API Reference</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm">
            <p>&copy; 2025 Seftec Logistics. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

