import { json, type RequestHandler } from '@sveltejs/kit';
import {
	CONVERT_MAX_BYTES,
	encoderAvailable,
	isServerFormat,
	OUTPUT_MIME,
	runMagick,
	sniffImageType
} from '$lib/server/magick';
import { rateLimited, releaseSlot, tryAcquireSlot } from '$lib/server/rateLimit';

/**
 * Tarayicinin uretemedigi ciktilar icin donusturme ucu (GIF, ICO, PDF).
 *
 * Govde multipart degil ham ikili veri; hedef format sorgu parametresinde
 * geliyor. Boylece sunucuda multipart ayristiricisi tutmaya gerek kalmiyor ve
 * ayristirma kaynakli saldiri yuzeyi tumuyle ortadan kalkiyor.
 */
export const POST: RequestHandler = async ({ request, url, getClientAddress }) => {
	if (rateLimited(getClientAddress())) {
		return json({ error: 'Cok fazla istek. Lutfen biraz bekleyin.' }, { status: 429 });
	}

	const format = (url.searchParams.get('format') ?? '').toLowerCase();
	if (!isServerFormat(format)) {
		return json({ error: 'Desteklenmeyen hedef format.' }, { status: 400 });
	}

	// Kodlayici yoksa istegi hic calistirmiyoruz: eksik kodlayici bos cikti
	// uretip 500'e donusurdu, oysa bu bir kurulum eksigi ve 501 ile ifade edilmeli.
	if (!encoderAvailable(format)) {
		return json({ error: 'Bu format su anda sunucuda desteklenmiyor.' }, { status: 501 });
	}

	const declared = Number(request.headers.get('content-length') ?? 0);
	if (declared > CONVERT_MAX_BYTES) {
		return json({ error: 'Dosya cok buyuk (en fazla 20 MB).' }, { status: 413 });
	}

	const input = new Uint8Array(await request.arrayBuffer());
	// Content-Length yalanci olabilir; gercek govde de sinirlaniyor.
	if (input.length > CONVERT_MAX_BYTES) {
		return json({ error: 'Dosya cok buyuk (en fazla 20 MB).' }, { status: 413 });
	}
	if (input.length === 0) {
		return json({ error: 'Bos istek govdesi.' }, { status: 400 });
	}

	const inputType = sniffImageType(input);
	if (!inputType) {
		return json({ error: 'Gecerli bir gorsel dosyasi gonderin.' }, { status: 415 });
	}

	if (!tryAcquireSlot()) {
		return json(
			{ error: 'Sunucu su anda yogun. Lutfen birkac saniye sonra tekrar deneyin.' },
			{ status: 503, headers: { 'Retry-After': '5' } }
		);
	}

	try {
		const output = await runMagick(input, inputType, format);
		return new Response(new Blob([output as BlobPart]), {
			headers: {
				'Content-Type': OUTPUT_MIME[format],
				'Content-Length': String(output.length),
				// Cikti kullaniciya ait; hicbir katmanda saklanmamali.
				'Cache-Control': 'no-store, private'
			}
		});
	} catch (err) {
		console.error('[convert]', format, err instanceof Error ? err.message : err);
		return json({ error: 'Donusturme basarisiz oldu.' }, { status: 500 });
	} finally {
		releaseSlot();
	}
};

// Calisma zamani ucu: onceden uretilemez (bkz. +layout.ts icindeki prerender).
export const prerender = false;
