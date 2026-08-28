import { useEffect, useRef } from 'react'
import Box from '@mui/material/Box'
import type { MediaItem } from '../lib/types'

interface SlideProps {
    item: MediaItem
    active: boolean
    /** Called when an active video finishes playing. */
    onVideoEnded: () => void
}

// A single full-bleed media layer. Images and videos both use object-fit:cover
// so they fully fill the viewport with no blank space (edges may be trimmed).
export default function Slide({ item, active, onVideoEnded }: SlideProps) {
    const videoRef = useRef<HTMLVideoElement>(null)

    useEffect(() => {
        const video = videoRef.current
        if (!video) return
        if (active) {
            video.currentTime = 0
            void video.play().catch(() => { })
        } else {
            video.pause()
        }
    }, [active])

    const coverSx = {
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        objectPosition: 'center',
        userSelect: 'none',
        pointerEvents: 'none',
        WebkitUserDrag: 'none',
    } as const

    if (item.type === 'video') {
        return (
            <Box
                component="video"
                ref={videoRef}
                src={item.src}
                muted
                playsInline
                preload="auto"
                onEnded={active ? onVideoEnded : undefined}
                sx={coverSx}
            />
        )
    }

    return (
        <Box
            component="img"
            src={item.src}
            alt=""
            draggable={false}
            loading="eager"
            decoding="async"
            sx={coverSx}
        />
    )
}
