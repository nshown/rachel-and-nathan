import { useMemo } from 'react'
import Slideshow from './components/Slideshow'
import RegularOverlay from './components/overlays/RegularOverlay'
import PreAnniversaryOverlay from './components/overlays/PreAnniversaryOverlay'
import AnniversaryOverlay from './components/overlays/AnniversaryOverlay'
import PostAnniversaryOverlay from './components/overlays/PostAnniversaryOverlay'
import { daysUntilAnniversary, modeOverrideFromLocation, resolveMode, yearsMarried } from './lib/mode'
import type { MediaManifest, Mode } from './lib/types'
import manifestData from './media-manifest.json'

const manifest = manifestData as MediaManifest

function overlayFor(mode: Mode, years: number, daysUntil: number) {
    switch (mode) {
        case 'pre':
            return <PreAnniversaryOverlay daysUntil={daysUntil} years={years} />
        case 'anniversary':
            return <AnniversaryOverlay years={years} />
        case 'post':
            return <PostAnniversaryOverlay />
        default:
            return <RegularOverlay />
    }
}

export default function App() {
    const { mode, years, daysUntil } = useMemo(() => {
        const now = new Date()
        const override = modeOverrideFromLocation(window.location.search)
        return {
            mode: override ?? resolveMode(now),
            years: yearsMarried(now),
            daysUntil: Math.max(0, daysUntilAnniversary(now)),
        }
    }, [])

    const pool = manifest[mode] ?? []

    return (
        <Slideshow mode={mode} pool={pool} blankIntro={mode === 'anniversary'}>
            {overlayFor(mode, years, daysUntil)}
        </Slideshow>
    )
}
