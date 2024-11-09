// Main page component - marked as client component for React hooks
'use client'

// Import the game canvas which contains the main game interface
import GameCanvas from './canvas/GameCanvas'

const Page = () => {

  return (
    <main className="relative">
      <GameCanvas />
    </main>
  )
}

export default Page
