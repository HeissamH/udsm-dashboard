// UDSM Official Brand Colors
export const udsmColors = {
    // Primary - UDSM Yellow
    primary: {
        50: '#FFFBEB',
        100: '#FFF3C1',
        200: '#FFE583',
        300: '#FFD900', // Official UDSM Yellow
        400: '#FACC15',
        500: '#EAB308',
        600: '#CA8A04',
        700: '#A16207',
        800: '#854D0E',
        900: '#713F12',
    },

    // Secondary - Academic Navy
    secondary: {
        50: '#F0F4F8',
        100: '#D9E2EC',
        200: '#BCCCDC',
        300: '#9FB3C8',
        400: '#829AB1',
        500: '#627D98',
        600: '#486581',
        700: '#334E68',
        800: '#243B53',
        900: '#102A43',
    },

    // Neutral - Professional Grays
    neutral: {
        50: '#F9FAFB',
        100: '#F3F4F6',
        200: '#E5E7EB',
        300: '#D1D5DB',
        400: '#9CA3AF',
        500: '#6B7280',
        600: '#4B5563',
        700: '#374151',
        800: '#1F2937',
        900: '#111827',
    },

    // Accent Colors
    success: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B',
    info: '#3B82F6',
} as const;

export type UdsmColors = typeof udsmColors;
