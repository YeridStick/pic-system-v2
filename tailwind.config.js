// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: {
            50: '#f0f9ff',
            100: '#e0f2fe',
            200: '#bae6fd',
            300: '#7dd3fc',
            400: '#38bdf8',
            500: '#4caf50',
            600: '#45a049',
            700: '#388e3c',
            800: '#2e7d32',
            900: '#1b5e20',
          },
          success: {
            50: '#f0fdf4',
            500: '#22c55e',
            600: '#16a34a',
          },
          error: {
            50: '#fef2f2',
            500: '#ef4444',
            600: '#dc2626',
          },
          warning: {
            50: '#fffbeb',
            500: '#f59e0b',
            600: '#d97706',
          }
        },
        fontFamily: {
          sans: ['Segoe UI', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
        },
        boxShadow: {
          'soft': '0 5px 15px rgba(0, 0, 0, 0.08)',
          'card': '0 20px 40px rgba(0, 0, 0, 0.1)',
        },
        borderRadius: {
          'xl': '12px',
          '2xl': '16px',
        }
      },
    },
    plugins: [],
  }