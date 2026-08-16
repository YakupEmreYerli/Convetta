import { describe, expect, it } from 'vitest';
import {
	extensionForMime,
	isValidDimension,
	matchAspect,
	outputMime,
	resizedName,
	MAX_DIMENSION
} from './resize';

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

describe('outputMime', () => {
	it('canvas ile uretilebilen kaynak formatlarini korur', () => {
		expect(outputMime('image/jpeg')).toBe('image/jpeg');
		expect(outputMime('image/webp')).toBe('image/webp');
	});

	it('uretilemeyen formatlari PNG yapar', () => {
		expect(outputMime('image/gif')).toBe('image/png');
		expect(outputMime('image/bmp')).toBe('image/png');
		expect(outputMime('image/avif')).toBe('image/png');
		expect(outputMime('')).toBe('image/png');
	});
});

describe('resizedName', () => {
	it('olculeri dosya adina ekler', () => {
		expect(resizedName('photo.png', { width: 800, height: 600 }, 'image/png')).toBe(
			'photo_800x600.png'
		);
	});

	it('uzantisiz adlarda ciktinin turunu kullanir', () => {
		expect(resizedName('photo', { width: 10, height: 10 }, 'image/png')).toBe('photo_10x10.png');
	});

	it('JPEG icin jpg uzantisi verir', () => {
		expect(resizedName('photo.jpeg', { width: 800, height: 600 }, 'image/jpeg')).toBe(
			'photo_800x600.jpg'
		);
	});

	it('PNG olarak kodlanan GIF ve BMP girdilerinde uzantiyi da degistirir', () => {
		// Eskiden 'animation_800x600.gif' donuyordu: ad PNG olan icerikle celisiyordu.
		expect(resizedName('animation.gif', { width: 800, height: 600 }, outputMime('image/gif'))).toBe(
			'animation_800x600.png'
		);
		expect(resizedName('scan.bmp', { width: 40, height: 30 }, outputMime('image/bmp'))).toBe(
			'scan_40x30.png'
		);
		expect(resizedName('shot.avif', { width: 40, height: 30 }, outputMime('image/avif'))).toBe(
			'shot_40x30.png'
		);
	});

	it('bilinmeyen turde png varsayar', () => {
		expect(extensionForMime('application/octet-stream')).toBe('png');
		expect(resizedName('photo.tiff', { width: 5, height: 5 }, 'image/tiff')).toBe('photo_5x5.png');
	});
});
