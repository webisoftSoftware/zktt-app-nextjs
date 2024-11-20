import { useEffect, useState } from 'react'
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
  let nextId = 0

  useEffect(() => {
    if (!isActive || !triggerSpray) return;

    // Reduced number of cards and adjusted spawn parameters
    const newCards = Array.from({ length: 300 }).map(() => {
      const angleXY = Math.random() * Math.PI * 10
      const angleZ = (Math.random() * Math.PI * 0.8) - Math.PI/6  // Reduced spread angle
      const speed = 4 + Math.random() * 2

      const horizontalMultiplier = 0.6  // Reduce horizontal speed
      const velocity: [number, number, number] = [
        Math.cos(angleXY) * Math.cos(angleZ) * speed * horizontalMultiplier,
        Math.sin(angleXY) * Math.cos(angleZ) * speed,
        Math.sin(angleZ) * speed * horizontalMultiplier
      ]

      return {
        id: nextId++,
        position: position,
        scale: 0.8 + Math.random() * 0.2,
        velocity,
        timestamp: Date.now()
      }
    })

    setCards(prev => [...prev, ...newCards])
  }, [triggerSpray, isActive, position])

  // Increased lifetime for smoother fade-out
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      const now = Date.now()
      setCards(prev => prev.filter(card => now - card.timestamp < 8500))
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