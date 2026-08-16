import { describe, expect, it } from 'vitest';
import { canonicalRedirect } from '../server/canonical.js';

/**
 * Yanlis bir kosul burada butun siteyi yonlendirme dongusune sokar: kanonik
 * konak adinin kendisi asla yonlendirilmemeli.
 */
describe('canonicalRedirect', () => {
	it('non-www adresi www adresine gonderir', () => {
		expect(canonicalRedirect({ host: 'convetta.com' }, '/resizer/')).toBe(
			'https://www.convetta.com/resizer/'
		);
	});

	it('kanonik adresi yonlendirmez', () => {
		expect(canonicalRedirect({ host: 'www.convetta.com' }, '/')).toBeNull();
	});

	it('yolu ve sorgu dizesini korur', () => {
		expect(canonicalRedirect({ host: 'convetta.com' }, '/en/resizer/?a=1')).toBe(
			'https://www.convetta.com/en/resizer/?a=1'
		);
	});

	it('port ve buyuk harf ayrimi kural disi birakmaz', () => {
		expect(canonicalRedirect({ host: 'Convetta.com:8787' }, '/')).toBe('https://www.convetta.com/');
	});

	it('vekilin bildirdigi konak adini Host yerine kullanir', () => {
		expect(
			canonicalRedirect({ host: 'app-container:8787', 'x-forwarded-host': 'convetta.com' }, '/')
		).toBe('https://www.convetta.com/');
	});

	it('virgullu vekil zincirinde ilk degeri alir', () => {
		expect(canonicalRedirect({ 'x-forwarded-host': 'convetta.com, proxy.internal' }, '/')).toBe(
			'https://www.convetta.com/'
		);
	});

	it('saglik kontrolunu ve bilinmeyen konaklari yonlendirmez', () => {
		expect(canonicalRedirect({ host: '127.0.0.1:8787' }, '/')).toBeNull();
		expect(canonicalRedirect({ host: 'localhost:5173' }, '/')).toBeNull();
		expect(canonicalRedirect({}, '/')).toBeNull();
	});

	it('semayi vekilden okur', () => {
		expect(canonicalRedirect({ host: 'convetta.com', 'x-forwarded-proto': 'http' }, '/')).toBe(
			'http://www.convetta.com/'
		);
	});
});
