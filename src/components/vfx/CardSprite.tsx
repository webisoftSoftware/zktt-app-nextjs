import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useLoader } from '@react-three/fiber'

interface CardSpriteProps {
  position: [number, number, number]
  scale: number
  velocity: [number, number, number]
}

export const cardImages = [
  // ETH cards
  '/cards/asset_1eth.png',
  '/cards/asset_2eth.png',
  '/cards/asset_3eth.png',
  '/cards/asset_4eth.png',
  '/cards/asset_5eth.png',
  '/cards/asset_10eth.png',

  // Blockchain cards
  '/cards/blockchain_blue_cosmos.png',
  '/cards/blockchain_blue_ton.png',
  '/cards/blockchain_darkblue_ethereum.png',
  '/cards/blockchain_darkblue_starknet.png',
  '/cards/blockchain_lightblue_arbitrum.png',
  '/cards/blockchain_lightblue_base.png',
  '/cards/blockchain_lightblue_fantom.png',
  '/cards/blockchain_lightblue_metis.png',
  '/cards/blockchain_gold_bitcoin.png',
  '/cards/blockchain_gold_dogecoin.png',
  '/cards/blockchain_green_canto.png',
  '/cards/blockchain_green_gnosis.png',
  '/cards/blockchain_green_near.png',
  '/cards/blockchain_grey_aptos.png',
  '/cards/blockchain_grey_linea.png',
  '/cards/blockchain_grey_zksync.png',
  '/cards/blockchain_pink_osmosis.png',
  '/cards/blockchain_pink_polkadot.png',
  '/cards/blockchain_pink_taiko.png',
  '/cards/blockchain_purple_celestia.png',
  '/cards/blockchain_purple_polygon.png',
  '/cards/blockchain_purple_solana.png',
  '/cards/blockchain_red_avalanche.png',
  '/cards/blockchain_red_kava.png',
  '/cards/blockchain_red_optimism.png',
  '/cards/blockchain_yellow_blast.png',
  '/cards/blockchain_yellow_celo.png',
  '/cards/blockchain_yellow_scroll.png',

  // Event cards
  '/cards/event_51atk.png',
  '/cards/event_chainreorg.png',
  '/cards/event_claimyield.png',
  '/cards/event_frontrun.png',
  '/cards/event_priorityfee.png',
  '/cards/event_replayatk.png',
  '/cards/event_sandwichatk.png',

  // Gas fee event cards
  '/cards/event_gasfee_blue_gold.png',
  '/cards/event_gasfee_darkblue_red.png',
  '/cards/event_gasfee_green_lightblue.png',
  '/cards/event_gasfee_grey_pink.png',
  '/cards/event_gasfee_multichain.png',
  '/cards/event_gasfee_yellow_purple.png',
]

