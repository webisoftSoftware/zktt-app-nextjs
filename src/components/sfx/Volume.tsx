import { useState } from 'react'
import Image from 'next/image'
import { Html } from '@react-three/drei'
import { PlayAudio } from './Play'

export function Volume() {
  const [isVolumeOn, setIsVolumeOn] = useState(false)

  return (
    <Html
      transform={false}
      className="fixed top-[-255] right-[-465] pointer-events-auto"
    >
      <div className="cursor-pointer">
        <div 
          onClick={() => setIsVolumeOn(!isVolumeOn)}
          className="w-5 h-5 transition-opacity hover:opacity-70"
        >
          <Image
            src={isVolumeOn ? '/img/vol_on.png' : '/img/vol_off.png'}
            alt={isVolumeOn ? 'Volume On' : 'Volume Off'}
            width={21}
            height={21}
            className="w-full h-full"
          />
        </div>
      </div>
      <PlayAudio isVolumeOn={isVolumeOn} />
    </Html>
  )
} 