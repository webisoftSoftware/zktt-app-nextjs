'use client';

import { useRef } from 'react';
import dynamic from 'next/dynamic';
import { Center } from '@react-three/drei';

// Dynamically import Scene component with SSR disabled
// This prevents hydration issues with Three.js
const Scene = dynamic(() => import('@/components/canvas/Scene'), { ssr: false });

// Define props interface for type safety
type LayoutProps = {
  children: React.ReactNode;
};

// Main layout component that wraps the app
const Layout = ({ children }: LayoutProps) => {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      style={{
        position: 'relative',
        width: '1280px',    // Fixed width for consistent layout
        height: '720px',    // 16:9 aspect ratio
        margin: '0 auto',   // Center horizontally
        // Note: overflow: 'auto' is intentionally disabled
        // to prevent scrolling issues with Three.js
        touchAction: 'auto', // Enable touch events
      }}
    >
      {/* Render child components */} 
      {children}
      {/* Render Three.js scene */}
      <Scene
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
        }}
        // Connect event handling to the container
        eventSource={ref as React.MutableRefObject<HTMLDivElement>}
        eventPrefix='client'
      />
    </div>
  );
};

export { Layout };