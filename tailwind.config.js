/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		fontFamily: {
			sans: ['"Times New Roman"', 'sans-serif'],
			times: ['Times New Roman Local', 'Times New Roman', 'Times', 'serif'],
		},
		extend: {
			'dark-bg': 'rgba(0,0,0,1)',
			'dark-text': 'rgba(255,255,255,1)',
			'light-bg': 'rgba(255,255,255,1)',
			'light-text': 'rgba(0,0,0,1)'
		}
	},
	plugins: []
};
