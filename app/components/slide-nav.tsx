'use client'

import { useEffect, useState } from 'react'

// 'games' temporarily removed while the Games section is hidden.
const SECTION_IDS = ['home', 'experience']

function scrollToSection(id: string) {
  const main = document.querySelector<HTMLElement>('main')
  const target = document.getElementById(id)
  if (!main || !target) return
  main.scrollTo({ top: target.offsetTop, behavior: 'smooth' })
}

function ArrowButton({
  direction,
  disabled,
  onClick,
}: {
  direction: 'up' | 'down'
  disabled: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === 'up' ? 'Previous slide' : 'Next slide'}
      style={{ opacity: disabled ? 0 : undefined, pointerEvents: disabled ? 'none' : undefined }}
      className="group flex items-center justify-center w-10 h-10 rounded-full bg-black/15 backdrop-blur-sm border border-white/20 transition-all duration-300 opacity-60 hover:opacity-100 hover:bg-black/25 hover:scale-110 cursor-pointer"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={[
          'text-[#1D1712] transition-transform duration-200',
          direction === 'up' ? 'group-hover:-translate-y-0.5' : 'group-hover:translate-y-0.5',
        ].join(' ')}
      >
        {direction === 'up' ? (
          <path d="M18 15l-6-6-6 6" />
        ) : (
          <path d="M6 9l6 6 6-6" />
        )}
      </svg>
    </button>
  )
}

export function SlideNav() {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const scrollContainer = document.querySelector<HTMLElement>('main')
    if (!scrollContainer) return

    const sections = SECTION_IDS
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = SECTION_IDS.indexOf((entry.target as HTMLElement).id)
            if (idx !== -1) setActiveIndex(idx)
          }
        })
      },
      { root: scrollContainer, threshold: 0.5 }
    )

    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  return (
    <>
      {/* Left side: dot indicators */}
      <div className="fixed left-6 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-3">
        {SECTION_IDS.map((id, i) => (
          <button
            key={id}
            onClick={() => scrollToSection(id)}
            aria-label={`Go to ${id}`}
            className={[
              'rounded-full transition-all duration-300 cursor-pointer border-0 p-0',
              i === activeIndex
                ? 'w-2.5 h-2.5 bg-[#1D1712]'
                : 'w-2 h-2 bg-[#1D1712]/30 hover:bg-[#1D1712]/60',
            ].join(' ')}
          />
        ))}
      </div>

      {/* Right side: up/down arrows */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-3">
        <ArrowButton
          direction="up"
          disabled={activeIndex === 0}
          onClick={() => scrollToSection(SECTION_IDS[activeIndex - 1])}
        />
        <ArrowButton
          direction="down"
          disabled={activeIndex === SECTION_IDS.length - 1}
          onClick={() => scrollToSection(SECTION_IDS[activeIndex + 1])}
        />
      </div>
    </>
  )
}
