import { defineParams } from '@sveltejs/kit/params';
import { DEFAULT_LOCALE, LOCALES } from './lib/i18n/locales.js';

/**
 * Yol önekindeki dil kodu. Varsayılan dil Türkçe önek almaz: `/` ve `/resizer`
 * Türkçe, `/en` ve `/en/resizer` İngilizcedir. Bu yüzden eşleştirici yalnızca
 * varsayılan dışındaki dilleri kabul eder.
 */
const matchLocale = (param: string) =>
	LOCALES.find((locale) => locale === param && locale !== DEFAULT_LOCALE);

export const params = defineParams({
	locale: matchLocale
});
