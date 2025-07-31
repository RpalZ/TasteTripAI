'use client'

import { useState, useEffect, ReactNode } from 'react'
import { usePathname } from 'next/navigation'

interface PageTransitionProps {
  children: ReactNode
  className?: string
}

export default function PageTransition({ children, className = '' }: PageTransitionProps) {
  const pathname = usePathname()
  const [isVisible, setIsVisible] = useState(false)
  const [currentPath, setCurrentPath] = useState(pathname)

  useEffect(() => {
    // When path changes, fade out
    if (pathname !== currentPath) {
      setIsVisible(false)
      
      // After fade out, update content and fade in
      setTimeout(() => {
        setCurrentPath(pathname)
        setIsVisible(true)
      }, 150)
    } else {
      // Initial load
      setIsVisible(true)
    }
  }, [pathname, currentPath])

  return (
    <div 
      className={`transition-all duration-300 ease-in-out ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-2'
      } ${className}`}
    >
      {children}
    </div>
  )
}

// Specialized transition for modal-like pages (like detail pages)
export function ModalPageTransition({ children, className = '' }: PageTransitionProps) {
  const pathname = usePathname()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div 
      className={`transition-all duration-300 ease-out ${
        isVisible 
          ? 'opacity-100 scale-100' 
          : 'opacity-0 scale-95'
      } ${className}`}
    >
      {children}
    </div>
  )
}

// Back button with transition
interface BackButtonProps {
  onClick: () => void
  className?: string
  children?: ReactNode
}

export function TransitionBackButton({ onClick, className = '', children }: BackButtonProps) {
  const [isLeaving, setIsLeaving] = useState(false)

  const handleClick = () => {
    setIsLeaving(true)
    
    // Add a small delay for the transition effect
    setTimeout(() => {
      onClick()
    }, 150)
  }

  return (
    <button
      onClick={handleClick}
      className={`transition-all duration-150 ${
        isLeaving 
          ? 'opacity-50 scale-95' 
          : 'opacity-100 scale-100 hover:scale-105'
      } ${className}`}
    >
      {children}
    </button>
  )
} 