'use client'

import React, { ReactNode } from 'react'
import { RetryButton } from '@/components/RetryButton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle } from 'lucide-react'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    console.error('[ErrorBoundary] Caught error:', error)
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[ErrorBoundary] Error details:', error, errorInfo)
  }

  handleRetry = () => {
    console.log('[ErrorBoundary] Retrying...')
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <Card className="max-w-md mx-auto my-8 border-amber-200">
          <CardHeader className="bg-amber-50 text-amber-800">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Something went wrong
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-gray-600 mb-6">
              There was an error loading this content. You can try again or contact support if the issue persists.
            </p>
            {this.state.error && (
              <div className="bg-gray-50 p-3 rounded text-xs font-mono text-gray-700 mb-4 overflow-auto">
                {this.state.error.message}
              </div>
            )}
            <div className="flex justify-end">
              <RetryButton onRetry={this.handleRetry} />
            </div>
          </CardContent>
        </Card>
      )
    }

    return this.props.children
  }
}
