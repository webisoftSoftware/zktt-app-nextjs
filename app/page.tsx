'use client'

import dynamic from 'next/dynamic'

const GameCanvas = dynamic(() => import('@/components/canvas/GameCanvas'), { ssr: false })

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <GameCanvas />
    </main>
  )
}
