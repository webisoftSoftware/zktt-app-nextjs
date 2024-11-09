import { useEffect, useRef } from 'react'
import { useAudio } from '../../context/AudioContext'

export function ClickSound() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const { isVolumeOn } = useAudio()

  useEffect(() => {
    const handleClick = () => {
      if (audioRef.current && isVolumeOn) {
        audioRef.current.volume = 0.3
        audioRef.current.currentTime = 0
        audioRef.current.play()
      }
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [isVolumeOn])

  return (
    <audio 
      ref={audioRef}
      preload="auto"
      src="/audio/pitchClick.mp3" // Make sure to add your click sound file
      style={{ display: 'none' }}
    >
      Your browser does not support the audio element.
    </audio>
  )
} 