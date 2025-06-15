'use client'

import { useState, useEffect, ReactNode } from 'react'
import { RetryButton } from '@/components/RetryButton'
import { Card, CardContent } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'

interface DataFetcherProps<T> {
  fetchData: () => Promise<T>
  children: (data: T) => ReactNode
  loadingComponent?: ReactNode
  errorMessage?: string
}

export function DataFetcher<T>({
  fetchData,
  children,
  loadingComponent,
  errorMessage = "Couldn't load the data. Please try again."
}: DataFetcherProps<T>) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await fetchData()
      setData(result)
    } catch (err) {
      console.error('Error fetching data:', err)
      setError(err instanceof Error ? err : new Error(String(err)))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  if (loading) {
    return loadingComponent || <div className="p-4 text-center">Loading...</div>
  }

  if (error) {
    return (
      <Card className="border-red-100 mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              <p>{errorMessage}</p>
            </div>
            <div className="text-xs text-gray-500 font-mono bg-gray-50 p-2 rounded w-full overflow-auto">
              {error.message}
            </div>
            <RetryButton onRetry={loadData} />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!data) {
    return (
      <Card className="border-amber-100 mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center gap-4">
            <p className="text-amber-600">No data available</p>
            <RetryButton onRetry={loadData} />
          </div>
        </CardContent>
      </Card>
    )
  }

  return <>{children(data)}</>
}
