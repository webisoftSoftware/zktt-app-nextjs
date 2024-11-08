'use client';

import { useRef } from 'react';
import dynamic from 'next/dynamic';

const Scene = dynamic(() => import('@/components/canvas/Scene'), { ssr: false });

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      style={{
        position: 'relative',
        width: ' 100%',
        height: '100%',
        overflow: 'auto',
        touchAction: 'auto',
      }}
    >
      {children}
      <Scene
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
        }}
        eventSource={ref as React.MutableRefObject<HTMLDivElement>}
        eventPrefix='client'
      />
    </div>
  );
};

export { Layout };