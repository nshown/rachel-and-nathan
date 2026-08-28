import { useSyncExternalStore } from 'react'
import type { Orientation } from './types'

const query = '(orientation: portrait)'

function getSnapshot(): Orientation {
    if (typeof window === 'undefined' || !window.matchMedia) return 'portrait'
    return window.matchMedia(query).matches ? 'portrait' : 'landscape'
}

function subscribe(callback: () => void): () => void {
    if (typeof window === 'undefined' || !window.matchMedia) return () => { }
    const mql = window.matchMedia(query)
    mql.addEventListener('change', callback)
    return () => mql.removeEventListener('change', callback)
}

/** Tracks whether the viewport is currently portrait or landscape. */
export function useOrientation(): Orientation {
    return useSyncExternalStore(subscribe, getSnapshot, () => 'portrait')
}
