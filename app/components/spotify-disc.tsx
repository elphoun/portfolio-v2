'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

export type DiscTrack = {
    id: string
    name: string
    artist: string
    album: string
    albumImage: string | null
    url: string
    previewUrl: string | null
    color: string
}

const DEFAULT_COLOR = '#1DB954'

// How long the disc takes to fade out (and back in) when the selected track
// changes. The color/art are swapped at the trough so the change is unseen.
const FADE_MS = 300

// The disc's resting opacity (it sits behind the page as a spinning backdrop).
const DISC_OPACITY = 0.7

// Default diameter. On phones the disc is deliberately wider than the viewport
// so it bleeds off both edges; the section clips the overflow. From `md` up it
// takes the 60vw the desktop composition is built around.
const DEFAULT_SIZE_CLASS = 'h-[135vw] w-[135vw] md:h-[60vw] md:w-[60vw]'

// Subtle grayscale film grain used to texture the crisp album art so it blends
// with the hand-drawn disc. Encoded SVG feTurbulence tile.
const GRAIN =
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

type SpotifyDiscProps = {
    /** The track to display; its color paints the disc and its art is the label. */
    track: DiscTrack | null
    className?: string
    /**
     * Diameter of the disc as any CSS length. Overrides the responsive default
     * (see DEFAULT_SIZE_CLASS).
     */
    size?: string
    /** Seconds per rotation. */
    spinSeconds?: number
}

/**
 * A spinning vinyl (disc.svg) whose stroke color is the primary color of the
 * given track, with the album art as the center label. Controlled: the parent
 * decides which track is shown (e.g. via the display case).
 */
