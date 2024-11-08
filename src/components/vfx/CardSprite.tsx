import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useLoader } from '@react-three/fiber'

interface CardSpriteProps {
  position: [number, number, number]
  scale: number
  velocity: [number, number, number]
}

const cardImages = [
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
  const texture = useLoader(THREE.TextureLoader, cardImages[Math.floor(Math.random() * cardImages.length)])
  const velocityRef = useRef<[number, number, number]>(velocity)

  useFrame((_, delta) => {
    if (!meshRef.current) return

    // Apply gravity
    velocityRef.current[1] -= 9.8 * delta

    // Update position
    meshRef.current.position.x += velocityRef.current[0] * delta
    meshRef.current.position.y += velocityRef.current[1] * delta
    meshRef.current.position.z += velocityRef.current[2] * delta

    // Bounce off screen edges
    const bounds = 5
    if (Math.abs(meshRef.current.position.x) > bounds) {
      velocityRef.current[0] *= -0.8
    }
    if (meshRef.current.position.y < -bounds) {
      velocityRef.current[1] *= -0.8
      meshRef.current.position.y = -bounds
    }

    // Add rotation
    meshRef.current.rotation.z += delta
  })

  return (
    <mesh ref={meshRef} position={position}>
      <planeGeometry args={[scale * 0.752, scale * 1.052, 1]} />
      <meshBasicMaterial 
        map={texture} 
        transparent={true}
        opacity={1} 
      />
    </mesh>
  )
}
