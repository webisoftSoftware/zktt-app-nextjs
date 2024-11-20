import { useState, useMemo } from 'react';
import { useLoader } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { TextureLoader } from 'three';
import * as THREE from 'three';
import { animated } from '@react-spring/three';
import { getNextRandomCard } from '../../utils/cardUtils';

// Add a constant for the standard card size and aspect ratio
export const CARD_DIMENSIONS = {
  width: 752,
  height: 1052,
  get aspectRatio() { return this.width / this.height },
  getScaledDimensions(desiredWidth: number) {
    const width = desiredWidth;
    const height = width / this.aspectRatio;
    return [width, height] as [number, number];
  },
  getWidthFromHeight(desiredWidth: number, matchStandardHeight: boolean = true) {
    const standardHeight = 0.75 / this.aspectRatio;
    const width = desiredWidth;
    return [width, standardHeight] as [number, number];
  }
}

export interface GameCardProps {
  frontTexture?: string;
  backTexture?: string;
  position: [number, number, number];
  label: string;
  rotation?: [number, number, number];
  size?: [number, number];
  isFaceUp?: boolean;
  isInHand?: boolean;
  disableHover?: boolean;
}

export function GameCard({
  frontTexture,
  backTexture = '/cards/cardback.png',
  position, 
  label, 
  rotation = [0, 0, 0], 
  size = CARD_DIMENSIONS.getScaledDimensions(0.75),
  isFaceUp = true,
  isInHand = false,
  disableHover = false
}: GameCardProps) {
  const [hovered, setHovered] = useState(false);
  const baseRotation = [-Math.PI/2, 0, 0] as [number, number, number];
  
  // Enhanced hover animation with curved lift
  const [x, y, z] = position;
  const liftHeight = 0.5;
  const forwardPush = 0.5;
  
  // Quadratic curve calculation
  const t = hovered && !disableHover ? 2 : 0;
  const verticalOffset = liftHeight * Math.sin(t * Math.PI/2);
  const forwardOffset = hovered && !disableHover ? (z > 0 ? forwardPush : -forwardPush) : 0;
  const curveOffset = hovered && !disableHover ? Math.sin(t * Math.PI) * 0.3 : 0;

  const adjustedPosition: [number, number, number] = [
    x + (curveOffset * (z > 0 ? -1 : 1)),
    y + verticalOffset,
    z + forwardOffset
  ];

  const hoverRotation = hovered && !disableHover ? Math.sin(t * Math.PI/2) * 0.15 : 0;
  const finalRotation: [number, number, number] = [
    baseRotation[0] + rotation[0],
    baseRotation[1] + rotation[1] + hoverRotation,
    baseRotation[2] + rotation[2]
  ];

  const frontTextureMap = useMemo(() => {
    const texturePath = frontTexture ?? getNextRandomCard();
    const texture = useLoader(TextureLoader, texturePath);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = true;
    return texture;
  }, [frontTexture]);

  const backTextureMap = useMemo(() => {
    const texture = useLoader(TextureLoader, backTexture);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = true;
    return texture;
  }, [backTexture]);

  return (
    <group 
      position={adjustedPosition}
      onPointerOver={(e) => {
        e.stopPropagation();
        if (!disableHover) setHovered(true);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        if (!disableHover) setHovered(false);
      }}
    >
      <animated.group rotation={finalRotation}>
        <mesh position={[0, 0, -0.01]}>
          <planeGeometry args={[size[0] + 0.05, size[1] + 0.1]} />
          <meshBasicMaterial visible={false} />
        </mesh>
        <Html center transform>
          <div className="whitespace-nowrap text-[10px] text-black">{label}</div>
        </Html>
        <mesh>
          <planeGeometry args={size} />
          <meshBasicMaterial 
            map={frontTextureMap}
            transparent={true}
            side={THREE.FrontSide}
            color={"white"}
          />
        </mesh>
        <mesh>
          <planeGeometry args={size} />
          <meshBasicMaterial 
            map={backTextureMap}
            transparent={true}
            side={THREE.BackSide}
            color={"white"}
          />
        </mesh>
      </animated.group>
    </group>
  )
}