import { useRef, useEffect, useState } from 'react'

interface PlayAudioProps {
  isVolumeOn: boolean;
}

export function PlayAudio({ isVolumeOn }: PlayAudioProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  // Initialize audio on mount
  useEffect(() => {
    if (audioRef.current) {
      // Set initial properties
      audioRef.current.volume = 0.2
      audioRef.current.muted = true
      audioRef.current.loop = true

      // Try to start playing
      const playPromise = audioRef.current.play()
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true)
            // Once successfully playing, set the mute state based on volume preference
            if (audioRef.current) {
              audioRef.current.muted = !isVolumeOn
            }
          })
          .catch(error => {
            console.log("Playback failed:", error)
            // If autoplay fails, we'll wait for user interaction
            const startAudio = () => {
              if (audioRef.current) {
                audioRef.current.play()
                audioRef.current.loop = true
                setIsPlaying(true)
                document.removeEventListener('click', startAudio)
              }
            }
            document.addEventListener('click', startAudio)
          })
      }
    }

    // Cleanup
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }
    }
  }, [])

  // Handle volume changes
  useEffect(() => {
    if (audioRef.current && isPlaying) {
      audioRef.current.muted = !isVolumeOn
    }
  }, [isVolumeOn, isPlaying])

  // Add ended event listener to ensure looping
  useEffect(() => {
    const audio = audioRef.current
    const handleEnded = () => {
      if (audio) {
        audio.currentTime = 0
        audio.play()
      }
    }

    audio?.addEventListener('ended', handleEnded)
    return () => audio?.removeEventListener('ended', handleEnded)
  }, [])

  return (
    <audio 
      ref={audioRef}
      loop
      playsInline
      preload="auto"
      muted
      src="/audio/themeSong.mp3"
    >
      Your browser does not support the audio element.
    </audio>
  )
}