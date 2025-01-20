/** @type {import('tailwindcss').Config} */
const { nextui } = require("@nextui-org/react");

export default {
	content: [
		'./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
		'./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
	],
	theme: {
		extend: {
			fontSize: {
				'xs-small': '0.6rem',   // Tamaño personalizado más pequeño
				'xxl': '1.75rem',       // Tamaño entre xl y 2xl
				'xxxl': '2.5rem',       // Tamaño grande adicional
				'giant': '5rem',        // Tamaño extremadamente grande
			  },
		},
	},

	plugins: [nextui()],
}
