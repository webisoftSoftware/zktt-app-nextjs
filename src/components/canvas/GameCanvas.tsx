'use client'

import { useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import { Dashboard } from './Dashboard'
import { GameSession } from '@/components/game/GameSession'
import { CardSprayManager } from '../vfx/CardSprayManager'
import { Volume } from '@/components/sfx/Volume'
import { useWallet } from '@/components/controller/WalletContext'
import { useContractController } from '@/helpers/executeHelper'

export default function GameCanvas() {
  // Reference to the container div for sizing and positioning
  const containerRef = useRef<HTMLDivElement>(null)
  
  // State to toggle between dashboard and game views
  const [isDashboardView, setIsDashboardView] = useState(true)
  
  // Get wallet connection status from context
  const { isWalletConnected } = useWallet()

  return (
    // Main container with centered content
    <div className="flex min-h-screen justify-center items-center">
      {/* Game viewport container */}
      <div 
        ref={containerRef}
        className="relative rounded-2xl overflow-hidden"
        style={{
          width: '1280px',  // Fixed width for consistent layout
          height: '720px',  // 16:9 aspect ratio
          background: 'rgba(255, 255, 255, 1)',
          border: '5px solid white',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}
      >

        {/* Conditional rendering based on current view */}
        {isDashboardView ? (
          // Dashboard view with Three.js canvas
          <Canvas
            gl={{ toneMapping: THREE.NoToneMapping }}  // Disable tone mapping for consistent colors
            camera={{ position: [0, 0, 6], fov: 40 }}  // Set up camera perspective
          >
            <Volume /> 
            <CardSprayManager isActive={isDashboardView} />
            <Dashboard 
              isWalletConnected={isWalletConnected}
              setGameView={setIsDashboardView}
            />
          </Canvas>
        ) : (
          // Game session view when dashboard is exited
          <GameSession onExit={() => setIsDashboardView(true)} />
        )}
      </div>
    </div>
  )
}
