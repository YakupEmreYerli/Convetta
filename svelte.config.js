import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		// Node adaptoru: cikti `build/index.js` olarak uretiliyor ve Dokploy'daki
		// konteyner bunu calistiriyor. Sayfalar yine de onceden uretiliyor
		// (bkz. +layout.ts prerender), yalnizca /api/convert calisma zamani
		// gerektiriyor - ImageMagick tarayicinin uretemedigi GIF/ICO/PDF
		// ciktilarini burada uretiyor.
		adapter: adapter({ out: 'build' }),
		alias: {
			$components: 'src/lib/components'
		}
	}
};

export default config;
