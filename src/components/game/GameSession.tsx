import { useEffect, useState, useCallback } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useWallet } from '../controller/WalletContext'
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
    <shaderMaterial
      attach="material"
      vertexShader={`
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `}
      fragmentShader={`
        varying vec2 vUv;
        void main() {
          vec3 color = mix(vec3(0.3), vec3(0.7), vUv.y); // Darker gradient from dark to medium gray
          gl_FragColor = vec4(color, 1.0);
        }
      `}
    />
  </Plane>
)

// const XYPlane = ({ size }: PlaneProps) => (
//   <Plane
//     args={[size, size, size, size]}
//     rotation={[0, 0, 0]}
//     position={[0, 0, 0]}
//   >
//     <meshStandardMaterial 
//       attach="material" 
//       color="pink" 
//       wireframe 
//       opacity={0.1}  
//       transparent 
//     />
//   </Plane>
// )

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
      <XZPlane size={size * 10} />
      {/* <XYPlane size={size} /> */}
      {/* <YZPlane size={size} /> */}
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
          <div className="whitespace-nowrap text-[10px] text-black">{label}</div>
        </Html>
        <mesh>
          <planeGeometry args={size} />
          <meshBasicMaterial color="#000000"/>
        </mesh>
      </animated.group>
    </group>
  )
}

// Define the Board component
interface BoardProps {
  position: [number, number, number];
  label: string;
  size: [number, number];
  rotation?: [number, number, number]; // Optional rotation prop
}

function Board({ position, label, size, rotation = [0, 0, 0] }: BoardProps) {
  return (
    <group position={position} rotation={rotation}>
      {/* Main Board with Custom Color */}
      <mesh>
        <planeGeometry args={size} />
        <meshBasicMaterial color="#bbbcbb" /> {/* Updated color */}
      </mesh>

      {/* Label */}
      <Html center transform>
        <div className="whitespace-nowrap text-[10px] text-black">{label}</div>
      </Html>
    </group>
  );
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
      <Board 
        position={[4.5, 0.3, 3.5]} 
        label="menu"
        rotation={[-Math.PI/4, 0, 0]}  // Rotate -45 degrees around X axis
        size={[3, 0.75]}
      />

      {/* Actions - bottom left, angled 45 degrees inward */}
      <Board
        position={[-4.5, 0.3, 3.5]} 
        label="actions"
        rotation={[-Math.PI/4, 0, 0]}  // Rotate -45 degrees around X axis
        size={[3, 0.75]}
      />

      {/* Deck - 100 cards stacked with a y-offset of 0.05 */}
      {Array.from({ length: 100 }).map((_, index) => (
        <GameCard 
          key={index}
          position={[-3.4, 0.015 * index, 0]} // Start at y=0 and increment by 0.05 for each card
          label=''
          size={CARD_DIMENSIONS.getScaledDimensions(1)} // Standard size
        />
      ))}

      {/* Discard - using standard size */}
      <GameCard 
        position={[3.4, 0.05, 0]} 
        label="discard"
        size={CARD_DIMENSIONS.getScaledDimensions(1)} // Standard size
      />

      {/* Player 1 Hand x 5 */}
      <GameCard 
        position={[0, 0.75, 4]} 
        label="p1.hand"
        rotation={[Math.PI/2.5, 0, 0]}
        size={CARD_DIMENSIONS.getScaledDimensions(1)} // Custom width and height
      />

      {/* Player 1 Board */}
      <Board 
        position={[0, 0.05, 1.75]} 
        label="p1.board"
        rotation={[-Math.PI/2, 0, 0]}
        size={[12, CARD_DIMENSIONS.getScaledDimensions(1)[1]]} // Custom width and height
      />

      {/* Player 2 Board */}
      <Board 
        position={[0, 0.05, -1.75]} 
        label="p2.board"
        rotation={[-Math.PI/2, 0, 0]}
        size={[12, CARD_DIMENSIONS.getScaledDimensions(1)[1]]} // Custom width and height
      />

      {/* You can also add specific rotations when needed */}
      <GameCard 
        position={[0.05, 0.75, -4]} 
        label="p2.hand"
        rotation={[
          -1.25, // Rotation around the X axis (no rotation)
          0, // Rotation around the Y axis (approximately 72 degrees)
          0 // Rotation around the Z axis (no rotation)
        ]} // This will flip it 180 degrees around Y axis
        size={CARD_DIMENSIONS.getScaledDimensions(1)} 
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
    <div className="size-full">
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
