"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import './InfoPanel.css'; // Import the CSS file

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

  useEffect(() => {
    const onPageClick = (e) => {
      if (isOpen) return;
      if (e.target.closest('.info-icon-wrapper, .info-panel')) return;
      setIsOpen(true);
    };
    document.addEventListener('click', onPageClick);
    return () => document.removeEventListener('click', onPageClick);
  }, [isOpen]);

  const [showPanel, setShowPanel] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowPanel(true);
      const animationTimeout = setTimeout(() => setIsAnimating(true), 20);
      return () => clearTimeout(animationTimeout);
    } else {
      setIsAnimating(false);
      const hideTimeout = setTimeout(() => setShowPanel(false), 2500);
      return () => clearTimeout(hideTimeout);
    }
  }, [isOpen]);

  const handleIconClick = () => setIsOpen(!isOpen);

  // Dynamic classes
  const iconWrapperClasses = `info-icon-wrapper ${isOpen ? 'open' : ''} ${scrolled ? 'scrolled' : ''}`;
  const panelClasses = `info-panel ${isAnimating ? 'visible' : ''} ${showPanel ? 'display' : ''}`;

  return (
    <>
      <div 
        className={iconWrapperClasses} 
        onClick={handleIconClick} 
        style={{ 
          opacity: showIcon ? 1 : 0, 
        }}
      >
        <Image src="/info-icon.svg" alt="Info / Close" width={90} height={90} />
      </div>

      {showPanel && (
        <div className={panelClasses}>
          {/* Backdrop for closing the panel */}
          <div 
            className="info-panel-backdrop"
            onClick={handleIconClick}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: 0
            }}
          />
          <h2 className="info-panel-header">After School is a collective of creators</h2>
          <div className="info-panel-content">
            <div className="info-panel-list-container">
              <ul className="info-panel-list">
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
            <img src="/assets/FULL LOGO.svg" alt="Full Logo" className="info-panel-logo" />
          </div>
        </div>
      )}
    </>
  );
};

export default InfoPanel;
