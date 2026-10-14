import type { Config } from 'tailwindcss'

// Threadline design tokens.
// These map 1:1 to the brand palette in the product brief.
// Always reach for these names (bg-primary, text-secondary, etc.)
// instead of hardcoding hex values in components.
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4F46E5',
          hover: '#4338CA',
          light: '#EEF2FF',
        },
        accent: {
          DEFAULT: '#14B8A6',
          hover: '#0D9488',
          light: '#F0FDFA',
        },
        success: {
          DEFAULT: '#22C55E',
          light: '#F0FDF4',
        },
        warning: {
          DEFAULT: '#F59E0B',
          light: '#FFFBEB',
        },
        background: '#F8FAFC',
        surface: '#FFFFFF',
        ink: {
          DEFAULT: '#0F172A', // primary text
          secondary: '#64748B', // secondary text
        },
        border: {
          DEFAULT: '#E2E8F0',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'sans-serif',
        ],
      },
      fontSize: {
        display: ['56px', { lineHeight: '1.05', letterSpacing: '-0.02em', fontWeight: '700' }],
        h1: ['40px', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
        h2: ['32px', { lineHeight: '1.15', letterSpacing: '-0.01em', fontWeight: '700' }],
        h3: ['22px', { lineHeight: '1.25', letterSpacing: '-0.01em', fontWeight: '600' }],
        body: ['15px', { lineHeight: '1.6', fontWeight: '400' }],
        small: ['13px', { lineHeight: '1.5', fontWeight: '400' }],
        label: ['12px', { lineHeight: '1.4', letterSpacing: '0.04em', fontWeight: '600' }],
      },
      borderRadius: {
        sm: '6px',
        DEFAULT: '10px',
        lg: '14px',
        xl: '20px',
      },
      boxShadow: {
        card: '0 1px 2px 0 rgba(15, 23, 42, 0.04), 0 1px 3px 0 rgba(15, 23, 42, 0.06)',
        raised: '0 4px 12px -2px rgba(15, 23, 42, 0.08), 0 2px 4px -2px rgba(15, 23, 42, 0.04)',
      },
      transitionDuration: {
        DEFAULT: '150ms',
      },
    },
  },
  plugins: [],
} satisfies Config
