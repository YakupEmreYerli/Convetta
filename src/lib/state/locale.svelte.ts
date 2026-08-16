import { getContext, setContext } from 'svelte';
import { browser } from '$app/environment';
import { dictionaries, fill, isLocale, type Dictionary, type Locale } from '$lib/i18n';

const STORAGE_KEY = 'convetta:lang';
const CONTEXT_KEY = Symbol('convetta:locale');

/**
 * Geçerli dil adresten gelir (`/` Türkçe, `/en` İngilizce).
 *
 * Durum bilincli olarak modul duzeyinde degil bilesen agacinda tutuluyor:
 * sunucu tek surecte cok sayida istegi karsiliyor ve paylasilan bir degisken
 * bir istegin dilini digerine sizdirirdi.
 */
export class LocaleState {
	current = $state<Locale>('tr');

	constructor(initial: Locale) {
		this.current = initial;
	}

	get dict(): Dictionary {
		return dictionaries[this.current];
	}

	/** Rotadan gelen dili uygular; `<html lang>` ve tercih burada guncellenir. */
	sync(locale: Locale) {
		this.current = locale;
		if (!browser) return;
		document.documentElement.lang = locale;
		try {
			localStorage.setItem(STORAGE_KEY, locale);
		} catch {
			/* kalici saklama basarisizsa dil yalnizca bu oturumda gecerli olur */
		}
	}

	/** Sozlukten metin alip `{...}` yer tutucularini doldurur. */
	t(pick: (d: Dictionary) => string, values?: Record<string, string | number>): string {
		return fill(pick(this.dict), values);
	}
}

/** Kok layout'ta bir kez cagrilir. */
export function setLocaleContext(initial: Locale): LocaleState {
	return setContext(CONTEXT_KEY, new LocaleState(initial));
}

/** Alt bilesenler gecerli dili buradan alir. */
export function getLocale(): LocaleState {
	return getContext<LocaleState>(CONTEXT_KEY);
}

/** Daha once secilmis dil; yoksa null. Yalnizca tarayicida anlamli. */
export function storedLocale(): Locale | null {
	if (!browser) return null;
	try {
		const value = localStorage.getItem(STORAGE_KEY);
		return isLocale(value) ? value : null;
	} catch {
		return null;
	}
}
