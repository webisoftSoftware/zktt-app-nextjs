import { useEffect, useState, useCallback, useMemo, useRef } from 'react'
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
import { useFrame } from '@react-three/fiber'

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

          float createDiamond(vec2 p, float size) {
            vec2 q = abs(p);
            return step(q.x + q.y, size);
          }
          
          void main() {
            // Base beige colors
            vec3 darkBeige = vec3(0.86, 0.84, 0.78);
            vec3 lightBeige = vec3(0.94, 0.92, 0.86);
            
            // Base gradient
            vec3 baseColor = mix(darkBeige, lightBeige, vUv.y);
            
            // Diamond grid pattern - increased density by multiplying vUv by 24.0 instead of 12.0
            vec2 gridUv = fract(vUv * 24.0) * 2.0 - 1.0;
            float diamond = createDiamond(gridUv, 0.8);
            
            // Add more prominent diamond pattern - increased opacity from 0.08 to 0.16
            float diamondOpacity = 0.16;
            vec3 finalColor = mix(baseColor, vec3(0.0), diamond * diamondOpacity);
            
            gl_FragColor = vec4(finalColor, 1.0);
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

export function GameCard({
  frontTexture,
  backTexture = '/cards/cardback.png',
  position, 
  label, 
  rotation = [0, 0, 0], 
  size = CARD_DIMENSIONS.getScaledDimensions(0.75),
  isFaceUp = true,
  isInHand = false,
  showWireframe,
  disableHover = false
}: GameCardProps & { showWireframe: boolean, disableHover?: boolean }) {
  
  const [hovered, setHovered] = useState(false);
  const baseRotation = [-Math.PI/2, 0, 0] as [number, number, number];
  
  // Enhanced hover animation with curved lift
  const [x, y, z] = position;
  const liftHeight = 0.5;
  const forwardPush = 0.5;
  
  // Quadratic curve calculation
  const t = hovered && !disableHover ? 2 : 0;
  const verticalOffset = liftHeight * Math.sin(t * Math.PI/2); // Smooth easing
  const forwardOffset = hovered && !disableHover ? (z > 0 ? forwardPush : -forwardPush) : 0;
  const curveOffset = hovered && !disableHover ? Math.sin(t * Math.PI) * 0.3 : 0; // Adds arc to movement

  const adjustedPosition: [number, number, number] = [
    x + (curveOffset * (z > 0 ? -1 : 1)), // Slight curve inward
    y + verticalOffset,
    z + forwardOffset
  ];

  // Add a subtle tilt when hovering
  const hoverRotation = hovered && !disableHover ? Math.sin(t * Math.PI/2) * 0.15 : 0;
  const finalRotation: [number, number, number] = [
    baseRotation[0] + rotation[0],
    baseRotation[1] + rotation[1] + hoverRotation,
    baseRotation[2] + rotation[2]
  ];

  const frontTextureMap = useMemo(() => {
    const texturePath = frontTexture ?? getNextRandomCard();
    return useLoader(TextureLoader, texturePath);
  }, [frontTexture]);

  const backTextureMap = useMemo(() => {
    return useLoader(TextureLoader, backTexture);
  }, [backTexture]);

  return (
    <group 
      position={adjustedPosition}
      onPointerOver={(e) => {
        e.stopPropagation(); // Prevent event bubbling
        if (!disableHover) setHovered(true);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        if (!disableHover) setHovered(false);
      }}
    >
      <animated.group rotation={finalRotation}>
        {/* Add invisible blocker plane slightly behind card */}
        <mesh position={[0, 0, -0.01]}>
          <planeGeometry args={[size[0] + 0.05, size[1] + 0.1]} /> {/* Slightly larger than card */}
          <meshBasicMaterial visible={false} />
        </mesh>
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
        minDistance={1}
        maxDistance={17.0}
        makeDefault
      />

      <Grid size={14} showWireframe={showWireframe} />
      <EnvironmentSphere />

      {/* Menu - bottom right, angled 45 degrees inward */}
       {/* Menu - bottom right, angled 45 degrees inward */}
       <Board 
        position={[4.5, 0.3, 3.5]} 
        label=""
        rotation={[-Math.PI/4, 0, 0]}  // Rotate -45 degrees around X axis
        size={[3, 0.75]}
        showWireframe={showWireframe}
      />
      <BoardOverlay
        position={[4.5, 0.301, 3.5]}
        rotation={[-Math.PI/4, 0, 0]}
        size={[3, 0.75]}
      />

      {/* Actions - bottom left, angled 45 degrees inward */}
      <Board
        position={[-4.5, 0.3, 3.5]} 
        label=""
        rotation={[-Math.PI/4, 0, 0]}  // Rotate -45 degrees around X axis
        size={[3, 0.75]}
        showWireframe={showWireframe}
      />
      <BoardOverlay
        position={[-4.5, 0.301, 3.5]}
        rotation={[-Math.PI/4, 0, 0]}
        size={[3, 0.75]}
      />

      {/* Deck - only show the first card if wireframe is on */}
      {Array.from({ length: 70 }).map((_, index) => (
        (!showWireframe || index === 0) && (
          <GameCard 
            key={index}
            frontTexture="/cards/cardback.png"
            backTexture="/cards/cardback.png"
            position={[-3.4, 0.0084 * index, 0]} // Start at y=0 and increment by 0.05 for each card
            label=''
            size={CARD_DIMENSIONS.getScaledDimensions(1)} // Standard size
            showWireframe={showWireframe && index === 0} // Only show wireframe for the first card
            disableHover={true} // Disable hover effect for Deck Cards
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
        disableHover={true} // Disable hover effect for Discard
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
        size={[12, CARD_DIMENSIONS.getScaledDimensions(1)[1]]}
        showWireframe={showWireframe}
      />
      <BoardOverlay
        position={[0, 0.05, 1.75]}
        rotation={[-Math.PI/2, 0, 0]}
        size={[12, CARD_DIMENSIONS.getScaledDimensions(1)[1]]}
      />

      {/* Player 2 Board */}
      <Board 
        position={[0, 0.05, -1.75]} 
        label=""
        rotation={[-Math.PI/2, 0, 0]}
        size={[12, CARD_DIMENSIONS.getScaledDimensions(1)[1]]}
        showWireframe={showWireframe}
      />
      <BoardOverlay
        position={[0, 0.05, -1.75]}
        rotation={[-Math.PI/2, 0, 0]}
        size={[12, CARD_DIMENSIONS.getScaledDimensions(1)[1]]}
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
      <div className="absolute bottom-0 right-0 z-50 flex items-center px-6 py-3">
        <button onClick={toggleWireframe} className="mr-4">
          <WireframeIcon 
            className="h-5 w-10" 
            color="black"
          />
        </button>
      </div>
      <Canvas
        gl={{ 
          toneMapping: THREE.NoToneMapping,
          antialias: true
        }}
        camera={{ 
          position: [0.00, 3.18, 11.33],
          rotation: [-15.70 * (Math.PI / 180), 0.00, 0.00],
          fov: 45,
          near: 0.1,
          far: 700
        }}
        style={{ background: showWireframe ? 'white' : 'transparent' }}
      >
        <CameraRig />
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

function CameraRig() {
  const { camera } = useThree()
  
  useSpring({
    from: {
      cx: 0.00,
      cy: 3.18,
      cz: 11.33,
      rx: -15.70 * (Math.PI / 180),
      ry: 0,
      rz: 0
    },
    to: {
      cx: -0.01,
      cy: 3.51,
      cz: 6.97,
      rx: -26.69 * (Math.PI / 180),
      ry: -0.06 * (Math.PI / 180),
      rz: -0.03 * (Math.PI / 180)
    },
    config: {
      mass: 1,
      tension: 80,
      friction: 30
    },
    onChange: ({ value }) => {
      camera.position.set(value.cx, value.cy, value.cz)
      camera.rotation.set(value.rx, value.ry, value.rz)
      camera.updateProjectionMatrix()
    }
  })

  return null
}

interface BoardOverlayProps {
  size: [number, number];
  position: [number, number, number];
  rotation?: [number, number, number];
}

const OVERLAY_SCALE = 1.2; // 120% scale

function getScaledOverlaySize(originalSize: [number, number]): [number, number] {
  return [originalSize[0] * OVERLAY_SCALE, originalSize[1] * OVERLAY_SCALE];
}

function BoardOverlay({ size, position, rotation = [0, 0, 0] }: BoardOverlayProps) {
  const [width, height] = size;
  
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[width * 1.1, height * 1.1]} /> {/* Increased geometry size for border overflow */}
        <shaderMaterial
          transparent
          uniforms={{
            borderWidth: { value: 0.08 },    // Increased border width
            featherWidth: { value: 0.15 },   // Adjusted feather width for smoother transition
            glowStrength: { value: 0.5 },    // Added glow strength
            glowRadius: { value: 0.2 },      // Added glow radius
            opacity: { value: 0.8 },         // Adjusted opacity
          }}
          vertexShader={`
            varying vec2 vUv;
            void main() {
              vUv = uv;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={`
            uniform float borderWidth;
            uniform float featherWidth;
            uniform float glowStrength;
            uniform float glowRadius;
            uniform float opacity;
            varying vec2 vUv;
            
            float smoothBorder(float dist, float width, float feather) {
              float innerEdge = width;
              float outerEdge = width + feather;
              return 1.0 - smoothstep(innerEdge, outerEdge, dist);
            }
            
            void main() {
              // Normalize UV coordinates to center (range -0.5 to 0.5)
              vec2 centeredUv = vUv - 0.5;
              
              // Calculate distance from edges
              float distFromEdgeX = abs(centeredUv.x);
              float distFromEdgeY = abs(centeredUv.y);
              
              // Get the maximum distance to create a rounded rectangle
              float distFromEdge = max(distFromEdgeX, distFromEdgeY);
              
              // Create smooth border with glow
              float border = smoothBorder(distFromEdge, borderWidth, featherWidth);
              float glow = smoothBorder(distFromEdge, borderWidth + glowRadius, featherWidth) * glowStrength;
              
              // Combine border and glow
              float finalMask = max(border, glow);
              
              // Create gradient from center to edge for the border
              vec3 borderColor = mix(vec3(1.0), vec3(0.9), distFromEdge * 2.0);
              
              // Output final color with transparency
              gl_FragColor = vec4(borderColor, finalMask * opacity);
            }
          `}
        />
      </mesh>
    </group>
  );
}

function EnvironmentSphere() {
  const sphereRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (!sphereRef.current) return
    const time = state.clock.getElapsedTime()
    sphereRef.current.rotation.x = Math.sin(time * 0.1) * 0.05
    sphereRef.current.rotation.y = Math.cos(time * 0.15) * 0.05
  })

  return (
    <mesh ref={sphereRef} position={[0, 0, 0]}>
      <sphereGeometry args={[12.5, 32, 32]} /> {/* Increased from 10 to 12.5 (25% larger) */}
      <meshBasicMaterial
        transparent
        opacity={0.5} // Decreased transparency by 50%
        side={THREE.BackSide}
      />
    </mesh>
  )
}
