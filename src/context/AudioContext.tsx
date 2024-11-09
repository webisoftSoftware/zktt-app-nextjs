import { createContext, useContext, useState } from 'react'

interface AudioContextType {
  isVolumeOn: boolean
  setIsVolumeOn: (value: boolean) => void
}

const AudioContext = createContext<AudioContextType | undefined>(undefined)

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [isVolumeOn, setIsVolumeOn] = useState(false)

  return (
    <AudioContext.Provider value={{ isVolumeOn, setIsVolumeOn }}>
      {children}
    </AudioContext.Provider>
  )
}

export function useAudio() {
  const context = useContext(AudioContext)
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider')
  }
  return context
} 