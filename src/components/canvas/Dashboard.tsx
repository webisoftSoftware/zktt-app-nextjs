import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group, TextureLoader } from 'three'
import { useLoader } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { Button } from '@/components/ui/Button'

/**
 * Dashboard Component
 * Main interface displayed after loading screen
 * 
 * Key features:
 * - Renders HTML elements within Three.js scene
 * - Contains primary navigation buttons
 * - Maintains consistent styling with app theme
 * 
 * Implementation details:
 * - Uses @react-three/drei's Html component for 3D positioning
 * - Center prop ensures content is centered in viewport
 * - pointerEvents: 'auto' enables button interaction
 * - Flexbox layout for vertical button arrangement
 * - Consistent button styling with hover effects
 * - Backdrop blur for glass-like effect
 */
export function Dashboard() {
  const texture = useLoader(TextureLoader, '/img/zktt_square_transparent.png')
  const groupRef = useRef<Group>(null)

  useFrame((_, delta) => {
    if (!groupRef.current) return
    
    groupRef.current.rotation.y += delta / 3
  })

  // Number of layers to create depth effect
  const LAYERS = 35
  // Space between each layer
  const LAYER_SPACING = 0.007

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Generate multiple layers */}
      {Array.from({ length: LAYERS }).map((_, index) => (
        <mesh 
          key={index}
          scale={[1.5, 1.5, 1.5]} 
          position={[0, 0, -index * LAYER_SPACING]} // Removed Y offset
        >
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial 
            map={texture} 
            transparent 
            opacity={0.99}
            side={2}
            depthWrite={false}
            // Optional: fade opacity for deeper layers
            // opacity={1 - (index * 0.1)} 
          />
        </mesh>
      ))}

      <Html
        fullscreen
        style={{
          position: 'absolute',
          zIndex: -1,
          pointerEvents: 'none',
        }}
      >
        <div 
          className="w-full h-full flex justify-between items-end p-8"
          style={{ pointerEvents: 'auto' }}
        >
          <Button 
            className="bottom-7 px-12 py-4 text-xl bg-white hover:bg-white/90 text-black border-2 border-black rounded-xl transition-all"
            onClick={() => console.log('Enter clicked')}
          >
            ENTER
          </Button>
          
          <Button 
            className="bottom-7 px-7 py-4 text-xl bg-white hover:bg-white/90 text-black border-2 border-black rounded-xl transition-all"
            onClick={() => console.log('Settings clicked')}
          >
            SETTINGS
          </Button>
        </div>
      </Html>
    </group>
  )
}
