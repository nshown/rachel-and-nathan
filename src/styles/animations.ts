// Shared entrance animation for overlay text.
export const riseIn = {
    '@keyframes riseIn': {
        from: { opacity: 0, transform: 'translateY(16px)' },
        to: { opacity: 1, transform: 'translateY(0)' },
    },
    animation: 'riseIn 1200ms ease-out both',
} as const
