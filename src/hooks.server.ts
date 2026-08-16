import { redirect, type Handle } from '@sveltejs/kit';
import { building } from '$app/environment';
import { DEFAULT_LOCALE } from '$lib/i18n';
import { localeFromPath } from '$lib/i18n/paths';

/**
 * Kanonik adres tek: https://www.convetta.com.
 *
 * DIKKAT: asagidaki non-www -> www 301'i sitenin SAYFALARINI kapsamiyor.
 * Sayfalar prerender ediliyor ve adapter-node prerender edilmis dosyalari bu
 * hook calismadan once statik olarak sunuyor; yani convetta.com/ istegi 301
 * degil 200 doner. Kural yalnizca prerender edilmemis yollarda (or. 404'e
 * dusen adresler) devreye giriyor.
 *
 * Sayfalar icin non-www -> www yonlendirmesi bu yuzden kenarda (Cloudflare
 * redirect rule) tanimlanmali. Kod tarafinda tek koruma her sayfanin
 * kendini www'li adrese isaret eden <link rel="canonical"> etiketi.
 */
const CANONICAL_HOST = 'www.convetta.com';
const REDIRECT_HOSTS = new Set(['convetta.com']);

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

const SECURITY_HEADERS: Record<string, string> = {
	'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
	'X-Content-Type-Options': 'nosniff',
	'X-Frame-Options': 'SAMEORIGIN',
	'Referrer-Policy': 'strict-origin-when-cross-origin',
	'Content-Security-Policy': CSP
};

export const handle: Handle = async ({ event, resolve }) => {
	const pathname = event.url.pathname;

	// Yonlendirme kurallari yalnizca calisma zamaninda anlamli: prerender
	// sirasinda istek yok, adres zaten kanonik bicimde uretiliyor ve url.search
	// o asamada okunamiyor.
	if (!building) redirectToCanonical(event.url, event.request);

	const locale = localeFromPath(pathname);
	const response = await resolve(event, {
		// app.html'deki <html lang> sunucuda doğru dille basılıyor; aksi
		// halde ekran okuyucular ve ceviri araclari ilk yuklemede yanlis dili
		// gorurdu.
		transformPageChunk: ({ html }) => html.replace('%lang%', locale)
	});

	for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
		response.headers.set(key, value);
	}
	return response;
};

function redirectToCanonical(url: URL, request: Request) {
	const { pathname, search } = url;

	// API ucu kanoniklestirmenin disinda: bu kurallar arama motoru icin var,
	// /api dizine girmiyor (bkz. robots.txt) ve yonlendirme burada islevi
	// bozuyor. POST bir 301 aldiginda govde dusuyor; ustelik asagidaki egik
	// cizgi kurali ile SvelteKit'in kendi normallestirmesi ters yonde
	// calisiyordu: /api/convert -> 301 -> /api/convert/ -> 308 -> /api/convert.
	if (pathname === '/api' || pathname.startsWith('/api/')) return;

	const host = (request.headers.get('host') ?? '').split(':')[0];
	if (REDIRECT_HOSTS.has(host)) {
		const proto = request.headers.get('x-forwarded-proto') === 'http' ? 'http' : 'https';
		redirect(301, `${proto}://${CANONICAL_HOST}${pathname}${search}`);
	}

	// Varsayılan dilin öneki yok: /tr/... adresleri öneksiz karşılıklarına
	// kalıcı olarak yönlendirilir.
	const segments = pathname.split('/').filter(Boolean);
	if (segments[0] === DEFAULT_LOCALE) {
		const rest = '/' + segments.slice(1).join('/');
		redirect(301, (rest === '/' ? '/' : rest.replace(/\/$/, '')) + search);
	}

	// Sayfa rotaları sondaki eğik çizgiyle tek bir kanonik biçimde tutulur.
	if (pathname.length > 1 && !pathname.endsWith('/')) {
		redirect(301, `${pathname}/${search}`);
	}
}
