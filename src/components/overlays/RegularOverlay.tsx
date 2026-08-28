import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { BottomScrim } from './common'
import { riseIn } from '../../styles/animations'

// Regular mode: an elegant "Rachel ❤ Nathan" resting over the lower third.
export default function RegularOverlay() {
    return (
        <>
            <BottomScrim />
            <Box
                sx={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: 'max(6vh, env(safe-area-inset-bottom))',
                    display: 'flex',
                    justifyContent: 'center',
                    px: 3,
                }}
            >
                <Typography
                    variant="h1"
                    sx={{
                        ...riseIn,
                        textAlign: 'center',
                        color: 'text.primary',
                        fontSize: 'clamp(2.4rem, 9vw, 5rem)',
                        letterSpacing: '0.01em',
                        textShadow: '0 2px 18px rgba(0,0,0,0.55)',
                    }}
                >
                    Rachel{' '}
                    <Box component="span" sx={{ color: 'primary.light' }}>
                        &#10084;
                    </Box>{' '}
                    Nathan
                </Typography>
            </Box>
        </>
    )
}
