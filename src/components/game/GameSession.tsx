import { useEffect, useState, useCallback, useRef } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useWallet } from '../controller/WalletContext'
import { useSpring } from '@react-spring/three'
import { CameraStats } from '@/components/ui/CameraStats'
import { AxesHelper } from 'three';
import GameContent from './GameContent';

interface GameSessionProps {
  onExit: () => void;
  isTestMode?: boolean;
}

export function GameSession({ onExit, isTestMode = false }: GameSessionProps) {
  const { isWalletConnected } = useWallet()
  const [cameraData, setCameraData] = useState({
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 }
  });

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
        frameloop="demand"
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
        style={{ background: 'white'}}
      >
        <CameraRig />
        <GameContent 
          onExit={onExit} 
          isTestMode={isTestMode} 
          onCameraUpdate={handleCameraUpdate}
        />
        <primitive object={new AxesHelper(5)} />
      </Canvas>
      
      {isTestMode && <CameraStats cameraData={cameraData} />}
    </div>
  )
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