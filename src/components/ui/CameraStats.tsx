import { useThree, useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { useState, useCallback } from 'react'

interface CameraData {
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
}

export function CameraStats({ cameraData }: { cameraData: CameraData }) {
  return (
    <div className="absolute top-4 left-4 text-xs font-mono bg-black/50 text-white p-2 rounded">
      <div>
        pos: [{cameraData.position.x.toFixed(2)}, {cameraData.position.y.toFixed(2)}, {cameraData.position.z.toFixed(2)}]
      </div>
      <div>
        rot: [{cameraData.rotation.x.toFixed(2)}°, {cameraData.rotation.y.toFixed(2)}°, {cameraData.rotation.z.toFixed(2)}°]
      </div>
    </div>
  )
}

// Create a separate component for the bridge that will be used inside Canvas
export function CameraStatsBridgeInCanvas({ onCameraUpdate }: { onCameraUpdate: (position: any, rotation: any) => void }) {
  const { camera } = useThree()

  useFrame(() => {
    onCameraUpdate(
      {
        x: camera.position.x,
        y: camera.position.y,
        z: camera.position.z
      },
      {
        x: camera.rotation.x * 180/Math.PI,
        y: camera.rotation.y * 180/Math.PI,
        z: camera.rotation.z * 180/Math.PI
      }
    )
  })

  return null
}
