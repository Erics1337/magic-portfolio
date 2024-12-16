/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        scroll: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(12px)', opacity: '0' }
        },
        'icon-bounce': {
          '0%, 100%': { transform: 'translateY(0) scale(1)' },
          '50%': { transform: 'translateY(-25%) scale(1.1)' }
        }
      },
      animation: {
        scroll: 'scroll 1.5s ease-in-out infinite',
        'icon-bounce': 'icon-bounce 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
      }
    }
  },
  plugins: [],
}
