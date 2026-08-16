import { redirect, type Handle } from '@sveltejs/kit';
import { building } from '$app/environment';
import { DEFAULT_LOCALE } from '$lib/i18n';
import { localeFromPath } from '$lib/i18n/paths';
// Basliklar sunucu girdisiyle ortak; bkz. server/security.js.
import { SECURITY_HEADERS } from '../server/security.js';

/**
 * Kanonik konak adi yonlendirmesi burada DEGIL, server/canonical.js icinde:
 * sayfalar prerender edildigi ve adapter-node onlari bu hook calismadan once
 * sundugu icin buradaki bir yonlendirme sitenin gercek sayfalarina hic
 * ulasmiyordu. Asagida yalnizca dil oneki ve sondaki egik cizgi kurallari
 * kaldi; ikisi de SSR ile uretilen adreslerde anlamli.
 */
export const handle: Handle = async ({ event, resolve }) => {
	const pathname = event.url.pathname;

	// Yonlendirme kurallari yalnizca calisma zamaninda anlamli: prerender
	// sirasinda istek yok, adres zaten kanonik bicimde uretiliyor ve url.search
	// o asamada okunamiyor.
	if (!building) redirectToCanonical(event.url);

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

function redirectToCanonical(url: URL) {
	const { pathname, search } = url;

	// API ucu kanoniklestirmenin disinda: bu kurallar arama motoru icin var,
	// /api dizine girmiyor (bkz. robots.txt) ve yonlendirme burada islevi
	// bozuyor. POST bir 301 aldiginda govde dusuyor; ustelik asagidaki egik
	// cizgi kurali ile SvelteKit'in kendi normallestirmesi ters yonde
	// calisiyordu: /api/convert -> 301 -> /api/convert/ -> 308 -> /api/convert.
	if (pathname === '/api' || pathname.startsWith('/api/')) return;

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
