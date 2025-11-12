/**
 * Skeleton loader component
 */

import { cn } from '../../lib/utils/cn'

export interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular'
}

export function Skeleton({ className, variant = 'rectangular' }: SkeletonProps) {
  const baseStyles = 'animate-pulse bg-muted rounded'
  const variantStyles = {
    text: 'h-4 w-full',
    circular: 'rounded-full',
    rectangular: 'h-20 w-full',
  }

  return <div className={cn(baseStyles, variantStyles[variant], className)} aria-busy="true" aria-label="Loading" />
}

