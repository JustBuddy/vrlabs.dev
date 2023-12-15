/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				textPrimary: '#FFFFFF',
				textSecondary: '#AFAFB2',
				action: '#3DACF2',
				background: '#1E2227',
				elements: '#2B3038',
				borderColor: '#41454C',
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
				desktopLarge: '1.25rem',
				mobileLarge: '1.19rem',
				normal: '1rem',
				small: '0.8rem',
			},
			backgroundImage: {
				'radial-gradient': "radial-gradient(at center bottom, #212F40 0%, #090A0F 100%)",
			},
			gridTemplateColumns: {
				'packages': 'repeat(auto-fit, 260px)',
				'packagesMobile': 'repeat(auto-fit, 240px)',
			},
			boxShadow: {
				'packages': '0 0 20px 5px #0000004a',
				'packagesHover': '0 0 20px 10px #0000004a',
			},
		},
	},
	plugins: [],
}
