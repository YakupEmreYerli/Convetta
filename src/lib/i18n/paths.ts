import { DEFAULT_LOCALE, isLocale, type Locale } from './index';

/**
 * Adres ve dil arasindaki tek donusum noktasi.
 *
 * Varsayilan dil onek almaz: `/`, `/resizer`. Diger diller yol onekiyle gelir:
 * `/tr`, `/tr/resizer`. Kanonik adres, hreflang etiketleri ve dil secici hep
 * buradaki iki fonksiyonu kullanir.
 */

/** Adresten dili okur; onek yoksa varsayilan dil. */
export function localeFromPath(pathname: string): Locale {
	const first = pathname.split('/').filter(Boolean)[0];
	return isLocale(first) && first !== DEFAULT_LOCALE ? first : DEFAULT_LOCALE;
}

/** Dil onegini atarak yolun geri kalanini dondurur: `/tr/resizer` -> `/resizer`. */
export function stripLocale(pathname: string): string {
	const segments = pathname.split('/').filter(Boolean);
	if (segments.length > 0 && isLocale(segments[0]) && segments[0] !== DEFAULT_LOCALE) {
		segments.shift();
	}
	return '/' + segments.join('/');
}

/** Ayni sayfanin baska dildeki adresi. */
export function localizePath(pathname: string, locale: Locale): string {
	const rest = stripLocale(pathname);
	if (locale === DEFAULT_LOCALE) return rest;
	return rest === '/' ? `/${locale}` : `/${locale}${rest}`;
}
