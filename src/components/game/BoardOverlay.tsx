export interface BoardOverlayProps {
  size: [number, number];
  position: [number, number, number];
  rotation?: [number, number, number];
}

export function BoardOverlay({ size, position, rotation = [0, 0, 0] }: BoardOverlayProps) {
  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={size} />
      <meshBasicMaterial color="black" wireframe={true} />
    </mesh>
  );
}