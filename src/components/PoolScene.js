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

const KID_SILHOUETTES = ['/kid-1.svg', '/kid-2.svg', '/kid-3.svg'];

// Data for the 11 kids and the letters they carry
const KID_DATA = [
  { id: 'kid1', letters: ['A'], size: 20 },
  { id: 'kid2', letters: ['F'], size: 20 },
  { id: 'kid3', letters: ['T'], size: 20 },
  { id: 'kid4', letters: ['E'], size: 20 },
  { id: 'kid5', letters: ['R'], size: 20 },
  { id: 'kid6', letters: ['S'], size: 20 },
  { id: 'kid7', letters: ['C'], size: 20 },
  { id: 'kid8', letters: ['H'], size: 20 },
  { id: 'kid9', letters: ['O'], size: 20 },
  { id: 'kid10', letters: ['O'], size: 20 },
  { id: 'kid11', letters: ['L'], size: 20 },
];

// Final positions for floaties, relative to the pool container
const FLOATY_FINAL_POSITIONS = [
  { x: 140, y: 160, rotation: -15 }, // A
  { x: 180, y: 160, rotation: 10 },  // F
  { x: 220, y: 155, rotation: -5 },   // T
  { x: 280, y: 165, rotation: 15 },  // E
  { x: 340, y: 150, rotation: -10 }, // R
  { x: 420, y: 160, rotation: 5 },   // S
  { x: 480, y: 155, rotation: -15 }, // C
  { x: 540, y: 165, rotation: 10 },  // H
  { x: 600, y: 150, rotation: -5 },  // O
  { x: 660, y: 160, rotation: 15 },  // O
  { x: 720, y: 155, rotation: -10 }, // L
];

// A simple floaty component for now
function Kid({ id, svg }) {
  // Renders the kid silhouette SVG
  return <img id={id} src={svg} alt="A kid silhouette" style={{ width: '70px', height: 'auto' }} />;
}

// A simple floaty component for now
function Floaty({ letter, id, carried = false, onPush }) {
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    onPush(id, x, y);
  };

  const style = carried ? 
    { position: 'absolute', opacity: 1, transform: 'scale(0.6)' } : 
    { position: 'absolute', opacity: 0, visibility: 'hidden', display: 'none' };

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

