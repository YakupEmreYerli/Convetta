import { describe, expect, it } from 'vitest';
import { isRedirect } from '@sveltejs/kit';
import { handle } from './hooks.server';

/**
 * Kanoniklestirme kurallari sayfa adresleri icin var. API ucunun bu kurallara
 * girmesi gorunur bir hata vermiyordu: tarayici 301'i takip ediyor, govde
 * dusuyor ve donusum "sunucu hatasi" olarak geri geliyordu. Kural yeniden
 * genisletilirse burasi patlasin.
 */
function run(path: string, method = 'GET') {
	const url = new URL(`https://www.convetta.com${path}`);
	const event = { url, request: new Request(url, { method }) };
	// resolve yalnizca "yonlendirme olmadi" demenin isareti.
	return handle({
		event,
		resolve: async () => new Response('ok', { status: 200 })
	} as unknown as Parameters<typeof handle>[0]);
}

/** redirect() bir istisna olarak firlatilir; testte yakalayip inceliyoruz. */
async function redirectOf(path: string, method = 'GET') {
	try {
		await run(path, method);
		return null;
	} catch (error) {
		if (isRedirect(error)) return { status: error.status, location: error.location };
		throw error;
	}
}

describe('handle', () => {
	it('API ucunu yonlendirmez', async () => {
		expect(await redirectOf('/api/convert', 'POST')).toBeNull();
		expect(await redirectOf('/api/convert?format=gif', 'POST')).toBeNull();
	});

	it('sayfa adreslerine sondaki egik cizgiyi ekler', async () => {
		expect(await redirectOf('/resizer')).toEqual({ status: 301, location: '/resizer/' });
	});

	it('varsayilan dil onekini kaldirir', async () => {
		expect(await redirectOf('/tr/resizer/')).toEqual({ status: 301, location: '/resizer' });
	});

	it('sorgu dizesini korur', async () => {
		expect(await redirectOf('/resizer?a=1')).toEqual({ status: 301, location: '/resizer/?a=1' });
	});
});
