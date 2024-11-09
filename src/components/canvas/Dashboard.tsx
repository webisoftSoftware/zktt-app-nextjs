import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group, TextureLoader } from 'three'
import { useLoader } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { Button } from '@/components/ui/Button'
import { useContractController } from '@/helpers/executeHelper'
import { StarknetProvider } from "@/components/controller/StarknetProvider"

// Define props interface for component type safety
interface DashboardProps {
  isWalletConnected: boolean
  setGameView: (isGameView: boolean, testMode?: boolean) => void
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

  // Add contract controller
  const { executeTransaction, submitted } = useContractController()

  // Separate submission states for each action
  const [isEntering, setIsEntering] = useState(false)
  const [isTesting, setIsTesting] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)

  // Updated enter transaction handler
  const handleEnterGame = async () => {
    try {
      setIsEntering(true)
      await executeTransaction([{
        contractAddress: "0x0533bb2f5c1d6fcb65adc8960b9a0f80a8b2d6c3020bbb9691710e7ab69a0e6d",
        entrypoint: "join",
        calldata: [0,7758188,3]
      }])
      setGameView(true)
    } catch (error) {
      console.error("Failed to enter game:", error)
    } finally {
      setIsEntering(false)
    }
  }

    // Updated test game handler
    const handleTestGame = async () => {
      try {
        setIsTesting(true)
        setGameView(true, true) // Pass true for test mode
      } catch (error) {
        console.error("Failed to enter test view:", error)
      } finally {
        setIsTesting(false)
      }
    }

  // Updated leave transaction handler
  const handleLeaveGame = async () => {
    try {
      setIsLeaving(true)
      await executeTransaction([{
        contractAddress: "0x0533bb2f5c1d6fcb65adc8960b9a0f80a8b2d6c3020bbb9691710e7ab69a0e6d",
        entrypoint: "leave",
        calldata: []
      }])
      setGameView(false)
    } catch (error) {
      console.error("Failed to leave game:", error)
    } finally {
      setIsLeaving(false)
    }
  }

  return (
    <>
      {/* Spinning zKTT Logo Group */}
      <group ref={logoGroupRef} position={[0, 0.235, 1]}>
        {/* Generate multiple layers of the logo for depth effect */}
        {Array.from({ length: LAYERS }).map((_, index) => (
          <mesh 
            key={index}
            scale={[2.1, 2.1, 2.1]} 
            position={[0, 0.07, -index * LAYER_SPACING]}
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
            bottom: '70px',
            transform: 'none',
            zIndex: 1
          }}
          zIndexRange={[0, 10]}  // Control overlay stacking
        >
          {/* Button container with fade animation */}
          <div 
            className="flex justify-center gap-7"
            style={{ 
              pointerEvents: isVisible ? 'auto' : 'none',  // Disable clicks when wallet not connected
              position: 'relative',
              zIndex: 1,
              opacity: isVisible ? 1 : 0,  // 25% opacity when not connected
              transition: 'opacity 2.1s ease-in-out',
              // Remove visibility property since we want to show the buttons at reduced opacity
            }}
          >
            {/* Enter game button - updated with separate loading state */}
            <Button 
              className="px-10 py-4 text-2xl bg-white hover:bg-black/5 text-black border-4 border-black rounded-xl transition-all"
              onClick={handleEnterGame}
              disabled={isEntering}
            >
              {isEntering ? 'JOINING...' : 'ENTER'}
            </Button>

            {/* Test game button - updated with test loading state */}
            <Button 
              className="px-10 py-4 text-2xl bg-white hover:bg-black/5 text-black border-4 border-black rounded-xl transition-all"
              onClick={handleTestGame}
              disabled={isTesting}
            >
              {isTesting ? 'TESTING...' : 'TEST'}
            </Button>
    
            {/* Leave game button - updated with separate loading state */}
            <Button 
              className="px-10 py-4 text-2xl bg-white hover:bg-black/5 text-black border-4 border-black rounded-xl transition-all"
              onClick={handleLeaveGame}
              disabled={isLeaving}
            >
              {isLeaving ? 'LEAVING...' : 'LEAVE'}
            </Button>
          </div>
        </Html>
      </group>
    </>
  )
}
