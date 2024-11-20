import { PlaneProps, XZPlane, YZPlane, XYPlane } from "@/utils/planeUtils";

export default function Grid({ size }: PlaneProps) {
    return (
      <group>
        <XZPlane size={size} />
        <XYPlane size={size} />
        <YZPlane size={size} />
      </group>
    )
}