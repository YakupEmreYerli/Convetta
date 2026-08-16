import { en, type Dictionary } from './en';
import { tr } from './tr';

export const LOCALES = ['tr', 'en'] as const;
export type Locale = (typeof LOCALES)[number];

/**
 * Varsayılan dil Türkçe: `/` Türkçe sunuluyor, İngilizce `/en` önekiyle.
 * Yol uretimi tek noktadan yapiliyor (bkz. ./paths.ts).
 */
export const DEFAULT_LOCALE: Locale = 'tr';

export const dictionaries: Record<Locale, Dictionary> = { tr, en };

export type { Dictionary };

export function isLocale(value: unknown): value is Locale {
	return typeof value === 'string' && (LOCALES as readonly string[]).includes(value);
}

/**
 * `{name}` bicimindeki yer tutuculari doldurur. Ceviri metinleri HTML olarak
 * degil metin olarak basildigi icin burada kacislama gerekmiyor.
 */
export function fill(template: string, values: Record<string, string | number> = {}): string {
	return template.replace(/\{(\w+)\}/g, (match, key: string) =>
		key in values ? String(values[key]) : match
	);
}
