import { createTheme } from '@mui/material/styles'

// Romantic theme for Rachel & Nathan.
// Warm, candlelit palette: a deep plum/wine backdrop with ivory/off-white text
// and a single soft-gold accent. Soft modern serif for headings (Fraunces),
// rounded modern sans for body (Nunito).
export const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#E4C590', // soft gold
            light: '#F1DCB4',
            dark: '#C6A25C',
            contrastText: '#2A2018',
        },
        secondary: {
            main: '#C6A25C', // deeper gold
            light: '#DCC08A',
            dark: '#A6823F',
            contrastText: '#2A2018',
        },
        background: {
            default: '#1C1116', // deep wine/plum
            paper: '#2A1B22',
        },
        text: {
            primary: '#FBF7F0', // warm ivory / off-white
            secondary: 'rgba(251, 247, 240, 0.72)',
        },
        divider: 'rgba(251, 247, 240, 0.16)',
    },
    shape: {
        borderRadius: 14,
    },
    typography: {
        fontFamily: '"Nunito", "Segoe UI", "Helvetica", "Arial", sans-serif',
        h1: { fontFamily: '"Fraunces", "Georgia", serif', fontWeight: 600 },
        h2: { fontFamily: '"Fraunces", "Georgia", serif', fontWeight: 600 },
        h3: { fontFamily: '"Fraunces", "Georgia", serif', fontWeight: 600 },
        h4: { fontFamily: '"Fraunces", "Georgia", serif', fontWeight: 500 },
        h5: { fontFamily: '"Fraunces", "Georgia", serif', fontWeight: 500 },
        h6: { fontFamily: '"Fraunces", "Georgia", serif', fontWeight: 500 },
        button: { textTransform: 'none', fontWeight: 600 },
    },
})
