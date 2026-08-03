# Michael Zhang — Portfolio

A single-page personal portfolio built with the Next.js App Router. The page is
a vertical snap-scroll deck of full-screen sections, and most of the artwork is
hand-drawn SVG that draws itself in, stroke by stroke, as each section scrolls
into view.

Live at [michaelzhang.dev](https://michaelzhang.dev).

## Sections

The deck is assembled in `app/page.tsx` from three sections, in order:

- **Home** (`app/pages/homepage.tsx`) — name, social links, and the animated
  Whimsicott drawing.
- **Experience** (`app/pages/experience.tsx`) — a chalkboard listing roles, with
  an animated machine and cogflies alongside it.
- **Random** (`app/pages/random.tsx`) — a display case whose pedestals hold album
  art for my top Spotify tracks, next to a spinning vinyl disc.

The floating nav (`app/components/nav.tsx`) tracks the active section with an
`IntersectionObserver` and scrolls between them. Its `SECTION_IDS` list must stay
in sync with the sections rendered by `app/page.tsx`.

## How the drawing animation works

`app/components/animated-svg.tsx` (`AnimatedSvg`) fetches an SVG from `public/`,
inlines it, and animates each `path`/`line`/`polyline`/`rect` with anime.js
`svg.createDrawable`. `app/components/scroll-effects.tsx` orchestrates it: on
entering a section it hides the content, dispatches `svg:play` on every SVG
container, waits for the matching `svg:complete` events, then fades the rest of
the content in. `DisplayCase` listens for those same events so the album covers
only appear once the case has finished drawing.

## Spotify integration

The Random section is driven by the Spotify Web API:

1. `app/lib/spotify.ts` refreshes an access token, fetches my top tracks, and
   extracts a primary color from each album cover with `node-vibrant`.
2. `app/api/spotify/disc-color/route.ts` exposes that as JSON, cached for a day
   via `unstable_cache`. It runs on the Node runtime because `node-vibrant`
   needs Node APIs.
3. `app/components/display-case.tsx` places the covers on pedestals, and
   `app/components/spotify-disc.tsx` paints the vinyl with the selected track's
   color and handles playback through the Spotify Embed iFrame API.

Everything degrades gracefully: with no credentials configured the endpoint
returns an empty track list, the case renders empty, and the disc falls back to
Spotify green.

Copy `env.example` to `.env.local` and follow the instructions there to mint a
refresh token. The `/api/spotify/login` and `/api/spotify/callback` routes exist
only for that one-time setup flow.

## Development

```bash
npm install
npm run dev
```

Then open http://127.0.0.1:3000. Use `127.0.0.1` rather than `localhost` so the
Spotify OAuth redirect URI matches.

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run deploy` | Deploy a preview to Vercel |
| `npm run deploy:prod` | Deploy to production |

## Stack

Next.js 16 (App Router), React 19, Tailwind CSS v4, anime.js for animation,
Geist plus a few Google display fonts, and Vercel Analytics / Speed Insights.
Deployed on Vercel.
