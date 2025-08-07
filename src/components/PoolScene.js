"use client";

import React, { useEffect, useRef, useState } from 'react';

import { gsap } from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";


gsap.registerPlugin(MotionPathPlugin);

// Placeholder SVGs for A, pool, and floaty letters
// Replace these with your actual assets in /public/assets
const POOL_SVG = (
  <svg width="1000" height="300" viewBox="0 0 800 250" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path id="pool-path" d="M50,120 C100,200 350,240 400,200 C450,160 700,200 750,120 C700,40 450,10 400,50 C350,90 100,40 50,120 Z" fill="black" fillOpacity="0.8"/>
  </svg>
);

const FLOATY_LETTERS = [
  "A", "F", "T", "E", "R", "S", "C", "H", "O", "O", "L"
];



// Final positions for floaties, relative to the pool container
const FLOATY_FINAL_POSITIONS = [
  { x: 120, y: 160, rotation: -15 }, // A
  { x: 160, y: 160, rotation: 10 },  // F
  { x: 200, y: 155, rotation: -5 },   // T
  { x: 260, y: 165, rotation: 15 },  // E
  { x: 300, y: 150, rotation: -10 }, // R
  { x: 380, y: 160, rotation: 5 },   // S
  { x: 440, y: 155, rotation: -15 }, // C
  { x: 500, y: 145, rotation: 10 },  // H
  { x: 560, y: 150, rotation: -5 },  // O
  { x: 620, y: 140, rotation: 15 },  // O
  { x: 660, y: 155, rotation: -10 }, // L (Moved closer)
];


// A simple floaty component for now
function Floaty({ letter, id, carried = false, onPush }) {
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    onPush(id, x, y);
  };

    // Always visible floaties
  const style = { position: 'absolute', opacity: 1, transform: 'scale(0.6)' };

  return (
    <div id={id} style={style} className="floaty-wrapper" onMouseMove={handleMouseMove}>
      <svg className="floaty-letter" width="50" height="50" viewBox="0 0 50 50">
        <g>
          <ellipse cx="25" cy="25" rx="22" ry="22" fill="black" fillOpacity="0.8" />
          <text x="50%" y="50%" dy=".3em" textAnchor="middle" fontSize="28" fontWeight="bold" fill="white">
            {letter}
          </text>
        </g>
      </svg>
    </div>
  );

}

