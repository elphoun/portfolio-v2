import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const SCOPES = ['user-top-read'].join(' ')

/**
 * One-time helper: start the Spotify OAuth flow to mint a refresh token.
 * Visit http://127.0.0.1:3000/api/spotify/login while running `npm run dev`.
 */
export function GET(request: Request) {
    const clientId = process.env.SPOTIFY_CLIENT_ID
    if (!clientId) {
        return NextResponse.json(
            { error: 'SPOTIFY_CLIENT_ID is not set. Add it to .env.local and restart.' },
            { status: 500 }
        )
    }

    const redirectUri =
        process.env.SPOTIFY_REDIRECT_URI ??
        new URL('/api/spotify/callback', request.url).toString()

    const authorizeUrl = new URL('https://accounts.spotify.com/authorize')
    authorizeUrl.searchParams.set('response_type', 'code')
    authorizeUrl.searchParams.set('client_id', clientId)
    authorizeUrl.searchParams.set('scope', SCOPES)
    authorizeUrl.searchParams.set('redirect_uri', redirectUri)
    authorizeUrl.searchParams.set('show_dialog', 'true')

    return NextResponse.redirect(authorizeUrl.toString())
}
