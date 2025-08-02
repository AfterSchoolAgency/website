'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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

  // close on outside click
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
      <button onClick={() => setOpen(o => !o)} aria-label="Toggle menu" className="focus:outline-none">
        {/* Unroll animation: reveal SVG left→right */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: open ? 1 : 0 }}
          transition={{ duration: 1.6, ease: 'easeInOut' }}
          style={{ originX: 0 }}
        >
          <Image
            src="/GRAPHIC ELEMENT.svg"
            alt="Logo"
            width={200}
            height={60}
            className="pointer-events-none"
          />
        </motion.div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ delay: 1.6 }}
            className="mt-2 ml-4 bg-white/90 backdrop-blur shadow-md rounded p-4 space-y-1 font-sans text-sm"
          >
            {roles.map(role => (
              <li key={role} className="text-black">
                {role}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}
