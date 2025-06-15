'use client'

import { useState, useCallback } from 'react'
import { RetryButton } from '@/components/RetryButton'

type ErrorWithMessage = {
  message: string
}

function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as Record<string, unknown>).message === 'string'
  )
}

function toErrorWithMessage(error: unknown): ErrorWithMessage {
  if (isErrorWithMessage(error)) return error
  
  try {
    return new Error(JSON.stringify(error))
  } catch {
    // fallback in case there's an error stringifying the error
    return new Error(String(error))
  }
}

function getErrorMessage(error: unknown): string {
  return toErrorWithMessage(error).message
}

export function useErrorHandler<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options?: {
    onError?: (error: Error) => void
    onSuccess?: (result: Awaited<ReturnType<T>>) => void
    errorMessage?: string
  }
) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [result, setResult] = useState<Awaited<ReturnType<T>> | null>(null)

  const execute = useCallback(
    async (...args: Parameters<T>) => {
      setIsLoading(true)
      setError(null)
      
      try {
        const res = await fn(...args)
        setResult(res)
        options?.onSuccess?.(res)
        return res
      } catch (e) {
        const error = new Error(getErrorMessage(e))
        setError(error)
        options?.onError?.(error)
        return null
      } finally {
        setIsLoading(false)
      }
    },
    [fn, options]
  )

  const reset = useCallback(() => {
    setError(null)
    setResult(null)
  }, [])

  const retry = useCallback(
    async (...args: Parameters<T>) => {
      reset()
      return execute(...args)
    },
    [execute, reset]
  )

  const ErrorComponent = useCallback(
    ({ message }: { message?: string }) => {
      if (!error) return null
      
      return (
        <div className="rounded-md bg-red-50 p-4 my-4">
          <div className="flex">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-red-800">
                {message || options?.errorMessage || 'An error occurred'}
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error.message}</p>
              </div>
              <div className="mt-4">
                <RetryButton onRetry={retry} />
              </div>
            </div>
          </div>
        </div>
      )
    },
    [error, retry, options?.errorMessage]
  )

  return {
    execute,
    retry,
    reset,
    isLoading,
    error,
    result,
    ErrorComponent,
  }
}
