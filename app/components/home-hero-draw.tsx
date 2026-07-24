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
  const playGenerationRef = useRef(0)
  const pendingPlayRef = useRef(false)
  const isMobileRef = useRef(false)

  const debugLog = (event: string, details?: Record<string, unknown>) => {
    if (typeof window === 'undefined') return
    const payload = details ? { event, src, ...details } : { event, src }
    console.log('[AnimatedSvg]', payload)
  }

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

    const playAnimation = () => {
      const svgRoot = svgRootRef.current
      if (!svgRoot) {
        debugLog('playAnimation:missing-svg-root:set-pending')
        pendingPlayRef.current = true
        return
      }

      pendingPlayRef.current = false
      delete container.dataset.pendingPlay

      const generation = ++playGenerationRef.current
      debugLog('playAnimation:start', {
        generation,
        autoplay,
        delayOnDesktopOnly,
        isMobile: isMobileRef.current,
      })

      const notifyComplete = () => {
        if (generation !== playGenerationRef.current) return
        debugLog('playAnimation:complete-dispatch', { generation })
        container.dispatchEvent(new CustomEvent('svg:complete', { bubbles: true }))
      }

      const drawableTargets = Array.from(
        svgRoot.querySelectorAll<SVGPathElement | SVGLineElement | SVGPolylineElement | SVGRectElement>(
          'path, line, polyline, rect'
        )
      )

      if (drawableTargets.length === 0) {
        debugLog('playAnimation:fallback-opacity', { generation })
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
      drawableTargets.forEach((target) => {
        target.style.opacity = ''
      })

      const actualDelayStep = delayOnDesktopOnly && isMobileRef.current ? 0 : delayStep
      debugLog('playAnimation:draw-targets', {
        generation,
        targetCount: drawableTargets.length,
        actualDelayStep,
        duration,
      })

      const drawables = drawableTargets.flatMap((target) => svg.createDrawable(target))
      animate(drawables, {
        draw: ['0 0', '0 1'],
        ease: 'inOutSine',
        duration,
        delay: stagger(actualDelayStep),
        onComplete: notifyComplete,
      })
    }

    const onPlay = () => {
      debugLog('event:svg-play-received', {
        containerOpacity: container.style.opacity || '(empty)',
      })
      pendingPlayRef.current = true
      playAnimation()
    }
    container.addEventListener('svg:play', onPlay)

    // ScrollEffects may dispatch svg:play before this effect runs
    if (container.dataset.pendingPlay === 'true' || container.style.opacity === '1') {
      pendingPlayRef.current = true
      debugLog('init:pending-play-detected', {
        datasetPendingPlay: container.dataset.pendingPlay ?? null,
        containerOpacity: container.style.opacity || '(empty)',
      })
    }

    const run = async () => {
      if (!src) return

      let svgText: string
      try {
        debugLog('fetch:start')
        const response = await fetch(src)
        if (!response.ok) {
          debugLog('fetch:non-ok-response', { status: response.status })
          return
        }
        svgText = await response.text()
      } catch {
        debugLog('fetch:error')
        return
      }

      if (isCancelled) return
      if (!svgText.includes('<svg')) {
        debugLog('fetch:missing-svg-tag')
        return
      }

      container.innerHTML = svgText
      debugLog('fetch:svg-injected')

      const svgRoot = container.querySelector('svg')
      if (!svgRoot) return

      svgRoot.setAttribute('width', '100%')
      svgRoot.setAttribute('height', '100%')
      svgRoot.classList.add('block', 'h-full', 'w-full')
      svgRootRef.current = svgRoot

      if (autoplay || pendingPlayRef.current) {
        debugLog('init:play-after-load', {
          autoplay,
          pendingPlay: pendingPlayRef.current,
        })
        playAnimation()
      } else {
        const paths = svgRoot.querySelectorAll<SVGElement>('path, line, polyline, rect')
        paths.forEach((p) => { p.style.opacity = '0' })
        debugLog('init:hidden-paths-waiting-for-play', { pathCount: paths.length })
      }
    }

    run()

    return () => {
      isCancelled = true
      debugLog('cleanup')
      svgRootRef.current = null
      container.removeEventListener('svg:play', onPlay)
      container.innerHTML = ''
    }
  }, [src, duration, delayStep, autoplay, delayOnDesktopOnly])

  return <div ref={containerRef} className={className} style={style} aria-hidden="true" data-svg-container />
}

export function HomeHeroDraw() {
  return <AnimatedSvg />
}
