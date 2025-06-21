import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Navigation() {
  return (
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
  )
}