export function SpotifyDisc({
    track,
    className = '',
    size,
    spinSeconds = 16,
}: SpotifyDiscProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    // Host element that the Spotify Embed API replaces with its <iframe> player.
    const embedRef = useRef<HTMLDivElement>(null)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const controllerRef = useRef<any>(null)
    const currentUriRef = useRef<string | null>(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const isPlayingRef = useRef(isPlaying)
    isPlayingRef.current = isPlaying

    // Cross-fade the disc on track change: `displayed` lags `track` by one fade
    // so the color/art swap happens while the disc is invisible, then it fades
    // back in. Playback (below) still follows `track` immediately.
    const [displayed, setDisplayed] = useState<DiscTrack | null>(track)
    const [discVisible, setDiscVisible] = useState(true)

    const color = displayed?.color ?? DEFAULT_COLOR
    // Keep the latest color available inside the (async) load closure.
    const colorRef = useRef(color)
    colorRef.current = color

    const canPlay = Boolean(track?.id)

    // Fade out, swap in the new track's color/art at the trough, then fade in.
    useEffect(() => {
        if (track?.id === displayed?.id) {
            // Same track (or a metadata refresh): update in place, no fade.
            setDisplayed(track)
            return
        }
        setDiscVisible(false)
        const timer = setTimeout(() => {
            setDisplayed(track)
            setDiscVisible(true)
        }, FADE_MS)
        return () => clearTimeout(timer)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [track?.id])

    const togglePlay = () => {
        controllerRef.current?.togglePlay?.()
    }

    // Load the Spotify Embed iFrame API and (re)point it at the selected track.
    // preview_url is deprecated, so the official embed is how playback works:
    // full track for logged-in Premium visitors, a 30s clip otherwise.
    useEffect(() => {
        if (typeof window === 'undefined' || !track?.id) return
        const uri = `spotify:track:${track.id}`
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const w = window as any
        let cancelled = false

        const ensure = () => {
            if (cancelled) return
            // Already have a controller: just swap the track.
            if (controllerRef.current) {
                if (currentUriRef.current !== uri) {
                    controllerRef.current.loadUri(uri)
                    currentUriRef.current = uri
                    if (isPlayingRef.current) controllerRef.current.play?.()
                }
                return
            }
            if (!w.SpotifyIframeApi || !embedRef.current) return
            w.SpotifyIframeApi.createController(
                embedRef.current,
                { width: '100%', height: 80, uri },
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (controller: any) => {
                    controllerRef.current = controller
                    currentUriRef.current = uri
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    controller.addListener('playback_update', (e: any) => {
                        setIsPlaying(!e?.data?.isPaused)
                    })
                }
            )
        }

        if (w.SpotifyIframeApi) {
            ensure()
        } else {
            const prev = w.onSpotifyIframeApiReady
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            w.onSpotifyIframeApiReady = (api: any) => {
                w.SpotifyIframeApi = api
                if (typeof prev === 'function') prev(api)
                ensure()
            }
            if (!document.getElementById('spotify-iframe-api')) {
                const s = document.createElement('script')
                s.id = 'spotify-iframe-api'
                s.src = 'https://open.spotify.com/embed/iframe-api/v1'
                s.async = true
                document.body.appendChild(s)
            }
        }

        return () => {
            cancelled = true
        }
    }, [track?.id])

    // Load the disc SVG once (static — no draw-in). ScrollEffects fades the
    // whole disc in as a normal content child, in step with the album covers.
    useEffect(() => {
        const container = containerRef.current
        if (!container) return
        let cancelled = false

        fetch('/assets/disc.svg')
            .then((res) => (res.ok ? res.text() : ''))
            .then((svgText) => {
                if (cancelled || !svgText.includes('<svg')) return
                container.innerHTML = svgText
                const svgRoot = container.querySelector('svg')
                if (!svgRoot) return
                svgRoot.setAttribute('width', '100%')
                svgRoot.setAttribute('height', '100%')
                svgRoot.classList.add('block', 'h-full', 'w-full')
                svgRoot
                    .querySelectorAll<SVGElement>('line, circle, path, polyline, rect')
                    .forEach((el) => el.setAttribute('stroke', colorRef.current))
            })

        return () => {
            cancelled = true
            container.innerHTML = ''
        }
    }, [])

    // Recolor the strokes whenever the selected track's color changes.
    useEffect(() => {
        const svg = containerRef.current?.querySelector('svg')
        if (!svg) return
        svg
            .querySelectorAll<SVGElement>('line, circle, path, polyline, rect')
            .forEach((el) => el.setAttribute('stroke', color))
    }, [color])

    return (
        <>
        <div className={`flex flex-col items-center gap-3 ${className}`}>
            <div
                className={`relative animate-spin ${size ? '' : DEFAULT_SIZE_CLASS}`}
                style={{
                    width: size,
                    height: size,
                    animationDuration: `${spinSeconds}s`,
                    opacity: discVisible ? DISC_OPACITY : 0,
                    transition: `opacity ${FADE_MS}ms ease`,
                }}
                role={canPlay ? 'button' : undefined}
                aria-label={
                    canPlay ? (isPlaying ? 'Pause preview' : 'Play preview') : undefined
                }
            >
                <div
                    ref={containerRef}
                    aria-hidden="true"
                    className="absolute inset-0"
                />

                {displayed?.albumImage ? (
                    <>
                        {/* Album art acts as the record label; shares the rotating
                            wrapper so it spins with the disc. Keyed so switching
                            tracks retriggers a fade-in. */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            key={displayed.id}
                            onClick={canPlay ? togglePlay : undefined}
                            src={displayed.albumImage}
                            alt={`${displayed.name} album art`}
                            className={`z-20 disc-label absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full object-cover shadow-md ${canPlay ? 'cursor-pointer' : ''}`}
                            style={{ width: '42%', height: '42%' }}
                        />
                        {/* Grain overlay to texture the album art. */}
                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full mix-blend-overlay"
                            style={{
                                width: '42%',
                                height: '42%',
                                backgroundImage: GRAIN,
                                opacity: 0.35,
                            }}
                        />
                    </>
                ) : null}
            </div>


            <style>{`
                .disc-label { animation: discLabelFade 400ms ease; }
                @keyframes discLabelFade { from { opacity: 0; } to { opacity: 1; } }
            `}</style>
        </div>

        {/* Spotify Embed player: the API replaces this div with its iframe.
            Kept in the tree (even before draw) so the controller can attach.
            It sits outside the disc wrapper on purpose -- the disc is a backdrop
            at a negative z-index, and an iframe buried in there can't be clicked. */}
        <div
            className={`fixed bottom-4 left-1/2 z-20 w-[calc(100%-1.5rem)] max-w-[20rem] -translate-x-1/2 overflow-hidden rounded-xl shadow-md transition-opacity duration-300 md:bottom-20 md:left-auto md:right-20 md:w-full md:translate-x-0 ${
                track ? 'opacity-100' : 'pointer-events-none opacity-0'
            }`}
        >
            <div ref={embedRef} />
        </div>
        </>
    )
}
