'use client'

import { useEffect, useRef } from 'react'
import { animate, stagger, svg } from 'animejs'

type AnimatedSvgProps = {
  src?: string
  className?: string
  style?: React.CSSProperties
  duration?: number
  delayStep?: number
  /**
   * If true (default), the draw animation plays immediately after the SVG loads,
   * and replays every time a 'svg:play' event is dispatched on the container.
   * If false, it only plays on 'svg:play' events (first one triggers load + play).
   */
  autoplay?: boolean
  /**
   * If true, delay is only applied on non-mobile displays (md and up)
   */
  delayOnDesktopOnly?: boolean
}

export function AnimatedSvg({
  src = '/assets/whimsicott.svg',
  className = 'w-full max-w-60 lg:max-w-[580px]',
  style,
  duration = 1200,
  delayStep = 20,
  autoplay = true,
  delayOnDesktopOnly = false,
}: AnimatedSvgProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  // Ref to the loaded svgRoot so replay doesn't need to re-fetch
  const svgRootRef = useRef<SVGSVGElement | null>(null)
  // Drawables are measured with getTotalLength(), which is a synchronous layout
  // read per element, so they're built once per loaded SVG and reused on replay.
  const drawablesRef = useRef<{
    targets: SVGGeometryElement[]
    drawables: ReturnType<typeof svg.createDrawable>
  } | null>(null)
  const playGenerationRef = useRef(0)
  const pendingPlayRef = useRef(false)
  const isMobileRef = useRef(false)

  useEffect(() => {
    const checkMobile = () => {
      isMobileRef.current = window.innerWidth < 768
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let isCancelled = false

    const getDrawables = (svgRoot: SVGSVGElement) => {
      if (drawablesRef.current) return drawablesRef.current

      const targets = Array.from(
        svgRoot.querySelectorAll<SVGGeometryElement>('path, line, polyline, rect')
      )
      drawablesRef.current = {
        targets,
        drawables: targets.flatMap((target) => svg.createDrawable(target)),
      }
      return drawablesRef.current
    }

    const playAnimation = () => {
      const svgRoot = svgRootRef.current
      if (!svgRoot) {
        pendingPlayRef.current = true
        return
      }

      pendingPlayRef.current = false
      delete container.dataset.pendingPlay

      const generation = ++playGenerationRef.current

      const notifyComplete = () => {
        if (generation !== playGenerationRef.current) return
        container.dispatchEvent(new CustomEvent('svg:complete', { bubbles: true }))
      }

      const { targets, drawables } = getDrawables(svgRoot)

      if (targets.length === 0) {
        animate(svgRoot, {
          opacity: [0, 1],
          scale: [0.985, 1],
          ease: 'outQuad',
          duration: Math.min(duration, 700),
          onComplete: notifyComplete,
        })
        return
      }

      // Clear pre-hide opacity so stroke draw is visible
      targets.forEach((target) => {
        target.style.opacity = ''
      })

      const actualDelayStep = delayOnDesktopOnly && isMobileRef.current ? 0 : delayStep

      animate(drawables, {
        draw: ['0 0', '0 1'],
        ease: 'inOutSine',
        duration,
        delay: stagger(actualDelayStep),
        onComplete: notifyComplete,
      })
    }

    const onPlay = () => {
      pendingPlayRef.current = true
      playAnimation()
    }
    container.addEventListener('svg:play', onPlay)

    // ScrollEffects may dispatch svg:play before this effect runs
    if (container.dataset.pendingPlay === 'true' || container.style.opacity === '1') {
      pendingPlayRef.current = true
    }

    const run = async () => {
      if (!src) return

      let svgText: string
      try {
        const response = await fetch(src)
        if (!response.ok) return
        svgText = await response.text()
      } catch {
        return
      }

      if (isCancelled) return
      if (!svgText.includes('<svg')) return

      container.innerHTML = svgText

      const svgRoot = container.querySelector('svg')
      if (!svgRoot) return

      svgRoot.setAttribute('width', '100%')
      svgRoot.setAttribute('height', '100%')
      svgRoot.classList.add('block', 'h-full', 'w-full')
      svgRootRef.current = svgRoot
      drawablesRef.current = null

      if (autoplay || pendingPlayRef.current) {
        playAnimation()
      } else {
        getDrawables(svgRoot).targets.forEach((target) => {
          target.style.opacity = '0'
        })
      }
    }

    run()

    return () => {
      isCancelled = true
      svgRootRef.current = null
      drawablesRef.current = null
      container.removeEventListener('svg:play', onPlay)
      container.innerHTML = ''
    }
  }, [src, duration, delayStep, autoplay, delayOnDesktopOnly])

  return <div ref={containerRef} className={className} style={style} aria-hidden="true" data-svg-container />
}
