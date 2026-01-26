/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Government Theme Colors
        primary: {
          50: '#e6f0ff',
          100: '#b3d1ff',
          200: '#80b3ff',
          300: '#4d94ff',
          400: '#1a75ff',
          500: '#003D82', // Deep Government Blue
          600: '#003470',
          700: '#002b5e',
          800: '#00224c',
          900: '#00193a',
        },
        secondary: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#F4F4F4', // Light Gray Background
          300: '#e0e0e0',
          400: '#bdbdbd',
          500: '#9e9e9e',
          600: '#757575',
          700: '#616161',
          800: '#424242',
          900: '#212121',
        },
        accent: {
          50: '#fff5e6',
          100: '#ffe0b3',
          200: '#ffcc80',
          300: '#ffb84d',
          400: '#ffa31a',
          500: '#FF9933', // Saffron/Orange for CTAs
          600: '#e68a2e',
          700: '#cc7a29',
          800: '#b36b24',
          900: '#995c1f',
        },
        success: {
          50: '#e8f5e9',
          100: '#c8e6c9',
          200: '#a5d6a7',
          300: '#81c784',
          400: '#66bb6a',
          500: '#138808', // India Green
          600: '#118507',
          700: '#0f7306',
          800: '#0d6105',
          900: '#0a4f04',
        },
        text: {
          primary: '#333333', // Dark Gray
          secondary: '#666666',
          muted: '#999999',
        },
        border: {
          DEFAULT: '#CCCCCC',
          light: '#E5E5E5',
          dark: '#999999',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'Inter', 'Arial', 'Helvetica', 'sans-serif'],
        heading: ['Poppins', 'Inter', 'Arial', 'Helvetica', 'sans-serif'],
      },
      fontSize: {
        'hero': ['3rem', { lineHeight: '1.2', fontWeight: '700' }],
        'h1': ['2.25rem', { lineHeight: '1.3', fontWeight: '700' }],
        'h2': ['1.875rem', { lineHeight: '1.35', fontWeight: '600' }],
        'h3': ['1.5rem', { lineHeight: '1.4', fontWeight: '600' }],
        'h4': ['1.25rem', { lineHeight: '1.45', fontWeight: '600' }],
        'body': ['1rem', { lineHeight: '1.6', fontWeight: '400' }],
        'small': ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 4px 16px rgba(0, 0, 0, 0.12)',
        'modal': '0 8px 32px rgba(0, 0, 0, 0.16)',
        'button': '0 2px 4px rgba(0, 61, 130, 0.2)',
        'button-hover': '0 4px 8px rgba(0, 61, 130, 0.3)',
      },
      maxWidth: {
        'content': '1200px',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
