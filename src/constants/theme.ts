/**
 * Funil OS - Centralized Theme Constants
 * 
 * All colors, spacing, and design tokens live here.
 * Components should import from this file instead of using hardcoded values.
 * 
 * Usage:
 *   import { COLORS, CSS_VARS } from '@/constants/theme'
 *   <div style={{ color: COLORS.primary.DEFAULT }} />
 *   <div className={CSS_VARS.primary} />  // uses CSS custom properties
 */

export const COLORS = {
  primary: {
    DEFAULT: '#C2714F',
    light: '#D4937A',
    dark: '#A85A3A',
    50: '#FDF5F2',
    100: '#FAEBE4',
    200: '#F3D1C4',
    300: '#E8AE97',
    400: '#D48A6B',
    500: '#C2714F',
    600: '#A85A3A',
    700: '#8B4730',
    800: '#6E3826',
    900: '#52291C',
  },
  background: {
    DEFAULT: '#FAF7F2',
    card: '#FFFFFF',
    muted: '#F5F0E8',
    dark: {
      DEFAULT: '#1A1A1A',
      card: '#2A2A2A',
      muted: '#333333',
    },
  },
  text: {
    DEFAULT: '#3D2B1F',
    muted: '#8B7D75',
    light: '#B5A99C',
    dark: {
      DEFAULT: '#E8E0D8',
      muted: '#A09080',
      light: '#6B5F55',
    },
  },
  border: {
    DEFAULT: '#E8E0D8',
    dark: '#3A3A3A',
  },
  status: {
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
    info: '#2196F3',
  },
} as const

/**
 * CSS Custom Properties for theme switching
 * Apply these to :root for light mode and [data-theme="dark"] for dark mode
 */
export const CSS_VARS = {
  light: {
    '--color-primary': COLORS.primary.DEFAULT,
    '--color-primary-light': COLORS.primary.light,
    '--color-primary-dark': COLORS.primary.dark,
    '--color-bg': COLORS.background.DEFAULT,
    '--color-bg-card': COLORS.background.card,
    '--color-bg-muted': COLORS.background.muted,
    '--color-text': COLORS.text.DEFAULT,
    '--color-text-muted': COLORS.text.muted,
    '--color-border': COLORS.border.DEFAULT,
  },
  dark: {
    '--color-primary': COLORS.primary.light,
    '--color-primary-light': COLORS.primary[200],
    '--color-primary-dark': COLORS.primary[700],
    '--color-bg': COLORS.background.dark.DEFAULT,
    '--color-bg-card': COLORS.background.dark.card,
    '--color-bg-muted': COLORS.background.dark.muted,
    '--color-text': COLORS.text.dark.DEFAULT,
    '--color-text-muted': COLORS.text.dark.muted,
    '--color-border': COLORS.border.dark,
  },
} as const

/**
 * Spacing scale (rem-based)
 */
export const SPACING = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem',
  '3xl': '4rem',
} as const

/**
 * Border radius tokens
 */
export const RADIUS = {
  sm: '0.375rem',
  md: '0.5rem',
  lg: '0.75rem',
  xl: '1rem',
  full: '9999px',
} as const

/**
 * Z-index scale
 */
export const Z_INDEX = {
  dropdown: 50,
  sticky: 100,
  overlay: 200,
  modal: 300,
  popover: 400,
  toast: 500,
  tooltip: 600,
} as const
