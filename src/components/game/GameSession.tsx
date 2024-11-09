import { useEffect, useState } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useWallet } from '@/components/controller/WalletContext'
import { Html } from '@react-three/drei'

interface GameSessionProps {
  onExit: () => void;
  isTestMode?: boolean;
}

// New component for game content
function GameContent({ onExit, isTestMode }: GameSessionProps) {
  const { viewport } = useThree()

  return (
    <>
      <group position={[2.75, -1.65, 0]}>
        <Html center>
          <div className="text-black">menu</div>
        </Html>
        <mesh>
          <planeGeometry args={[2, 0.75]} />
          <meshBasicMaterial 
            color="#000000"
            wireframe={true}
          />
        </mesh>
      </group>

      <group position={[-3.4, 0, 0]}>
        <Html center>
          <div className="text-black">deck</div>
        </Html>
        <mesh>
          <planeGeometry args={[0.75, 1.25]} />
          <meshBasicMaterial 
            color="#000000"
            wireframe={true}
          />
        </mesh>
      </group>

      <group position={[3.4, 0, 0]}>
        <Html center>
          <div className="text-black">discard</div>
        </Html>
        <mesh>
          <planeGeometry args={[0.75, 1.25]} />
          <meshBasicMaterial 
            color="#000000"
            wireframe={true}
          />
        </mesh>
      </group>

      <group position={[0, -2, 0]}>
        <Html center>
          <div className="text-black">p1.hand</div>
        </Html>
        <mesh>
          <planeGeometry args={[0.75, 1.25]} />
          <meshBasicMaterial 
            color="#000000"
            wireframe={true}
          />
        </mesh>
      </group>

      <group position={[0, -0.75, 0]}>
        <Html center>
          <div className="text-black">p1.board</div>
        </Html>
        <mesh>
          <planeGeometry args={[3.25, 0.75]} />
          <meshBasicMaterial 
            color="#000000"
            wireframe={true}
          />
        </mesh>
      </group>

      <group position={[0, 2, 0]}>
        <Html center>
          <div className="text-black">p2.hand</div>
        </Html>
        <mesh>
          <planeGeometry args={[0.75, 1.25]} />
          <meshBasicMaterial 
            color="#000000"
            wireframe={true}
          />
        </mesh>
      </group>

      <group position={[0, 1.25, 0]}>
        <Html center>
          <div className="text-black">p2.board</div>
        </Html>
        <mesh>
          <planeGeometry args={[3.25, 0.75]} />
          <meshBasicMaterial 
            color="#000000"
            wireframe={true}
          />
        </mesh>
      </group>

      <group position={[-2.75, -1.65, 0]}>
        <Html center>
          <div className="text-black">actions</div>
        </Html>
        <mesh>
          <planeGeometry args={[2, 0.75]} />
          <meshBasicMaterial 
            color="#000000" 
            wireframe={true}
          />
        </mesh>
      </group>

      {isTestMode && (
        <Html
          transform={false}
          style={{
            position: 'relative',
            top: '-255px',
            right: '-400px',
            margin: '0 auto',
            justifyContent: 'center',
          }}
        >
        </Html>
      )}
    </>
  )
}

// Main component
export function GameSession({ onExit, isTestMode = false }: GameSessionProps) {
  const { isWalletConnected } = useWallet()
  const [playerName, setPlayerName] = useState<string>('')
  
  useEffect(() => {
    if (!isTestMode && !isWalletConnected) {
      onExit()
    }
  }, [isWalletConnected, onExit, isTestMode])

  return (
    <div className="w-full h-full">
      <Canvas
        gl={{ toneMapping: THREE.NoToneMapping }}
        camera={{ position: [0, 0, 6], fov: 40 }}
      >
        <GameContent onExit={onExit} isTestMode={isTestMode} />
      </Canvas>
    </div>
  )
}
