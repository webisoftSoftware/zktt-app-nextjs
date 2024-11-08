import { useEffect, useState } from 'react'
import { useThree } from '@react-three/fiber'
import { CardSprite } from './CardSprite'

interface CardSprayManagerProps {
  isActive?: boolean
}

interface Card {
  id: number
  position: [number, number, number]
  scale: number
  velocity: [number, number, number]
  timestamp: number
}

export function CardSprayManager({ isActive = false }: CardSprayManagerProps) {
  const [cards, setCards] = useState<Card[]>([])
  const { mouse, viewport } = useThree()
  let nextId = 0

  useEffect(() => {
    if (!isActive) return; // Don't spawn cards if not active

    const spawnInterval = setInterval(() => {
      // Convert mouse position to world coordinates
      const x = (mouse.x * viewport.width) / 2
      const y = (mouse.y * viewport.height) / 2

      // Adjust scale to maintain proper card aspect ratio (752:1052)
      const baseScale = (Math.random() * 3.5 + 3.5) / 10
      const scaleX = baseScale * 0.752 // Width
      const scaleY = baseScale * 1.052 // Height

      // Random velocity
      const velocity: [number, number, number] = [
        (Math.random() - 0.5) * 5,
        Math.random() * 5,
        0
      ]

      const newCard: Card = {
        id: nextId++,
        position: [x, y, 0],
        scale: baseScale, // We'll use this as a base scale in CardSprite
        velocity,
        timestamp: Date.now()
      }

      setCards(prev => [...prev, newCard])
    }, 700)

    return () => clearInterval(spawnInterval)
  }, [mouse, viewport, isActive])

  // Cleanup old cards
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      const now = Date.now()
      setCards(prev => prev.filter(card => now - card.timestamp < 7000))
    }, 1000)

    return () => clearInterval(cleanupInterval)
  }, [])

  return (
    <>
      {cards.map(card => (
        <CardSprite
          key={card.id}
          position={card.position}
          scale={card.scale}
          velocity={card.velocity}
        />
      ))}
    </>
  )
} 