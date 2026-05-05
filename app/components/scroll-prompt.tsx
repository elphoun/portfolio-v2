'use client'

import { useEffect, useState } from 'react'

export function ScrollPrompt() {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      // Hide prompt if user has scrolled down
      const scrollTop = document.querySelector('main')?.scrollTop || 0
      setIsVisible(scrollTop < 100)
    }

    const main = document.querySelector('main')
    if (!main) return

    main.addEventListener('scroll', handleScroll)
    return () => main.removeEventListener('scroll', handleScroll)
  }, [])

  if (!isVisible) return null

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-2 animate-bounce">
      <p className="text-sm text-[#3D2817] font-medium">Scroll down</p>
      <svg
        className="w-5 h-5 text-[#3D2817]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 14l-7 7m0 0l-7-7m7 7V3"
        />
      </svg>
    </div>
  )
}
