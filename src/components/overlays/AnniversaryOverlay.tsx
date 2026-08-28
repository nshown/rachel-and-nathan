import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { BottomScrim } from './common'
import { useOrientation } from '../../lib/useOrientation'
import { riseIn } from '../../styles/animations'

interface AnniversaryOverlayProps {
    years: number
}

// Anniversary mode (Sept 7): shown on the blank intro slide and over the photos.
export default function AnniversaryOverlay({ years }: AnniversaryOverlayProps) {
    const yearLabel = years === 1 ? 'year' : 'years'
    const landscape = useOrientation() === 'landscape'
    return (
        <>
            <BottomScrim />
            <Box
                sx={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: 'max(7vh, env(safe-area-inset-bottom))',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    px: 4,
                    color: 'text.primary',
                }}
            >
                <Typography
                    variant="h1"
                    sx={{
                        ...riseIn,
                        fontSize: landscape ? 'clamp(1.9rem, 5vw, 3.2rem)' : 'clamp(2.4rem, 10vw, 5.4rem)',
                        lineHeight: 1.05,
                        textShadow: '0 2px 24px rgba(0,0,0,0.6)',
                    }}
                >
                    Happy Anniversary
                    <br />
                    Rachel &amp; Nathan!
                </Typography>
                <Typography
                    variant="h4"
                    sx={{
                        ...riseIn,
                        mt: 2,
                        maxWidth: 640,
                        fontSize: landscape ? 'clamp(1.1rem, 3vw, 1.6rem)' : 'clamp(1.3rem, 6vw, 2.2rem)',
                        color: 'primary.light',
                        textShadow: '0 2px 18px rgba(0,0,0,0.6)',
                    }}
                >
                    What a wonderful {years} {yearLabel} of marriage it&rsquo;s been!
                </Typography>
            </Box>
        </>
    )
}
