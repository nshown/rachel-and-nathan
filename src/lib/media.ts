import type { MediaItem, Orientation } from './types'

/** Number of items shown per mode before the loop repeats. */
export const LOOP_SIZE = 10

/** Fisher–Yates shuffle over a copy of the input. */
function shuffle<T>(items: readonly T[]): T[] {
    const copy = items.slice()
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
            ;[copy[i], copy[j]] = [copy[j], copy[i]]
    }
    return copy
}

/**
 * Picks up to `LOOP_SIZE` random items from `pool` that match `orientation`.
 * Pools are guaranteed to hold enough of both orientations, so no fallback to
 * the opposite orientation is applied.
 */
export function pickQueue(pool: readonly MediaItem[], orientation: Orientation): MediaItem[] {
    const matching = pool.filter((item) => item.orientation === orientation)
    return shuffle(matching).slice(0, LOOP_SIZE)
}
