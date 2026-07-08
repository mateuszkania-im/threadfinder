import tailwindcssAnimate from 'tailwindcss-animate'

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: { '2xl': '1280px' },
    },
    extend: {
      fontFamily: {
        sans: ['Geist', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"Geist Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        border: 'hsl(var(--border))',
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
        // Light surfaces + signal-green brand
        ink: '#0A2540',
        slate: '#3D4B60',
        blurple: '#1FC46E',
        canvas: '#F4FAF6',
        elevated: '#0A2540',
        signal: {
          high: '#10B981',
          med: '#F59E0B',
          low: '#F43F5E',
        },
        src: {
          jira: '#2684FF',
          confluence: '#2563EB',
          figma: '#A259FF',
          onedrive: '#0364B8',
          github: '#1F2328',
          doc: '#8B5CF6',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 4px)',
        sm: 'calc(var(--radius) - 8px)',
      },
      boxShadow: {
        card: '0 1px 2px rgba(10,37,64,0.04), 0 8px 24px -12px rgba(10,37,64,0.12)',
        float: '0 24px 60px -24px rgba(20,120,70,0.22), 0 2px 8px rgba(10,37,64,0.06)',
        glow: '0 0 0 1px rgba(31,196,110,0.14), 0 12px 40px -12px rgba(31,196,110,0.3)',
      },
      keyframes: {
        'aurora-drift': {
          '0%,100%': { transform: 'translate3d(0,0,0) scale(1)' },
          '50%': { transform: 'translate3d(0,-3%,0) scale(1.08)' },
        },
        'signal-pulse': {
          '0%,100%': { opacity: '0.35' },
          '50%': { opacity: '1' },
        },
        'caret-blink': {
          '0%,100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
      },
      animation: {
        'aurora-drift': 'aurora-drift 16s ease-in-out infinite',
        'signal-pulse': 'signal-pulse 1.4s ease-in-out infinite',
        'caret-blink': 'caret-blink 1s step-end infinite',
      },
    },
  },
  plugins: [tailwindcssAnimate],
}
