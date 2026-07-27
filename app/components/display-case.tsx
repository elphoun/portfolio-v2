'use client'

import type { CSSProperties, KeyboardEvent } from 'react'
import { AnimatedSvg } from './home-hero-draw'

/**
 * The six pedestals inside /public/games/displaycase.svg, keyed by position.
 * Coordinates are in the display case's own viewBox space (2386 x 1040).
 * `cx` is the pedestal's horizontal center, `restY` is the plate surface an item
 * "sits" on, and `ceilY` is the top of the usable space above that plate.
 */
export type Slot =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right'

const VIEWBOX_WIDTH = 2386
const VIEWBOX_HEIGHT = 1040

const SLOTS: Record<Slot, { cx: number; restY: number; ceilY: number }> = {
  'top-left': { cx: 1270, restY: 150, ceilY: 22 },
  'top-center': { cx: 1553, restY: 150, ceilY: 22 },
  'top-right': { cx: 1842, restY: 150, ceilY: 22 },
  'bottom-left': { cx: 1273, restY: 337, ceilY: 240 },
  'bottom-center': { cx: 1556, restY: 337, ceilY: 240 },
  'bottom-right': { cx: 1845, restY: 337, ceilY: 240 },
}

const COLUMN_WIDTH = 240

export type DisplayCaseItem = {
  /** Stable id used for selection. */
  id: string
  /** Path to the image to show, e.g. '/games/pokemon.svg' */
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
  const cellH = Math.min(cellW, availableH)

  const gridW = cellW * cols + gap * (cols - 1)
  const startX = cx - gridW / 2
  const startY = restY - cellH

  return Array.from({ length: count }, (_, i) => {
    const size = Math.min(cellW, cellH)
    return {
      cx: startX + i * (cellW + gap) + cellW / 2,
      cy: startY + cellH / 2,
      size,
    }
  })
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
    <div className={className} style={style}>
      <div className="relative w-full">
        {/* The case itself, drawn in with the shared stroke animation. */}
        <AnimatedSvg
          src="/games/displaycase.svg"
          className="absolute inset-0 h-full w-full"
          duration={1200}
          delayStep={2}
          autoplay={false}
          delayOnDesktopOnly={true}
        />

        {/* Interactive item overlay, sharing the case's coordinate space. */}
        <svg
          viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
          className="relative block h-auto w-full"
          role={interactive ? 'group' : 'img'}
          aria-label="Game display case"
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

          <g className={interactive ? 'di-interactive' : undefined}>
            {[...groups.entries()].flatMap(([slot, groupItems]) => {
              const placements = layoutSlot(groupItems.length, slot, gap)
              return groupItems.map((item, i) => {
                const { cx, cy, size } = placements[i]
                const isSelected = item.id === selectedId
                return (
                  <g
                    key={item.id}
                    className={`di-item${isSelected ? ' is-selected' : ''}`}
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
              })
            })}
          </g>
        </svg>
      </div>
    </div>
  )
}
