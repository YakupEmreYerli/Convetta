import { spawn, spawnSync } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import { readFile, unlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

/**
 * ImageMagick koprusu.
 *
 * Tarayici JPEG/PNG/WEBP uretebiliyor (bkz. $lib/convert.ts); bu modul yalnizca
 * canvas'in uretemedigi ciktilar icin var: GIF, ICO, PDF. Mantik eski Node
 * sunucusundan (server.cjs) tasindi, sinirlar ve guvenlik gerekceleri korundu.
 */

export const SERVER_FORMATS = ['gif', 'ico', 'pdf'] as const;
export type ServerFormat = (typeof SERVER_FORMATS)[number];

export const CONVERT_MAX_BYTES = 20 * 1024 * 1024;
const CONVERT_TIMEOUT_MS = 20_000;

export const OUTPUT_MIME: Record<ServerFormat, string> = {
	gif: 'image/gif',
	ico: 'image/x-icon',
	pdf: 'application/pdf'
};

export function isServerFormat(value: string): value is ServerFormat {
	return (SERVER_FORMATS as readonly string[]).includes(value);
}

/**
 * Hangi kodlayicilarin gercekten derlendigi ImageMagick paketine gore degisir;
 * eksik kodlayici hata vermek yerine sessizce BOS cikti uretir. Acilista bir kez
 * sorup ogreniyoruz ki desteklenmeyen format 500 yerine acik bir 501 ile
 * reddedilsin ve eksiklik dagitim aninda loglarda gorunsun.
 */
let available: Set<string> | null = null;

export function encoderAvailable(format: ServerFormat): boolean {
	if (available === null) available = probeFormats();
	// Liste hic okunamadiysa (ImageMagick yok) hicbir format desteklenmiyor.
	return available.has(format);
}

function probeFormats(): Set<string> {
	const found = new Set<string>();
	let out = '';
	try {
		out = String(spawnSync('magick', ['-list', 'format'], { encoding: 'utf8', timeout: 10_000 }).stdout ?? '');
	} catch {
		out = '';
	}

	// Satirlar "  GIF* GIF  rw+  ..." biciminde; ad yildizli olabiliyor.
	for (const line of out.split('\n')) {
		const match = line.match(/^\s{2,}([A-Z0-9]+)\*?\s+\S+\s+([-rwa+]+)/);
		if (match && match[2].includes('w')) found.add(match[1].toLowerCase());
	}

	if (found.size === 0) {
		console.error('[convert] ImageMagick bulunamadi: GIF/ICO/PDF istekleri 501 donecek.');
	} else {
		const missing = SERVER_FORMATS.filter((f) => !found.has(f));
		if (missing.length) {
			console.error(
				`[convert] su cikti formatlari icin kodlayici yok: ${missing.join(', ')}. ` +
					'Alpine icin ilgili apk paketini ekleyin (or. imagemagick-jpeg, imagemagick-webp).'
			);
		}
	}

	return found;
}

/**
 * Girdi turu dosya adindan veya Content-Type'tan degil, icerigin ilk
 * baytlarindan dogrulaniyor. Boylece cozucuye yalnizca gercekten raster gorsel
 * olan veriler ulasiyor; ozellikle PDF/PS girdileri (Ghostscript uzerinden
 * gecmis RCE'lerin kaynagi) hic kabul edilmiyor.
 */
export function sniffImageType(buf: Uint8Array): string | null {
	if (buf.length < 12) return null;
	const ascii = (start: number, end: number) =>
		String.fromCharCode(...buf.subarray(start, end));

	if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return 'png';
	if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'jpeg';
	if (ascii(0, 6) === 'GIF87a' || ascii(0, 6) === 'GIF89a') return 'gif';
	if (ascii(0, 4) === 'RIFF' && ascii(8, 12) === 'WEBP') return 'webp';
	if (buf[0] === 0x42 && buf[1] === 0x4d) return 'bmp';
	return null;
}

/**
 * ICO kodlayicisi bazi ImageMagick derlemelerinde stdout'a yazamiyor (bos cikti
 * uretiyor), bu yuzden ICO gecici bir dosyaya yazilip okunuyor. Diger formatlar
 * stdout uzerinden akiyor ve diske hic dokunmuyor.
 */
export function runMagick(
	input: Uint8Array,
	inputType: string,
	format: ServerFormat
): Promise<Uint8Array> {
	const usesTempFile = format === 'ico';
	const tmpPath = usesTempFile
		? join(tmpdir(), `convetta-${randomBytes(8).toString('hex')}.ico`)
		: null;

	const args = [
		'-limit', 'memory', '256MiB',
		'-limit', 'map', '512MiB',
		// Diske tasmayi tamamen kapatiyoruz: bellek limiti asildiginda ImageMagick
		// sessizce /tmp'e yazmaya baslar ve sinirsiz disk tuketebilir.
		'-limit', 'disk', '0',
		// Sikistirma bombalarina karsi: 20 MB'lik bir PNG on binlerce piksel
		// genislikte bir tuvale acilabilir. Alan/boyut limitleri cozme asamasinda
		// devreye girer, yani bellek daha ayrilmadan istek reddedilir.
		'-limit', 'area', '64MB',
		'-limit', 'width', '16KP',
		'-limit', 'height', '16KP',
		'-limit', 'time', String(Math.floor(CONVERT_TIMEOUT_MS / 1000)),
		`${inputType}:-`
	];

	if (format === 'ico') {
		// ICO 256x256 ile sinirli; buyuk girdiler once kucultulur (">" yalnizca
		// buyuk olanlari kucultur, kucukleri oldugu gibi birakir).
		args.push('-resize', '256x256>', '-define', 'icon:auto-resize=256,128,64,48,32,16', `ico:${tmpPath}`);
	} else {
		args.push(`${format}:-`);
	}

	return new Promise((resolve, reject) => {
		const child = spawn('magick', args, { stdio: ['pipe', 'pipe', 'pipe'] });
		const chunks: Buffer[] = [];
		const errChunks: Buffer[] = [];
		let finished = false;

		const timer = setTimeout(() => {
			if (!finished) child.kill('SIGKILL');
		}, CONVERT_TIMEOUT_MS);

		const settle = (err: Error | null, out?: Uint8Array) => {
			if (finished) return;
			finished = true;
			clearTimeout(timer);
			if (tmpPath) void unlink(tmpPath).catch(() => {});
			if (err) reject(err);
			else resolve(out as Uint8Array);
		};

		child.stdout.on('data', (c: Buffer) => chunks.push(c));
		child.stderr.on('data', (c: Buffer) => errChunks.push(c));
		child.on('error', (err) => settle(err));
		child.on('close', (code) => {
			if (code !== 0) {
				return settle(
					new Error(Buffer.concat(errChunks).toString('utf8').slice(0, 200) || `exit ${code}`)
				);
			}
			if (usesTempFile && tmpPath) {
				readFile(tmpPath).then(
					(data) =>
						data.length > 0
							? settle(null, data)
							: settle(new Error('ICO kodlayici bos cikti uretti')),
					(err: Error) => settle(err)
				);
				return;
			}
			const out = Buffer.concat(chunks);
			if (out.length === 0) return settle(new Error('Bos cikti'));
			settle(null, out);
		});

		child.stdin.on('error', () => {});
		child.stdin.end(input);
	});
}
