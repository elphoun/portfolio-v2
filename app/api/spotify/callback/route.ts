import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function htmlPage(title: string, body: string) {
    return new NextResponse(
        `<!doctype html><html><head><meta charset="utf-8"><title>${title}</title>
        <style>
          body{font-family:ui-monospace,Menlo,monospace;max-width:720px;margin:48px auto;padding:0 20px;line-height:1.6;color:#111}
          code,pre{background:#f4f4f5;border-radius:8px;padding:2px 6px}
          pre{padding:16px;overflow:auto;white-space:pre-wrap;word-break:break-all}
          .ok{color:#128a3a}.err{color:#c02626}
        </style></head><body>${body}</body></html>`,
        { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    )
}

/**
 * One-time helper: Spotify redirects here with a `code`, which we exchange for a
 * refresh token. Copy the printed value into SPOTIFY_REFRESH_TOKEN in .env.local.
 */
export async function GET(request: Request) {
    const url = new URL(request.url)
    const code = url.searchParams.get('code')
    const error = url.searchParams.get('error')

    if (error) {
        return htmlPage('Spotify auth error', `<h1 class="err">Authorization failed</h1><p>${error}</p>`)
    }
    if (!code) {
        return htmlPage(
            'Spotify auth',
            `<h1 class="err">Missing code</h1><p>Start the flow at <a href="/api/spotify/login">/api/spotify/login</a>.</p>`
        )
    }

    const clientId = process.env.SPOTIFY_CLIENT_ID
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET
    if (!clientId || !clientSecret) {
        return htmlPage(
            'Spotify auth',
            `<h1 class="err">Missing credentials</h1><p>Set <code>SPOTIFY_CLIENT_ID</code> and <code>SPOTIFY_CLIENT_SECRET</code> in <code>.env.local</code>.</p>`
        )
    }

    const redirectUri =
        process.env.SPOTIFY_REDIRECT_URI ??
        new URL('/api/spotify/callback', request.url).toString()

    const res = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            Authorization: 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            grant_type: 'authorization_code',
            code,
            redirect_uri: redirectUri,
        }),
        cache: 'no-store',
    })

    const data = (await res.json()) as { refresh_token?: string; error_description?: string }

    if (!res.ok || !data.refresh_token) {
        return htmlPage(
            'Spotify auth',
            `<h1 class="err">Token exchange failed</h1><pre>${JSON.stringify(data, null, 2)}</pre>`
        )
    }

    return htmlPage(
        'Spotify connected',
        `<h1 class="ok">✅ Spotify connected</h1>
         <p>Add this to your <code>.env.local</code> (and to Vercel env vars), then restart the dev server:</p>
         <pre>SPOTIFY_REFRESH_TOKEN=${data.refresh_token}</pre>
         <p>You can now delete the <code>login</code> / <code>callback</code> routes if you like — they're only needed once.</p>`
    )
}
