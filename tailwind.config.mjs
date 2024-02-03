/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				textPrimary: '#FEFEFE',
				textSecondary: '#AFAFB2',
				elements: "#2E3540",
				elementsBright: "#404B59",
				elementsBrighter: "#495666",
				elementsDark: "#1F242B",
				action: '#4188D9',
				actionBright: '#44A0E0',
				actionDark: '#3670B2',
				border: '#41454C',
				borderBright: '#626873',
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
				desktopHeading2: '1.8rem',
				mobileHeading2: '1.5rem',
				desktopLarge: '1.25rem',
				mobileLarge: '1.19rem',
				normal: '1rem',
				small: '0.8rem',
				none: '0rem',
			},
			backgroundImage: {
				'radial-gradient': "radial-gradient(at center top, #2D3440 0%, #13161A 100%)",
			},
			gridTemplateColumns: {
				'packages': 'repeat(auto-fit, minmax(260px, 1fr))',
				'packagesMobile': 'repeat(auto-fit, minmax(230px, 1fr))',
			},
			boxShadow: {
				'packages': '0 0 15px 5px rgb(0 0 0 / 0.15)',
				'packagesHover': '0 0 20px 5px rgb(0 0 0 / 0.15)',
			},
			scale: {
				'102': '1.02',
			},
		},
	},
	plugins: [],
}
