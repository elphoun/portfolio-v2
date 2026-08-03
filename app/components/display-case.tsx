'use client'

import type { CSSProperties, KeyboardEvent } from 'react'
import { useEffect, useRef, useState } from 'react'
import { AnimatedSvg } from './animated-svg'

/**
 * The six pedestals inside /public/random/displaycase.svg, keyed by position.
 * Coordinates are in the overlay's viewBox space (VIEWBOX_WIDTH x VIEWBOX_HEIGHT
 * below), which the case SVG is stretched to fill.
 * `cx` is the pedestal's horizontal center (the cup), `restY` is the cup rim an
 * item "sits" on, and `ceilY` is the top of the usable space above that cup.
 */
export type Slot =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right'

const VIEWBOX_WIDTH = 1550
const VIEWBOX_HEIGHT = 850
const CX1 = 675;
const CX2 = 930;
const CX3 = 1200;
const CY1 = 130;
const CY2 = 315;

// How much usable space sits above each pedestal rim: the ceiling (top of the
// slot) is this many units above restY. Larger = taller covers allowed.
const CEIL_OFFSET = 85;

const SLOTS: Record<Slot, { cx: number; restY: number; ceilY: number }> = {
  'top-left': { cx: CX1, restY: CY1, ceilY: CY1 - CEIL_OFFSET },
  'top-center': { cx: CX2, restY: CY1, ceilY: CY1 - CEIL_OFFSET },
  'top-right': { cx: CX3, restY: CY1, ceilY: CY1 - CEIL_OFFSET },
  'bottom-left': { cx: CX1, restY: CY2, ceilY: CY2 - CEIL_OFFSET },
  'bottom-center': { cx: CX2, restY: CY2, ceilY: CY2 - CEIL_OFFSET },
  'bottom-right': { cx: CX3, restY: CY2, ceilY: CY2 - CEIL_OFFSET },
}

const COLUMN_WIDTH = 220

// Must match the transforms applied in the <style> block below so layout can
// reserve room for them: covers scale up on hover and drift upward while
// floating. Without this headroom, an enlarged/raised cover clips the case.
const HOVER_SCALE = 1.1
const FLOAT_RISE = 11

export type DisplayCaseItem = {
  /** Stable id used for selection. */
  id: string
  /** Image to show on the pedestal, e.g. a Spotify album art URL. */
  src: string
  /** Accessible label for the item. */
  alt?: string
  /** Which pedestal this item sits on. Defaults to the top-left pedestal. */
  slot?: Slot
}

type DisplayCaseProps = {
  /** Items placed on the pedestals. Change this to update the case. */
  items: DisplayCaseItem[]
  /** Currently selected item id (highlighted). */
  selectedId?: string
  /** When provided, items become clickable controls. */
  onSelect?: (id: string) => void
  /** Gap between items that share a pedestal, in viewBox units. */
  gap?: number
  className?: string
  style?: CSSProperties
}

/**
 * Lays items out in a centered row that is bottom-aligned to the pedestal's
 * plate, and returns the placement box for each item.
 */
function layoutSlot(count: number, slot: Slot, gap: number) {
  const { cx, restY, ceilY } = SLOTS[slot]
  const cols = Math.max(count, 1)

  const cellW = (COLUMN_WIDTH - gap * (cols - 1)) / cols
  const availableH = restY - ceilY

  // Shrink the cover so that, once it floats up and scales on hover, it still
  // fits between the case ceiling (ceilY) and the pedestal rim (restY).
  const maxSize = (availableH - FLOAT_RISE) / HOVER_SCALE
  const size = Math.max(0, Math.min(cellW, maxSize))

  // Bottom-align to the pedestal, but leave room for the hover scale so the
  // enlarged cover doesn't overhang the rim.
  const cy = restY - (size * HOVER_SCALE) / 2

  const gridW = size * cols + gap * (cols - 1)
  const startX = cx - gridW / 2

  return Array.from({ length: count }, (_, i) => ({
    cx: startX + i * (size + gap) + size / 2,
    cy,
    size,
  }))
}

