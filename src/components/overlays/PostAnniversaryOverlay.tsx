import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { TopScrim } from './common'
import { useOrientation } from '../../lib/useOrientation'
import { riseIn } from '../../styles/animations'

// Post-anniversary mode: a warm, forward-looking message across the top frame.
export default function PostAnniversaryOverlay() {
    const landscape = useOrientation() === 'landscape'
    return (
        <>
            <TopScrim />
            <Box
                sx={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: 'max(7vh, env(safe-area-inset-top))',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    px: 4,
                    color: 'text.primary',
                }}
            >
                <Typography
                    variant="h2"
                    sx={{
                        ...riseIn,
                        fontSize: landscape ? 'clamp(1.6rem, 4.5vw, 2.6rem)' : 'clamp(2rem, 8vw, 3.6rem)',
                        lineHeight: 1.1,
                        textShadow: '0 2px 20px rgba(0,0,0,0.6)',
                    }}
                >
                    What a wonderful journey it&rsquo;s been!
                </Typography>
                <Typography
                    variant="h5"
                    sx={{
                        ...riseIn,
                        mt: 2,
                        maxWidth: 620,
                        fontSize: landscape ? 'clamp(1rem, 3vw, 1.5rem)' : 'clamp(1.2rem, 5vw, 1.9rem)',
                        color: 'primary.light',
                        textShadow: '0 2px 18px rgba(0,0,0,0.6)',
                    }}
                >
                    Looking forward to the wonderful years to come!!!
                </Typography>
            </Box>
        </>
    )
}
