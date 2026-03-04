import type { Config } from 'tailwindcss'
import animatePlugin from 'tailwindcss-animate'
import typographyPlugin from '@tailwindcss/typography'
import aspectRatioPlugin from '@tailwindcss/aspect-ratio'

export default {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1440px',
      },
    },
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      fontSize: {
        '2xs': ['10px', { lineHeight: '14px', fontWeight: '500' }],
        xs: ['11px', { lineHeight: '16px', fontWeight: '500' }],
        sm: ['13px', { lineHeight: '20px', fontWeight: '400' }],
        base: ['14px', { lineHeight: '22px', fontWeight: '400' }],
        md: ['15px', { lineHeight: '24px', fontWeight: '500' }],
        lg: ['16px', { lineHeight: '24px', fontWeight: '600' }],
        xl: ['18px', { lineHeight: '28px', fontWeight: '600' }],
        '2xl': ['22px', { lineHeight: '30px', fontWeight: '700' }],
        '3xl': ['28px', { lineHeight: '36px', fontWeight: '700' }],
        '4xl': ['36px', { lineHeight: '44px', fontWeight: '800' }],
      },
      letterSpacing: {
        tightest: '-0.03em',
        tighter: '-0.02em',
        tight: '-0.01em',
      },
      colors: {
        brand: {
          DEFAULT: 'hsl(var(--brand))',
          light: 'hsl(var(--brand-light))',
          dark: 'hsl(var(--brand-dark))',
          subtle: 'hsl(var(--brand-subtle))',
          ghost: 'hsl(var(--brand-ghost))',
        },
        surface: {
          base: 'hsl(var(--bg-base))',
          elevated: 'hsl(var(--bg-elevated))',
          sunken: 'hsl(var(--bg-sunken))',
          overlay: 'hsl(var(--bg-overlay))',
          inset: 'hsl(var(--bg-inset))',
        },
        border: {
          DEFAULT: 'hsl(var(--border-default))',
          subtle: 'hsl(var(--border-subtle))',
          strong: 'hsl(var(--border-strong))',
        },
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        success: {
          DEFAULT: 'hsl(var(--success))',
          bg: 'hsl(var(--success-bg))',
          foreground: 'hsl(var(--success-foreground))',
        },
        warning: {
          DEFAULT: 'hsl(var(--warning))',
          bg: 'hsl(var(--warning-bg))',
          foreground: 'hsl(var(--warning-foreground))',
        },
        danger: {
          DEFAULT: 'hsl(var(--danger))',
          bg: 'hsl(var(--danger-bg))',
          foreground: 'hsl(var(--danger-foreground))',
        },
        info: {
          DEFAULT: 'hsl(var(--info))',
          bg: 'hsl(var(--info-bg))',
          foreground: 'hsl(var(--info-foreground))',
        },
      },
      boxShadow: {
        xs: 'var(--shadow-xs)',
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        xl: 'var(--shadow-xl)',
        glow: 'var(--shadow-glow)',
        card: 'var(--shadow-card)',
        'card-hover': 'var(--shadow-card-hover)',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        DEFAULT: 'var(--radius)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
      },
      keyframes: {
        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
        'fade-in-up': { from: { opacity: '0', transform: 'translateY(8px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        'scale-in': { from: { opacity: '0', transform: 'scale(0.95)' }, to: { opacity: '1', transform: 'scale(1)' } },
        'slide-left': { from: { transform: 'translateX(100%)' }, to: { transform: 'translateX(0)' } },
        shimmer: { '0%': { backgroundPosition: '200% 0' }, '100%': { backgroundPosition: '-200% 0' } },
      },
      animation: {
        'fade-in': 'fade-in 0.3s cubic-bezier(0.16,1,0.3,1) forwards',
        'fade-in-up': 'fade-in-up 0.4s cubic-bezier(0.16,1,0.3,1) forwards',
        'scale-in': 'scale-in 0.3s cubic-bezier(0.34,1.56,0.64,1) forwards',
        'slide-left': 'slide-left 0.3s cubic-bezier(0.16,1,0.3,1) forwards',
        shimmer: 'shimmer 1.5s ease-in-out infinite',
      },
    },
  },
  plugins: [animatePlugin, typographyPlugin, aspectRatioPlugin],
} satisfies Config
