'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import {
  ComputerOutlineIcon,
  HomeOutlineRoundedIcon,
  HeadphonesOutlineIcon,
  FolderOpenOutlineIcon,
} from '../../components/icons'
import { AnimatedSvg } from './home-hero-draw'

const SECTION_IDS = ['home', 'experience', 'projects', 'other']

const navItems = [
  { id: 'home',       icon: <HomeOutlineRoundedIcon /> },
  { id: 'experience', icon: <FolderOpenOutlineIcon /> },
  { id: 'projects',   icon: <ComputerOutlineIcon /> },
  { id: 'other',      icon: <HeadphonesOutlineIcon /> },
]

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
      className="group flex items-center justify-center w-8 h-8 rounded-full bg-black/15 backdrop-blur-sm border border-black/30 transition-all duration-300 opacity-70 hover:opacity-100 hover:bg-black/30 hover:scale-110 cursor-pointer"
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
          'text-[#3D2817] transition-transform duration-200',
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

export function Navbar() {
  const [activeId, setActiveId] = useState('home')
  const activeIndex = SECTION_IDS.indexOf(activeId)

  useEffect(() => {
    const scrollContainer = document.querySelector<HTMLElement>('main')
    if (!scrollContainer) return

    const sections = Array.from(document.querySelectorAll<HTMLElement>('section[id]'))

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId((entry.target as HTMLElement).id)
          }
        })
      },
      { root: scrollContainer, threshold: 0.5 }
    )

    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  return (
    <aside 
      className="fixed right-6 top-1/2 -translate-y-1/2 z-50 rounded-lg overflow-hidden"
    >
      <AnimatedSvg
        src="/assets/background.svg"
        className="absolute inset-0 w-full h-full object-cover"
        aria-hidden="true"
      />
      <nav
        className="flex flex-col items-center gap-2 px-4 py-6 relative z-10"
        id="nav"
        aria-label="Page sections"
      >
        {/* Up arrow */}
        <ArrowButton
          direction="up"
          disabled={activeIndex === 0}
          onClick={() => scrollToSection(SECTION_IDS[activeIndex - 1])}
        />

        {/* Section icons */}
        <div className="flex flex-col items-center gap-2">
          {navItems.map(({ id, icon }) => (
            <button
              key={id}
              onClick={() => scrollToSection(id)}
              data-nav-id={id}
              data-active={activeId === id ? 'true' : 'false'}
              aria-label={id}
              aria-current={activeId === id ? 'page' : undefined}
              className={[
                'flex items-center justify-center rounded-full p-2 transition-all duration-300 cursor-pointer',
                activeId === id
                  ? 'text-white bg-[#3D2817] scale-110 shadow-sm'
                  : 'text-[#3D2817]/70 hover:text-[#3D2817] hover:bg-black/15',
              ].join(' ')}
            >
              {icon}
            </button>
          ))}
        </div>

        {/* Down arrow */}
        <ArrowButton
          direction="down"
          disabled={activeIndex === SECTION_IDS.length - 1}
          onClick={() => scrollToSection(SECTION_IDS[activeIndex + 1])}
        />
      </nav>
    </aside>
  )
}
