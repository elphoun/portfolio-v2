'use client'

import { useEffect, useState } from 'react'
import { SectionContainer } from '../components/section-container'
import { DisplayCase, type DisplayCaseItem, type Slot } from '../components/display-case'
import { Fredericka_the_Great } from "next/font/google"
import { SpotifyDisc, type DiscTrack } from '../components/spotify-disc'

// Pedestals to spread the top tracks across (top row, then bottom row).
const SLOT_ORDER: Slot[] = [
    'top-left',
    'top-center',
    'top-right',
    'bottom-left',
    'bottom-center',
    'bottom-right',
]

const fredericka = Fredericka_the_Great({ subsets: ['latin'], weight: ['400'], adjustFontFallback: false })

export const RandomPage = () => {
    const [tracks, setTracks] = useState<DiscTrack[]>([])
    const [selectedId, setSelectedId] = useState<string | undefined>(undefined)

    // Load the top tracks (with precomputed colors) once on mount.
    useEffect(() => {
        let cancelled = false
        fetch('/api/spotify/disc-color')
            .then((res) => (res.ok ? res.json() : null))
            .then((data: { tracks?: DiscTrack[] } | null) => {
                if (cancelled || !data?.tracks) return
                setTracks(data.tracks)
                setSelectedId((cur) => cur ?? data.tracks?.[0]?.id)
            })
            .catch(() => {
                /* graceful: no tracks -> fallback disc */
            })
        return () => {
            cancelled = true
        }
    }, [])

    const selected = tracks.find((t) => t.id === selectedId) ?? tracks[0] ?? null

    // Album covers become the interactive items in the display case.
    const items: DisplayCaseItem[] = tracks
        .filter((t) => t.albumImage)
        .map((track, i) => ({
            id: track.id,
            src: track.albumImage as string,
            alt: `${track.name} — ${track.artist}`,
            slot: SLOT_ORDER[i % SLOT_ORDER.length],
        }))

    return (
        // overflow-hidden lets the oversized mobile disc bleed past the viewport
        // edges without making the page horizontally scrollable.
        <SectionContainer className="overflow-hidden p-0 md:pr-10 md:p-0 lg:pr-20 lg:pl-0" id="random">
            {/* ScrollEffects transforms this element (it is the section's first
                child), which makes it the containing block for the fixed disc, so
                it has to stay in flow and span the section. */}
            <div className="flex w-full flex-1 min-h-0">
                {/* This column is full-width but mostly empty, and the disc behind
                    it sits at a negative z-index, so it has to let clicks through
                    to reach the disc's play control. */}
                <div className="pointer-events-none absolute bottom-0 left-0 flex flex-col w-full flex-1 justify-end min-h-0 md:-left-20">
                    <h1 className={`${fredericka.className} text-[#FAEED6] text-center md:pl-24 md:text-left text-[clamp(2.25rem,6vw,6rem)]`}>
                        Random :)
                    </h1>
                    <DisplayCase
                        items={items}
                        selectedId={selected?.id}
                        onSelect={setSelectedId}
                        className="pointer-events-auto w-full h-auto md:w-[50%]"
                    />
                </div>
                {/* On phones the disc is centered in the space above the display
                    case; on desktop it hangs off the top-right as a backdrop. */}
                <SpotifyDisc
                    track={selected}
                    className="fixed -z-10 top-[36%] left-1/2 -translate-x-1/2 -translate-y-1/2 md:top-0 md:left-auto md:right-0 md:translate-x-0 md:translate-y-0"
                />
            </div>
        </SectionContainer>
    )
}
