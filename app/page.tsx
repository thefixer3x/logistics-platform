"use client"

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Truck, 
  Shield, 
  BarChart3, 
  Users, 
  MapPin, 
  Clock, 
  CheckCircle, 
  Star, 
  ChevronRight, 
  ArrowRight, 
  Globe, 
  Zap,
  Database,
  Layers
} from 'lucide-react'

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className={`${scrolled ? 'bg-background/90 shadow-md' : 'bg-transparent'} backdrop-blur-md sticky top-0 z-50 transition-all duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-green-600 rounded-full blur opacity-70 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative bg-background rounded-full p-1">
                  <Truck className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-green-600">SefTech Logistics</span>
            </div>
            <div className="hidden md:flex space-x-1">
              <Link href="/features">
                <Button variant="ghost" size="sm">Features</Button>
              </Link>
              <Link href="/solutions">
                <Button variant="ghost" size="sm">Solutions</Button>
              </Link>
              <Link href="/pricing">
                <Button variant="ghost" size="sm">Pricing</Button>
              </Link>
              <Link href="/demo">
                <Button variant="ghost" size="sm">
                  Live Demo
                </Button>
              </Link>
            </div>
            <div className="flex space-x-2">
              <Link href="/login">
                <Button variant="outline">Sign In</Button>
              </Link>
              <Link href="/login">
                <Button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 transition-all duration-300">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
          <div className="absolute -z-10 inset-0 bg-[radial-gradient(ellipse_at_center,rgba(var(--background-end-rgb),0)_0%,rgba(var(--background-start-rgb),1)_70%)]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 md:pt-32 md:pb-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <Badge className="px-3 py-1 text-sm bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded-full">
                Next-Gen Logistics Platform
              </Badge>
              
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                <span className="block">Intelligent</span>
                <span className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-green-600">
                  Logistics Operations
                </span>
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-lg">
                AI-powered truck management with real-time tracking, automated payments, and 
                predictive SLA monitoring for modern logistics companies.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/login">
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 transition-all duration-300">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/demo">
                  <Button variant="outline" size="lg">
                    Schedule Demo
                  </Button>
                </Link>
              </div>
              
              <div className="flex items-center space-x-4 pt-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center text-xs font-medium">
                      {i}
                    </div>
                  ))}
                </div>
                <div className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">500+</span> companies trust SefTech
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-green-600 rounded-xl blur opacity-30"></div>
              <div className="relative bg-background/80 backdrop-blur-sm border border-border/40 rounded-xl overflow-hidden shadow-xl">
                <Tabs defaultValue="dashboard" className="w-full">
                  <div className="flex items-center justify-between px-4 py-2 border-b border-border/30">
                    <TabsList className="grid w-full max-w-xs grid-cols-3">
                      <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                      <TabsTrigger value="tracking">Tracking</TabsTrigger>
                      <TabsTrigger value="analytics">Analytics</TabsTrigger>
                    </TabsList>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 rounded-full bg-red-500"></div>
                      <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    </div>
                  </div>
                  <TabsContent value="dashboard" className="p-0 m-0">
                    <div className="aspect-video w-full bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950/30 dark:to-green-950/30 p-4">
                      <div className="grid grid-cols-2 gap-4 h-full">
                        <div className="space-y-4">
                          <div className="bg-background/80 backdrop-blur-sm rounded-lg p-4 border border-border/30 shadow-sm">
                            <div className="flex justify-between items-center mb-4">
                              <h3 className="font-medium">Active Trucks</h3>
                              <Badge>Live</Badge>
                            </div>
                            <div className="text-3xl font-bold">247</div>
                            <div className="text-sm text-muted-foreground mt-2">
                              <span className="text-green-600">↑ 12%</span> from last week
                            </div>
                          </div>
                          <div className="bg-background/80 backdrop-blur-sm rounded-lg p-4 border border-border/30 shadow-sm">
                            <div className="flex justify-between items-center mb-4">
                              <h3 className="font-medium">SLA Compliance</h3>
                              <Badge variant="outline">98.5%</Badge>
                            </div>
                            <div className="h-8 w-full bg-muted rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-blue-600 to-green-600 rounded-full" style={{ width: '98.5%' }}></div>
                            </div>
                          </div>
                        </div>
                        <div className="bg-background/80 backdrop-blur-sm rounded-lg p-4 border border-border/30 shadow-sm">
                          <h3 className="font-medium mb-4">Truck Distribution</h3>
                          <div className="h-[calc(100%-2rem)] flex items-end justify-between gap-2">
                            {[65, 40, 85, 30, 70, 50, 90].map((height, i) => (
                              <div key={i} className="h-full flex flex-col justify-end">
                                <div 
                                  className="w-8 bg-gradient-to-t from-blue-600 to-green-600 rounded-t-md"
                                  style={{ height: `${height}%` }}
                                ></div>
                                <div className="text-xs text-center mt-1">{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="tracking" className="p-0 m-0">
                    <div className="aspect-video w-full bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950/30 dark:to-green-950/30 p-4">
                      <div className="h-full bg-background/80 backdrop-blur-sm rounded-lg p-4 border border-border/30 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="font-medium">Live Fleet Tracking</h3>
                          <Badge variant="outline">24 Active Routes</Badge>
                        </div>
                        <div className="relative h-[calc(100%-2rem)] rounded-lg bg-blue-50 dark:bg-blue-950/30 overflow-hidden">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Globe className="h-32 w-32 text-muted-foreground/20" />
                          </div>
                          {[1, 2, 3, 4, 5].map((i) => (
                            <div 
                              key={i} 
                              className="absolute h-2 w-2 bg-blue-600 rounded-full animate-ping"
                              style={{ 
                                top: `${20 + Math.random() * 60}%`, 
                                left: `${20 + Math.random() * 60}%`,
                                animationDelay: `${i * 0.5}s`
                              }}
                            ></div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="analytics" className="p-0 m-0">
                    <div className="aspect-video w-full bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950/30 dark:to-green-950/30 p-4">
                      <div className="grid grid-cols-2 gap-4 h-full">
                        <div className="bg-background/80 backdrop-blur-sm rounded-lg p-4 border border-border/30 shadow-sm">
                          <h3 className="font-medium mb-4">Performance Metrics</h3>
                          <div className="space-y-4">
                            {['Delivery Time', 'Fuel Efficiency', 'Maintenance'].map((metric, i) => (
                              <div key={i} className="space-y-1">
                                <div className="flex justify-between text-sm">
                                  <span>{metric}</span>
                                  <span>{[92, 87, 95][i]}%</span>
                                </div>
                                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-gradient-to-r from-blue-600 to-green-600 rounded-full" 
                                    style={{ width: `${[92, 87, 95][i]}%` }}
                                  ></div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="bg-background/80 backdrop-blur-sm rounded-lg p-4 border border-border/30 shadow-sm">
                          <h3 className="font-medium mb-4">Cost Analysis</h3>
                          <div className="h-[calc(100%-2rem)] flex items-center justify-center">
                            <div className="relative h-32 w-32">
                              <div className="absolute inset-0 rounded-full border-8 border-muted"></div>
                              <div 
                                className="absolute inset-0 rounded-full border-8 border-transparent border-t-blue-600 border-r-green-600"
                                style={{ transform: 'rotate(45deg)' }}
                              ></div>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center">
                                  <div className="text-2xl font-bold">24%</div>
                                  <div className="text-xs text-muted-foreground">Savings</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 px-3 py-1 text-sm bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded-full">
              Core Capabilities
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything You Need for Modern Logistics
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to optimize your fleet operations and improve efficiency
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <MapPin className="h-10 w-10 text-blue-600" />,
                title: "Real-Time Tracking",
                description: "Monitor your fleet with GPS tracking, route optimization, and live updates",
                gradient: "from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20"
              },
              {
                icon: <BarChart3 className="h-10 w-10 text-green-600" />,
                title: "Smart Analytics",
                description: "Comprehensive reporting with SLA monitoring and performance insights",
                gradient: "from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/20"
              },
              {
                icon: <Shield className="h-10 w-10 text-purple-600" />,
                title: "Automated Payments",
                description: "Secure payment processing with Stripe integration and contract management",
                gradient: "from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/20"
              },
              {
                icon: <Users className="h-10 w-10 text-red-600" />,
                title: "Multi-Role Dashboards",
                description: "Customized interfaces for drivers, supervisors, and contractors",
                gradient: "from-red-50 to-red-100 dark:from-red-950/30 dark:to-red-900/20"
              },
              {
                icon: <Clock className="h-10 w-10 text-orange-600" />,
                title: "Maintenance Tracking",
                description: "Automated maintenance scheduling and compliance monitoring",
                gradient: "from-orange-50 to-orange-100 dark:from-orange-950/30 dark:to-orange-900/20"
              },
              {
                icon: <CheckCircle className="h-10 w-10 text-teal-600" />,
                title: "SLA Compliance",
                description: "Automated SLA monitoring with rollover management and reporting",
                gradient: "from-teal-50 to-teal-100 dark:from-teal-950/30 dark:to-teal-900/20"
              }
            ].map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-50 group-hover:opacity-100 transition-opacity duration-300`}></div>
                <CardHeader className="relative">
                  <div className="mb-4">{feature.icon}</div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative">
                  <Button variant="ghost" size="sm" className="group-hover:translate-x-1 transition-transform duration-300">
                    Learn more <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 px-3 py-1 text-sm bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded-full">
              Advanced Technology
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Powered by Cutting-Edge Tech
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our platform leverages the latest technologies to deliver unmatched performance
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: <Zap className="h-10 w-10 mx-auto mb-4 text-yellow-500" />, name: "Real-time Processing", description: "Sub-second data updates" },
              { icon: <Database className="h-10 w-10 mx-auto mb-4 text-blue-500" />, name: "Cloud Infrastructure", description: "99.99% uptime guarantee" },
              { icon: <Layers className="h-10 w-10 mx-auto mb-4 text-purple-500" />, name: "AI Optimization", description: "Predictive route planning" },
              { icon: <Shield className="h-10 w-10 mx-auto mb-4 text-green-500" />, name: "Enterprise Security", description: "SOC 2 Type II certified" },
            ].map((tech, index) => (
              <div key={index} className="bg-background rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                {tech.icon}
                <h3 className="text-lg font-semibold mb-2">{tech.name}</h3>
                <p className="text-sm text-muted-foreground">{tech.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-muted/30 to-background">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { value: "500+", label: "Active Trucks", color: "text-blue-600" },
              { value: "98.5%", label: "Uptime", color: "text-green-600" },
              { value: "₦2.5B+", label: "Payments Processed", color: "text-purple-600" },
              { value: "24/7", label: "Support", color: "text-red-600" },
            ].map((stat, index) => (
              <div key={index} className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg blur opacity-0 group-hover:opacity-30 transition duration-300"></div>
                <div className="relative bg-background rounded-lg p-6 shadow-md">
                  <div className={`text-4xl font-bold ${stat.color} mb-2`}>{stat.value}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-green-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Logistics?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join hundreds of companies already using SefTech Logistics to streamline their operations
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-50">
                Get Started Today
              </Button>
            </Link>
            <Link href="/demo">
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                Schedule a Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Truck className="h-6 w-6" />
                <span className="text-lg font-bold">SefTech Logistics</span>
              </div>
              <p className="text-gray-400">
                Comprehensive logistics platform for modern fleet management
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Fleet Tracking</li>
                <li>Payment Processing</li>
                <li>SLA Monitoring</li>
                <li>Analytics</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Documentation</li>
                <li>API Reference</li>
                <li>Help Center</li>
                <li>Contact Us</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>About Us</li>
                <li>Careers</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 SefTech Logistics. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}