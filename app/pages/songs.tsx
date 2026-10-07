'use client'

import { useEffect, useState } from 'react'
import { SectionContainer } from '../components/section-container'
import { DisplayCase, type DisplayCaseItem, type Slot } from '../components/display-case'
import { Fredericka_the_Great } from "next/font/google"
import { SpotifyDisc, type DiscTrack } from '../components/spotify-disc'

const SLOT_ORDER: Slot[] = [
    'top-left',
    'top-center',
    'top-right',
    'bottom-left',
    'bottom-center',
    'bottom-right',
]

export const RandomPage = () => {
    const [tracks, setTracks] = useState<DiscTrack[]>([])
    const [selectedId, setSelectedId] = useState<string | undefined>(undefined)

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
                // fallback to empty
            })
        return () => {
            cancelled = true
        }
    }, [])

    const selected = tracks.find((t) => t.id === selectedId) ?? tracks[0] ?? null

    const items: DisplayCaseItem[] = tracks
        .filter((t) => t.albumImage)
        .map((track, i) => ({
            id: track.id,
            src: track.albumImage as string,
            alt: `${track.name} — ${track.artist}`,
            slot: SLOT_ORDER[i % SLOT_ORDER.length],
        }))

    return (
        <SectionContainer className="overflow-hidden p-0 md:pr-10 md:p-0 lg:pr-20 lg:pl-0" id="songs">
            <div className="flex w-full flex-1 min-h-0">
                <div className="pointer-events-none absolute bottom-0 left-0 flex flex-col w-full flex-1 justify-end min-h-0 md:-left-20">
                    <DisplayCase
                        items={items}
                        selectedId={selected?.id}
                        onSelect={setSelectedId}
                        className="pointer-events-auto w-full h-auto md:w-[50%]"
                    />
                </div>
                <SpotifyDisc
                    track={selected}
                    className="fixed top-[36%] left-1/2 -translate-x-1/2 -translate-y-1/2 md:top-0 md:left-auto md:right-0 md:translate-x-0 md:translate-y-0"
                />
            </div>
        </SectionContainer>
    )
}
