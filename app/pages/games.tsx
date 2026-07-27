'use client'

import { useState } from 'react'
import { SectionContainer } from '../components/section-container'
import { AnimatedSvg } from '../components/home-hero-draw'
import { DisplayCase, type DisplayCaseItem, type Slot } from '../components/display-case'
import { LeafPreview, type Game } from '../components/leaf-preview'

const games: Game[] = [
    { id: 'silksong', title: 'Hollow Knight: Silksong', icon: '/games/silksong.svg', leaf: '/games/silksong-leaf.gif', meta: 'Team Cherry' },
    { id: 'ninesols', title: 'Nine Sols', icon: '/games/ninesols.svg', leaf: '/games/ninesols.svg', meta: 'Red Candle Games' },
    { id: 'mkw', title: 'Mario Kart World', icon: '/games/mkw.svg', leaf: '/games/mkw.svg', meta: 'Nintendo' },
    { id: 'showdown', title: 'Pokémon Showdown', icon: '/games/showdown.svg', leaf: '/games/showdown.svg', meta: 'Smogon' },
    { id: 'gamecube', title: 'GameCube', icon: '/games/gamecube.svg', leaf: '/games/gamecube.svg', meta: 'Nintendo' },
]

// Order the games are placed onto the display case pedestals (left→right, top→bottom).
const GAME_SLOTS: Slot[] = [
    'top-left',
    'top-center',
    'top-right',
    'bottom-left',
    'bottom-center',
    'bottom-right',
]

export const GamesPage = () => {
    const [selectedId, setSelectedId] = useState(games[0]?.id)
    const selected = games.find((g) => g.id === selectedId) ?? games[0]

    const items: DisplayCaseItem[] = games.map((game, i) => ({
        id: game.id,
        src: game.icon,
        alt: game.title,
        slot: GAME_SLOTS[i % GAME_SLOTS.length],
    }))

    return (
        <SectionContainer className="p-0 md:p-0 lg:p-0" id="games">
            <div className="flex w-full flex-1 min-h-0">
                <div className="pointer-events-none rotate-300 fixed right-0 -translate-x-64 -translate-y-20 top-0 z-0 h-full w-full">
                    {selected ? <LeafPreview game={selected} /> : null}
                </div>

                <DisplayCase
                    items={items}
                    selectedId={selected?.id}
                    onSelect={setSelectedId}
                    className="fixed bottom-0 -left-20 z-10 w-[50%] h-auto"
                />
            </div>
        </SectionContainer>
    )
}