export default function PoolScene() {
  const sceneRef = useRef(null);
  const [kidDataWithSvgs, setKidDataWithSvgs] = useState([]);
  const [pushHandler, setPushHandler] = useState(() => () => {});
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 }); // Initialize mouse off-screen

  useEffect(() => {
    // Assign random SVGs on the client-side only to prevent hydration mismatch
    setKidDataWithSvgs(
      KID_DATA.map(kid => ({
        ...kid,
        svg: KID_SILHOUETTES[Math.floor(Math.random() * KID_SILHOUETTES.length)],
      }))
    );
  }, []); // Empty dependency array ensures this runs only once on the client

  useEffect(() => {
    if (kidDataWithSvgs.length === 0) return; // Don't run animations until kids are set

    console.log("Scene ready for new animation sequence.");

    const tl = gsap.timeline({
      onComplete: () => {
        console.log("Main animation sequence complete. Ready for end state.");
        // TODO: Add logic here to fade in the final wordmark and navigation.
      }
    });

    // 1. Pool emerges
    // 1. Pool emerges, starting at the 2-second mark.
    tl.fromTo('.pool-container',
      { opacity: 0 },
      { opacity: 1, duration: 1.5, ease: 'power1.inOut', delay: 2 }
    );

    // Add a label to mark when the kids' parade should start
    tl.addLabel('kidsParadeStarts', '+=0.5'); // 0.5s pause after pool appears

    // Set kids at the start of the path, but hidden.
    gsap.set('.kid-group', { 
      opacity: 0, // Start hidden
      rotation: 0 
    });

    // Create a separate timeline for each kid's journey
    kidDataWithSvgs.forEach((kid, index) => {
      const kidSelector = `#${kid.id}`;
      const kidTl = gsap.timeline();

      // This timeline handles a single kid's full journey
      kidTl.to(kidSelector, { // Run up
        motionPath: {
          path: '#runUpPath',
          align: '#runUpPath',
          alignOrigin: [0.5, 0.5],
          autoRotate: false,
        },
        duration: 8,
        ease: 'power1.inOut',
        onStart: () => gsap.set(kidSelector, { opacity: 1 }),
      })
      .to(kidSelector, { duration: 0.5 }) // Hesitate
      .to(kidSelector, { // Slide down
        motionPath: {
          path: '#slideDownPath',
          align: '#slideDownPath',
          alignOrigin: [0.5, 0.5],
          autoRotate: false,
        },
        duration: 2,
        ease: 'power1.in',
        onComplete: () => {
          gsap.to(kidSelector, { opacity: 0, duration: 0.2 });
          const floatyId = `floaty-${index}`;
          // The floatyElement is now inside the pool container
          const floatyElement = sceneRef.current.querySelector(`.pool-container #${floatyId}`);
          if (floatyElement) {
            const finalPos = FLOATY_FINAL_POSITIONS[index];
            gsap.timeline()
              .set(floatyElement, { 
                opacity: 1, 
                visibility: 'visible', 
                display: 'block', 
                x: finalPos.x, 
                y: finalPos.y - 50, 
                scale: 0.6, 
                rotation: finalPos.rotation 
              })
              .to(floatyElement, { 
                x: finalPos.x + (Math.random() * 40 - 20),
                y: finalPos.y - (Math.random() * 20 + 20),
                duration: 1.5, 
                ease: 'power1.out',
              })
              .to(floatyElement, { 
                x: finalPos.x,
                y: finalPos.y, 
                duration: 0.8, 
                ease: 'bounce.out', 
                onComplete: () => {
                  gsap.to(floatyElement, { y: `+=${Math.random() * 10 + 5}`, repeat: -1, yoyo: true, duration: Math.random() * 2 + 3, ease: 'sine.inOut' });
                }
              });
          }
        }
      });

      // Add each kid's personal timeline to the main timeline, staggered
      tl.add(kidTl, `kidsParadeStarts+=${index * 0.2}`);
    });

    const floatyElements = gsap.utils.toArray('.floaty-wrapper');
    const floatyData = floatyElements.map((el, i) => ({
      el,
      x: FLOATY_FINAL_POSITIONS[i].x,
      y: FLOATY_FINAL_POSITIONS[i].y,
      vx: 0,
      vy: 0,
      radius: 25
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
        // Ambient float
        p1.vx += (Math.random() - 0.5) * 0.05;

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

        // Inter-floaty collisions
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
            const ax = (tx - p2.x) * 0.5;
            const ay = (ty - p2.y) * 0.5;

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
      tl.kill();
      gsap.ticker.remove(physicsTick);
    };
  }, [kidDataWithSvgs]); // Rerun if kid data changes

  return (
    <div ref={sceneRef} style={{ position: "relative", width: 1100, height: 600, border: '1px solid #ccc' }}>
      {/* 'A' is positioned centrally */}
      <div style={{ position: "absolute", left: '50%', top: '40%', transform: 'translate(-50%, -50%)', zIndex: 2 }}>
        <img src="/LOGO.svg" alt="A logo" style={{ width: '300px', height: 'auto' }} />
      </div>
      
      <div 
        className="pool-container" 
        style={{ position: 'absolute', bottom: '20px', left: '75%', transform: 'translateX(-50%) rotate(-5deg)', zIndex: 10 }}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        }}
        onMouseLeave={() => setMousePos({ x: -1000, y: -1000 })}
      >
        <div style={{ position: 'relative', width: '1050px', height: '320px' }}>
          {POOL_SVG}
          {/* Floaty letters are now positioned relative to THIS container */}
          <div className="floaties-container" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
            {kidDataWithSvgs.map((kid, index) => (
              <Floaty key={`floaty-${index}`} id={`floaty-${index}`} letter={kid.letters[0]} onPush={pushHandler} />
            ))}
          </div>
        </div>
      </div>

      {/* Placeholder for kids that will be animated */}
      <div className="kids-container" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 4 }}>
        {kidDataWithSvgs.map((kid, index) => (
          <div key={kid.id} id={kid.id} className="kid-group" style={{ position: 'absolute', top: 0, left: 0, opacity: 0 }}>
            <div className="kid-silhouette" style={{ position: 'absolute' }}>
              <Kid id={`kid-${index}`} svg={kid.svg} />
            </div>
          </div>
        ))}
      </div>

      {/* Invisible SVG for the scene-wide motion path */}
      <svg width="1100" height="600" style={{ position: 'absolute', top: 0, left: 0, zIndex: 5, pointerEvents: 'none' }}>
                <path id="runUpPath" d="M1200,550 C800,600 300,600 150,550 C200,450 450,250 550,200" stroke="none" strokeWidth="2" fill="none"/>
        <path id="slideDownPath" d="M550,200 Q550,350 700,450" stroke="none" strokeWidth="2" fill="none"/>
      </svg>
    </div>
  );
}
