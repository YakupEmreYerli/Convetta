import { describe, expect, it } from 'vitest';
import { dictionaries, fill, isLocale, LOCALES } from './index';

/** Ic ice sozluk anahtarlarini "a.b.c" bicimine acar. */
function flatten(value: unknown, prefix = ''): string[] {
	if (typeof value === 'string') return [prefix];
	if (Array.isArray(value)) return value.flatMap((v, i) => flatten(v, `${prefix}[${i}]`));
	if (value && typeof value === 'object') {
		return Object.entries(value).flatMap(([k, v]) => flatten(v, prefix ? `${prefix}.${k}` : k));
	}
	return [];
}

describe('sozlukler', () => {
	it('tum dillerde ayni anahtarlari icerir', () => {
		const reference = flatten(dictionaries.en).sort();
		for (const code of LOCALES) {
			expect(flatten(dictionaries[code]).sort(), `eksik ceviri: ${code}`).toEqual(reference);
		}
	});

	it('bos metin birakmaz', () => {
		for (const code of LOCALES) {
			const empty = flatten(dictionaries[code]).filter((key) => {
				const parts = key.replace(/\[(\d+)\]/g, '.$1').split('.');
				let node: unknown = dictionaries[code];
				for (const part of parts) node = (node as Record<string, unknown>)[part];
				return typeof node === 'string' && node.trim() === '';
			});
			expect(empty, `bos ceviri: ${code}`).toEqual([]);
		}
	});
});

describe('fill', () => {
	it('yer tutuculari doldurur', () => {
		expect(fill('{count} dosya', { count: 3 })).toBe('3 dosya');
	});

	it('karsiligi olmayan yer tutucuyu oldugu gibi birakir', () => {
		expect(fill('{a} / {b}', { a: 1 })).toBe('1 / {b}');
	});
});

describe('isLocale', () => {
	it('yalnizca bilinen dilleri kabul eder', () => {
		expect(isLocale('tr')).toBe(true);
		expect(isLocale('de')).toBe(false);
		expect(isLocale(null)).toBe(false);
	});
});
