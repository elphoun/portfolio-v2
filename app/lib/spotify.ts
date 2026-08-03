import 'server-only'
import { Vibrant } from 'node-vibrant/node'

const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token'
/** How many top tracks to surface in the display case (one per pedestal). */
export const TOP_TRACKS_LIMIT = 6
const TOP_TRACKS_ENDPOINT = `https://api.spotify.com/v1/me/top/tracks?limit=${TOP_TRACKS_LIMIT}&time_range=long_term`

/** Fallback color used when Spotify isn't configured or a request fails. */
export const FALLBACK_DISC_COLOR = '#1DB954' // Spotify green

export type DiscTrack = {
    /** Stable id (Spotify track id) used for selection. */
    id: string
    name: string
    artist: string
    album: string
    albumImage: string | null
    url: string
    /**
     * Spotify's deprecated preview_url, kept only for reference. Playback goes
     * through the Embed iFrame API instead (see components/spotify-disc.tsx).
     */
    previewUrl: string | null
    /** Hex color extracted from this track's album art. */
    color: string
}

export type DiscColorResult = {
    /** Whether Spotify credentials are configured on the server. */
    configured: boolean
    /** The user's current top tracks, each with an extracted color. */
    tracks: DiscTrack[]
}

type SpotifyImage = { url: string; width: number; height: number }

function getCredentials() {
    const clientId = process.env.SPOTIFY_CLIENT_ID
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET
    const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN
    if (!clientId || !clientSecret || !refreshToken) return null
    return { clientId, clientSecret, refreshToken }
}

function basicAuthHeader(clientId: string, clientSecret: string) {
    return 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
}

/**
 * Exchange the long-lived refresh token for a short-lived access token.
 * Uses `no-store` so we never serve a stale/expired access token.
 */
async function getAccessToken(): Promise<string | null> {
    const creds = getCredentials()
    if (!creds) return null

    const res = await fetch(TOKEN_ENDPOINT, {
        method: 'POST',
        headers: {
            Authorization: basicAuthHeader(creds.clientId, creds.clientSecret),
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: creds.refreshToken,
        }),
        cache: 'no-store',
    })

    if (!res.ok) return null
    const data = (await res.json()) as { access_token?: string }
    return data.access_token ?? null
}

/** Pick the largest available album image for best color sampling. */
function pickAlbumImage(images: SpotifyImage[] | undefined): string | null {
    if (!images || images.length === 0) return null
    return [...images].sort((a, b) => (b.width ?? 0) - (a.width ?? 0))[0]?.url ?? null
}

type RawTrack = {
    id: string
    name: string
    preview_url?: string | null
    external_urls?: { spotify?: string }
    artists?: Array<{ name: string }>
    album?: { name?: string; images?: SpotifyImage[] }
}

async function getTopTracks(accessToken: string): Promise<RawTrack[]> {
    const res = await fetch(TOP_TRACKS_ENDPOINT, {
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: 'no-store',
    })
    if (!res.ok) return []

    const data = (await res.json()) as { items?: RawTrack[] }
    return data.items ?? []
}

/**
 * Extract a vibrant "primary" color from an album image URL.
 * Prefers the Vibrant swatch, otherwise falls back to the most populous swatch.
 */
export async function extractPrimaryColor(imageUrl: string): Promise<string | null> {
    try {
        const res = await fetch(imageUrl, { cache: 'no-store' })
        if (!res.ok) return null
        const buffer = Buffer.from(await res.arrayBuffer())

        const palette = await new Vibrant(buffer).getPalette()

        if (palette.Vibrant?.hex) return palette.Vibrant.hex

        const mostPopulous = Object.values(palette)
            .filter((swatch): swatch is NonNullable<typeof swatch> => Boolean(swatch))
            .sort((a, b) => b.population - a.population)[0]

        return mostPopulous?.hex ?? null
    } catch {
        return null
    }
}

/** Map a raw Spotify track + resolved color into our DiscTrack shape. */
function toDiscTrack(raw: RawTrack, color: string): DiscTrack {
    return {
        id: raw.id,
        name: raw.name,
        artist: raw.artists?.map((a) => a.name).join(', ') ?? '',
        album: raw.album?.name ?? '',
        albumImage: pickAlbumImage(raw.album?.images),
        url: raw.external_urls?.spotify ?? '',
        previewUrl: raw.preview_url ?? null,
        color,
    }
}

/**
 * Resolve the current top tracks, each with a color extracted from its album
 * art. Always resolves (never throws) so the UI can degrade gracefully.
 */
export async function getTopTrackDiscColor(): Promise<DiscColorResult> {
    const creds = getCredentials()
    if (!creds) {
        return { configured: false, tracks: [] }
    }

    try {
        const accessToken = await getAccessToken()
        if (!accessToken) {
            return { configured: true, tracks: [] }
        }

        const rawTracks = await getTopTracks(accessToken)

        // Extract every track's color in parallel (cached daily upstream).
        const tracks = await Promise.all(
            rawTracks.map(async (raw) => {
                const image = pickAlbumImage(raw.album?.images)
                const color = image
                    ? (await extractPrimaryColor(image)) ?? FALLBACK_DISC_COLOR
                    : FALLBACK_DISC_COLOR
                return toDiscTrack(raw, color)
            })
        )

        return { configured: true, tracks }
    } catch {
        return { configured: true, tracks: [] }
    }
}
