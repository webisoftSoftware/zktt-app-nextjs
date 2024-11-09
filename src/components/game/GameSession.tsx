import { useEffect, useState, useCallback } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useWallet } from '@/components/controller/WalletContext'
import { Html } from '@react-three/drei'
import { OrbitControls } from '@react-three/drei'
import { useSpring, animated } from '@react-spring/three'
import { CameraStats, CameraStatsBridgeInCanvas } from '@/components/ui/CameraStats'

interface GameSessionProps {
  onExit: () => void;
  isTestMode?: boolean;
}

// New component for game content
import { Plane, Text } from "@react-three/drei"

interface PlaneProps {
  size: number;
}

interface GameCardProps {
  position: [number, number, number];
  label: string;
  rotation?: [number, number, number];
  size?: [number, number];
  isFaceUp?: boolean;
}

const XZPlane = ({ size }: PlaneProps) => (
  <Plane
    args={[size, size, size, size]}
    rotation={[1.5 * Math.PI, 0, 0]}
    position={[0, 0, 0]}
  >
    <meshStandardMaterial 
      attach="material" 
      color="#000000" 
      wireframe 
      opacity={0.30}  
      transparent 
    />
  </Plane>
)

const XYPlane = ({ size }: PlaneProps) => (
  <Plane
    args={[size, size, size, size]}
    rotation={[0, 0, 0]}
    position={[0, 0, 0]}
  >
    <meshStandardMaterial 
      attach="material" 
      color="pink" 
      wireframe 
      opacity={0.1}  
      transparent 
    />
  </Plane>
)

const YZPlane = ({ size }: PlaneProps) => (
  <Plane
    args={[size, size, size, size]}
    rotation={[0, Math.PI / 2, 0]}
    position={[0, 0, 0]}
  >
    <meshStandardMaterial 
      attach="material" 
      color="#80ffdb" 
      wireframe 
      opacity={0.1}  
      transparent 
    />
  </Plane>
)

function Grid({ size }: PlaneProps) {
  return (
    <group>
      <XZPlane size={size} />
      <XYPlane size={size} />
      <YZPlane size={size} />
    </group>
  )
}

// Create a reusable card component
// Add a constant for the standard card size and aspect ratio
const CARD_DIMENSIONS = {
  width: 752,
  height: 1052,
  get aspectRatio() { return this.width / this.height },
  // Helper to get properly scaled dimensions based on desired width
  getScaledDimensions(desiredWidth: number) {
    const width = desiredWidth;
    const height = width / this.aspectRatio;
    return [width, height] as [number, number];
  },
  // New helper to get dimensions based on matching a standard card height
  getWidthFromHeight(desiredWidth: number, matchStandardHeight: boolean = true) {
    // First get the standard height from default card width (0.75)
    const standardHeight = 0.75 / this.aspectRatio;
    // Now calculate width that will give us that same height
    const width = desiredWidth;
    return [width, standardHeight] as [number, number];
  }
}

function GameCard({ 
  position, 
  label, 
  rotation = [0, 0, 0], 
  size = CARD_DIMENSIONS.getScaledDimensions(0.75), // Default width of 0.75 units
  isFaceUp = true 
}: GameCardProps) {
  const baseRotation = [-Math.PI/2, 0, 0] as [number, number, number];
  
  const { flipRotation } = useSpring({
    flipRotation: isFaceUp ? 0 : Math.PI,
    config: { mass: 1, tension: 180, friction: 12 }
  });

  return (
    <group position={position}>
      <animated.group
        rotation-x={baseRotation[0] + rotation[0]}
        rotation-y={flipRotation}
        rotation-z={baseRotation[2] + rotation[2]}
      >
        <Html center transform>
          <div className="text-black text-[10px] whitespace-nowrap">{label}</div>
        </Html>
        <mesh>
          <planeGeometry args={size} />
          <meshBasicMaterial color="#000000" wireframe={true} />
        </mesh>
      </animated.group>
    </group>
  )
}

interface GameContentProps {
  onExit: () => void;
  isTestMode: boolean;
  onCameraUpdate: (position: any, rotation: any) => void;
}

function GameContent({ onExit, isTestMode, onCameraUpdate }: GameContentProps) {
  const { viewport } = useThree()

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />

      <OrbitControls 
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        makeDefault
      />

      <Grid size={10} />

      {/* Menu - bottom right, angled 45 degrees inward */}
      <GameCard 
        position={[3, 0, 3]} 
        label="menu"
        rotation={[Math.PI/4, 0, 0]}  // Rotate -45 degrees around X axis
        size={[3, 0.75]}
      />

      {/* Actions - bottom left, angled 45 degrees inward */}
      <GameCard 
        position={[-3, 0, 3]} 
        label="actions"
        rotation={[Math.PI/4, 0, 0]}  // Rotate -45 degrees around X axis
        size={[3, 0.75]}
      />

      {/* Deck - using standard size */}
      <GameCard 
        position={[-3.4, 0, 0]} 
        label="deck"
        size={CARD_DIMENSIONS.getScaledDimensions(1)} // Standard size
      />

      {/* Discard - using standard size */}
      <GameCard 
        position={[3.4, 0, 0]} 
        label="discard"
        size={CARD_DIMENSIONS.getScaledDimensions(1)} // Standard size
      />

      {/* Player 1 Hand x 5 */}
      <GameCard 
        position={[0, 0.5, 4]} 
        label="p1.hand"
        rotation={[Math.PI/2.5, 0, 0]}  
      />

      {/* Player 1 Board - matching standard card height */}
      <GameCard 
        position={[0, 0, 1.25]} 
        label="p1.board"
        size={CARD_DIMENSIONS.getWidthFromHeight(3.25)} // 3.25 units wide, standard height
      />

      {/* Player 1 Board - matching standard card height */}
      <GameCard 
        position={[0, 0, -1.25]} 
        label="p1.board"
        size={CARD_DIMENSIONS.getWidthFromHeight(3.25)} // 3.25 units wide, standard height
      />


      {/* You can also add specific rotations when needed */}
      <GameCard 
        position={[0, 0.5, -4]} 
        label="p2.hand"
        rotation={[
          -1.25, // Rotation around the X axis (no rotation)
          0, // Rotation around the Y axis (approximately 72 degrees)
          0 // Rotation around the Z axis (no rotation)
        ]} // This will flip it 180 degrees around Y axis
      />

      {isTestMode && <CameraStatsBridgeInCanvas onCameraUpdate={onCameraUpdate} />}
    </>
  )
}

// Main component
export function GameSession({ onExit, isTestMode = false }: GameSessionProps) {
  const { isWalletConnected } = useWallet()
  const [playerName, setPlayerName] = useState<string>('')
  const [cameraData, setCameraData] = useState({
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 }
  })

  const handleCameraUpdate = useCallback((position: any, rotation: any) => {
    setCameraData({ position, rotation })
  }, [])

  useEffect(() => {
    if (!isTestMode && !isWalletConnected) {
      onExit()
    }
  }, [isWalletConnected, onExit, isTestMode])

  return (
    <div className="w-full h-full">
      <Canvas
        gl={{ 
          toneMapping: THREE.NoToneMapping,
          antialias: true
        }}
        camera={{ 
          position: [0, 5, 10],
          fov: 45,
          near: 0.1,
          far: 700
        }}
      >
        <GameContent 
          onExit={onExit} 
          isTestMode={isTestMode} 
          onCameraUpdate={handleCameraUpdate}
        />
      </Canvas>
      
      {isTestMode && <CameraStats cameraData={cameraData} />}
    </div>
  )
}
