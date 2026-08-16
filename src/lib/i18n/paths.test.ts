import { describe, expect, it } from 'vitest';
import { localeFromPath, localizePath, stripLocale } from './paths';

describe('localeFromPath', () => {
	it('oneksiz adresler varsayilan dildedir (Turkce)', () => {
		expect(localeFromPath('/')).toBe('tr');
		expect(localeFromPath('/resizer')).toBe('tr');
	});

	it('dil onegini okur', () => {
		expect(localeFromPath('/en')).toBe('en');
		expect(localeFromPath('/en/resizer')).toBe('en');
	});

	it('bilinmeyen onegi dil saymaz', () => {
		expect(localeFromPath('/de/resizer')).toBe('tr');
	});
});

describe('stripLocale', () => {
	it('dil onegini atar', () => {
		expect(stripLocale('/en/resizer')).toBe('/resizer');
		expect(stripLocale('/en')).toBe('/');
	});

	it('oneksiz adresi degistirmez', () => {
		expect(stripLocale('/resizer')).toBe('/resizer');
		expect(stripLocale('/')).toBe('/');
	});
});

describe('localizePath', () => {
	it('varsayilan dilde onek eklemez', () => {
		expect(localizePath('/en/resizer', 'tr')).toBe('/resizer/');
		expect(localizePath('/en', 'tr')).toBe('/');
	});

	it('digerlerinde onek ekler', () => {
		expect(localizePath('/resizer', 'en')).toBe('/en/resizer/');
		expect(localizePath('/', 'en')).toBe('/en/');
	});

	it('ayni dile donusturmek adresi degistirmez', () => {
		expect(localizePath('/en/privacy', 'en')).toBe('/en/privacy/');
		expect(localizePath('/privacy', 'tr')).toBe('/privacy/');
	});
});
