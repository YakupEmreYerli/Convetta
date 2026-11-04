import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import { defineConfig } from 'vitest/config';
import tailwindConfig from './tailwind.app.config.js';

export default defineConfig({
	plugins: [sveltekit()],
	// Fixed port from the machine port registry, so parallel projects never collide.
	server: { port: 4470, strictPort: true },
	preview: { port: 4470, strictPort: true },
	css: {
		// PostCSS zinciri burada tanimli: kokte postcss.config.js birakilsaydi
		// eski sitenin `npm run build:css` cagrisi da onu yakalar ve iki farkli
		// Tailwind yapilandirmasi ust uste binerdi.
		postcss: {
			plugins: [tailwindcss(tailwindConfig), autoprefixer()]
		}
	},
	test: {
		environment: 'jsdom',
		include: ['src/**/*.test.ts'],
		globals: true
	}
});
