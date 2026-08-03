'use client'

import { useEffect } from 'react'
import { animate } from 'animejs'

type SectionState = {
  svgRevealTimeout: ReturnType<typeof setTimeout> | null
  onSvgComplete: ((e: Event) => void) | null
  enterGeneration: number
  isActive: boolean
}

export function ScrollEffects() {
  useEffect(() => {
    const scrollContainer = document.querySelector<HTMLElement>('main')
    if (!scrollContainer) return

    const sections = Array.from(scrollContainer.querySelectorAll<HTMLElement>('section'))
    const sectionStates = new Map<HTMLElement, SectionState>()

    const getSectionState = (section: HTMLElement): SectionState => {
      let state = sectionStates.get(section)
      if (!state) {
        state = {
          svgRevealTimeout: null,
          onSvgComplete: null,
          enterGeneration: 0,
          isActive: false,
        }
        sectionStates.set(section, state)
      }
      return state
    }

    const isContentChild = (el: HTMLElement) =>
      !el.hasAttribute('data-svg-container') &&
      !el.classList.contains('blackboard') &&
      // A wrapper that holds SVG containers must stay visible so the draw
      // animation is seen as it happens, rather than fading in once complete.
      !el.querySelector('[data-svg-container]')

    const fadeInFrameChildren = (frame: HTMLElement) => {
      Array.from(frame.children).forEach((child) => {
        const el = child as HTMLElement
        if (isContentChild(el)) {
          animate(el, {
            opacity: [0, 1],
            ease: 'easeInOutQuad',
            duration: 250,
          })
        }
      })
    }

    const fadeOutFrameChildren = (frame: HTMLElement) => {
      Array.from(frame.children).forEach((child) => {
        const el = child as HTMLElement
        if (isContentChild(el)) {
          animate(el, {
            opacity: [1, 0],
            ease: 'easeInOutQuad',
            duration: 300,
          })
        }
      })
    }

    const clearSectionPending = (section: HTMLElement) => {
      const state = getSectionState(section)
      if (state.svgRevealTimeout !== null) {
        clearTimeout(state.svgRevealTimeout)
        state.svgRevealTimeout = null
      }
      if (state.onSvgComplete) {
        section.removeEventListener('svg:complete', state.onSvgComplete)
        state.onSvgComplete = null
      }
      state.enterGeneration++
    }

    const leaveSection = (section: HTMLElement, frame: HTMLElement) => {
      const state = getSectionState(section)
      if (!state.isActive) return

      state.isActive = false
      clearSectionPending(section)

      section.querySelectorAll<HTMLElement>('[data-svg-container]').forEach((container) => {
        container.style.opacity = '0'
      })
      fadeOutFrameChildren(frame)
    }

    const enterSection = (section: HTMLElement, index: number) => {
      const frame = section.firstElementChild as HTMLElement | null
      if (!frame) return

      const state = getSectionState(section)
      if (state.isActive) return

      clearSectionPending(section)
      state.isActive = true
      const generation = state.enterGeneration

      animate(frame, {
        y: [48, 0],
        scale: [0.96, 1],
        opacity: [0, 1],
        rotateZ: index % 2 === 0 ? [-0.5, 0] : [0.5, 0],
        ease: 'outExpo',
        duration: 500,
      })

      state.svgRevealTimeout = setTimeout(() => {
        if (generation !== state.enterGeneration || !state.isActive) return
        state.svgRevealTimeout = null

        const containers = section.querySelectorAll<HTMLElement>('[data-svg-container]')

        if (containers.length === 0) {
          fadeInFrameChildren(frame)
          return
        }

        let completed = 0
        const onSvgComplete = () => {
          if (generation !== state.enterGeneration || !state.isActive) return
          completed++
          if (completed >= containers.length) {
            section.removeEventListener('svg:complete', onSvgComplete)
            state.onSvgComplete = null
            fadeInFrameChildren(frame)
          }
        }
        state.onSvgComplete = onSvgComplete
        section.addEventListener('svg:complete', onSvgComplete)

        containers.forEach((container) => {
          container.dataset.pendingPlay = 'true'
          container.style.opacity = '1'
          container.dispatchEvent(new CustomEvent('svg:play', { bubbles: false }))
        })
      }, 100)

      const totalSections = sections.length
      const progress = totalSections > 1 ? index / (totalSections - 1) : 0
      document.documentElement.style.setProperty('--scroll-progress', `${progress}`)
    }

    // All sections start hidden (including home)
    sections.forEach((section) => {
      const frame = section.firstElementChild as HTMLElement | null
      if (!frame) return

      frame.style.opacity = '0'
      frame.style.transform = 'translateY(48px) scale(0.96)'

      section.querySelectorAll<HTMLElement>('[data-svg-container]').forEach((svg) => {
        svg.style.opacity = '0'
      })

      Array.from(frame.children).forEach((child) => {
        const el = child as HTMLElement
        if (isContentChild(el)) {
          el.style.opacity = '0'
        }
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
            enterSection(section, index)
          } else {
            leaveSection(section, frame)
          }
        })
      },
      { root: scrollContainer, threshold: 0.5 }
    )

    sections.forEach((section) => observer.observe(section))

    const rootRect = scrollContainer.getBoundingClientRect()
    const initialSection =
      sections.find((section) => {
        const rect = section.getBoundingClientRect()
        const visibleHeight =
          Math.min(rect.bottom, rootRect.bottom) - Math.max(rect.top, rootRect.top)
        return visibleHeight >= rect.height * 0.5
      }) ?? sections[0]

    if (initialSection) {
      enterSection(initialSection, sections.indexOf(initialSection))
    }

    return () => {
      observer.disconnect()
      document.documentElement.style.removeProperty('--scroll-progress')

      sections.forEach((section) => {
        clearSectionPending(section)
        const frame = section.firstElementChild as HTMLElement | null
        if (frame) {
          frame.style.opacity = ''
          frame.style.transform = ''
          Array.from(frame.children).forEach((child) => {
            const el = child as HTMLElement
            if (isContentChild(el)) {
              el.style.opacity = ''
            }
          })
        }
        section.querySelectorAll<HTMLElement>('[data-svg-container]').forEach((svg) => {
          svg.style.opacity = ''
        })
      })
      sectionStates.clear()
    }
  }, [])

  return null
}
