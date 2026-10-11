// README banner'ını iki dilde üretir: docs/banner.tr.png ve docs/banner.en.png (1280×640).
// Çalıştır (depo kökünden): node scripts/banner.mjs
//
// Şablon docs/brand/banner.html; iki dil aynı şablondan, yalnız metni değişerek çıkar.
// Bağımlılık yok: yüklü Chrome ya da Chromium başsız (headless) açılır, pencere görünmez;
// sayfayla Node'un yerleşik WebSocket'i üzerinden DevTools protokolüyle konuşulur.
// Başka bir tarayıcı için CHROME_BIN verilebilir.
import { spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { setTimeout as bekle } from 'node:timers/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';

const depo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sablon = pathToFileURL(path.join(depo, 'docs/brand/banner.html')).href;

const adaylar = [process.env.CHROME_BIN, 'google-chrome-stable', 'google-chrome', 'chromium', 'chromium-browser'];
const chrome = adaylar.find((ad) => ad && spawnSync(ad, ['--version']).status === 0);
if (!chrome) throw new Error('Chrome/Chromium bulunamadı; CHROME_BIN ile yolunu verin.');

const profil = fs.mkdtempSync(path.join(os.tmpdir(), 'convetta-banner-'));
const tarayici = spawn(
	chrome,
	[
		'--headless=new',
		'--disable-gpu',
		'--hide-scrollbars',
		'--force-color-profile=srgb',
		'--allow-file-access-from-files',
		'--remote-debugging-port=0',
		`--user-data-dir=${profil}`,
		'about:blank'
	],
	{ stdio: 'ignore' }
);

try {
	// Chrome seçtiği portu profil klasöründeki DevToolsActivePort dosyasına yazar.
	const portDosyasi = path.join(profil, 'DevToolsActivePort');
	for (let i = 0; i < 100 && !fs.existsSync(portDosyasi); i++) await bekle(100);
	const port = fs.readFileSync(portDosyasi, 'utf8').split('\n')[0];
	const hedefler = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
	const ws = new WebSocket(hedefler.find((h) => h.type === 'page').webSocketDebuggerUrl);
	await new Promise((tamam, hata) => {
		ws.onopen = tamam;
		ws.onerror = hata;
	});

	let sira = 0;
	const bekleyenler = new Map();
	const olaylar = new Map();
	ws.onmessage = ({ data }) => {
		const mesaj = JSON.parse(data);
		if (mesaj.id) {
			const { tamam, hata } = bekleyenler.get(mesaj.id);
			bekleyenler.delete(mesaj.id);
			if (mesaj.error) hata(new Error(mesaj.error.message));
			else tamam(mesaj.result);
		} else olaylar.get(mesaj.method)?.();
	};
	const gonder = (method, params = {}) =>
		new Promise((tamam, hata) => {
			bekleyenler.set(++sira, { tamam, hata });
			ws.send(JSON.stringify({ id: sira, method, params }));
		});

	await gonder('Page.enable');
	await gonder('Emulation.setDeviceMetricsOverride', { width: 1280, height: 640, deviceScaleFactor: 1, mobile: false });
	for (const dil of ['tr', 'en']) {
		const yuklendi = new Promise((tamam) => olaylar.set('Page.loadEventFired', tamam));
		await gonder('Page.navigate', { url: `${sablon}?lang=${dil}` });
		await yuklendi;
		// Yazı tipi ya da görsel yüklenmezse Chrome sessizce yedek yazı tipine düşer;
		// şablon window.hazir ile ikisini de bekleyip durumu bildirir.
		const { result } = await gonder('Runtime.evaluate', { expression: 'window.hazir', awaitPromise: true, returnByValue: true });
		if (result.value !== 'hazir') throw new Error(`banner.html (${dil}) hazır değil: ${result.value}`);
		const { data } = await gonder('Page.captureScreenshot', { format: 'png' });
		const cikti = path.join(depo, 'docs', `banner.${dil}.png`);
		fs.writeFileSync(cikti, Buffer.from(data, 'base64'));
		console.log('yazıldı', path.relative(depo, cikti));
	}
	ws.close();
} finally {
	tarayici.kill();
	await new Promise((tamam) => (tarayici.exitCode === null ? tarayici.once('exit', tamam) : tamam()));
	// Chrome'un yardımcı süreçleri profile bir süre daha yazabilir; silmeyi birkaç kez dene.
	fs.rmSync(profil, { recursive: true, force: true, maxRetries: 10, retryDelay: 100 });
}
