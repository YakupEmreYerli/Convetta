import { describe, expect, it } from 'vitest';
import { validateFile } from './convert';
import {
	CANVAS_FORMATS,
	EXTENSION_BY_FORMAT,
	isServerFormat,
	MAX_FILE_BYTES,
	MIME_BY_FORMAT,
	needsOpaqueBackground,
	SERVER_FORMATS,
	supportsQuality,
	TARGET_FORMATS
} from './formats';

function fakeFile(name: string, type: string, size: number): File {
	const file = new File([new Uint8Array(1)], name, { type });
	// File.size salt okunur; testte boyut kontrolunu zorlamak icin geciciyoruz.
	Object.defineProperty(file, 'size', { value: size });
	return file;
}

describe('validateFile', () => {
	it('gorselleri kabul eder', () => {
		expect(validateFile(fakeFile('a.png', 'image/png', 1024))).toBeNull();
	});

	it('gorsel olmayan dosyalari reddeder', () => {
		expect(validateFile(fakeFile('a.txt', 'text/plain', 1024))).toBe('notImage');
	});

	it('tipi bilinmeyen dosyalari cozumleme asamasina birakir', () => {
		expect(validateFile(fakeFile('a.heic', '', 1024))).toBeNull();
	});

	it('boyut sinirini asanlari reddeder', () => {
		expect(validateFile(fakeFile('a.png', 'image/png', MAX_FILE_BYTES + 1))).toBe('tooLarge');
	});
});

describe('format tablosu', () => {
	it('her hedef formatin MIME ve uzanti karsiligi vardir', () => {
		for (const format of TARGET_FORMATS) {
			expect(MIME_BY_FORMAT[format]).toMatch(/^(image|application)\//);
			expect(EXTENSION_BY_FORMAT[format]).toBeTruthy();
		}
	});

	it('kalite yalnizca kayipli formatlarda anlamli', () => {
		expect(supportsQuality('jpeg')).toBe(true);
		expect(supportsQuality('webp')).toBe(true);
		expect(supportsQuality('png')).toBe(false);
	});

	it('yalnizca JPEG opak arka plan ister', () => {
		expect(needsOpaqueBackground('jpeg')).toBe(true);
		expect(needsOpaqueBackground('png')).toBe(false);
		expect(needsOpaqueBackground('webp')).toBe(false);
	});

	it('tarayici ve sunucu formatlari birbirine karismaz', () => {
		for (const format of SERVER_FORMATS) {
			expect(isServerFormat(format)).toBe(true);
			expect(CANVAS_FORMATS).not.toContain(format);
		}
		for (const format of CANVAS_FORMATS) {
			expect(isServerFormat(format)).toBe(false);
		}
	});
});
