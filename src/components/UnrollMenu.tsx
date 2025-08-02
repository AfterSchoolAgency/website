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
  const itemsRef = useRef<Array<HTMLButtonElement | null>>([])
  // Timeline ref should be gsap.core.Timeline, not Tween
  const tl = useRef<gsap.core.Timeline | null>(null)

  // Initialize GSAP timeline once
  useEffect(() => {
    const overlay = overlayRef.current
    if (!overlay) return

    // Set initial overlay state
    gsap.set(overlay, { height: 0, overflow: 'hidden' })

    // Build timeline
    const timeline = gsap.timeline({ paused: true })
    timeline
      .to(overlay, {
        height: '100vh',
        duration: 0.8,
        ease: 'cubic-bezier(0.23, 1, 0.32, 1)',
        backgroundColor: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(10px)',
      })
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

  // Play or reverse on open change
  useEffect(() => {
    if (tl.current) {
      open ? tl.current.play() : tl.current.reverse()
    }

    // Prevent background scroll
    document.body.style.overflow = open ? 'hidden' : ''
  }, [open])

  return (
    <>
      {/* Trigger: logo or close icon */}
      <div className="fixed top-6 left-6 z-50">
        <button
          onClick={() => setOpen(prev => !prev)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          className="focus:outline-none"
        >
          {open ? (
            <span className="text-3xl font-bold">&times;</span>
          ) : (
            <Image
              src="/GRAPHIC ELEMENT.svg"
              alt="Graphic Element"
              width={200}
              height={60}
              priority
            />
          )}
        </button>
      </div>

      {/* Animated overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-40 flex flex-col items-start px-6"
      >
        {/* Logo in overlay header */}
        <div className="mt-6">
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
              ref={el => (itemsRef.current[i] = el)}
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
