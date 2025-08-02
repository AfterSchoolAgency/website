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
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={containerRef} className="fixed top-6 left-6 z-50">
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="Toggle menu"
        className="focus:outline-none"
      >
        {/* Unroll animation: reveal SVG left→right */}
        <div
          className={
            `overflow-hidden transition-transform duration-700 ease-in-out transform origin-left`
          }
          style={{ transform: open ? 'scaleX(1)' : 'scaleX(0)' }}
        >
          <Image
            src="/GRAPHIC ELEMENT.svg"
            alt="Logo"
            width={200}
            height={60}
            className="pointer-events-none"
          />
        </div>
      </button>

      <ul
        className={
          `absolute top-full left-0 mt-2 ml-4 bg-white/90 backdrop-blur shadow-md rounded p-4 space-y-1 font-sans text-sm transition-opacity duration-500 ease-in-out ` +
          (open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none')
        }
      >
        {roles.map(role => (
          <li key={role} className="text-black">
            {role}
          </li>
        ))}
      </ul>
    </div>
  )
}
