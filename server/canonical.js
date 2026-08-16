/**
 * Kanonik konak adi kontrolu.
 *
 * Bu kural neden hooks.server.ts'te degil: sayfalar prerender ediliyor ve
 * adapter-node prerender edilmis dosyalari hook'lar calismadan once statik
 * olarak sunuyor. Yani hook icindeki bir yonlendirme sitenin gercek
 * sayfalarina hic ulasmiyordu; convetta.com/ istegi 200 donuyordu ve ayni
 * icerik iki konak adinda birden yayindaydi.
 *
 * Saf fonksiyon olarak ayri duruyor cunku test edilebilir olmasi gerekiyor:
 * yanlis bir kosul burada butun siteyi yonlendirme dongusune sokar.
 */

const CANONICAL_HOST = 'www.convetta.com';

/** Yalnizca bilinen non-www adres yonlendirilir. */
const REDIRECT_HOSTS = new Set(['convetta.com']);

/**
 * Ilk deger alinir: ters vekil zincirinde bu basliklar virgulle ayrilmis
 * liste olabiliyor ve dogru olan istemciye en yakin ilk kayittir.
 *
 * @param {string | string[] | undefined} value
 * @returns {string}
 */
function firstValue(value) {
	const raw = Array.isArray(value) ? value[0] : value;
	return String(raw ?? '')
		.split(',')[0]
		.trim();
}

/**
 * Yonlendirilecekse hedef adresi, yonlendirilmeyecekse null doner.
 *
 * @param {import('node:http').IncomingHttpHeaders} headers
 * @param {string | undefined} url Istegin yolu ve sorgu dizesi.
 * @returns {string | null}
 */
export function canonicalRedirect(headers, url) {
	// Vekil arkasinda Host konteynerin kendi adresi olabiliyor; istemcinin
	// gercekte yazdigi adres X-Forwarded-Host'ta.
	const forwarded = firstValue(headers['x-forwarded-host']);
	const hostHeader = forwarded || firstValue(headers.host);
	// Port ayiklanir (convetta.com:8787), buyuk harf normallestirilir.
	const host = hostHeader.split(':')[0].toLowerCase();

	if (!REDIRECT_HOSTS.has(host)) return null;

	// Uretimde TLS vekilde sonlaniyor; sema yalnizca vekilin bildirdigi
	// degerden okunur, aksi halde https varsayilir.
	const proto = firstValue(headers['x-forwarded-proto']) === 'http' ? 'http' : 'https';

	return `${proto}://${CANONICAL_HOST}${url || '/'}`;
}
