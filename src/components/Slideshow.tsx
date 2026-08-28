import { useCallback, useEffect, useRef, useState } from 'react'
import Box from '@mui/material/Box'
import Slide from './Slide'
import { pickQueue } from '../lib/media'
import { useOrientation } from '../lib/useOrientation'
import type { MediaItem, Mode } from '../lib/types'

const IMAGE_DURATION_MS = 6500
const FADE_MS = 1200
// Safety net so a video that never fires 'ended' can't stall the loop.
const VIDEO_MAX_MS = 30000
const SWIPE_THRESHOLD_PX = 45
const TAP_SLOP_PX = 10

interface SlideshowProps {
    mode: Mode
    pool: readonly MediaItem[]
    /** When set, a blank slide is shown first and cycled like a photo; the
     * `children` overlay renders on top of it and every image. */
    blankIntro?: boolean
    children?: React.ReactNode
}

type SlideEntry = { kind: 'intro' } | { kind: 'media'; item: MediaItem }

// Full-screen crossfading media loop with tap-to-advance and swipe navigation.
export default function Slideshow({ mode, pool, blankIntro, children }: SlideshowProps) {
    const orientation = useOrientation()
    const [queue, setQueue] = useState<MediaItem[]>(() => pickQueue(pool, orientation))
    const [index, setIndex] = useState(0)

    // Re-pick a random queue when the mode or orientation changes, using the
    // render-time reset pattern (no effect / no flash of stale content).
    const signature = `${mode}|${orientation}`
    const [prevSignature, setPrevSignature] = useState(signature)
    if (prevSignature !== signature) {
        setPrevSignature(signature)
        setQueue(pickQueue(pool, orientation))
        setIndex(0)
    }

    const slides: SlideEntry[] = blankIntro
        ? [{ kind: 'intro' }, ...queue.map((item) => ({ kind: 'media', item }) as const)]
        : queue.map((item) => ({ kind: 'media', item }) as const)

    const count = slides.length
    const activeIndex = count > 0 ? ((index % count) + count) % count : 0
    const current = slides[activeIndex]
    const currentIsVideo = current?.kind === 'media' && current.item.type === 'video'

    const step = useCallback(
        (dir: number) => {
            setIndex((i) => {
                if (count === 0) return 0
                return (i + dir + count) % count
            })
        },
        [count],
    )

    // Auto-advance: images/intro advance on a timer; videos advance when they
    // end (with a safety timeout as a backstop).
    useEffect(() => {
        if (count === 0) return
        const delay = currentIsVideo ? VIDEO_MAX_MS : IMAGE_DURATION_MS
        const timer = window.setTimeout(() => step(1), delay)
        return () => window.clearTimeout(timer)
    }, [activeIndex, currentIsVideo, count, step])

    const pointerStart = useRef<{ x: number; y: number } | null>(null)

    const handlePointerDown = (e: React.PointerEvent) => {
        pointerStart.current = { x: e.clientX, y: e.clientY }
    }

    const handlePointerUp = (e: React.PointerEvent) => {
        const start = pointerStart.current
        pointerStart.current = null
        if (!start) return
        const dx = e.clientX - start.x
        const dy = e.clientY - start.y
        if (Math.abs(dx) > SWIPE_THRESHOLD_PX && Math.abs(dx) > Math.abs(dy)) {
            step(dx < 0 ? 1 : -1)
        } else if (Math.abs(dx) <= TAP_SLOP_PX && Math.abs(dy) <= TAP_SLOP_PX) {
            step(1)
        }
    }

    return (
        <Box
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            sx={{
                position: 'fixed',
                inset: 0,
                overflow: 'hidden',
                bgcolor: 'background.default',
                touchAction: 'pan-y',
                cursor: 'pointer',
            }}
        >
            {slides.map((slide, i) => {
                const active = i === activeIndex
                const key = slide.kind === 'intro' ? 'intro' : slide.item.src
                return (
                    <Box
                        key={key}
                        sx={{
                            position: 'absolute',
                            inset: 0,
                            opacity: active ? 1 : 0,
                            transition: `opacity ${FADE_MS}ms ease-in-out`,
                            zIndex: active ? 1 : 0,
                        }}
                    >
                        {slide.kind === 'intro' ? null : (
                            <Slide item={slide.item} active={active} onVideoEnded={() => step(1)} />
                        )}
                    </Box>
                )
            })}
            {children ? (
                <Box sx={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none' }}>{children}</Box>
            ) : null}
        </Box>
    )
}
