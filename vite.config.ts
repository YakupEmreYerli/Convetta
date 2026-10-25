import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/postcss';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [sveltekit()],
	css: {
		// PostCSS zinciri yalnızca Vite uygulamasında uygulanıyor. Kök düzeyinde
		// postcss.config.js, eski statik site derlemesine v4 zincirini de uygular
		// ve birbirinden bağımsız Tailwind yapılandırmalarını çakıştırır.
		postcss: {
			plugins: [tailwindcss()]
		}
	},
	test: {
		environment: 'jsdom',
		include: ['src/**/*.test.ts'],
		globals: true
	}
});
