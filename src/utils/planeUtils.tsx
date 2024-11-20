import { Plane } from "@react-three/drei";

export interface PlaneProps {
    size: number;
  }

export const XZPlane = ({ size }: PlaneProps) => (
    <Plane
      args={[size, size, size, size]}
      rotation={[1.5 * Math.PI, 0, 0]}
      position={[0, 0, 0]}
    >
    <meshStandardMaterial 
        attach="material" 
        color="black" 
        wireframe 
        opacity={0.1}  
        transparent 
    />
    </Plane>
)
  
export const XYPlane = ({ size }: PlaneProps) => (
    <Plane
    args={[size, size, size, size]}
    rotation={[0, 0, 0]}
    position={[0, 0, 0]}
    >
    <meshStandardMaterial 
    attach="material" 
    color="black" 
    wireframe 
    opacity={0.1}  
    transparent 
    />
    </Plane>
)

export const YZPlane = ({ size }: PlaneProps) => (
<Plane
    args={[size, size, size, size]}
    rotation={[0, Math.PI / 2, 0]}
    position={[0, 0, 0]}
>
    <meshStandardMaterial 
    attach="material" 
    color="black" 
    wireframe 
    opacity={0.1}  
    transparent 
    />
</Plane>
)