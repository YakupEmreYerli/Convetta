import { redirect, type Handle } from '@sveltejs/kit';
import { building } from '$app/environment';
import { DEFAULT_LOCALE } from '$lib/i18n';
import { localeFromPath } from '$lib/i18n/paths';

/**
 * Kanonik adres tek: https://www.convetta.com. Dokploy'da hem convetta.com hem
 * www.convetta.com ayni konteynere yonlendigi icin non-www -> www 301'i burada
 * yapiliyor; yoksa ayni icerik iki adreste 200 doner ve arama motoru kanonik
 * secimi kendi basina yapar.
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

	// Sondaki egik cizgi tek bir kanonik bicime indiriliyor (/resizer/ -> /resizer).
	if (pathname.length > 1 && pathname.endsWith('/')) {
		redirect(301, pathname.replace(/\/+$/, '') + search);
	}
}
