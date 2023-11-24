/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			fontFamily: {
				'Sans': ['Sans'],
				'Sans-Bold': ['Sans-Bold'],
				'Novecento-Utrabold': ['Novecento-Utrabold']
			}
		},
	},
	plugins: [],
}
