/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          navy: '#0E2954',
          dark: '#07152B',
          navyLight: '#183B73',
          navySubtle: '#EFF4FB',
          saffron: '#F57C00',
          saffronHover: '#D96B00',
          saffronLight: '#FFF7ED',
          gold: '#D97706',
          green: '#059669',
          greenHover: '#047857',
          greenLight: '#ECFDF5',
          surface: '#FAF8FF',
          surfaceAlt: '#F8FAFC',
          card: '#FFFFFF',
          border: '#E2E8F0',
          borderSubtle: '#F1F5F9',
          text: '#0F172A',
          subtext: '#475569',
          blue: '#1D4ED8',
          blueLight: '#EFF6FF',
          red: '#DC2626',
          redLight: '#FEF2F2'
        },
        mota: {
          navy: '#0E2954',
          darknavy: '#07152B',
          saffron: '#F57C00',
          saffronLight: '#FFF7ED',
          green: '#059669',
          greenLight: '#ECFDF5',
          gold: '#D97706',
          slate: '#FAF8FF',
          card: '#FFFFFF',
          border: '#E2E8F0',
          subtext: '#475569'
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', '"Noto Sans Devanagari"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'mobile-tab': '0 -2px 14px -1px rgba(15, 23, 42, 0.08)',
        'card-soft': '0 1px 4px 0 rgba(15, 23, 42, 0.05), 0 4px 12px -2px rgba(15, 23, 42, 0.04)',
        'card-elevated': '0 4px 20px -2px rgba(11, 30, 54, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        'float-btn': '0 8px 24px -4px rgba(224, 109, 0, 0.38)'
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.2s ease-out forwards',
        'slide-up': 'slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(3px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
