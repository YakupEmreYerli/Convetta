/**
 * SvelteKit uygulamasinin Tailwind yapilandirmasi.
 *
 * Koktekki tailwind.config.cjs eski statik HTML sitesine ait ve dokunulmadi;
 * bu dosya yalnizca src/ altindaki Svelte bilesenlerini tarar. Iki yapilandirma
 * birbirinden bagimsiz derlenir (bu dosya vite.config.ts icinden PostCSS'e
 * dogrudan veriliyor, kokte postcss.config.js yok).
 *
 * @type {import('tailwindcss').Config}
 */
export default {
	darkMode: 'class',
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				brand: {
					DEFAULT: '#2864EC',
					600: '#2563eb',
					700: '#1d4ed8'
				}
			},
			fontFamily: {
				sans: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif']
			},
			maxWidth: {
				content: '80rem'
			}
		}
	},
	plugins: []
};
