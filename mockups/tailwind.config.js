/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary':   '#0A0A14',
        'bg-card':      '#12121E',
        'bg-ui':        '#1A1A2E',
        'accent-gold':  '#C9A84C',
        'accent-violet':'#7C3AED',
        'text-primary': '#FFFFFF',
        'text-secondary':'#9CA3AF',
        'star':         '#F59E0B',
      },
      fontFamily: {
        title: ['"Space Grotesk"', 'sans-serif'],
        body:  ['"DM Sans"', 'sans-serif'],
      },
      width: {
        'phone': '390px',
      },
      height: {
        'phone': '844px',
      },
    },
  },
  plugins: [],
}
