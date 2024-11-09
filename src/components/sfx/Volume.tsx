import { useState } from 'react'
import Image from 'next/image'
import { Html } from '@react-three/drei'

export function Volume() {
  const [isVolumeOn, setIsVolumeOn] = useState(true)

  return (
    <Html
      transform={false}
      className="fixed top-[-342] right-[-621] pointer-events-auto"
    >
      <div className="cursor-pointer">
        <div 
          onClick={() => setIsVolumeOn(!isVolumeOn)}
          className="w-7 h-7 transition-opacity hover:opacity-70"
        >
          <Image
            src={isVolumeOn ? '/img/vol_on.png' : '/img/vol_off.png'}
            alt={isVolumeOn ? 'Volume On' : 'Volume Off'}
            width={35}
            height={35}
            className="w-full h-full"
          />
        </div>
      </div>
    </Html>
  )
} 