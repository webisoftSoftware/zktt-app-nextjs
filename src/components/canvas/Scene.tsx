'use client';

import { Canvas } from '@react-three/fiber';
import { Preload } from '@react-three/drei';
import { r3f } from '@/helpers/global';
import * as THREE from 'three';

type SceneProps = Omit<React.ComponentProps<typeof Canvas>, 'children' | 'onCreated'>;
export default function Scene({ ...props }: SceneProps) {
  // Everything defined in here will persist between route changes, only children are swapped
  return (
    <Canvas {...props} onCreated={(state) => (state.gl.toneMapping = THREE.AgXToneMapping)}>
      <r3f.Out />
      <Preload all />
    </Canvas>
  );
}