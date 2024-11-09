/**
 * Utility function for combining CSS class names conditionally
 * @param classes - Array of class names or undefined values
 * @returns String of combined class names
 * 
 * This function:
 * 1. Takes any number of class name strings or undefined values
 * 2. Filters out falsy values (undefined, null, false)
 * 3. Joins remaining classes with spaces
 * 
 * Useful for:
 * - Combining static and dynamic classes
 * - Handling conditional classes cleanly
 * - Maintaining type safety with Tailwind
 * 
 * Example usage:
 * cn(
 *   'base-class',
 *   isActive && 'active-class',
 *   variant === 'primary' ? 'primary-class' : 'secondary-class'
 * )
 */
export function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}
