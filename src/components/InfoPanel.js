"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';


const InfoPanel = ({ showIcon = true }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

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


  const baseIconStyle = {
    position: 'fixed',
    cursor: 'pointer',
    zIndex: 1001,
    opacity: typeof showIcon === 'boolean' ? (showIcon ? 1 : 0) : 1,
    transition: 'opacity 1s cubic-bezier(0.23,1,0.32,1), transform 0.5s ease-in-out, width 0.3s, height 0.3s, top 0.3s, left 0.3s',
    transform: isOpen ? 'rotate(360deg)' : 'rotate(0deg)',
    boxShadow: scrolled ? '0 0 0 6px #ffe066, 0 0 0 18px #fffbe7' : undefined,
    border: scrolled ? '2px solid #ffe066' : undefined,
  };

  const iconStyle = {
    ...baseIconStyle,
    top: isMobile ? '15px' : '20px',
    left: isMobile ? '15px' : '20px',
    width: isMobile ? '50px' : '90px',
    height: isMobile ? '50px' : '90px',
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
    backgroundColor: isMobile ? 'rgb(255, 255, 255)' : 'rgba(255, 255, 255, 0.98)',
    color: 'black',
    opacity: isAnimating ? 1 : 0,
    pointerEvents: isOpen ? 'auto' : 'none',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
    padding: isMobile ? '80px 20px 20px' : '20px 20px 5vh 20px',
    flexDirection: 'column',
    display: showPanel ? 'flex' : 'none',
    transform: isAnimating ? 'scaleY(1)' : 'scaleY(0)',
    transformOrigin: 'top',
    willChange: 'transform',
    transition: 'transform 2.5s cubic-bezier(0.23, 1, 0.32, 1), opacity 2.5s cubic-bezier(0.23, 1, 0.32, 1)',
    overflowY: 'auto',
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
        <Image src="/info-icon.svg" alt="Info / Close" layout="fill" objectFit="contain" />
      </div>

      <div style={panelStyle} className="info-panel" onClick={handleIconClick}>
        <div style={{...contentStyle, pointerEvents: 'auto', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: isMobile ? '20px' : '40px'}} onClick={(e) => e.stopPropagation()}>
            
          <h2 style={{
            fontWeight: 400,
            fontSize: isMobile ? '1.5em' : '2em',
            textAlign: 'center',
            letterSpacing: '0.01em',
            margin: 0,
            padding: '0 10px',
          }}>After School is a collective of creators</h2>

          <div style={{width: '100%', textAlign: 'center'}}>
            <ul style={{fontSize: isMobile ? '1.1em' : '1.6em', listStyle: 'none', padding: 0, textAlign: 'center', lineHeight: '1.4em', margin: 0}}>
              <li>Artists</li>
              <li>Marketers</li>
              <li>Stylists</li>
              <li>Directors</li>
              <li>Musicians</li>
              <li>Graphic designers</li>
              <li>Designers</li>
              <li>Architects</li>
              <li>Writers</li>
              <li>Advertisers</li>
              <li>Photography</li>
              <li>Dreamers</li>
            </ul>
          </div>
          <img src="/assets/FULL LOGO.svg" alt="Full Logo" style={{maxWidth: '80vw', maxHeight: isMobile ? '15vh' : '20vh', objectFit: 'contain', marginTop: isMobile ? '20px' : '0'}} />
        </div>
      </div>
    </>
  );
};

export default InfoPanel;
