import { describe, expect, it } from 'vitest';
import { isValidDimension, matchAspect, resizedName, MAX_DIMENSION } from './resize';

describe('isValidDimension', () => {
	it('sinirlar icindeki degerleri kabul eder', () => {
		expect(isValidDimension(1)).toBe(true);
		expect(isValidDimension(MAX_DIMENSION)).toBe(true);
	});

	it('sifir, negatif ve sinir disi degerleri reddeder', () => {
		expect(isValidDimension(0)).toBe(false);
		expect(isValidDimension(-10)).toBe(false);
		expect(isValidDimension(MAX_DIMENSION + 1)).toBe(false);
		expect(isValidDimension(Number.NaN)).toBe(false);
	});
});

describe('matchAspect', () => {
	it('en-boy oranini korur', () => {
		// 16:9 oraninda 1920 genislik -> 1080 yukseklik
		expect(matchAspect(1920, 16 / 9, 'width')).toBe(1080);
		expect(matchAspect(1080, 16 / 9, 'height')).toBe(1920);
	});

	it('sonucu en az 1 piksel tutar', () => {
		expect(matchAspect(1, 1000, 'width')).toBe(1);
	});

	it('oran bilinmiyorsa degeri degistirmez', () => {
		expect(matchAspect(500, 0, 'width')).toBe(500);
	});
});

describe('resizedName', () => {
	it('olculeri dosya adina ekler', () => {
		expect(resizedName('photo.png', { width: 800, height: 600 })).toBe('photo_800x600.png');
	});

	it('uzantisiz adlarda png varsayar', () => {
		expect(resizedName('photo', { width: 10, height: 10 })).toBe('photo_10x10.png');
	});
});
