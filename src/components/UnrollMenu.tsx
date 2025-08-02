'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

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

  return (
    <div className="fixed top-6 left-6 z-50">
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="Toggle menu"
        className="focus:outline-none"
      >
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 556 69"
          width="200"
          className="h-auto"
        >
          <motion.path
            d="M1008,754.8h501.6c0-49.1-4.8-98.5-14.4-147-9.6-48.6-24-96.2-43.2-142.8-19.1-46.7-44.3-92.4-75.8-135.1-31.5-42.7-69.2-81.3-113.5-115.2-44.3-33.8-94.1-62.2-147.8-84.4-53.7-22.2-111.1-37.1-170.1-44.5-59-7.5-119.4-7.5-178.4,0-59,7.4-116.4,22.3-170.1,44.5-53.7,22.2-103.5,50.6-147.8,84.4-44.3,33.9-82,72.5-113.5,115.2-31.5,42.7-56.7,88.4-75.8,135.1-19.2,46.6-33.5,94.2-43.2,142.8-9.6,48.5-14.4,97.9-14.4,147H992" 
            stroke="black"
            strokeWidth="2"
            fill="transparent"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: open ? 1 : 0 }}
            transition={{ duration: 1.6, ease: 'easeInOut' }}
          />
        </motion.svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ delay: 1.4 }}
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
