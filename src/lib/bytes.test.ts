import { describe, expect, it } from 'vitest';
import { formatBytes } from './bytes';

describe('formatBytes', () => {
	it('1 MB altini KB olarak gosterir', () => {
		expect(formatBytes(1024)).toBe('1.00 KB');
		expect(formatBytes(512)).toBe('0.50 KB');
	});

	it('1 MB ve ustunu MB olarak gosterir', () => {
		expect(formatBytes(1024 * 1024)).toBe('1.00 MB');
		expect(formatBytes(5 * 1024 * 1024)).toBe('5.00 MB');
	});

	it('gecersiz degerde bos metin doner', () => {
		expect(formatBytes(Number.NaN)).toBe('');
		expect(formatBytes(-1)).toBe('');
	});
});
