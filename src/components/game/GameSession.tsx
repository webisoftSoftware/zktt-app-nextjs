import { useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import { useWallet } from '@/components/controller/WalletContext'
import { Html } from '@react-three/drei'

interface GameSessionProps {
  onExit: () => void
}

export function GameSession({ onExit }: GameSessionProps) {
  const { isWalletConnected } = useWallet()
  const [playerName, setPlayerName] = useState<string>('')
  
  // Ensure wallet is connected
  useEffect(() => {
    if (!isWalletConnected) {
      onExit()
    }
  }, [isWalletConnected, onExit])

  return (
    <div className="w-full h-full">
      <Canvas
        gl={{ toneMapping: THREE.NoToneMapping }}
        camera={{ position: [0, 0, 6], fov: 40 }}
      >
        {/* Game Board Area */}
        <group position={[0, 0, 0]}>
          <mesh>
            <planeGeometry args={[10, 6]} />
            <meshBasicMaterial color="#1a1a1a" />
          </mesh>
        </group>

        {/* Player Hand Area */}
        <group position={[0, -2, 1]}>
          <Html center>
            <div className="flex gap-4">
              {/* Cards will be rendered here */}
            </div>
          </Html>
        </group>

        {/* Game Controls */}
        <Html
          transform={false}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
          }}
        >
          <div className="flex flex-col gap-4">
            <button
              className="px-4 py-2 bg-white text-black rounded-xl border-2 border-black hover:bg-black/5"
              onClick={onExit}
            >
              Exit Game
            </button>
          </div>
        </Html>
      </Canvas>
    </div>
  )
}
