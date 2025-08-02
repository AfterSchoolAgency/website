'use client'

import { useState, useRef, useEffect } from 'react'
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
  const containerRef = useRef<HTMLDivElement>(null)

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Prevent background scroll
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <div ref={containerRef}>
      {/* Trigger button: unroll the graphic element */}
      <div
        className="fixed top-6 left-6 z-50 overflow-hidden origin-left"
        style={{
          transform: open ? 'scaleX(1)' : 'scaleX(0)',
          transition: 'transform 1s ease-in-out',
        }}
      >
        <button
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="focus:outline-none"
        >
          <Image
            src="/GRAPHIC ELEMENT.svg"
            alt="Graphic Element"
            width={200}
            height={60}
            priority
          />
        </button>
      </div>

      {/* Full-screen overlay with unroll reveal */}
      <div
        className="fixed inset-0 bg-white z-40 origin-left"
        style={{
          transform: open ? 'scaleX(1)' : 'scaleX(0)',
          transition: 'transform 1s ease-in-out',
          pointerEvents: open ? 'auto' : 'none',
        }}
      >
        {/* Close button */}
        <button
          onClick={() => setOpen(false)}
          aria-label="Close menu"
          className="absolute top-6 right-6 text-3xl font-bold focus:outline-none"
        >
          &times;
        </button>

        {/* Logo inside overlay */}
        <div className="absolute top-6 left-6">
          <Image
            src="/GRAPHIC ELEMENT.svg"
            alt="Graphic Element"
            width={200}
            height={60}
            priority
          />
        </div>

        {/* Centered menu items */}
        <div className="h-full flex flex-col items-center justify-center space-y-8 px-4">
          {roles.map(role => (
            <button
              key={role}
              onClick={() => setOpen(false)}
              className="text-4xl font-semibold uppercase tracking-wide focus:outline-none"
            >
              {role}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
