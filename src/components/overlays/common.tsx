import Box from '@mui/material/Box'

// Bottom-anchored gradient scrim that keeps overlaid text legible over photos.
export function BottomScrim() {
    return (
        <Box
            sx={{
                position: 'absolute',
                inset: 0,
                background:
                    'linear-gradient(to top, rgba(20,10,14,0.72) 0%, rgba(20,10,14,0.28) 32%, rgba(20,10,14,0) 60%)',
            }}
        />
    )
}

// Top-anchored gradient scrim, mirror of BottomScrim for top-aligned text.
export function TopScrim() {
    return (
        <Box
            sx={{
                position: 'absolute',
                inset: 0,
                background:
                    'linear-gradient(to bottom, rgba(20,10,14,0.72) 0%, rgba(20,10,14,0.28) 32%, rgba(20,10,14,0) 60%)',
            }}
        />
    )
}

