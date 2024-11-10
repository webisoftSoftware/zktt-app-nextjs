import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group, TextureLoader } from 'three'
import { useLoader } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { Button } from '../ui/Button'
import { useContractController } from '../../helpers/executeHelper'
import { StarknetProvider } from "../controller/StarknetProvider"
import { useConnect } from "@starknet-react/core"
import ControllerConnector from '@cartridge/connector/controller'
import { shortString } from 'starknet'
import { CardSprayManager } from '../vfx/CardSprayManager'
import DojoInit from '../../dojo/sdk_setup'

// Define props interface for component type safety
interface DashboardProps {
  isWalletConnected: boolean
  setGameView: (isGameView: boolean, testMode?: boolean) => void
}

// Main dashboard component for game interface
export function Dashboard({ isWalletConnected, setGameView }: DashboardProps) {
  // Load the ZKTT logo texture for 3D rendering
  const texture = useLoader(TextureLoader, '/img/zktt_square_transparent.png')
  
  const dojo = DojoInit().then((dojo) => {
    console.log(dojo)
  })
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

  // Add contract controller
  const { executeTransaction, submitted } = useContractController()

  // Separate submission states for each action
  const [isStarting, setIsStarting] = useState(false)
  const [isJoining, setIsJoining] = useState(false)
  const [isTesting, setIsTesting] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)

  // Get connector to access username
  const { connectors } = useConnect()
  const connector = connectors[0] as unknown as ControllerConnector

  // Updated join transaction handler

  const handleJoinGame = async () => {
    try {
      setIsJoining(true)
      
      // Fetch username from controller
      const username = await connector.username()
      if (!username) {
        throw new Error("Username not found")
      }
      // Convert username to felt using shortString encoding
      const serializedUsername = shortString.encodeShortString(username)

      await executeTransaction([{
        contractAddress: "0x0533bb2f5c1d6fcb65adc8960b9a0f80a8b2d6c3020bbb9691710e7ab69a0e6d",
        entrypoint: "join",
        calldata: [0, serializedUsername, 3]
      }])
      setGameView(true)
    } catch (error) {
      console.error("Failed to join game:", error)
    } finally {
      setIsJoining(false)
    }
  }

  // Rename handleJoinGame to handleStartGame
  const handleStartGame = async () => {
    try {
      setIsStarting(true)
      await executeTransaction([{
        contractAddress: "0x076f8d509dac11e7db93304f89b3c13fecef38b92c9b77f46f610e67051aebc5",
        entrypoint: "start",
        calldata: []
      }])
    } catch (error) {
      console.error("Failed to join:", error)
    } finally {
      setIsStarting(false)
    }
  }

    // Updated test game handler
    const handleTestGame = async () => {
      try {
        setIsTesting(true)
        setIsPlayDisabled(true)
        setTriggerSpray(true)

        // Start the logo animation after 8.5 seconds (1.5s before transition)
        setTimeout(() => {
          // Animate scale and position
          const startTime = Date.now()
          const animationDuration = 1500 // 1.5 seconds
          
          const animateLogoTransform = () => {
            const elapsed = Date.now() - startTime
            const progress = Math.min(elapsed / animationDuration, 1)
            
            // Exponential scaling
            const scale = 1 + (999 * Math.pow(progress, 2))
            setLogoScale(scale)
            
            // Move towards camera
            const newZ = 1 + (progress * 20)
            setLogoPosition([0, 0.28, newZ])
            
            if (progress < 1) {
              requestAnimationFrame(animateLogoTransform)
            }
          }
          
          animateLogoTransform()
        }, 8500)

        setTimeout(() => {
          setTriggerSpray(false)
          setIsPlayDisabled(false)
        }, 10000)

        setGameView(true, true)
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

  // Constants for logo layer effect
  const LAYERS = 35  // Number of logo layers for depth effect
  const LAYER_SPACING = 0.007  // Space between each layer

  // Add new state for card spray
  const [triggerSpray, setTriggerSpray] = useState(false)

  // Add new state for play button disabled state
  const [isPlayDisabled, setIsPlayDisabled] = useState(false)

  const [logoScale, setLogoScale] = useState(1)
  const [logoPosition, setLogoPosition] = useState<[number, number, number]>([0, 0.28, 1])

  return (
    <>
      <CardSprayManager 
        isActive={true} 
        triggerSpray={triggerSpray}
        position={[0, 0, 1]}
      />
      <group ref={logoGroupRef} position={logoPosition} scale={logoScale}>
        {Array.from({ length: LAYERS }).map((_, index) => (
          <mesh key={index} position={[0, 0, index * LAYER_SPACING]}>
            <planeGeometry args={[2.1, 2.1]} />
            <meshBasicMaterial
              map={texture}
              transparent
              opacity={0.98}
              side={2}
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
            pointerEvents: 'all',  // Changed from 'none' to 'all' to allow click events
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
              position: 'relative',
              zIndex: 1,
              opacity: isVisible ? 1 : 1,  // Fixed opacity values
              transition: 'opacity 2.1s ease-in-out',
              // Remove visibility property since we want to show the buttons at reduced opacity
            }}
          >
            {/* Join game button - updated with separate loading state */}
            {/* <Button 
              className="rounded-2xl border-4 border-black bg-white px-7 py-3 text-2xl text-black transition-all hover:bg-black/5"
              onClick={() => {
                if (isWalletConnected) {
                  handleJoinGame()
                }
              }}
              disabled={isJoining}
            >
              {isJoining ? 'WAITING...' : 'READY'}
            </Button>

            {/* Start game button */}
            {/* <Button 
              className="rounded-2xl border-4 border-black bg-white px-7 py-3 text-2xl text-black transition-all hover:bg-black/5"
              onClick={() => {
                if (isWalletConnected) {
                  handleStartGame()
                }
              }}
              disabled={isStarting}
            >
              {isStarting ? 'STARTING...' : 'START'}
            </Button> */}

            {/* Test game button - updated with test loading state */}
            {/* <Button 
              className="rounded-2xl border-4 border-black bg-white px-8 py-3 text-2xl text-black transition-all hover:bg-black/5"
              onClick={handleTestGame}
              disabled={isTesting}
            >
              {isTesting ? 'TESTING...' : 'TEST'}
            </Button> */}
    
            {/* Leave game button - updated with separate loading state */}
            {/* <Button 
              className="rounded-2xl border-4 border-black bg-white px-7 py-3 text-2xl text-black transition-all hover:bg-black/5"
              onClick={handleLeaveGame}
              disabled={isLeaving}
            >
              {isLeaving ? 'LEAVING...' : 'LEAVE'}
            </Button> */}
            {/* Test game button - updated with test loading state */}
            <Button 
              className="rounded-2xl border-4 border-black bg-white px-14 py-3 text-2xl text-black transition-all hover:bg-black hover:text-white"
              onClick={handleTestGame}
              disabled={isTesting || isPlayDisabled} // Disable button when testing or play is disabled
            >
              {isPlayDisabled ? 'JOINING...' : 'PLAY'}
            </Button>
            <Button 
              className="rounded-2xl border-4 border-black bg-white px-8 py-3 text-2xl text-black transition-all hover:bg-black hover:text-white"
            >
              SETTINGS
            </Button> 
          </div>
        </Html>
      </group>
    </>
  )
}
