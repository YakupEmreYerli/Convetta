/**
 * Guvenlik basliklari. Tek kaynak burasi: hem sunucu girdisi (server/index.js)
 * hem de SvelteKit hook'u (src/hooks.server.ts) bunu okuyor.
 *
 * Neden iki yerde birden uygulaniyor: sayfalar prerender ediliyor ve
 * adapter-node prerender edilmis dosyalari hook calismadan once sunuyor.
 * Hook yalnizca SSR ile uretilen yanitlari kapsiyordu, yani sitenin gercek
 * sayfalari uzun sure hicbir guvenlik basligi tasimadi. Sunucu katmani
 * bosluğu dolduruyor; hook ise gelistirme sunucusunda (vite) ayni basliklarin
 * gecerli olmasini sagliyor.
 *
 * Ikisi cakismaz: Node, writeHead ile gonderilen degeri setHeader ile
 * konulanin uzerine yazar, bu yuzden SSR yanitlarinda hook'un degeri gecerli
 * olur ve baslik iki kez gonderilmez.
 */

const CSP = [
	"default-src 'self'",
	// SvelteKit hydration verisini ve app.html'deki tema betigini satir ici
	// calistirir; ikisi de kendi kodumuz.
	"script-src 'self' 'unsafe-inline'",
	"style-src 'self' 'unsafe-inline'",
	// blob: donusum ciktilarinin onizlemesi, data: canvas ciktilari icin.
	"img-src 'self' data: blob:",
	"font-src 'self'",
	"connect-src 'self' blob:",
	"object-src 'none'",
	"base-uri 'self'",
	"form-action 'self'",
	"frame-ancestors 'self'"
].join('; ');

/** @type {Record<string, string>} */
export const SECURITY_HEADERS = {
	'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
	'X-Content-Type-Options': 'nosniff',
	'X-Frame-Options': 'SAMEORIGIN',
	'Referrer-Policy': 'strict-origin-when-cross-origin',
	'Content-Security-Policy': CSP
};
