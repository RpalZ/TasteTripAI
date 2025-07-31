'use client'

import React from 'react'
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from 'lucide-react'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: React.ErrorInfo
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<ErrorFallbackProps>
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

interface ErrorFallbackProps {
  error?: Error
  resetError: () => void
  goHome: () => void
  goBack: () => void
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { 
      hasError: true, 
      error 
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo
    })

    // Log error to console for development
    console.error('ErrorBoundary caught an error:', error, errorInfo)

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo)

    // In production, you might want to send to an error reporting service
    if (process.env.NODE_ENV === 'production') {
      // Example: Send to error reporting service
      // reportError(error, errorInfo)
    }
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  goHome = () => {
    window.location.href = '/'
  }

  goBack = () => {
    if (window.history.length > 1) {
      window.history.back()
    } else {
      this.goHome()
    }
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback
      
      return (
        <FallbackComponent
          error={this.state.error}
          resetError={this.resetError}
          goHome={this.goHome}
          goBack={this.goBack}
        />
      )
    }

    return this.props.children
  }
}

// Default error fallback component
function DefaultErrorFallback({ error, resetError, goHome, goBack }: ErrorFallbackProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Oops! Something went wrong
          </h1>
          
          <p className="text-gray-600 mb-6">
            We encountered an unexpected error. Don't worry, this happens sometimes.
          </p>

          {/* Error details (only in development) */}
          {process.env.NODE_ENV === 'development' && error && (
            <details className="mb-6 text-left">
              <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                Show error details
              </summary>
              <div className="mt-2 p-3 bg-gray-100 rounded text-xs font-mono text-red-600 overflow-auto max-h-32">
                {error.message}
                {error.stack && (
                  <pre className="mt-2 whitespace-pre-wrap">
                    {error.stack}
                  </pre>
                )}
              </div>
            </details>
          )}

          <div className="space-y-3">
            <button
              onClick={resetError}
              className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </button>
            
            <div className="flex space-x-3">
              <button
                onClick={goBack}
                className="flex-1 flex items-center justify-center px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </button>
              
              <button
                onClick={goHome}
                className="flex-1 flex items-center justify-center px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                <Home className="w-4 h-4 mr-2" />
                Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Specialized error fallback for chat interface
export function ChatErrorFallback({ error, resetError, goHome }: ErrorFallbackProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-red-50 rounded-lg border border-red-200 m-4">
      <AlertTriangle className="w-12 h-12 text-red-600 mb-4" />
      <h3 className="text-lg font-semibold text-red-800 mb-2">
        Chat Error
      </h3>
      <p className="text-red-600 mb-4">
        There was an error with the chat interface.
      </p>
      <div className="flex space-x-3">
        <button
          onClick={resetError}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Retry Chat
        </button>
        <button
          onClick={goHome}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Go Home
        </button>
      </div>
    </div>
  )
}

// Hook for handling async errors (since error boundaries don't catch them)
export function useAsyncError() {
  const [, setError] = React.useState()
  
  return React.useCallback((error: Error) => {
    setError(() => {
      throw error
    })
  }, [])
}

export default ErrorBoundary 