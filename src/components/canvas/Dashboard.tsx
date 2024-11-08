import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group, TextureLoader } from 'three'
import { useLoader } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { Button } from '@/components/ui/Button'

interface DashboardProps {
  isWalletConnected: boolean
}

/**
 * Dashboard Component
 * Main interface displayed after loading screen
 * 
 * Key features:
 * - Renders HTML elements within Three.js scene
 * - Contains primary navigation buttons that appear when wallet is connected
 * - Maintains consistent styling with app theme
 * 
 * Implementation details:
 * - Uses @react-three/drei's Html component for 3D positioning
 * - Buttons fade in/out based on wallet connection status
 * - Center prop ensures content is centered in viewport
 * - pointerEvents: 'auto' enables button interaction
 * - Flexbox layout for vertical button arrangement
 * - Consistent button styling with hover effects
 */
export function Dashboard({ isWalletConnected }: DashboardProps) {
  const texture = useLoader(TextureLoader, '/img/zktt_square_transparent.png')
  const logoGroupRef = useRef<Group>(null)
  const [isVisible, setIsVisible] = useState(false)

  // Handle fade animation
  useEffect(() => {
    setIsVisible(isWalletConnected)
  }, [isWalletConnected])

  useFrame((_, delta) => {
    if (!logoGroupRef.current) return
    logoGroupRef.current.rotation.y += delta / 3
  })

  const LAYERS = 35
  const LAYER_SPACING = 0.007

  return (
    <>
      {/* Logo Group */}
      <group ref={logoGroupRef} position={[0, 0.235, 1]}>
        {Array.from({ length: LAYERS }).map((_, index) => (
          <mesh 
            key={index}
            scale={[2.1, 2.1, 2.1]} 
            position={[0, 0, -index * LAYER_SPACING]}
          >
            <planeGeometry args={[1, 1]} />
            <meshBasicMaterial 
              map={texture} 
              transparent 
              opacity={0.99}
              side={2}
              depthWrite={false}
            />
          </mesh>
        ))}
      </group>

      {/* Buttons Group */}
      <group position={[0, -2, 1]}>
        <Html
          center
          style={{
            width: '100%',
            pointerEvents: 'none',
            position: 'absolute',
            bottom: '105px',
            transform: 'none',
            zIndex: 1
          }}
          zIndexRange={[0, 10]}
        >
          <div 
            className="flex justify-center gap-7"
            style={{ 
              pointerEvents: 'auto',
              position: 'relative',
              zIndex: 1,
              opacity: isVisible ? 1 : 0,
              transition: 'opacity 0.7s ease-in-out',
              visibility: isVisible ? 'visible' : 'hidden'
            }}
          >
            <Button 
              className="px-14 py-4 text-2xl bg-white hover:bg-black/5 text-black border-4 border-black rounded-xl transition-all"
              onClick={() => console.log('Enter clicked')}
            >
              ENTER
            </Button>
    
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