export function CardSprite({ position, scale, velocity }: CardSpriteProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const selectedImageRef = useRef(cardImages[Math.floor(Math.random() * cardImages.length)])
  const frontTexture = useLoader(THREE.TextureLoader, selectedImageRef.current || '')
  const backTexture = useLoader(THREE.TextureLoader, '/cards/cardback.png')
  const velocityRef = useRef<[number, number, number]>(velocity)
  const startTime = useRef(Date.now())
  const returnPhase = useRef(false)
  
  const rotationVelocity = useRef({
    x: (Math.random() - 0.5) * 2,
    y: (Math.random() - 0.5) * 2,
    z: (Math.random() - 0.5) * 2
  })

  const returnStartTime = useRef(1.5 + Math.random() * 0.9) // Random start between 1.5-2.4s
  const finalPhaseTime = useRef(4.2) // Final destination time

  useFrame((_, delta) => {
    if (!meshRef.current) return

    const elapsedTime = (Date.now() - startTime.current) / 1000

    // Initial explosion phase
    if (elapsedTime <= returnStartTime.current) {
      // Keep original explosion physics
      const elapsedTime = (Date.now() - startTime.current) / 1000

      if (elapsedTime > 3 && !returnPhase.current) {
        // Initiate return phase
        returnPhase.current = true
        
        // Reset velocity for upward movement
        velocityRef.current = [
          (Math.random() - 0.42) * 2, // Random X spread
          15 + Math.random() * 5,     // Strong upward velocity
          (Math.random() - 0.49) * 2   // Random Z spread
        ]
      }

      if (returnPhase.current) {
        // Spiral return behavior
        const targetPos = [-3.4, 0, 0]
        const dirX = targetPos[0] - meshRef.current.position.x
        const dirY = targetPos[1] - meshRef.current.position.y
        const dirZ = targetPos[2] - meshRef.current.position.z
        
        // Apply spiral force
        const spiralRadius = Math.max(0, (elapsedTime - 3) * 0.5)
        velocityRef.current[0] += dirX * delta * 2
        velocityRef.current[1] += dirY * delta * 2
        velocityRef.current[2] += dirZ * delta * 2
        
        // Add spiral motion
        meshRef.current.position.x += Math.cos(elapsedTime * 5) * spiralRadius * delta
        meshRef.current.position.z += Math.sin(elapsedTime * 5) * spiralRadius * delta
      }

      // Apply gravity (reduced during return phase)
      velocityRef.current[1] -= returnPhase.current ? 9.8 * delta * 0.5 : 3.2 * delta

      // Update position
      meshRef.current.position.x += velocityRef.current[0] * delta
      meshRef.current.position.y += velocityRef.current[1] * delta
      meshRef.current.position.z += velocityRef.current[2] * delta

      // Calculate bounds based on aspect ratio (960x540)
      const aspectRatio = 960/540
      const boundsY = 8
      const boundsX = boundsY * aspectRatio
      const boundsZ = 10

      // Bounce off screen edges with more energy preservation
      if (Math.abs(meshRef.current.position.x) > boundsX) {
        velocityRef.current[0] *= -0.85
        meshRef.current.position.x = Math.sign(meshRef.current.position.x) * boundsX
        rotationVelocity.current.y *= -1 // Reverse Y rotation on X bounce
      }
      if (Math.abs(meshRef.current.position.y) > boundsY) {
        velocityRef.current[1] *= -0.85
        meshRef.current.position.y = Math.sign(meshRef.current.position.y) * boundsY
        rotationVelocity.current.x *= -1 // Reverse X rotation on Y bounce
      }
      if (Math.abs(meshRef.current.position.z) > boundsZ) {
        velocityRef.current[2] *= -0.85
        meshRef.current.position.z = Math.sign(meshRef.current.position.z) * boundsZ
        rotationVelocity.current.z *= -1 // Reverse Z rotation on Z bounce
      }
    }
    
    // Return phase
    else if (elapsedTime > returnStartTime.current && elapsedTime <= finalPhaseTime.current) {
      // Smooth upward transition
      const transitionProgress = (elapsedTime - returnStartTime.current) / 
                                (finalPhaseTime.current - returnStartTime.current)
      const upwardForce = Math.sin(transitionProgress * Math.PI) * 8

      velocityRef.current[1] = upwardForce
      velocityRef.current[0] += (Math.random() - 0.5) * delta * 2
      velocityRef.current[2] += (Math.random() - 0.5) * delta * 2
    }
    
    // Final spiral phase
    else {
      const targetPos = [-3.4, 0, 0]
      const finalRotation = [Math.PI/1, 0, 0]
      
      // Smooth position transition
      meshRef.current.position.x += (targetPos[0] - meshRef.current.position.x) * delta * 4
      meshRef.current.position.y += (targetPos[1] - meshRef.current.position.y) * delta * 4
      meshRef.current.position.z += (targetPos[2] - meshRef.current.position.z) * delta * 4
      
      // Smooth rotation transition to lay flat
      meshRef.current.rotation.x += (finalRotation[0] - meshRef.current.rotation.x) * delta * 4
      meshRef.current.rotation.y += (finalRotation[1] - meshRef.current.rotation.y) * delta * 4
      meshRef.current.rotation.z += (finalRotation[2] - meshRef.current.rotation.z) * delta * 4
    }

    // Always apply rotation
    meshRef.current.rotation.x += rotationVelocity.current.x * delta
    meshRef.current.rotation.y += rotationVelocity.current.y * delta
    meshRef.current.rotation.z += rotationVelocity.current.z * delta
  })

  return (
    <group ref={meshRef} position={position}>
      {/* Front face */}
      <mesh>
        <planeGeometry args={[scale * 0.752, scale * 1.052]} />
        <meshBasicMaterial 
          map={frontTexture} 
          transparent={true}
          opacity={1}
          side={THREE.FrontSide}
        />
      </mesh>
      {/* Back face */}
      <mesh rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[scale * 0.752, scale * 1.052]} />
        <meshBasicMaterial 
          map={backTexture} 
          transparent={true}
          opacity={1}
          side={THREE.FrontSide}
        />
      </mesh>
    </group>
  )
}
