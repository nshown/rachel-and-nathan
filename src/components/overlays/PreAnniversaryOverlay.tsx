import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { ordinal } from '../../lib/mode'
import { BottomScrim } from './common'
import { riseIn } from '../../styles/animations'

interface PreAnniversaryOverlayProps {
    daysUntil: number
    years: number
}

// Pre-anniversary mode: the countdown floats over the photo (no blocking panel).
export default function PreAnniversaryOverlay({ daysUntil, years }: PreAnniversaryOverlayProps) {
    const dayLabel = daysUntil === 1 ? 'day' : 'days'
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
                        lineHeight: 1,
                        color: 'primary.light',
                        fontSize: 'clamp(3.4rem, 18vw, 7rem)',
                        textShadow: '0 2px 22px rgba(0,0,0,0.6)',
                    }}
                >
                    {daysUntil}
                </Typography>
                <Typography
                    variant="h4"
                    sx={{
                        ...riseIn,
                        mt: 1,
                        maxWidth: 620,
                        fontSize: 'clamp(1.3rem, 6vw, 2.2rem)',
                        textShadow: '0 2px 18px rgba(0,0,0,0.6)',
                    }}
                >
                    {dayLabel} until our {ordinal(years)} wedding anniversary!
                </Typography>
            </Box>
        </>
    )
}
