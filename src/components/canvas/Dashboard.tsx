import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group, TextureLoader } from 'three'
import { useLoader } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { Button } from '@/components/ui/Button'

// Define props interface for component type safety
interface DashboardProps {
  isWalletConnected: boolean
  setGameView: (isGameView: boolean) => void
}

// Main dashboard component for game interface
export function Dashboard({ isWalletConnected, setGameView }: DashboardProps) {
  // Load the ZKTT logo texture for 3D rendering
  const texture = useLoader(TextureLoader, '/img/zktt_square_transparent.png')
  
  // Reference to the rotating logo group
  const logoGroupRef = useRef<Group>(null)
  
  // State to manage button visibility
  const [isVisible, setIsVisible] = useState(false)

  // Update visibility when wallet connection changes
  useEffect(() => {
    setIsVisible(isWalletConnected)
  }, [isWalletConnected])

  // Animate logo rotation on each frame
  useFrame((_, delta) => {
    if (!logoGroupRef.current) return
    logoGroupRef.current.rotation.y += delta / 3
  })

  // Constants for logo layer effect
  const LAYERS = 35  // Number of logo layers for depth effect
  const LAYER_SPACING = 0.007  // Space between each layer

  return (
    <>
      {/* Spinning zKTT Logo Group */}
      <group ref={logoGroupRef} position={[0, 0.235, 1]}>
        {/* Generate multiple layers of the logo for depth effect */}
        {Array.from({ length: LAYERS }).map((_, index) => (
          <mesh 
            key={index}
            scale={[2.1, 2.1, 2.1]} 
            position={[0, 0, -index * LAYER_SPACING]}
          >
            {/* Basic plane geometry for logo texture */}
            <planeGeometry args={[1, 1]} />
            
            {/* Material settings for logo appearance */}
            <meshBasicMaterial 
              map={texture} 
              transparent 
              opacity={0.99}
              side={2}  // Render both sides of the plane
              depthWrite={false}  // Prevent z-fighting between layers
            />
          </mesh>
        ))}
      </group>

      {/* Navigation Buttons Group */}
      <group position={[0, -2, 1]}>
        {/* HTML overlay for buttons */}
        <Html
          center
          style={{
            width: '100%',
            pointerEvents: 'none',  // Allow click-through by default
            position: 'absolute',
            bottom: '105px',
            transform: 'none',
            zIndex: 1
          }}
          zIndexRange={[0, 10]}  // Control overlay stacking
        >
          {/* Button container with fade animation */}
          <div 
            className="flex justify-center gap-7"
            style={{ 
              pointerEvents: 'auto',  // Re-enable click events
              position: 'relative',
              zIndex: 1,
              opacity: isVisible ? 1 : 0,
              transition: 'opacity 0.7s ease-in-out',
              visibility: isVisible ? 'visible' : 'hidden'
            }}
          >
            {/* Enter game button */}
            <Button 
              className="px-14 py-4 text-2xl bg-white hover:bg-black/5 text-black border-4 border-black rounded-xl transition-all"
              onClick={() => setGameView(true)}
            >
              ENTER
            </Button>
    
            {/* Settings button - currently logs to console */}
            <Button 
              className="px-10 py-4 text-2xl bg-white hover:bg-black/5 text-black border-4 border-black rounded-xl transition-all"
              onClick={() => console.log('Settings clicked')}
            >
              SETTINGS
            </Button>
          </div>
        </Html>
      </group>
    </>
  )
}
