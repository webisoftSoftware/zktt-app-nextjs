'use client'

import { useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import { Dashboard } from './Dashboard'
import { CardSprayManager } from '../vfx/CardSprayManager'
import { Volume } from '@/components/sfx/Volume'
import { useWallet } from '@/context/WalletContext'

export default function GameCanvas() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDashboardView, setIsDashboardView] = useState(true)
  const { isWalletConnected } = useWallet()

  return (
    <div className="flex min-h-screen justify-center items-center">
      <div 
        ref={containerRef}
        className="relative rounded-2xl overflow-hidden"
        style={{
          width: '1280px',
          height: '720px',
          background: 'rgba(255, 255, 255, 1)',
          border: '5px solid white',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Canvas
          gl={{ toneMapping: THREE.NoToneMapping }}
          camera={{ position: [0, 0, 6], fov: 40 }}
        >
          <Volume />
          <CardSprayManager isActive={isDashboardView} />
          <Dashboard isWalletConnected={isWalletConnected} />
        </Canvas>
      </div>
    </div>
  )
}
