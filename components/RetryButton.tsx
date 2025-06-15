'use client'

import { Button } from '@/components/ui/button'
import { RefreshCcw } from 'lucide-react'

export function RetryButton({ onRetry }: { onRetry: () => void }) {
  return (
    <Button 
      onClick={onRetry} 
      variant="outline" 
      className="flex items-center gap-2"
    >
      <RefreshCcw className="h-4 w-4" />
      Try again
    </Button>
  )
}
