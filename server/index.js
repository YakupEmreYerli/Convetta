/**
 * Uygulama sunucusu.
 *
 * adapter-node'un hazir girdisi (build/index.js) yerine bu dosya calisiyor:
 * tek sebep, konak adi yonlendirmesinin prerender edilmis dosyalar sunulmadan
 * ONCE yapilmasi gerekmesi. Hazir girdi ise istegi dogrudan SvelteKit
 * isleyicisine veriyor ve statik dosya bu isleyicinin icinde, hook'lardan
 * once cikiyor.
 *
 * Onun disinda davranis ayni kalmali: PORT/HOST ortam degiskenleri, SIGTERM
 * ve SIGINT'te acik baglantilarin duzgunce kapatilmasi. Gerisini (govde
 * siniri, statik dosyalar, SSR) handler zaten yapiyor.
 */
import { createServer } from 'node:http';
import process from 'node:process';
import { handler } from '../build/handler.js';
import { canonicalRedirect } from './canonical.js';
import { SECURITY_HEADERS } from './security.js';

const port = Number(process.env.PORT || 3000);
const host = process.env.HOST || '0.0.0.0';
// Docker konteyneri durdururken varsayilan olarak 10 sn bekliyor; altinda kalmali.
const SHUTDOWN_TIMEOUT_MS = Number(process.env.SHUTDOWN_TIMEOUT || 8) * 1000;

const server = createServer((req, res) => {
	// Basliklar handler'dan once konuluyor: prerender edilmis dosyalar ve
	// statik varliklar handler'in icinden cikiyor ve hook'a hic ugramiyor,
	// yani tek kapsayici nokta burasi. SSR yanitlarinda hook ayni basligi
	// yeniden yazar (bkz. server/security.js).
	for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
		res.setHeader(key, value);
	}

	const location = canonicalRedirect(req.headers, req.url);
	if (location) {
		// 301: adres kalici olarak degisti. Sonlandirici olmayan bir yanit
		// oldugu icin govde gonderilmiyor.
		res.writeHead(301, { location, 'cache-control': 'public, max-age=3600' });
		res.end();
		return;
	}

	// handler bir ara katman: eslesmeyen istekte next() cagiriyor. SvelteKit
	// kendi 404'unu zaten uretiyor, bu yuzden buraya normalde hic gelinmiyor.
	handler(req, res, () => {
		res.statusCode = 404;
		res.end('Not found');
	});
});

server.listen(port, host, () => {
	console.log(`Listening on http://${host}:${port}`);
});

/** @param {'SIGTERM' | 'SIGINT'} reason */
function shutdown(reason) {
	console.log(`${reason} alindi, kapaniliyor`);
	// Bosta bekleyen keep-alive baglantilari kapatilmazsa close() onlari
	// bekler ve konteyner zaman asimiyla oldurulur.
	server.closeIdleConnections();
	server.close(() => process.exit(0));
	setTimeout(() => {
		server.closeAllConnections();
		process.exit(0);
	}, SHUTDOWN_TIMEOUT_MS).unref();
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
