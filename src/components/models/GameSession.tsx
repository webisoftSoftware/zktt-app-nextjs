import { useEffect, useState, useCallback, useMemo } from 'react'
import { Canvas, useThree, useLoader } from '@react-three/fiber'
import * as THREE from 'three'
import { useWallet } from '../controller/WalletContext'
import { Html, Texture } from '@react-three/drei'
import { OrbitControls } from '@react-three/drei'
import { useSpring, animated } from '@react-spring/three'
import { CameraStats, CameraStatsBridgeInCanvas } from '@/components/ui/CameraStats'
import { TextureLoader } from 'three'

interface GameSessionProps {
  onExit: () => void;
  isTestMode?: boolean;
}

// New component for game content
import { Plane, Text } from "@react-three/drei"
import { cardImages } from '../vfx/CardSprite'

interface PlaneProps {
  size: number;
}

interface GameCardProps {
  frontTexture?: string;
  backTexture?: string;
  position: [number, number, number];
  label: string;
  rotation?: [number, number, number];
  size?: [number, number];
  isFaceUp?: boolean;
  isInHand?: boolean;
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

export function GameCard({
  frontTexture,
  backTexture = '/cards/cardback.png',
  position, 
  label, 
  rotation = [0, 0, 0], 
  size = CARD_DIMENSIONS.getScaledDimensions(0.75),
  isFaceUp = true,
  isInHand = false
}: GameCardProps) {
  const [hovered, setHovered] = useState(false);
  const baseRotation = [-Math.PI/2, 0, 0] as [number, number, number];
  
  // Calculate the hover offset
  const yOffset = hovered ? 0.2 : 0;
  const [x, y, z] = position;
  const adjustedPosition: [number, number, number] = [x, y + yOffset, z];

  const frontTextureMap = useMemo(() => {
    const texturePath = frontTexture ?? getNextRandomCard();
    return useLoader(TextureLoader, texturePath);
  }, [frontTexture]);

  const backTextureMap = useMemo(() => {
    return useLoader(TextureLoader, backTexture);
  }, [backTexture]);

  return (
    <group position={adjustedPosition}>
      <animated.group
        rotation-x={baseRotation[0] + rotation[0]}
        rotation-y={baseRotation[1] + rotation[1]}
        rotation-z={baseRotation[2] + rotation[2]}
      >
        <Html center transform>
          <div className="whitespace-nowrap text-[10px] text-black">{label}</div>
        </Html>
        {/* Front face */}
        <mesh
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <planeGeometry args={size} />
          <meshBasicMaterial 
            map={frontTextureMap}
            transparent={true}
            side={THREE.FrontSide}
          />
        </mesh>
        {/* Back face */}
        <mesh
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <planeGeometry args={size} />
          <meshBasicMaterial 
            map={backTextureMap}
            transparent={true}
            side={THREE.BackSide}
          />
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

const getRandomCardIndex = (): number => {
  return Math.floor(Math.random() * cardImages.length);  // Returns 0, 1, 2, 3, or 4
}

function GameContent({ onExit, isTestMode, onCameraUpdate }: GameContentProps) {
  const { viewport } = useThree();

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
        frontTexture="/cards/cardback.png"
        backTexture="/cards/cardback.png"
        position={[3, 0, 3]} 
        label="menu"
        rotation={[Math.PI/4, 0, 0]}  // Rotate -45 degrees around X axis
        size={[3, 0.75]}
      />

      {/* Actions - bottom left, angled 45 degrees inward */}
      <GameCard 
        frontTexture="/cards/cardback.png"
        backTexture="/cards/cardback.png"
        position={[-3, 0, 3]} 
        label="actions"
        rotation={[Math.PI/4, 0, 0]}  // Rotate -45 degrees around X axis
        size={[3, 0.75]}
      />

      {/* Deck - using standard size */}
      <GameCard 
        frontTexture="/cards/cardback.png"
        backTexture="/cards/cardback.png"
        position={[-3.4, 0, 0]} 
        label="deck"
        size={CARD_DIMENSIONS.getScaledDimensions(1)} // Standard size
      />

      {/* Discard - using standard size */}
      <GameCard 
        frontTexture="/cards/cardback.png"
        backTexture="/cards/cardback.png"
        position={[3.4, 0, 0]} 
        label="discard"
        size={CARD_DIMENSIONS.getScaledDimensions(1)} // Standard size
      />

      {/* Player 1 Hand - tight fan from left to right */}
      <GameCard
        backTexture="/cards/cardback.png"
        position={[-0.4, 0.1, 3.6]} 
        label=""
        rotation={[Math.PI/2.2, 0, 0.4]}
      />
      <GameCard 
        backTexture="/cards/cardback.png"
        position={[-0.2, 0.2, 3.7]} 
        label=""
        rotation={[Math.PI/2.2, 0, 0.2]}  
      />
      <GameCard 
        backTexture="/cards/cardback.png"
        position={[0, 0.3, 3.8]} 
        label=""
        rotation={[Math.PI/2.2, 0, 0]} 
      />
      <GameCard 
        backTexture="/cards/cardback.png"
        position={[0.2, 0.4, 3.9]} 
        label=""
        rotation={[Math.PI/2.2, 0, -0.2]} 
      />
      <GameCard 
        backTexture="/cards/cardback.png"
        position={[0.4, 0.5, 4.0]} 
        label=""
        rotation={[Math.PI/2.2, 0, -0.4]}
      />

      {/* Opponent's hand - mirrored tight fan */}
      <GameCard
        frontTexture="/cards/cardback.png"
        backTexture="/cards/cardback.png"
        position={[-0.4, 0.1, -3.6]} 
        label=""
        rotation={[-Math.PI/2.2, 0, Math.PI + 0.4]}
      />
      <GameCard 
        frontTexture="/cards/cardback.png"
        backTexture="/cards/cardback.png"
        position={[-0.2, 0.2, -3.7]} 
        label=""
        rotation={[-Math.PI/2.2, 0, Math.PI + 0.2]}
      />
      <GameCard
        frontTexture="/cards/cardback.png"
        backTexture="/cards/cardback.png"
        position={[0, 0.3, -3.8]} 
        label=""
        rotation={[-Math.PI/2.2, 0, Math.PI]}
      />
      <GameCard
        frontTexture="/cards/cardback.png"
        backTexture="/cards/cardback.png"
        position={[0.2, 0.4, -3.9]} 
        label=""
        rotation={[-Math.PI/2.2, 0, Math.PI - 0.2]}
      />
      <GameCard
        frontTexture="/cards/cardback.png"
        backTexture="/cards/cardback.png"
        position={[0.4, 0.5, -4.0]} 
        label=""
        rotation={[-Math.PI/2.2, 0, Math.PI - 0.4]}
      />

      {/* Player 1 Board - matching standard card height */}
      <GameCard 
        frontTexture="/cards/cardback.png"
        backTexture="/cards/cardback.png"
        position={[0, 0, 1.25]} 
        label="p1.board"
        size={CARD_DIMENSIONS.getWidthFromHeight(3.25)} // 3.25 units wide, standard height
      />

      {/* Player 1 Board - matching standard card height */}
      <GameCard 
        frontTexture="/cards/cardback.png"
        backTexture="/cards/cardback.png"
        position={[0, 0, -1.25]} 
        label="p1.board"
        size={CARD_DIMENSIONS.getWidthFromHeight(3.25)} // 3.25 units wide, standard height
      />


      {/* You can also add specific rotations when needed */}
      <GameCard
      frontTexture="/cards/cardback.png"
        backTexture="/cards/cardback.png"
        position={[-1.0, 0.42, -4]} 
        label=""
        rotation={[
          -Math.PI/2.2, // Rotation around the X axis (no rotation)
          0, // Rotation around the Y axis (approximately 72 degrees)
          Math.PI/1.05 // Rotation around the Z axis (no rotation)
        ]} // This will flip it 180 degrees around Y axis
      />

      <GameCard 
      frontTexture="/cards/cardback.png"
        backTexture="/cards/cardback.png"
        position={[-0.5, 0.48, -4]} 
        label=""
        rotation={[
          -Math.PI/2.2, // Rotation around the X axis (no rotation)
          0, // Rotation around the Y axis (approximately 72 degrees)
          Math.PI/1.025 // Rotation around the Z axis (no rotation)
        ]} // This will flip it 180 degrees around Y axis
      />
      <GameCard
      frontTexture="/cards/cardback.png"
        backTexture="/cards/cardback.png"
        position={[0, 0.5, -4]} 
        label=""
        rotation={[
          -Math.PI/2.2, // Rotation around the X axis (no rotation)
          0, // Rotation around the Y axis (approximately 72 degrees)
          Math.PI/1.0 // Rotation around the Z axis (no rotation)
        ]} // This will flip it 180 degrees around Y axis
      />
      <GameCard
      frontTexture="/cards/cardback.png"
        backTexture="/cards/cardback.png"
        position={[0.5, 0.48, -4]} 
        label=""
        rotation={[
          -Math.PI/2.2, // Rotation around the X axis (no rotation)
            0, // Rotation around the Y axis (approximately 72 degrees)
          -Math.PI/1.025 // Rotation around the Z axis (no rotation)
        ]} // This will flip it 180 degrees around Y axis
      />
      <GameCard
      frontTexture="/cards/cardback.png"
        backTexture="/cards/cardback.png"
        position={[1.0, 0.42, -4]} 
        label=""
        rotation={[
          -Math.PI/2.2, // Rotation around the X axis (no rotation)
          0, // Rotation around the Y axis (approximately 72 degrees)
          -Math.PI/1.05 // Rotation around the Z axis (no rotation)
        ]} // This will flip it 180 degrees around Y axis
      />

      {isTestMode && <CameraStatsBridgeInCanvas onCameraUpdate={onCameraUpdate} />}
    </>
  )
}

// Main component
export function GameSession({ onExit, isTestMode = false }: GameSessionProps) {
  const { isWalletConnected } = useWallet()
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

// Fisher-Yates shuffle algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Create a randomized version of cardImages that we'll export
export const randomizedCardImages = shuffleArray(cardImages);

// Helper function to get next card (cycles through the randomized array)
let currentCardIndex = 0;
export const getNextRandomCard = (): string => {
  const card = randomizedCardImages[currentCardIndex];
  currentCardIndex = (currentCardIndex + 1) % randomizedCardImages.length;
  return card;
}
