import { describe, expect, it } from 'vitest';
import { extractClipboardImages, isEditableTarget } from './clipboard';

/** DataTransfer jsdom'da tam desteklenmiyor; yalnizca kullandigimiz alanlar taklit ediliyor. */
function clipboard(items: Array<{ kind: string; type: string; file?: File | null }>): DataTransfer {
	return {
		items: items.map((item) => ({
			kind: item.kind,
			type: item.type,
			getAsFile: () => (item.file === undefined ? new File(['x'], 'image.png', { type: item.type }) : item.file)
		}))
	} as unknown as DataTransfer;
}

describe('extractClipboardImages', () => {
	it('panodaki gorseli File olarak dondurur', () => {
		const result = extractClipboardImages(clipboard([{ kind: 'file', type: 'image/png' }]), 1000);
		expect(result.files).toHaveLength(1);
		expect(result.files[0].type).toBe('image/png');
		expect(result.rejectedNonImage).toBe(false);
	});

	it('adsiz pano gorsellerini tekrar etmeyen adlarla adlandirir', () => {
		const result = extractClipboardImages(
			clipboard([
				{ kind: 'file', type: 'image/png' },
				{ kind: 'file', type: 'image/jpeg' }
			]),
			1000
		);
		expect(result.files.map((f) => f.name)).toEqual(['pasted-1000.png', 'pasted-1000-2.jpeg']);
	});

	it('metin yapistirmasini yok sayar', () => {
		const result = extractClipboardImages(clipboard([{ kind: 'string', type: 'text/plain' }]));
		expect(result.files).toHaveLength(0);
		expect(result.rejectedNonImage).toBe(false);
	});

	it('gorsel olmayan dosyalari isaretler', () => {
		const result = extractClipboardImages(clipboard([{ kind: 'file', type: 'application/pdf' }]));
		expect(result.files).toHaveLength(0);
		expect(result.rejectedNonImage).toBe(true);
	});

	it('okunamayan pano ogesini hata olarak isaretler', () => {
		const result = extractClipboardImages(
			clipboard([{ kind: 'file', type: 'image/png', file: null }])
		);
		expect(result.files).toHaveLength(0);
		expect(result.rejectedNonImage).toBe(true);
	});

	it('pano bos oldugunda sessiz kalir', () => {
		expect(extractClipboardImages(null)).toEqual({ files: [], rejectedNonImage: false });
	});
});

describe('isEditableTarget', () => {
	it('metin alanlarini tanir', () => {
		const input = document.createElement('input');
		expect(isEditableTarget(input)).toBe(true);
		expect(isEditableTarget(document.createElement('div'))).toBe(false);
		expect(isEditableTarget(null)).toBe(false);
	});
});
