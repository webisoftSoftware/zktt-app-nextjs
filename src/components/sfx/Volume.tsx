import { useAudio } from '../../context/AudioContext'
import { PlayAudio } from './Play'

export function Volume() {
  const { isVolumeOn, setIsVolumeOn } = useAudio()

  return (
    <>
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
    </>
  )
} 