import { NextResponse } from 'next/server'
import { revalidateTag, unstable_cache } from 'next/cache'
import { getTopTrackDiscColor } from '@/app/lib/spotify'

// Run on the Node.js runtime (node-vibrant/jimp need Node APIs).
export const runtime = 'nodejs'

// Cache the computed result (top track + extracted color) for a day so we only
// recompute once daily, regardless of how many visitors hit the endpoint.
const CACHE_TAG = 'spotify-disc-color'

const getCachedDiscColor = unstable_cache(
    () => getTopTrackDiscColor(),
    // Bump the version suffix whenever the payload shape changes to bust the cache.
    [CACHE_TAG, 'v4-top6-preview'],
    { revalidate: 86400, tags: [CACHE_TAG] }
)

export async function GET() {
    const result = await getCachedDiscColor()

    // A missing-credentials or failed fetch would otherwise stay cached for a
    // full day, so drop it and let the next request try again.
    if (result.tracks.length === 0) {
        revalidateTag(CACHE_TAG, 'max')
    }

    return NextResponse.json(result)
}
