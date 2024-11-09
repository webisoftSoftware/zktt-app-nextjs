import { useEffect, useState, useCallback, useMemo } from 'react'
import { Canvas, useThree, useLoader } from '@react-three/fiber'
import * as THREE from 'three'
import { useWallet } from '../controller/WalletContext'
import { Html, Texture } from '@react-three/drei'
import { OrbitControls } from '@react-three/drei'
import { useSpring, animated } from '@react-spring/three'
import { CameraStats, CameraStatsBridgeInCanvas } from '@/components/ui/CameraStats'
import { TextureLoader } from 'three'
import { AxesHelper } from 'three';
import WireframeIcon from '../icons/WireframeIcon';

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
}

const XZPlane = ({ size, showWireframe }: PlaneProps & { showWireframe: boolean }) => (
  <Plane
    args={[showWireframe ? size : size * 10, showWireframe ? size : size * 10, size, size]}
    rotation={[1.5 * Math.PI, 0, 0]}
    position={[0, 0, 0]}
  >
    {showWireframe ? (
      <meshStandardMaterial 
        attach="material" 
        color="black" 
        wireframe 
        opacity={0.1}  
        transparent 
      />
    ) : (
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
    )}
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
      color="black" 
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
      color="black" 
      wireframe 
      opacity={0.1}  
      transparent 
    />
  </Plane>
)

