import { useState } from 'react'
import { Html } from '@react-three/drei'
import { PlayAudio } from './Play'

export function Volume() {
  const [isVolumeOn, setIsVolumeOn] = useState(false)

  return (
    <Html
      transform={false}
      className="pointer-events-auto fixed right-[-465] top-[-255]"
    >
      <div className="cursor-pointer">
        <div 
          onClick={() => setIsVolumeOn(!isVolumeOn)}
          className="size-5 transition-opacity hover:opacity-70"
        >
          <img
            src={isVolumeOn ? '/img/vol_on.png' : '/img/vol_off.png'}
            alt={isVolumeOn ? 'Volume On' : 'Volume Off'}
            width={21}
            height={21}
            className="size-full"
          />
        </div>
      </div>
      <PlayAudio isVolumeOn={isVolumeOn} />
    </Html>
  )
} 