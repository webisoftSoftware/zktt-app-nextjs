import { useEffect, useState } from 'react'
import { useThree } from '@react-three/fiber'
import { CardSprite } from './CardSprite'

interface CardSprayManagerProps {
  isActive?: boolean
  triggerSpray?: boolean
  position?: [number, number, number]
}

interface Card {
  id: number
  position: [number, number, number]
  scale: number
  velocity: [number, number, number]
  timestamp: number
}

export function CardSprayManager({ 
  isActive = false, 
  triggerSpray = false,
  position = [0, 0, 0]
}: CardSprayManagerProps) {
  const [cards, setCards] = useState<Card[]>([])
  const { viewport } = useThree()
  let nextId = 0

  useEffect(() => {
    if (!isActive || !triggerSpray) return;

    // Doubled from 350 to 700 cards
    const newCards = Array.from({ length: 700 }).map(() => {
      const angleXY = Math.random() * Math.PI * 2
      const angleZ = (Math.random() * Math.PI) - Math.PI/2
      const speed = 8 + Math.random() * 12

      const velocity: [number, number, number] = [
        Math.cos(angleXY) * Math.cos(angleZ) * speed,
        Math.sin(angleXY) * Math.cos(angleZ) * speed,
        Math.sin(angleZ) * speed * 0.5
      ]

      return {
        id: nextId++,
        position: position,
        scale: 1,
        velocity,
        timestamp: Date.now()
      }
    })

    setCards(prev => [...prev, ...newCards])
  }, [triggerSpray, isActive, position])

  // Cleanup old cards after transition duration
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      const now = Date.now()
      setCards(prev => prev.filter(card => now - card.timestamp < 7000))
    }, 100)

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