function Grid({ size, showWireframe }: PlaneProps & { showWireframe: boolean }) {
  return (
    <group>
      <XZPlane size={showWireframe ? size : size * 10} showWireframe={showWireframe} />
      {showWireframe && (
        <>
          <XYPlane size={size} />
          <YZPlane size={size} />
        </>
      )}
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
  frontTexture,
  backTexture = '/cards/cardback.png',
  position, 
  label, 
  rotation = [0, 0, 0], 
  size = CARD_DIMENSIONS.getScaledDimensions(0.75),
  isFaceUp = true,
  showWireframe
}: GameCardProps & { showWireframe: boolean }) {
  const baseRotation = [-Math.PI/2, 0, 0] as [number, number, number];
  
  const { flipRotation } = useSpring({
    flipRotation: isFaceUp ? 0 : Math.PI,
    config: { mass: 1, tension: 180, friction: 12 }
  });

  const frontTextureMap = useMemo(() => {
    const texturePath = frontTexture ?? getNextRandomCard();
    return useLoader(TextureLoader, texturePath);
  }, [frontTexture]);

  const backTextureMap = useMemo(() => {
    return useLoader(TextureLoader, backTexture);
  }, [backTexture]);

  return (
    <group position={position}>
      <animated.group
        rotation-x={baseRotation[0] + rotation[0]}
        rotation-y={baseRotation[1] + rotation[1]}
        rotation-z={baseRotation[2] + rotation[2]}
      >
        <Html center transform>
          <div className="whitespace-nowrap text-[10px] text-black">{label}</div>
        </Html>
        {/* Front face */}
        <mesh>
          <planeGeometry args={size} />
          <meshBasicMaterial 
            map={frontTextureMap}
            transparent={true}
            side={THREE.FrontSide}
            wireframe={showWireframe}
            color={showWireframe ? "black" : "white"}
          />
        </mesh>
        {/* Back face */}
        <mesh>
          <planeGeometry args={size} />
          <meshBasicMaterial 
            map={backTextureMap}
            transparent={true}
            side={THREE.BackSide}
            wireframe={showWireframe}
            color={showWireframe ? "black" : "white"}
          />
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

function Board({ position, label, size, rotation = [0, 0, 0], showWireframe }: BoardProps & { showWireframe: boolean }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Main Board with Custom Color */}
      <mesh>
        <planeGeometry args={size} />
        <meshBasicMaterial color={showWireframe ? "black" : "#bbbcbb"} wireframe={showWireframe} />
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

const getRandomCardIndex = (): number => {
  return Math.floor(Math.random() * cardImages.length);  // Returns 0, 1, 2, 3, or 4
}

function GameContent({ onExit, isTestMode, onCameraUpdate, showWireframe }: GameContentProps & { showWireframe: boolean }) {
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

      <Grid size={10} showWireframe={showWireframe} />

      {/* Menu - bottom right, angled 45 degrees inward */}
      <Board 
        position={[4.5, 0.3, 3.5]} 
        label=""
        rotation={[-Math.PI/4, 0, 0]}  // Rotate -45 degrees around X axis
        size={[3, 0.75]}
        showWireframe={showWireframe}
      />

      {/* Actions - bottom left, angled 45 degrees inward */}
      <Board
        position={[-4.5, 0.3, 3.5]} 
        label=""
        rotation={[-Math.PI/4, 0, 0]}  // Rotate -45 degrees around X axis
        size={[3, 0.75]}
        showWireframe={showWireframe}
      />

      {/* Deck - only show the first card if wireframe is on */}
      {Array.from({ length: 100 }).map((_, index) => (
        (!showWireframe || index === 0) && (
          <GameCard 
            key={index}
            frontTexture="/cards/cardback.png"
            backTexture="/cards/cardback.png"
            position={[-3.4, 0.0084 * index, 0]} // Start at y=0 and increment by 0.05 for each card
            label=''
            size={CARD_DIMENSIONS.getScaledDimensions(1)} // Standard size
            showWireframe={showWireframe && index === 0} // Only show wireframe for the first card
          />
        )
      ))}

      {/* Discard - using standard size */}
      <GameCard 
        backTexture="/cards/cardback.png"
        position={[3.4, 0.05, 0]} 
        label=""
        size={CARD_DIMENSIONS.getScaledDimensions(1)} // Standard size
        showWireframe={showWireframe}
      />

      {/* Player 1 Hand x 5 */}
      <GameCard
        backTexture="/cards/cardback.png"
        position={[-1, 0.82, 4]} 
        label=""
        size={CARD_DIMENSIONS.getScaledDimensions(1)} 
        rotation={[Math.PI/2.2, 0, 0.2]}
        showWireframe={showWireframe}
      />
       <GameCard 
        backTexture="/cards/cardback.png"
        position={[-0.5, 0.88, 4]} 
        label=""
        size={CARD_DIMENSIONS.getScaledDimensions(1)} 
        rotation={[Math.PI/2.2, 0, 0.1]}  
        showWireframe={showWireframe}
      />
       <GameCard 
        backTexture="/cards/cardback.png"
        position={[0, 0.9, 4]} 
        label=""
        size={CARD_DIMENSIONS.getScaledDimensions(1)} 
        rotation={[Math.PI/2.2, 0, 0]}  
        showWireframe={showWireframe}
      />
       <GameCard 
        backTexture="/cards/cardback.png"
        position={[0.5, 0.88, 4]} 
        label=""
        size={CARD_DIMENSIONS.getScaledDimensions(1)} 
        rotation={[Math.PI/2.2, 0, -0.1]}  
        showWireframe={showWireframe}
      />
       <GameCard 
        backTexture="/cards/cardback.png"
        size={CARD_DIMENSIONS.getScaledDimensions(1)} 
        position={[1.0, 0.82, 4]} 
        label=""
        rotation={[Math.PI/2.2, 0, -0.2]}  
        showWireframe={showWireframe}
      />

      {/* Player 1 Board */}
      <Board 
        position={[0, 0.05, 1.75]} 
        label=""
        rotation={[-Math.PI/2, 0, 0]}
        size={[12, CARD_DIMENSIONS.getScaledDimensions(1)[1]]} // Custom width and height
        showWireframe={showWireframe}
      />

      {/* Player 2 Board */}
      <Board 
        position={[0, 0.05, -1.75]} 
        label=""
        rotation={[-Math.PI/2, 0, 0]}
        size={[12, CARD_DIMENSIONS.getScaledDimensions(1)[1]]} // Custom width and height
        showWireframe={showWireframe}
      />

      {/* You can also add specific rotations when needed */}
      <GameCard
        backTexture="/cards/cardback.png"
        position={[-1.0, 0.82, -4]} 
        label=""
        size={CARD_DIMENSIONS.getScaledDimensions(1)} 
        rotation={[
          -Math.PI/2.2, // Rotation around the X axis (no rotation)
          0, // Rotation around the Y axis (approximately 72 degrees)
          Math.PI/1.05 // Rotation around the Z axis (no rotation)
        ]} // This will flip it 180 degrees around Y axis
        showWireframe={showWireframe}
      />

      <GameCard 
        backTexture="/cards/cardback.png"
        position={[-0.5, 0.88, -4]} 
        size={CARD_DIMENSIONS.getScaledDimensions(1)} 
        label=""
        rotation={[
          -Math.PI/2.2, // Rotation around the X axis (no rotation)
          0, // Rotation around the Y axis (approximately 72 degrees)
          Math.PI/1.025 // Rotation around the Z axis (no rotation)
        ]} // This will flip it 180 degrees around Y axis
        showWireframe={showWireframe}
      />
      <GameCard
        backTexture="/cards/cardback.png"
        position={[0, 0.9, -4]} 
        size={CARD_DIMENSIONS.getScaledDimensions(1)} 
        label=""
        rotation={[
          -Math.PI/2.2, // Rotation around the X axis (no rotation)
          0, // Rotation around the Y axis (approximately 72 degrees)
          Math.PI/1.0 // Rotation around the Z axis (no rotation)
        ]} // This will flip it 180 degrees around Y axis
        showWireframe={showWireframe}
      />
      <GameCard
        backTexture="/cards/cardback.png"
        position={[0.5, 0.88, -4]} 
        label=""
        size={CARD_DIMENSIONS.getScaledDimensions(1)} 
        rotation={[
          -Math.PI/2.2, // Rotation around the X axis (no rotation)
            0, // Rotation around the Y axis (approximately 72 degrees)
          -Math.PI/1.025 // Rotation around the Z axis (no rotation)
        ]} // This will flip it 180 degrees around Y axis
        showWireframe={showWireframe}
      />
      <GameCard
        backTexture="/cards/cardback.png"
        position={[1.0, 0.82, -4]} 
        label=""
        rotation={[
          -Math.PI/2.2, // Rotation around the X axis (no rotation)
          0, // Rotation around the Y axis (approximately 72 degrees)
          -Math.PI/1.05 // Rotation around the Z axis (no rotation)
        ]} // This will flip it 180 degrees around Y axis
        size={CARD_DIMENSIONS.getScaledDimensions(1)} 
        showWireframe={showWireframe}
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
  const [showWireframe, setShowWireframe] = useState<boolean>(false);

  const toggleWireframe = () => {
    setShowWireframe(prev => !prev);
  };

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
      <div className="absolute right-6 top-4 z-50 flex items-center">
        <button onClick={toggleWireframe} className="mr-4">
          <WireframeIcon 
            className="w-10 h-5" 
            color={showWireframe ? 'black' : 'white'}
          />
        </button>
      </div>
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
        style={{ background: showWireframe ? 'white' : 'transparent' }}
      >
        <GameContent 
          onExit={onExit} 
          isTestMode={isTestMode} 
          onCameraUpdate={handleCameraUpdate}
          showWireframe={showWireframe}
        />
        {showWireframe && <primitive object={new AxesHelper(5)} />}
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
