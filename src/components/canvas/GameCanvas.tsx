'use client'

import { useRef, useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import { Dashboard } from './Dashboard'
import { GameSession } from '../game/GameSession'
import { CardSprayManager } from '../vfx/CardSprayManager'
import { useWallet } from '../controller/WalletContext'
import { useContractController } from '../../helpers/executeHelper'
import { OrbitControls } from '@react-three/drei'

export default function GameCanvas() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDashboardView, setIsDashboardView] = useState(true)
  const [isTestMode, setIsTestMode] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const { isWalletConnected } = useWallet()

  const handleViewChange = async (isGameView: boolean, testMode: boolean = false) => {
    if (isGameView) {
      setIsTestMode(testMode)
      await new Promise(resolve => setTimeout(resolve, 7000))
      setIsDashboardView(false)
    } else {
      setIsDashboardView(true)
      setIsTestMode(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div 
        ref={containerRef}
        className={`relative overflow-hidden rounded-2xl`}
        style={{
          width: '960px',
          height: '540px',
          border: isDashboardView ? '5px solid black' : '5px solid black',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}
      >
        {isDashboardView ? (
          <Canvas
            gl={{ toneMapping: THREE.NoToneMapping }}
            camera={{ position: [0, 0, 6], fov: 40 }}
            style={{ background: 'white' }}
          >
            <OrbitControls
              minDistance={6}
              maxDistance={6}
              enablePan={false}
              enableZoom={false}
              enableRotate={false}
              makeDefault
            />
            <Dashboard 
              isWalletConnected={isWalletConnected}
              setGameView={handleViewChange}
            />
          </Canvas>
        ) : (
          <GameSession 
            onExit={() => handleViewChange(false)} 
            isTestMode={isTestMode}
          />
        )}
      </div>
    </div>
  )
}
