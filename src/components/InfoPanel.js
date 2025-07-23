'use client';

import { useState } from 'react';
import Image from 'next/image';

const InfoPanel = () => {
  const [isOpen, setIsOpen] = useState(false);

  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className="info-icon-container" onClick={togglePanel}>
        <Image src="/GRAPHIC ELEMENT.svg" alt="Info" width={32} height={32} />
      </div>
      <div className={`info-panel ${isOpen ? 'open' : ''}`}>
        <p>
          After school is a creative collective of designers directors artist musicians writers engineers
        </p>
      </div>
    </>
  );
};

export default InfoPanel;
