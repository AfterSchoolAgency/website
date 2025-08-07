"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';


const InfoPanel = ({ showIcon = true }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Open info panel if user clicks anywhere on the page (not icon or panel)
  useEffect(() => {
    const onPageClick = (e) => {
      if (isOpen) return;
      // Ignore clicks on icon or panel
      if (e.target.closest('.info-icon, .info-panel')) return;
      setIsOpen(true);
    };
    document.addEventListener('click', onPageClick);
    return () => document.removeEventListener('click', onPageClick);
  }, [isOpen]);


  const iconStyle = {
    position: 'fixed',
    top: '20px',
    left: '20px',
    width: '90px',
    height: '90px',
    cursor: 'pointer',
    zIndex: 1001, // Ensure icon is above panel
    opacity: typeof showIcon === 'boolean' ? (showIcon ? 1 : 0) : 1,
    transition: 'opacity 1s cubic-bezier(0.23,1,0.32,1), transform 0.5s ease-in-out',
    transform: isOpen ? 'rotate(360deg)' : 'rotate(0deg)',
    boxShadow: scrolled ? '0 0 0 6px #ffe066, 0 0 0 18px #fffbe7' : undefined,
    border: scrolled ? '2px solid #ffe066' : undefined,
  };

  const [showPanel, setShowPanel] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowPanel(true);
      // Use a timeout to allow the component to render before animating
      const animationTimeout = setTimeout(() => setIsAnimating(true), 20);
      return () => clearTimeout(animationTimeout);
    } else {
      setIsAnimating(false);
      // Hide the panel after the close animation completes
      const hideTimeout = setTimeout(() => setShowPanel(false), 2500); // Match the new out duration
      return () => clearTimeout(hideTimeout);
    }
  }, [isOpen]);

  const panelStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    color: 'black',
    opacity: isAnimating ? 1 : 0,
    pointerEvents: isOpen ? 'auto' : 'none',
    alignItems: 'center',
    justifyContent: 'flex-end',
    zIndex: 999,
    padding: '20px 20px 5vh 20px',
    flexDirection: 'column',
    display: showPanel ? 'flex' : 'none',
    transform: isAnimating ? 'scaleY(1)' : 'scaleY(0)',
    transformOrigin: 'top',
    willChange: 'transform',
    transition: 'transform 2.5s cubic-bezier(0.23, 1, 0.32, 1), opacity 2.5s cubic-bezier(0.23, 1, 0.32, 1)',
  };



  const contentStyle = {
    textAlign: 'center',
    maxWidth: '600px',
    fontFamily: 'sans-serif'
  };

  // Handler for both info icon and panel icon
  const handleIconClick = () => setIsOpen(!isOpen);

  return (
    <>
      <div style={iconStyle} onClick={handleIconClick} className="info-icon">
        <Image src="/info-icon.svg" alt="Info / Close" width={90} height={90} />
      </div>

      <div style={panelStyle} className="info-panel" onClick={handleIconClick}>
        

            
        <h2 style={{
          position: 'absolute',
          top: '60px',
          left: 0,
          width: '100%',
          margin: 0,
          fontWeight: 400,
          fontSize: '2em',
          textAlign: 'center',
          marginBottom: '32px',
          letterSpacing: '0.01em',
          zIndex: 1002,
          background: 'rgba(255,255,255,0.9)',
          padding: '16px 0 16px 0'
        }}>After School is a collective of creators</h2>
        <div style={{...contentStyle, pointerEvents: 'auto', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', gap: '40px', paddingTop: '290px'}} onClick={(e) => e.stopPropagation()}>
          <div style={{width: '100%', textAlign: 'center', marginBottom: '16px'}}>
            <ul style={{marginTop: '0', fontSize: '1.6em', listStyle: 'none', padding: 0, textAlign: 'center', lineHeight: '1.4em'}}>
              <li style={{marginBottom: '6px'}}>Artists</li>
              <li style={{marginBottom: '6px'}}>Marketers</li>
              <li style={{marginBottom: '6px'}}>Stylists</li>
              <li style={{marginBottom: '6px'}}>Directors</li>
              <li style={{marginBottom: '6px'}}>Musicians</li>
              <li style={{marginBottom: '6px'}}>Graphic designers</li>
              <li style={{marginBottom: '6px'}}>Designers</li>
              <li style={{marginBottom: '6px'}}>Architects</li>
              <li style={{marginBottom: '6px'}}>Writers</li>
              <li style={{marginBottom: '6px'}}>Advertisers</li>
              <li style={{marginBottom: '6px'}}>Photography</li>
              <li>Dreamers</li>
            </ul>
          </div>
          <img src="/assets/FULL LOGO.svg" alt="Full Logo" style={{maxWidth: '90vw', maxHeight: '20vh', objectFit: 'contain'}} />
        </div>
      </div>
    </>
  );
};

export default InfoPanel;
