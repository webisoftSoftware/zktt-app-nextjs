import { useFrame } from "@react-three/fiber"
import { useRef } from "react"
import * as THREE from 'three';

export default function EnvironmentSphere() {
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