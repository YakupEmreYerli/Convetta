import { describe, expect, it } from 'vitest';
import { baseName, formatBytes, outputName, uniqueName } from './filename';

describe('baseName', () => {
	it('son uzantiyi atar', () => {
		expect(baseName('photo.png')).toBe('photo');
		expect(baseName('arsiv.tar.gz')).toBe('arsiv.tar');
	});

	it('uzantisiz adi korur', () => {
		expect(baseName('screenshot')).toBe('screenshot');
	});

	it('yalnizca uzantidan olusan adlarda yedek ad kullanir', () => {
		expect(baseName('.gitignore')).toBe('.gitignore');
		expect(baseName('')).toBe('image');
	});
});

describe('outputName', () => {
	it('jpeg icin jpg uzantisi uretir', () => {
		expect(outputName('logo.png', 'jpeg')).toBe('logo.jpg');
		expect(outputName('logo.png', 'webp')).toBe('logo.webp');
	});
});

describe('uniqueName', () => {
	it('ayni adlar birbirini ezmez', () => {
		const taken = new Set<string>();
		expect(uniqueName('logo.jpg', taken)).toBe('logo.jpg');
		expect(uniqueName('logo.jpg', taken)).toBe('logo (2).jpg');
		expect(uniqueName('logo.jpg', taken)).toBe('logo (3).jpg');
	});

	it('uzantisiz adlarda da numaralandirir', () => {
		const taken = new Set<string>(['rapor']);
		expect(uniqueName('rapor', taken)).toBe('rapor (2)');
	});
});

describe('formatBytes', () => {
	it('birimleri olceklendirir', () => {
		expect(formatBytes(512)).toBe('512 B');
		expect(formatBytes(2048)).toBe('2.0 KB');
		expect(formatBytes(5 * 1024 * 1024)).toBe('5.0 MB');
	});

	it('Turkce icin ondalik ayraci virgul olur', () => {
		expect(formatBytes(2048, 'tr')).toBe('2,0 KB');
	});

	it('gecersiz degerlerde tire dondurur', () => {
		expect(formatBytes(Number.NaN)).toBe('—');
		expect(formatBytes(-1)).toBe('—');
	});
});
