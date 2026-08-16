import type { ParamMatcher } from '@sveltejs/kit';
import { LOCALES, DEFAULT_LOCALE } from '$lib/i18n';

/**
 * Yol onekindeki dil kodu. Varsayilan dil (Ingilizce) onek almaz: `/` ve
 * `/resizer` Ingilizce, `/tr` ve `/tr/resizer` Turkce. Bu yuzden matcher
 * yalnizca varsayilan disindaki dilleri kabul eder - aksi halde `/resizer`
 * adresi "resizer" adli bir dil olarak yorumlanmaya calisilirdi.
 */
export const match: ParamMatcher = (param) => {
	return LOCALES.includes(param as (typeof LOCALES)[number]) && param !== DEFAULT_LOCALE;
};
