/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				primary: '#F6F6FA',
				secondary: '#60A5FA',
				action: ''
			},
			fontFamily: {
				'Sans': ['Sans'],
				'Sans-Bold': ['Sans-Bold'],
				'Novecento-Utrabold': ['Novecento-Utrabold']
			},
			borderWidth: {
				'1': '1px'
			},
			fontSize: {
				desktopHeading: '4.25rem',
				mobileHeading: '3rem',
				desktopHeading2: '1.56rem',
				mobileHeading2: '1.5rem',
				desktopHeading3: '1.25rem',
				mobileHeading3: '1.19rem',
				desktopLarge: '1.13rem',
				mobileLarge: '1.14rem',
				medium: '1.5rem',
				normal: '1rem',
			},
			backgroundImage: {
				'radial-gradient': "radial-gradient(at center bottom, #212F40 0%, #090A0F 100%)",
			},
		},
	},
	plugins: [],
}
