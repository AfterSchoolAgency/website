"use client";
import Image from 'next/image';
import PoolScene from '../components/PoolScene';
import InfoPanel from '../components/InfoPanel';

import React, { useEffect, useState } from 'react';

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
    <main style={{ minHeight: '100vh', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <InfoPanel showIcon={showIcon} />
      <PoolScene showPool={showPool} />
    </main>
  );
}
