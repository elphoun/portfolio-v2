'use client'

import { useEffect } from 'react'
import { animate } from 'animejs'

export function ScrollEffects() {
  useEffect(() => {
    const scrollContainer = document.querySelector<HTMLElement>('main')
    if (!scrollContainer) return

    const sections = Array.from(scrollContainer.querySelectorAll<HTMLElement>('section'))

    // Set initial hidden state for all sections except the first
    sections.forEach((section, index) => {
      const frame = section.firstElementChild as HTMLElement | null
      if (!frame) return
      if (index === 0) {
        frame.style.opacity = '1'
        frame.style.transform = 'none'
      } else {
        frame.style.opacity = '0'
        frame.style.transform = 'translateY(48px) scale(0.96)'
      }

      // Hide all SVG containers initially
      section.querySelectorAll<HTMLElement>('[data-svg-container]').forEach((svg) => {
        svg.style.opacity = '0'
      })
    })

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const section = entry.target as HTMLElement
          const index = sections.indexOf(section)
          const frame = section.firstElementChild as HTMLElement | null
          if (!frame) return

          if (entry.isIntersecting) {
            // Section entering view — animate frame in and show SVGs
            animate(frame, {
              y: [48, 0],
              scale: [0.96, 1],
              opacity: [0, 1],
              rotateZ: index % 2 === 0 ? [-0.5, 0] : [0.5, 0],
              ease: 'outExpo',
              duration: 700,
            })

            // Show and replay SVG animations after entrance animation starts
            setTimeout(() => {
              section.querySelectorAll<HTMLElement>('[data-svg-container]').forEach((container) => {
                container.style.opacity = '1'
                container.dispatchEvent(new CustomEvent('svg:play', { bubbles: false }))
              })
            }, 200)

            // Update scroll progress CSS var
            const totalSections = sections.length
            const progress = totalSections > 1 ? index / (totalSections - 1) : 0
            document.documentElement.style.setProperty('--scroll-progress', `${progress}`)
          } else {
            // Section leaving view — hide SVGs
            section.querySelectorAll<HTMLElement>('[data-svg-container]').forEach((container) => {
              container.style.opacity = '0'
            })
          }
        })
      },
      { root: scrollContainer, threshold: 0.5 }
    )

    sections.forEach((section) => observer.observe(section))

    return () => {
      observer.disconnect()
      document.documentElement.style.removeProperty('--scroll-progress')
      sections.forEach((section) => {
        const frame = section.firstElementChild as HTMLElement | null
        if (frame) {
          frame.style.opacity = ''
          frame.style.transform = ''
        }
        section.querySelectorAll<HTMLElement>('[data-svg-container]').forEach((svg) => {
          svg.style.opacity = ''
        })
      })
    }
  }, [])

  return null
}
