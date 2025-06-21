import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Zap } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative py-20 px-4 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto text-center">
        <Badge className="mb-4" variant="secondary">
          <Zap className="w-3 h-3 mr-1" />
          Powered by AI & Real-time Analytics
        </Badge>
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Transform Your Logistics Operations
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          End-to-end truck management platform with real-time tracking, automated payments, 
          and intelligent SLA monitoring for the modern logistics industry.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/login">
            <Button size="lg" className="gap-2">
              Start Free Trial <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/demo">
            <Button size="lg" variant="outline">
              View Live Demo
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
