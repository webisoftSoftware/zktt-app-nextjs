import { Html } from "@react-three/drei";
import { BoardOverlay } from "./BoardOverlay";

export interface BoardProps {
  position: [number, number, number];
  label: string;
  size: [number, number];
  rotation?: [number, number, number];
}

export function Board({ position, label, size, rotation = [0, 0, 0] }: BoardProps) {
  return (
    <>
      <group position={position} rotation={rotation}>
        {/* Main Board with Custom Color */}
        <mesh>
          <planeGeometry args={size} />
          <meshBasicMaterial color={"black"} wireframe={true} />
        </mesh>

        {/* Label */}
        <Html center transform>
          <div className="whitespace-nowrap text-[10px] text-black">{label}</div>
        </Html>
      </group>
      <BoardOverlay
        position={[position[0], position[1] + 0.001, position[2]]}
        rotation={rotation}
        size={size}
      />
    </>
  );
}
