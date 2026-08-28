import type { Mode } from './types'

// Anniversary anchor: Rachel & Nathan were married September 7, 2024.
export const WEDDING_YEAR = 2024
const ANNIVERSARY_MONTH = 8 // 0-based: September
const ANNIVERSARY_DAY = 7

// Number of days before / after Sept 7 that the pre- and post-anniversary
// modes stay active.
export const WINDOW_DAYS = 14

const MS_PER_DAY = 24 * 60 * 60 * 1000

function dateOnly(d: Date): Date {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

/** Whole-day difference (b - a), ignoring time of day. */
function daysBetween(a: Date, b: Date): number {
    return Math.round((dateOnly(b).getTime() - dateOnly(a).getTime()) / MS_PER_DAY)
}

/** The number the upcoming/most-recent Sept 7 represents (2026 -> 2). */
export function yearsMarried(now: Date): number {
    return now.getFullYear() - WEDDING_YEAR
}

/** Days from `now` until this year's Sept 7 (negative once it has passed). */
export function daysUntilAnniversary(now: Date): number {
    const anniversary = new Date(now.getFullYear(), ANNIVERSARY_MONTH, ANNIVERSARY_DAY)
    return daysBetween(now, anniversary)
}

export function resolveMode(now: Date): Mode {
    const delta = daysUntilAnniversary(now)
    if (delta === 0) return 'anniversary'
    if (delta > 0 && delta <= WINDOW_DAYS) return 'pre'
    if (delta < 0 && delta >= -WINDOW_DAYS) return 'post'
    return 'regular'
}

const VALID_MODES: readonly Mode[] = ['regular', 'pre', 'anniversary', 'post']

/** Optional `?mode=` override for previewing any mode regardless of date. */
export function modeOverrideFromLocation(search: string): Mode | null {
    const raw = new URLSearchParams(search).get('mode')
    if (!raw) return null
    const normalized = raw.toLowerCase()
    const aliases: Record<string, Mode> = {
        regular: 'regular',
        pre: 'pre',
        'pre-anniversary': 'pre',
        anniversary: 'anniversary',
        post: 'post',
        'post-anniversary': 'post',
    }
    const mode = aliases[normalized]
    return mode && VALID_MODES.includes(mode) ? mode : null
}

/** Ordinal suffix for the anniversary number, e.g. 2 -> "2nd". */
export function ordinal(n: number): string {
    const mod100 = n % 100
    if (mod100 >= 11 && mod100 <= 13) return `${n}th`
    switch (n % 10) {
        case 1:
            return `${n}st`
        case 2:
            return `${n}nd`
        case 3:
            return `${n}rd`
        default:
            return `${n}th`
    }
}
