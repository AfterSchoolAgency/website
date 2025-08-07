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
    <main style={{ minHeight: '100vh', background: '#fff' }}>
      {/* InfoPanel is a pure overlay and should not affect layout */}
      <ClientOnly>
        <InfoPanel showIcon={showIcon} />
      </ClientOnly>

      {/* Main container to center the PoolScene */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <ClientOnly>
          <PoolScene showPool={showPool} />
        </ClientOnly>
      </div>
    </main>
  );
}
