"use client";
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import PoolScene from '../components/PoolScene';
import InfoPanel from '../components/InfoPanel';

// Wrapper to prevent hydration errors by only rendering on the client
const ClientOnly = ({ children }) => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return children;
};

export default function Home() {
  const [showPool, setShowPool] = useState(false);
  const [showIcon, setShowIcon] = useState(false);

  useEffect(() => {
    // 1s logo animation, then pool fades in
    const iconTimer = setTimeout(() => setShowIcon(true), 1000); // icon appears right after logo
    const poolTimer = setTimeout(() => setShowPool(true), 2000); // pool fades in after icon
    return () => {
      clearTimeout(poolTimer);
      clearTimeout(iconTimer);
    };
  }, []);

  return (
    <main style={{ height: '100vh', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      {/* InfoPanel is an absolute overlay within the main container */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
        <ClientOnly>
          <InfoPanel showIcon={showIcon} />
        </ClientOnly>
      </div>

      {/* PoolScene is centered by the main flex container */}
      <ClientOnly>
        <PoolScene showPool={showPool} />
      </ClientOnly>
    </main>
  );
}
