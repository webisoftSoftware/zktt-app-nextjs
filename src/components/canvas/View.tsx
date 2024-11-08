// 'use client';

// import { forwardRef, useRef } from 'react';
// import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
// import { Canvas } from '@react-three/fiber';
// import * as THREE from 'three';

// const View = forwardRef(({ children, orbit = false, ...props }, ref) => {
// const localRef = useRef<HTMLDivElement>(null);

//   return (
//     <>
//       <div ref={localRef} {...props}>
//         <Canvas
//           className="w-[1280px] h-[m720px] "
//           gl={{ toneMapping: THREE.AgXToneMapping }}
//           camera={{ position: [0, 0, 6], fov: 40 }}
//         >
//           <ambientLight />
//           <pointLight position={[20, 30, 10]} intensity={3} decay={0.2} />
//           <pointLight position={[-10, -10, -10]} color="blue" decay={0.2} />
//           {children}
//           {orbit && <OrbitControls />}
//         </Canvas>
//       </div>
//     </>
//   );
// });
// View.displayName = 'View';

// export { View };