export default function PoolScene({ showPool = true }) {
  const ambientAudioRef = useRef(null);
  const [showUnmute, setShowUnmute] = useState(false);
  const [audioStarted, setAudioStarted] = useState(false);
  const sceneRef = useRef(null);
  const logoRef = useRef(null);
  const [scale, setScale] = useState(1);

  // Try to auto-play ambient audio on pool show
  useEffect(() => {
    if (showPool && !audioStarted && ambientAudioRef.current) {
      ambientAudioRef.current.loop = true;
      ambientAudioRef.current.currentTime = 0;
      ambientAudioRef.current.volume = 0.5;
      ambientAudioRef.current.play()
        .then(() => {
          setAudioStarted(true);
          setShowUnmute(false);
        })
        .catch(() => {
          // Only show unmute if play() is blocked by browser
          setShowUnmute(true);
        });
    }
  }, [showPool, audioStarted]);

  // Play ambient kids audio when unmuted
  const handleUnmute = () => {
    if (ambientAudioRef.current && !audioStarted) {
      ambientAudioRef.current.loop = true;
      ambientAudioRef.current.currentTime = 0;
      ambientAudioRef.current.volume = 0.5;
      ambientAudioRef.current.play()
        .then(() => {
          setAudioStarted(true);
          setShowUnmute(false);
        });
    }
  };

  // If unmute button is shown, make any click unmute the audio
  useEffect(() => {
    if (showUnmute) {
      const handleAnyClickToUnmute = () => {
        handleUnmute();
      };

      // Add a one-time listener to the window
      window.addEventListener('click', handleAnyClickToUnmute, { once: true });

      // Cleanup in case the component unmounts before the click
      return () => {
        window.removeEventListener('click', handleAnyClickToUnmute);
      };
    }
  }, [showUnmute]);


  // Set up floaty state (one for each letter)
  const [floaties, setFloaties] = useState(FLOATY_LETTERS.map((letter, i) => ({
    id: `floaty-${i}`,
    letter: letter,
    svg: ''
  })));

  const [pushHandler, setPushHandler] = useState(() => () => {});
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 }); // Initialize mouse off-screen

  // Unified handler for mouse and touch interactions
  const handleInteractionMove = (e, isTouchEvent = false) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const point = isTouchEvent ? e.touches[0] : e;
    if (point) {
      setMousePos({ x: point.clientX - rect.left, y: point.clientY - rect.top });
    }
  };

  const handleInteractionEnd = () => {
    setMousePos({ x: -1000, y: -1000 });
  };


  // Logo animation on mount
  useEffect(() => {
    if (logoRef.current) {
      gsap.fromTo(
        logoRef.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 1, ease: 'power2.out' }
      );
    }
  }, []);

  // No need to assign random SVGs. Only floaties are used.

  useEffect(() => {
    const floatyElements = gsap.utils.toArray('.floaty-wrapper');
    if (floatyElements.length === 0) return;

    const tl = gsap.timeline();

    // 1. Animate pool fade-in
    tl.fromTo('.pool-container',
      { opacity: 0 },
      { opacity: 1, duration: 1.5, ease: 'power1.inOut' },
      0
    );

        // Delay floaties entry by 1s
    tl.to({}, { duration: 1 });



    // 2. Animate floaties rolling down the logo and into position, one by one.
    floatyElements.forEach((el, i) => {
      const finalPos = FLOATY_FINAL_POSITIONS[i];
      tl.fromTo(el, 
        {
          // FROM: Start invisible at the top of the path
          opacity: 0,
          motionPath: {
            path: '#logoSlidePath',
            align: '#logoSlidePath',
            alignOrigin: [0.5, 0.5],
            start: 0,
            end: 0
          }
        },
        {
          // TO: Animate to visible and roll down the path
          opacity: 1,
          motionPath: {
            path: '#logoSlidePath',
            align: '#logoSlidePath',
            alignOrigin: [0.5, 0.5],
            autoRotate: false
          },
          rotation: '+=360',
          duration: 1.5, // Even slower, more deliberate roll
          ease: 'sine.inOut'
        },
        ">-1.45" // Maintain 0.05s delay with the new, slower duration
      )
      .to(el, {
        x: finalPos.x,
        y: finalPos.y,
        rotation: finalPos.rotation,
        duration: 0.8,
        ease: 'power2.out',
        onComplete: () => {
            // Make watermark 9% more visible
            gsap.to('.contact-watermark', { opacity: '+=0.09', duration: 0.5, ease: 'power1.inOut' });



            // Hand over to physics engine with a 'splash' of momentum
            if (floatyData[i]) {
              floatyData[i].x = finalPos.x;
              floatyData[i].y = finalPos.y;
              floatyData[i].vx = (Math.random() - 0.5) * 1; // Softer splash velocity X
              floatyData[i].vy = (Math.random() - 0.5) * 1; // Softer splash velocity Y
              floatyData[i].isAnimatingIn = false; // Enable physics for this floaty
            }
          }
      });
    });

    const floatyData = floatyElements.map((el, i) => ({
      el,
      x: 0, // Start at (0,0) relative to parent
      y: 0,
      vx: 0,
      vy: 0,
      radius: 25,
      isAnimatingIn: true // Disable physics during entrance
    }));

    const poolPathElement = sceneRef.current.querySelector('#pool-path');
    const rawPath = MotionPathPlugin.getRawPath(poolPathElement);
    MotionPathPlugin.cacheRawPathMeasurements(rawPath);
    const poolPolygon = [];
    const segments = 60; // Increased for more precision
    for (let i = 0; i <= segments; i++) {
        const progress = i / segments;
        const point = MotionPathPlugin.getPositionOnPath(rawPath, progress);
        poolPolygon.push({ x: point.x, y: point.y });
    }

    const handleFloatyPush = (id, mouseX, mouseY) => {
      const floatyId = parseInt(id.split('-')[1]);
      const floaty = floatyData[floatyId];
      if (!floaty) return;

      const pushForce = 1.5;
      const dx = mouseX - floaty.radius;
      const dy = mouseY - floaty.radius;
      
      floaty.vx -= dx * pushForce * 0.1;
      floaty.vy -= dy * pushForce * 0.1;
    };

    setPushHandler(() => handleFloatyPush);

    const physicsTick = () => {
      const pushRadius = 100; // The "ripple" radius around the mouse
      const pushStrength = 1.5;
      floatyData.forEach((p1, i) => {
        if (p1.isAnimatingIn) return; // Skip physics for floaties still animating in
        // Ambient float
        p1.vx += (Math.random() - 0.5) * 0.03; // Slightly increased for continuous motion
        p1.vy += (Math.random() - 0.5) * 0.03; // Slightly increased for continuous motion

        // Add damping (friction)
        p1.vx *= 0.98; // Slightly increased friction for a calmer float
        p1.vy *= 0.98; // Slightly increased friction for a calmer float

        // Mouse interaction (wide push)
        const dxMouse = p1.x - mousePos.x;
        const dyMouse = p1.y - mousePos.y;
        const distMouseSq = dxMouse * dxMouse + dyMouse * dyMouse;

        if (distMouseSq < pushRadius * pushRadius) {
            const distMouse = Math.sqrt(distMouseSq);
            const force = 1 - (distMouse / pushRadius); // Force is stronger when closer
            p1.vx += (dxMouse / distMouse) * force * pushStrength;
            p1.vy += (dyMouse / distMouse) * force * pushStrength;
        }
        p1.vy += (Math.random() - 0.5) * 0.05;

        // Friction
        p1.vx *= 0.92;
        p1.vy *= 0.92;

        // Update position
        p1.x += p1.vx;
        p1.y += p1.vy;

        // Custom polygon wall collisions
        for (let k = 0; k < poolPolygon.length; k++) {
          const pA = poolPolygon[k];
          const pB = poolPolygon[(k + 1) % poolPolygon.length];

          // Find closest point on segment
          const toA = { x: p1.x - pA.x, y: p1.y - pA.y };
          const seg = { x: pB.x - pA.x, y: pB.y - pA.y };
          const segLenSq = seg.x * seg.x + seg.y * seg.y;
          const dot = toA.x * seg.x + toA.y * seg.y;
          const t = Math.max(0, Math.min(1, dot / segLenSq));
          const closestPt = { x: pA.x + t * seg.x, y: pA.y + t * seg.y };

          const distSq = (p1.x - closestPt.x)**2 + (p1.y - closestPt.y)**2;

          if (distSq < p1.radius * p1.radius) {
            const dist = Math.sqrt(distSq);
            const overlap = p1.radius - dist;
            const normal = { x: p1.x - closestPt.x, y: p1.y - closestPt.y };
            const nLen = Math.sqrt(normal.x**2 + normal.y**2);
            normal.x /= nLen;
            normal.y /= nLen;

            p1.x += normal.x * overlap;
            p1.y += normal.y * overlap;

            const velDot = p1.vx * normal.x + p1.vy * normal.y;
            p1.vx -= 2 * velDot * normal.x;
            p1.vy -= 2 * velDot * normal.y;
            p1.vx *= 0.7; // Dampen bounce
            p1.vy *= 0.7;
          }
        }

        // Add a spring force to pull floaties back to their target position
        const finalPos = FLOATY_FINAL_POSITIONS[i];
        const springStrength = 0.0005;
        const dxSpring = finalPos.x - p1.x;
        const dySpring = finalPos.y - p1.y;
        p1.vx += dxSpring * springStrength;
        p1.vy += dySpring * springStrength;

        // Collisions between floaties
        for (let j = i + 1; j < floatyData.length; j++) {
          const p2 = floatyData[j];
          const dx = p2.x - p1.x;
          const dy = p2.y - p1.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const min_dist = p1.radius + p2.radius;

          if (distance < min_dist) {
            const angle = Math.atan2(dy, dx);
            const tx = p1.x + Math.cos(angle) * min_dist;
            const ty = p1.y + Math.sin(angle) * min_dist;
            const ax = (tx - p2.x) * 0.1; // Reduced collision force
            const ay = (ty - p2.y) * 0.1; // Reduced collision force

            p1.vx -= ax;
            p1.vy -= ay;
            p2.vx += ax;
            p2.vy += ay;
          }
        }

        gsap.set(p1.el, { x: p1.x, y: p1.y });
      });
    };

    gsap.ticker.add(physicsTick);

    return () => {
      gsap.ticker.remove(physicsTick);
      tl.kill();
    };
  }, [floaties]); // Rerun if floaties change

  // Handle responsive scaling
  useEffect(() => {
    const handleResize = () => {
      const baseWidth = 1100; // The original fixed width of your scene
      const newScale = Math.min(window.innerWidth / baseWidth, 1.0);
      setScale(newScale);
    };

    handleResize(); // Set initial scale
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div ref={sceneRef} style={{ 
      position: "relative", 
      width: 1100, 
      height: 600, 
      transform: `scale(${scale})`,
      transformOrigin: 'center center',
      transition: 'transform 0.3s ease-out'
    }}>
      {/* Logo in the center */}
      <div ref={logoRef} style={{ position: 'absolute', left: '50%', top: '40%', transform: 'translate(-50%, -50%)', zIndex: 2, opacity: 0, scale: 0.8 }}>
        <img src="/LOGO.svg" alt="A logo" style={{ 
            width: '300px', 
            height: 'auto', 
        }} />
      </div>
      
      <div 
        className="pool-fade-wrapper"
        style={{
          opacity: showPool ? 1 : 0,
          transition: 'opacity 2s ease-in-out',
          pointerEvents: showPool ? 'auto' : 'none',
          position: 'absolute',
          bottom: '20px',
          left: '75%',
          transform: 'translateX(-50%) rotate(-5deg)',
          zIndex: 10
        }}
      >
        <div 
          className="pool-container" 
          style={{ width: '1000px', height: '300px', position: 'relative' }}
          onMouseMove={(e) => handleInteractionMove(e)}
          onMouseLeave={handleInteractionEnd}
          onTouchStart={(e) => handleInteractionMove(e, true)}
          onTouchMove={(e) => handleInteractionMove(e, true)}
          onTouchEnd={handleInteractionEnd}
        >
          <div style={{ position: 'relative', width: '1000px', height: '300px' }}>
            {POOL_SVG}
            {/* Floaty letters are now positioned relative to THIS container */}
            <div className="floaties-container" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
              {floaties.map((floaty, index) => (
                <Floaty key={floaty.id} id={floaty.id} letter={floaty.letter} onPush={pushHandler} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Invisible SVG for motion paths and filters */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          {/* Watery/Gooey effect filter */}
          <filter id="watery-goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>

          {/* Motion path for floaties */}
          <path id="logoSlidePath" d="M550,120 C550,250 650,280 700,450" stroke="none" fill="none"/>
        </defs>
      </svg>

      {/* Contact Us text with watery effect */}
      <div className="contact-watermark" style={{
        position: 'absolute',
        bottom: '-132px', // Raised by 0.25 inch (24px)
        left: '89%', // Move further right
        transform: 'translateX(-50%) rotate(-15deg)', // Increased angle
        zIndex: 20,
        opacity: 0
      }}>
        <a href="mailto:contact@afterschoolagency.com" style={{ display: 'inline-block', pointerEvents: 'auto' }}>
          <img 
            src="/assets/DC89A5B2-630A-4197-A665-AAFFF2D61C52.PNG" 
            alt="Contact Us Watermark" 
            style={{ width: '232px', height: 'auto', display: 'block', pointerEvents: 'auto', userSelect: 'none' }}
          />
        </a>
      </div>
      {/* Unmute button */}

      {/* Unmute button */}
      {showUnmute && (
        <button
          onClick={handleUnmute}
          style={{
            position: 'absolute',
            top: 24,
            right: 32,
            zIndex: 1000,
            background: 'rgba(255,255,255,0.95)',
            color: '#111',
            border: '1px solid #ccc',
            borderRadius: '32px',
            padding: '12px 24px',
            fontSize: '1.2em',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(0,0,0,0.07)',
            transition: 'background 0.2s',
          }}
        >
          Unmute
        </button>
      )}
      {/* Ambient kids audio */}
      <audio ref={ambientAudioRef} src="/assets/audio/11L-ambiant_kids_playing-1754548399070.mp3" preload="auto" />
    </div>
  );
}
