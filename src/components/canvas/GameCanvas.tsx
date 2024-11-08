import { useState, useEffect } from 'react'
import { View } from '@/components/canvas/View'
import { Common } from '@/components/canvas/View'
import { Dashboard } from './Dashboard'

/**
 * GameCanvas Component
 * Main container for the game interface
 * 
 * Key features:
 * - Manages loading state transition
 * - Contains both 3D and UI elements
 * - Maintains persistent rounded styling
 * 
 * Implementation details:
 * - useState: Tracks loading state
 * - useEffect: Handles loading timeout (3 seconds)
 * - Cleanup: Clears timeout on unmount
 * - Responsive container: Uses aspect ratio
 * - Persistent styling: Uses fixed rounded corners
 * - Border radius: Maintained with overflow hidden
 * - Background: Consistent white with proper opacity
 * 
 * Layout structure:
 * - Outer container: Handles centering and padding
 * - Inner container: Fixed dimensions with rounded corners
 * - View component: 3D rendering with preserved styling
 */
export default function GameCanvas() {
  // const [isLoading, setIsLoading] = useState(true)

  return (
    <div className="flex min-h-screen justify-center items-center p-8">
      <div 
        className="relative w-[1280px] h-[720px] rounded-2xl overflow-hidden"
        style={{
          maxWidth: '100%',
          aspectRatio: '16/9',
          background: 'rgba(255, 255, 255, 0.9)',
          border: '5px solid white',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}
      >
        <View className="relative w-full h-full">
          <Common color="transparent" />
          <Dashboard />
        </View>
      </div>
    </div>
  )
}
