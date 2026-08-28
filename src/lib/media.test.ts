import { describe, expect, it } from 'vitest'
import { LOOP_SIZE, pickQueue } from './media'
import type { MediaItem, Orientation } from './types'

function makePool(portrait: number, landscape: number): MediaItem[] {
    const items: MediaItem[] = []
    for (let i = 0; i < portrait; i++) {
        items.push({ src: `/p/${i}.jpg`, width: 1000, height: 1500, type: 'image', orientation: 'portrait' })
    }
    for (let i = 0; i < landscape; i++) {
        items.push({ src: `/l/${i}.jpg`, width: 1500, height: 1000, type: 'image', orientation: 'landscape' })
    }
    return items
}

function allMatch(items: MediaItem[], orientation: Orientation): boolean {
    return items.every((item) => item.orientation === orientation)
}

describe('pickQueue', () => {
    it('returns only items matching the requested orientation', () => {
        const pool = makePool(8, 8)
        expect(allMatch(pickQueue(pool, 'portrait'), 'portrait')).toBe(true)
        expect(allMatch(pickQueue(pool, 'landscape'), 'landscape')).toBe(true)
    })

    it('caps the queue at LOOP_SIZE', () => {
        const pool = makePool(25, 25)
        expect(pickQueue(pool, 'portrait')).toHaveLength(LOOP_SIZE)
    })

    it('returns all matching items when fewer than LOOP_SIZE', () => {
        const pool = makePool(3, 20)
        expect(pickQueue(pool, 'portrait')).toHaveLength(3)
    })

    it('returns an empty queue when nothing matches', () => {
        const pool = makePool(0, 5)
        expect(pickQueue(pool, 'portrait')).toEqual([])
    })

    it('does not mutate the input pool', () => {
        const pool = makePool(12, 12)
        const snapshot = pool.map((item) => item.src)
        pickQueue(pool, 'landscape')
        expect(pool.map((item) => item.src)).toEqual(snapshot)
    })

    it('only returns items that exist in the pool', () => {
        const pool = makePool(15, 5)
        const known = new Set(pool.map((item) => item.src))
        for (const item of pickQueue(pool, 'portrait')) {
            expect(known.has(item.src)).toBe(true)
        }
    })
})
