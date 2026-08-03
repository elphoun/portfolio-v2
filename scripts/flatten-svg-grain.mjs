/**
 * Collapses Figma's per-shape "grain" texture filters into a single shared filter.
 *
 * Figma exports the hand-drawn texture as one feTurbulence + feDisplacementMap
 * filter per shape. Since the draw-in animation mutates stroke-dashoffset every
 * frame, each of those filtered groups gets re-rasterized every frame, and
 * generating fractal noise a hundred-odd times per frame does not fit in a frame
 * budget. feTurbulence is evaluated in user space from a fixed seed, so one
 * filter over a parent group yields the same noise field per shape for a
 * fraction of the cost.
 *
 * Consecutive runs of grain groups are merged (rather than all of them hoisted
 * into a single group) so that unfiltered siblings keep their paint order.
 *
 * Usage: node scripts/flatten-svg-grain.mjs public/random/displaycase.svg [...]
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { basename } from 'node:path'

/** Fallback filter region padding, used only when a source filter omits its region. */
const REGION_PAD = 20

const FILTER_RE = /<filter id="([^"]+)"([^>]*)>([\s\S]*?)<\/filter>/g
const GROUP_RE = /<g ([^>]*?)>([\s\S]*?)<\/g>/g

function attr(source, name) {
  const match = source.match(new RegExp(`${name}="([^"]*)"`))
  return match ? match[1] : null
}

/**
 * Reads the turbulence/displacement parameters out of a filter body, or returns
 * null if this isn't one of Figma's grain filters.
 */
function parseGrain(body) {
  const turbulence = body.match(/<feTurbulence[^>]*>/)
  const displacement = body.match(/<feDisplacementMap[^>]*>/)
  if (!turbulence || !displacement) return null

  return {
    type: attr(turbulence[0], 'type'),
    baseFrequency: attr(turbulence[0], 'baseFrequency'),
    numOctaves: attr(turbulence[0], 'numOctaves'),
    seed: attr(turbulence[0], 'seed'),
    scale: attr(displacement[0], 'scale'),
    xChannelSelector: attr(displacement[0], 'xChannelSelector'),
    yChannelSelector: attr(displacement[0], 'yChannelSelector'),
  }
}

function signature(grain) {
  return [grain.type, grain.baseFrequency, grain.numOctaves, grain.seed, grain.scale].join('|')
}

/**
 * The merged wrapper gets the union of its members' regions. Filters rasterize
 * their whole region every time the source changes, so a region spanning the
 * canvas would cost far more per frame than the tight boxes Figma emitted --
 * the union keeps the rasterized area at or below what it was.
 */
function union(a, b) {
  if (!a) return b
  if (!b) return a
  const x = Math.min(a.x, b.x)
  const y = Math.min(a.y, b.y)
  return {
    x,
    y,
    width: Math.max(a.x + a.width, b.x + b.width) - x,
    height: Math.max(a.y + a.height, b.y + b.height) - y,
  }
}

/** Every drawing element, in document order, used to assert nothing moved. */
function shapes(svg) {
  return (svg.match(/<(?:path|line|polyline|polygon|rect|circle|ellipse|image)\b[^>]*>/g) ?? []).join('\n')
}