export function DisplayCase({
  items,
  selectedId,
  onSelect,
  gap = 12,
  className,
  style,
}: DisplayCaseProps) {
  const interactive = typeof onSelect === 'function'

  // Items stay hidden until the case itself finishes drawing in. The case's
  // AnimatedSvg dispatches a bubbling `svg:complete` when its draw finishes;
  // `svg:play` is non-bubbling, so we catch it in the capture phase to re-hide
  // the items whenever the case replays (e.g. scrolling back into view).
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return

    const onPlay = () => setRevealed(false)
    const onComplete = () => setRevealed(true)

    wrapper.addEventListener('svg:play', onPlay, true) // capture: svg:play doesn't bubble
    wrapper.addEventListener('svg:complete', onComplete)
    return () => {
      wrapper.removeEventListener('svg:play', onPlay, true)
      wrapper.removeEventListener('svg:complete', onComplete)
    }
  }, [])

  const groups = new Map<Slot, DisplayCaseItem[]>()
  for (const item of items) {
    const slot = item.slot ?? 'top-left'
    const group = groups.get(slot) ?? []
    group.push(item)
    groups.set(slot, group)
  }

  const onKeyActivate = (id: string) => (e: KeyboardEvent<SVGGElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onSelect?.(id)
    }
  }

  return (
    <div className={className} style={style} ref={wrapperRef}>
      <div className="relative w-full">
        {/* The case itself, drawn in with the shared stroke animation. */}
        <AnimatedSvg
          src="/random/displaycase.svg"
          className="absolute bottom-0 left-0 inset-0 h-full w-full"
          duration={800}
          delayStep={1}
          autoplay={false}
          delayOnDesktopOnly={true}
        />

        {/* Interactive item overlay, sharing the case's coordinate space. */}
        <svg
          viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
          className="relative block h-auto w-full"
          role={interactive ? 'group' : 'img'}
          aria-label="Top tracks display case"
        >
          <defs>
            <filter id="display-item-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="3" stdDeviation="4" floodOpacity="0.35" />
            </filter>
            <radialGradient id="display-item-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FAEED6" stopOpacity="0.6" />
              <stop offset="55%" stopColor="#FAEED6" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#FAEED6" stopOpacity="0" />
            </radialGradient>
          </defs>
          <style>{`
            /* Hold all items hidden until the case has drawn in. */
            .di-items { opacity: 0; }
            .di-items.di-revealed { opacity: 1; transition: opacity 250ms ease; }
            .di-items:not(.di-revealed) { pointer-events: none; }

            /* Covers gently levitate above their pedestals once revealed. */
            @keyframes di-float {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-11px); }
            }
            .di-items.di-revealed .di-item {
              animation: di-float 3.4s ease-in-out infinite;
              will-change: transform;
            }
            @media (prefers-reduced-motion: reduce) {
              .di-items.di-revealed .di-item { animation: none; }
            }

            .di-item { transition: opacity 160ms ease; }
            .di-interactive .di-item { cursor: pointer; opacity: 0.55; }
            .di-interactive .di-item.is-selected { opacity: 1; }
            .di-interactive .di-item:hover,
            .di-interactive .di-item:focus-visible { opacity: 1; outline: none; }

            .di-glow { opacity: 0; transition: opacity 220ms ease; }
            .di-interactive .di-item.is-selected .di-glow { opacity: 1; }
            .di-interactive .di-item:hover .di-glow,
            .di-interactive .di-item:focus-visible .di-glow { opacity: 0.9; }

            .di-art { transform-box: fill-box; transform-origin: center; transition: transform 200ms ease; }
            .di-interactive .di-item.is-selected .di-art { transform: scale(1.06); }
            .di-interactive .di-item:hover .di-art,
            .di-interactive .di-item:focus-visible .di-art { transform: scale(1.1); }
          `}</style>

          <g
            className={`di-items${revealed ? ' di-revealed' : ''}${
              interactive ? ' di-interactive' : ''
            }`}
          >
            {[...groups.entries()]
              .flatMap(([slot, groupItems]) => {
                const placements = layoutSlot(groupItems.length, slot, gap)
                return groupItems.map((item, i) => ({ item, ...placements[i] }))
              })
              .map(({ item, cx, cy, size }, idx) => {
                const isSelected = item.id === selectedId
                return (
                  <g
                    key={item.id}
                    className={`di-item outline-0 ${isSelected ? 'is-selected' : ''}`}
                    // Stagger the float so covers bob out of phase.
                    style={{ animationDelay: `${(idx % 6) * 0.35}s` }}
                    onClick={interactive ? () => onSelect?.(item.id) : undefined}
                    onKeyDown={interactive ? onKeyActivate(item.id) : undefined}
                    role={interactive ? 'button' : undefined}
                    aria-pressed={interactive ? isSelected : undefined}
                    aria-label={item.alt}
                    tabIndex={interactive ? 0 : undefined}
                  >
                    {interactive ? (
                      <circle
                        className="di-glow"
                        cx={cx}
                        cy={cy}
                        r={size * 0.85}
                        fill="url(#display-item-glow)"
                      />
                    ) : null}
                    <image
                      className="di-art"
                      href={item.src}
                      x={cx - size / 2}
                      y={cy - size / 2}
                      width={size}
                      height={size}
                      preserveAspectRatio="xMidYMid meet"
                      filter="url(#display-item-shadow)"
                    >
                      {item.alt ? <title>{item.alt}</title> : null}
                    </image>
                  </g>
                )
              })}
          </g>
        </svg>
      </div>
    </div>
  )
}
