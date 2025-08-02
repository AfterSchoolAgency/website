/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions */
'use client'

import { useState, useRef, useEffect } from 'react'
import gsap from 'gsap'
import Image from 'next/image'

const roles = [
  'Curators',
  'Designers',
  'Marketers',
  'Musicians',
  'Writers',
  'Philosophers',
  'Artists',
  'Filmmakers',
  'Stylists',
  'Financiers',
]

export default function UnrollMenu() {
  const [open, setOpen] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const itemsRef = useRef<Array<HTMLButtonElement | null>>([])
  // Use any to avoid Timeline vs Tween mismatch
  const tl = useRef<any>(null)

  useEffect(() => {
    const overlay = overlayRef.current
    const pathEl = pathRef.current
    if (!overlay || !pathEl) return

    // Prepare SVG path for dash animation
    const length = pathEl.getTotalLength()
    pathEl.style.strokeDasharray = `${length}`
    pathEl.style.strokeDashoffset = `${length}`
    pathEl.style.fill = 'transparent'
    pathEl.style.stroke = 'black'
    pathEl.style.strokeWidth = '2'

    // Prevent initial overflow
    gsap.set(overlay, { height: 0, overflow: 'hidden' })

    // Build timeline
    const timeline = gsap.timeline({ paused: true })
    timeline
      // 1) Draw the path (unravel)
      .to(pathEl, {
        strokeDashoffset: 0,
        duration: 1,
        ease: 'power2.inOut',
      })
      // 2) Expand overlay full-screen
      .to(
        overlay,
        {
          height: '100vh',
          duration: 0.8,
          ease: 'cubic-bezier(0.23,1,0.32,1)',
          backgroundColor: 'rgba(255,255,255,0.8)',
          backdropFilter: 'blur(10px)',
        },
        '-=0.3'
      )
      // 3) Stagger menu items
      .from(
        itemsRef.current,
        {
          y: -20,
          opacity: 0,
          stagger: 0.1,
          duration: 0.4,
          ease: 'power3.out',
        },
        '-=0.4'
      )

    tl.current = timeline
  }, [])

  // Play or reverse on open toggle
  useEffect(() => {
    if (tl.current) {
      open ? tl.current.play() : tl.current.reverse()
    }
    document.body.style.overflow = open ? 'hidden' : ''
  }, [open])

  return (
    <>
      {/* Trigger button */}
      <div className="fixed top-6 left-6 z-50">
        <button
          onClick={() => setOpen(prev => !prev)}
          className="focus:outline-none"
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? (
            <span className="text-3xl font-bold">×</span>
          ) : (
            <svg
              ref={pathRef}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 556 69"
              width="200"
              className="h-auto"
            >
              <path d="M1008,754.8h501.6c0-49.1-4.8-98.5-14.4-147-9.6-48.6-24-96.2-43.2-142.8-19.1-46.7-44.3-92.4-75.8-135.1-31.5-42.7-69.2-81.3-113.5-115.2-44.3-33.8-94.1-62.2-147.8-84.4-53.7-22.2-111.1-37.1-170.1-44.5-59-7.5-119.4-7.5-178.4,0-59,7.4-116.4,22.3-170.1,44.5-53.7,22.2-103.5,50.6-147.8,84.4-44.3,33.9-82,72.5-113.5,115.2-31.5,42.7-56.7,88.4-75.8,135.1-19.2,46.6-33.5,94.2-43.2,142.8-9.6,48.5-14.4,97.9-14.4,147H992" />
            </svg>
          )}
        </button>
      </div>

      {/* Overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-40 flex flex-col items-start px-6"
      >
        {/* Close button */}
        <button
          onClick={() => setOpen(false)}
          className="absolute top-6 right-6 text-3xl font-bold focus:outline-none"
          aria-label="Close menu"
        >
          ×
        </button>

        {/* Logo in overlay header */}
        <div className="absolute top-6 left-6">
          <Image
            src="/GRAPHIC ELEMENT.svg"
            alt="Graphic Element"
            width={200}
            height={60}
            priority
          />
        </div>

        {/* Menu items */}
        <div className="flex flex-col mt-12 space-y-6">
          {roles.map((role, i) => (
            <button
              key={role}
              ref={el => { itemsRef.current[i] = el }}
              onClick={() => setOpen(false)}
              className="text-3xl font-semibold uppercase tracking-wide focus:outline-none text-left"
            >
              {role}
            </button>
          ))}
        </div>
      </div>
    </>
  )
}
