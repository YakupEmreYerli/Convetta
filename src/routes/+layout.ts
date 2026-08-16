import { localeFromPath } from '$lib/i18n/paths';
import type { LayoutLoad } from './$types';

// Sayfalar build sirasinda onceden uretiliyor; yalnizca /api/convert calisma
// zamani gerektiriyor (bkz. routes/api/convert/+server.ts).
export const prerender = true;
export const ssr = true;

/**
 * Dil, adres onekinden okunuyor ve sunucu ile istemci tarafinda ayni sonucu
 * veriyor; boylece ilk boyamada dogru metinler basiliyor ve hydration uyusmazligi
 * olusmuyor.
 */
export const load: LayoutLoad = ({ url }) => {
	return { locale: localeFromPath(url.pathname) };
};
