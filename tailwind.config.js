/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    fontFamily: {
      sans: ['Arial', 'Helvetica', 'sans-serif'],
      times: ['Times New Roman Local', 'Times New Roman', 'Times', 'serif']
    },
    extend: {
      'dark-bg': 'rgba(0,0,0,1)',
      'dark-text': 'rgba(255,255,255,1)',
      'light-bg': 'rgba(255,255,255,1)',
      'light-text': 'rgba(0,0,0,1)',
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' }
        }
      },
      animation: {
        blink: 'blink 1s step-end infinite'
      }
    },
    plugins: []
  }
};
