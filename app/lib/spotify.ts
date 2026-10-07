import 'server-only'
import sharp from 'sharp'

const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token'
/** How many playlist tracks to surface in the display case. */
const PLAYLIST_TRACKS_LIMIT = 6
const PLAYLIST_ENDPOINT = 'https://api.spotify.com/v1/playlists'

/** Fallback color used when Spotify isn't configured or a request fails. */
const FALLBACK_DISC_COLOR = '#1DB954' // Spotify green

export type DiscTrack = {
    /** Stable id (Spotify track id) used for selection. */
    id: string
    name: string
    artist: string
    album: string
    albumImage: string | null
    url: string
    /** Hex color extracted from this track's album art. */
    color: string
}

export type DiscColorResult = {
    /** Whether Spotify credentials are configured on the server. */
    configured: boolean
    /** The selected playlist's tracks, each with an extracted color. */
    tracks: DiscTrack[]
}

type SpotifyImage = { url: string; width: number; height: number }

function getCredentials() {
    const clientId = process.env.SPOTIFY_CLIENT_ID
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET
    const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN
    const playlistId = process.env.SPOTIFY_FAVORITES_PLAYLIST_ID
    if (!clientId || !clientSecret || !refreshToken || !playlistId) return null
    return { clientId, clientSecret, refreshToken, playlistId }
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
    external_urls?: { spotify?: string }
    artists?: Array<{ name: string }>
    album?: { name?: string; images?: SpotifyImage[] }
}

type PlaylistResponse = {
    items?: {
        items?: Array<{ item?: RawTrack | null; track?: RawTrack | null }>
    }
    tracks?: {
        items?: Array<{ item?: RawTrack | null; track?: RawTrack | null }>
    }
}

async function getPlaylistTracks(accessToken: string, playlistId: string): Promise<RawTrack[]> {
    const res = await fetch(`${PLAYLIST_ENDPOINT}/${playlistId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: 'no-store',
    })
    if (!res.ok) return []

    const data = (await res.json()) as PlaylistResponse
    const playlistItems = data.items?.items ?? data.tracks?.items ?? []
    return playlistItems
        .slice(0, PLAYLIST_TRACKS_LIMIT)
        .map((playlistItem) => playlistItem.item ?? playlistItem.track)
        .filter((track): track is RawTrack => Boolean(track?.id))
}

/**
 * Extract the dominant color from an album image URL.
 */
async function extractPrimaryColor(imageUrl: string): Promise<string | null> {
    try {
        const res = await fetch(imageUrl, { cache: 'no-store' })
        if (!res.ok) return null
        const buffer = Buffer.from(await res.arrayBuffer())

        const { dominant } = await sharp(buffer).stats()
        const toHex = (value: number) => value.toString(16).padStart(2, '0')
        return `#${toHex(dominant.r)}${toHex(dominant.g)}${toHex(dominant.b)}`
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
        color,
    }
}

/**
 * Resolve the selected playlist's tracks, each with a color extracted from its
 * album art. Always resolves (never throws) so the UI can degrade gracefully.
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

        const rawTracks = await getPlaylistTracks(accessToken, creds.playlistId)

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