function flatten(svg, label) {
  const viewBox = (attr(svg, 'viewBox') ?? '0 0 0 0').split(/[\s,]+/).map(Number)
  const fallbackRegion = {
    x: viewBox[0] - REGION_PAD,
    y: viewBox[1] - REGION_PAD,
    width: viewBox[2] + REGION_PAD * 2,
    height: viewBox[3] + REGION_PAD * 2,
  }

  const grainFilters = new Map()
  for (const [, id, attrs, body] of svg.matchAll(FILTER_RE)) {
    const grain = parseGrain(body)
    if (!grain) continue
    const x = attr(attrs, 'x')
    const region =
      x === null
        ? fallbackRegion
        : {
            x: Number(x),
            y: Number(attr(attrs, 'y')),
            width: Number(attr(attrs, 'width')),
            height: Number(attr(attrs, 'height')),
          }
    grainFilters.set(id, { ...grain, region })
  }

  if (grainFilters.size === 0) {
    return { svg, merged: 0, groups: 0, skipped: 'no grain filters found' }
  }
  if (grainFilters.size === 1) {
    return { svg, merged: 0, groups: 0, skipped: 'already uses a single grain filter' }
  }

  // Figma suffixes every id with the source node, e.g. filter0_g_524_132. Reuse
  // that suffix so the merged ids stay unique: these SVGs are injected inline,
  // so several of them share one document and thus one id namespace. The second
  // pattern matches ids this script already produced, keeping re-runs stable.
  const firstId = [...grainFilters.keys()][0]
  const suffix = (firstId.match(/_g_(.+)$/) ?? firstId.match(/^grain\d+_(.+)$/))?.[1]
  if (!suffix) {
    throw new Error(`${label}: cannot derive a unique id suffix from "${firstId}"`)
  }

  // Walk the markup, replacing each run of adjacent same-variant grain groups
  // with one group. A file can mix several grain variants (different seeds, or a
  // finer texture for some shapes); merging across variants would change how
  // those shapes are displaced, so a variant switch breaks the run.
  const merged = new Map()
  let out = ''
  let cursor = 0
  let run = []
  let runGrain = null
  let runRegion = null
  let mergedGroups = 0

  const flushRun = () => {
    if (run.length === 0) return
    mergedGroups += run.length

    const key = [signature(runGrain), runRegion.x, runRegion.y, runRegion.width, runRegion.height].join('|')
    let entry = merged.get(key)
    if (!entry) {
      entry = { grain: runGrain, region: runRegion, id: `grain${merged.size}_${suffix}` }
      merged.set(key, entry)
    }

    out += `<g filter="url(#${entry.id})">\n${run.join('\n')}\n</g>\n`
    run = []
    runGrain = null
    runRegion = null
  }

  GROUP_RE.lastIndex = 0
  let match
  while ((match = GROUP_RE.exec(svg)) !== null) {
    const [full, attrs, children] = match
    const filterId = attrs.match(/filter="url\(#([^)]+)\)"/)?.[1]
    const grain = filterId ? grainFilters.get(filterId) : undefined
    const between = svg.slice(cursor, match.index)
    cursor = match.index + full.length

    // Any markup between two grain groups (other than whitespace) has to keep
    // its position in paint order, so it terminates the current run. So does a
    // switch to a different grain variant.
    const sameVariant = grain && runGrain && signature(grain) === signature(runGrain)
    if (between.trim() !== '' || !grain || (runGrain && !sameVariant)) {
      flushRun()
      out += between
    }

    if (!grain) {
      out += full
      continue
    }

    if (children.includes('<g ') || children.includes('<g>')) {
      throw new Error(`${label}: nested groups inside a grain group are not supported`)
    }

    runGrain = grain
    runRegion = union(runRegion, grain.region)

    const otherAttrs = attrs.replace(/filter="url\(#[^)]+\)"/, '').trim()
    // A group that also carries a clip-path/transform keeps its own wrapper.
    run.push(otherAttrs ? `<g ${otherAttrs}>${children}</g>` : children.trim())
  }
  flushRun()
  out += svg.slice(cursor)

  // Drop the now-unused per-shape filter definitions.
  out = out.replace(FILTER_RE, (full, id) => (grainFilters.has(id) ? '' : full))

  const mergedFilters = [...merged.values()]
    .map(
      ({ grain, region, id }) =>
        `<filter id="${id}" x="${region.x}" y="${region.y}" ` +
        `width="${region.width}" height="${region.height}" ` +
        `filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">\n` +
        `<feFlood flood-opacity="0" result="BackgroundImageFix"/>\n` +
        `<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>\n` +
        `<feTurbulence type="${grain.type}" baseFrequency="${grain.baseFrequency}" numOctaves="${grain.numOctaves}" seed="${grain.seed}"/>\n` +
        // Figma writes width/height="100%" here, but in userSpaceOnUse those
        // resolve against the viewport rather than the filter region, which
        // clips the padding off the right and bottom edges. Omitting them lets
        // the primitive subregion default to the whole filter region.
        `<feDisplacementMap in="shape" scale="${grain.scale}" xChannelSelector="${grain.xChannelSelector}" yChannelSelector="${grain.yChannelSelector}" result="displacedImage"/>\n` +
        `<feMerge result="effect1_texture_${id}">\n<feMergeNode in="displacedImage"/>\n</feMerge>\n` +
        `</filter>\n`
    )
    .join('')

  if (out.includes('<defs>')) {
    out = out.replace('<defs>', `<defs>\n${mergedFilters}`)
  } else {
    out = out.replace('</svg>', `<defs>\n${mergedFilters}</defs>\n</svg>`)
  }

  // Tidy up the blank lines left behind by the removed definitions.
  out = out.replace(/\n{2,}/g, '\n')

  if (shapes(out) !== shapes(svg)) {
    throw new Error(`${label}: drawing elements changed during the rewrite, refusing to write`)
  }
  const opens = (out.match(/<g[\s>]/g) ?? []).length
  const closes = (out.match(/<\/g>/g) ?? []).length
  if (opens !== closes) {
    throw new Error(`${label}: unbalanced groups after rewrite (${opens} open, ${closes} close)`)
  }

  const areaBefore = [...grainFilters.values()].reduce(
    (sum, { region }) => sum + region.width * region.height,
    0
  )
  const areaAfter = [...merged.values()].reduce(
    (sum, { region }) => sum + region.width * region.height,
    0
  )

  return {
    svg: out,
    groups: mergedGroups,
    removed: grainFilters.size,
    filters: merged.size,
    areaBefore,
    areaAfter,
  }
}

const files = process.argv.slice(2)
if (files.length === 0) {
  console.error('usage: node scripts/flatten-svg-grain.mjs <svg...>')
  process.exit(1)
}

for (const file of files) {
  const label = basename(file)
  const before = readFileSync(file, 'utf8')
  const result = flatten(before, label)

  if (result.skipped) {
    console.log(`${label}: skipped (${result.skipped})`)
    continue
  }

  writeFileSync(file, result.svg)
  const kb = (n) => `${(n / 1024).toFixed(1)}KB`
  const mpx = (n) => `${(n / 1e6).toFixed(2)}M`
  console.log(
    `${label}: ${result.removed} filtered groups -> ${result.filters}, ` +
      `${kb(before.length)} -> ${kb(result.svg.length)}, ` +
      `filtered area ${mpx(result.areaBefore)} -> ${mpx(result.areaAfter)} user-units^2`
  )
}
