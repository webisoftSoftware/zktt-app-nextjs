// Main page component - marked as client component for React hooks
'use client'

// Import the game canvas which contains the main game interface
import GameCanvas from '@/components/canvas/GameCanvas'

// Simple page component that renders the game canvas
export default function Page() {
  return (
    <main>
      <GameCanvas />
    </main>
  )
}
