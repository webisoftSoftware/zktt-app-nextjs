// import { useRef, useState } from 'react'
// import { useFrame } from '@react-three/fiber'
// import { Group, TextureLoader } from 'three'
// import { useLoader } from '@react-three/fiber'

// /**
//  * LoadingScreen Component
//  * Displays a rotating ZKTT logo in 3D space
//  * 
//  * Key features:
//  * - Uses Three.js for 3D rendering
//  * - Loads and displays a texture (logo)
//  * - Implements 3D rotation animation like a globe
//  * 
//  * Implementation details:
//  * - useLoader: Handles async texture loading with error handling
//  * - useState: Maintains reference to the mesh for animation
//  * - useFrame: Executes complex 3D rotation animation
//  * - mesh scale: Adjusted for proper viewport visibility
//  * - rotation: Combines multiple axes for globe-like effect
//  * - material: Uses double-sided rendering for full visibility
//  */
// export function LoadingScreen() {
//   const texture = useLoader(TextureLoader, '/img/zktt_fill_white.png')
//   const groupRef = useRef<Group>(null)
//   const [loadingProgress, setLoadingProgress] = useState(0)

//   // Simulate loading progress
//   useFrame((state, delta) => {
//     if (!groupRef.current) return
    
//     // Smooth rotation like in Examples.tsx Logo component
//     const t = state.clock.getElapsedTime()
//     groupRef.current.rotation.y = Math.sin(t) * (Math.PI / 8)
//     groupRef.current.rotation.x = Math.cos(t) * (Math.PI / 8)
//     groupRef.current.rotation.z -= delta / 4

//     // Update loading progress
//     if (loadingProgress < 100) {
//       setLoadingProgress(prev => Math.min(prev + delta * 35, 100))
//     }
//   })

//   return (
//     <group ref={groupRef}>
//       {/* Logo */}
//       <mesh scale={[1.4, 1.4, 1.4]} position={[0, 0.3, 0]}>
//         <planeGeometry args={[1, 1]} />
//         <meshBasicMaterial 
//           map={texture} 
//           transparent 
//           opacity={1}
//           side={2}
//           depthWrite={false}
//         />
//       </mesh>

//       {/* Loading Bar Background */}
//       <mesh position={[0, -0.5, 0]} scale={[2, 0.1, 1]}>
//         <planeGeometry args={[1, 1]} />
//         <meshBasicMaterial 
//           color="#ffffff" 
//           transparent 
//           opacity={0.2}
//         />
//       </mesh>

//       {/* Loading Bar Progress */}
//       <mesh 
//         position={[-1 + (loadingProgress / 100), -0.5, 0.01]} 
//         scale={[(loadingProgress / 50), 0.1, 1]}
//       >
//         <planeGeometry args={[1, 1]} />
//         <meshBasicMaterial color="#000000" />
//       </mesh>
//     </group>
//   )
// }
