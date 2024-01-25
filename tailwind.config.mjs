/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				textPrimary: '#FFFFFF',
				textSecondary: '#AFAFB2',
				action: '#4990E2',
				background: '#24282E',
				elements: '#2B3038',
				elementsBright: '#3B414C',
				borderColor: '#41454C',
				borderColorBright: '#6E7480',
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
				'radial-gradient': "radial-gradient(at center top, #373D47 0%, #181B1F 100%)",
				'linear-gradient': "linear-gradient(180deg, #313740 0%, #181B1F 100%)",
			},
			gridTemplateColumns: {
				'packages': 'repeat(auto-fit, minmax(260px, 1fr))',
				'packagesMobile': 'repeat(auto-fit, minmax(230px, 1fr))',
			},
			boxShadow: {
				'packages': '0 0 20px 5px #0000004a',
				'packagesHover': '0 0 20px 10px #0000004a',
				'drawer': '0 0 20px 10px #0000004a',
			},
			scale: {
				'102': '1.02',
			},
		},
	},
	plugins: [],
}
