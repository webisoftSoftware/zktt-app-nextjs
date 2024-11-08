'use client'

import { useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { Dashboard } from './Dashboard'
import { CardSprayManager } from '../vfx/CardSprayManager'

export default function GameCanvas() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDashboardView, setIsDashboardView] = useState(true)
  // TODO: move and condense this dashboard view to other components?

  return (
    <div className="flex min-h-screen justify-center items-center p-8">
      <div 
        ref={containerRef}
        className="relative w-[1280px] h-[720px] rounded-2xl overflow-hidden"
        style={{
          maxWidth: '100%',
          aspectRatio: '16/9',
          background: 'rgba(255, 255, 255, 1)',
          border: '5px solid white',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Canvas
          gl={{ toneMapping: THREE.AgXToneMapping }}
          camera={{ position: [0, 0, 6], fov: 40 }}
        >
          {/* Lighting */}
          <ambientLight />
          <pointLight position={[20, 30, 10]} intensity={3} decay={0.2} />
          <pointLight position={[-10, -10, -10]} color="blue" decay={0.2} />
          
          {/* Main Content */}
          <CardSprayManager isActive={isDashboardView} />
          <Dashboard />
          
          {/* Optional Controls */}
          <OrbitControls enableZoom={false} />
        </Canvas>
      </div>
    </div>
  )
}
