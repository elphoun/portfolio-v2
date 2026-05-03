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
}

export function AnimatedSvg({
  src = '/assets/whimsicott.svg',
  className = 'w-full max-w-[580px]',
  style,
  duration = 1200,
  delayStep = 20,
  autoplay = true,
}: AnimatedSvgProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  // Ref to the loaded svgRoot so replay doesn't need to re-fetch
  const svgRootRef = useRef<SVGSVGElement | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let isCancelled = false

    const playAnimation = () => {
      const svgRoot = svgRootRef.current
      if (!svgRoot) return

      const drawableTargets = Array.from(
        svgRoot.querySelectorAll<SVGPathElement | SVGLineElement | SVGPolylineElement | SVGRectElement>(
          'path, line, polyline, rect'
        )
      )

      if (drawableTargets.length === 0) {
        animate(svgRoot, {
          opacity: [0, 1],
          scale: [0.985, 1],
          ease: 'outQuad',
          duration: Math.min(duration, 700),
        })
        return
      }

      // Reset all drawables to hidden before replaying
      const drawables = drawableTargets.flatMap((target) => svg.createDrawable(target))
      animate(drawables, {
        draw: ['0 0', '0 1'],
        ease: 'inOutSine',
        duration,
        delay: stagger(delayStep),
      })
    }

    // svg:play fires every time the section enters view — always replay
    const onPlay = () => playAnimation()
    container.addEventListener('svg:play', onPlay)

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

      if (autoplay) {
        playAnimation()
      } else {
        // Hide all paths until first play signal
        const paths = svgRoot.querySelectorAll<SVGElement>('path, line, polyline, rect')
        paths.forEach((p) => { p.style.opacity = '0' })
      }
    }

    run()

    return () => {
      isCancelled = true
      svgRootRef.current = null
      container.removeEventListener('svg:play', onPlay)
      container.innerHTML = ''
    }
  }, [src, duration, delayStep, autoplay])

  return <div ref={containerRef} className={className} style={style} aria-hidden="true" data-svg-container />
}

export function HomeHeroDraw() {
  return <AnimatedSvg />
}
