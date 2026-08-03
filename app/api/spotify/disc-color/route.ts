import { NextResponse } from 'next/server'
import { unstable_cache } from 'next/cache'
import { getTopTrackDiscColor } from '@/app/lib/spotify'

// Run on the Node.js runtime (node-vibrant/jimp need Node APIs).
export const runtime = 'nodejs'

// Cache the computed result (top track + extracted color) for a day so we only
// recompute once daily, regardless of how many visitors hit the endpoint.
const getCachedDiscColor = unstable_cache(
    () => getTopTrackDiscColor(),
    // Bump the version suffix whenever the payload shape changes to bust the cache.
    ['spotify-disc-color', 'v3-top6-preview'],
    { revalidate: 86400, tags: ['spotify-disc-color'] }
)

export async function GET() {
    const result = await getCachedDiscColor()
    return NextResponse.json(result)
}
