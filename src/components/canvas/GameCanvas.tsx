'use client'

import { useRef, useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import { Dashboard } from './Dashboard'
import { GameSession } from '../game/GameSession'
import { CardSprayManager } from '../vfx/CardSprayManager'
import { Volume } from '../sfx/Volume'
import { useWallet } from '../controller/WalletContext'
import { useContractController } from '../../helpers/executeHelper'
import ShaderBackground from './ShaderBackground'

export default function GameCanvas() {
  // Reference to the container div for sizing and positioning
  const containerRef = useRef<HTMLDivElement>(null)
  
  // State to toggle between dashboard and game views
  const [isDashboardView, setIsDashboardView] = useState(true)
  
  // State to toggle between test mode and normal mode
  const [isTestMode, setIsTestMode] = useState(false)
  
  // Get wallet connection status from context
  const { isWalletConnected } = useWallet()

  // TEMPORARY DEV HELPER - REMOVE BEFORE PRODUCTION
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsDashboardView(true)
      setIsTestMode(false)
    }, 1)
    return () => clearTimeout(timer)
  }, [])

  const handleViewChange = (isGameView: boolean, testMode: boolean = false) => {
    setIsTestMode(testMode)
    setIsDashboardView(!isGameView)
  }

  return (
    // Main container with centered content
    <div className="flex min-h-screen items-center justify-center">
      {/* Game viewport container */}
      <div 
        ref={containerRef}
        className="relative overflow-hidden rounded-2xl"
        style={{
          width: '960px',  // Fixed width for consistent layout
          height: '540px',  // 16:9 aspect ratio
          //background: isDashboardView ? 'rgba(255, 255, 255, 1)' : (isTestMode ? '#ffffff' : '#ffffff'),
          border: isDashboardView ? '5px solid white' : '5px solid rgba(255, 255, 255, 1)',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}
      >
        {isDashboardView && <ShaderBackground />}
        {/* Add Volume control outside of conditional rendering */}
        <div className="absolute right-4 top-4 z-50">
          <Volume />
        </div>

        {/* Conditional rendering based on current view */}
        {isDashboardView ? (
          // Dashboard view with Three.js canvas
          <Canvas
            gl={{ toneMapping: THREE.NoToneMapping }}  // Disable tone mapping for consistent colors
            camera={{ position: [0, 0, 6], fov: 40 }}  // Set up camera perspective
          >
            <Volume /> 
            {/*<CardSprayManager isActive={isDashboardView} />*/}
            <Dashboard 
              isWalletConnected={isWalletConnected}
              setGameView={handleViewChange}
            />
          </Canvas>
        ) : (
          // Game session view when dashboard is exited
          <GameSession 
            onExit={() => handleViewChange(false)} 
            isTestMode={isTestMode}
          />
        )}
      </div>
    </div>
  )
}
