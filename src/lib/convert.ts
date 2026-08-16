import {
	isServerFormat,
	MAX_FILE_BYTES,
	MIME_BY_FORMAT,
	needsOpaqueBackground,
	type CanvasFormat,
	type TargetFormat
} from './formats';

/** Ceviri anahtarina karsilik gelen hata kodu; metin katmani UI'da eklenir. */
export type ConversionErrorCode = 'notImage' | 'tooLarge' | 'decode' | 'encode' | 'server';

export class ConversionError extends Error {
	readonly code: ConversionErrorCode;

	constructor(code: ConversionErrorCode) {
		super(code);
		this.name = 'ConversionError';
		this.code = code;
	}
}

/** Dosya, kodlayiciya hic gitmeden once ucuz kontrollerden gecer. */
export function validateFile(file: File): ConversionErrorCode | null {
	// file.type, isletim sistemi uzantiyi tanimadiginda bos string olabilir;
	// bos tip reddedilmez, cozumleme asamasi zaten eleyecektir.
	if (file.type && !file.type.startsWith('image/')) return 'notImage';
	if (file.size > MAX_FILE_BYTES) return 'tooLarge';
	return null;
}

/**
 * Görseli bitmap olarak cozer. createImageBitmap her modern tarayicida var ve
 * <img> yolundan farkli olarak ana is parcacigini daha az mesgul eder; yoksa
 * Image nesnesine dusulur.
 */
async function decode(file: File): Promise<ImageBitmap | HTMLImageElement> {
	if (typeof createImageBitmap === 'function') {
		try {
			return await createImageBitmap(file);
		} catch {
			/* bozuk ya da desteklenmeyen dosya: <img> yolu denenir */
		}
	}

	const url = URL.createObjectURL(file);
	try {
		return await new Promise<HTMLImageElement>((resolve, reject) => {
			const img = new Image();
			img.onload = () => resolve(img);
			img.onerror = () => reject(new ConversionError('decode'));
			img.src = url;
		});
	} finally {
		// Cozumleme bittiginde adres serbest birakilir; blob verisi bitmap'e
		// kopyalandigi icin sonrasinda gerekmiyor.
		URL.revokeObjectURL(url);
	}
}

function dimensions(source: ImageBitmap | HTMLImageElement): { width: number; height: number } {
	if ('naturalWidth' in source) {
		return { width: source.naturalWidth, height: source.naturalHeight };
	}
	return { width: source.width, height: source.height };
}

function toBlob(canvas: HTMLCanvasElement, mime: string, quality: number): Promise<Blob | null> {
	return new Promise((resolve) => canvas.toBlob(resolve, mime, quality));
}

export interface ConversionResult {
	blob: Blob;
	width: number;
	height: number;
}

/**
 * Görseli hedef formata cevirir.
 *
 * JPEG/PNG/WEBP tamamen tarayicida, Canvas API ile uretilir ve dosya cihazdan
 * hic cikmaz. GIF/ICO/PDF icin tarayicida kodlayici yok; bunlar /api/convert
 * uzerinden ImageMagick'e gider. En-boy orani her iki yolda da korunur.
 */
export async function convertImage(
	file: File,
	format: TargetFormat,
	quality = 0.92
): Promise<ConversionResult> {
	const invalid = validateFile(file);
	if (invalid) throw new ConversionError(invalid);

	if (isServerFormat(format)) return convertOnServer(file, format);
	return convertWithCanvas(file, format, quality);
}

/** Sunucu ucu: yalnizca tarayicinin uretemedigi ciktilar icin. */
async function convertOnServer(file: File, format: TargetFormat): Promise<ConversionResult> {
	let response: Response;
	try {
		response = await fetch(`/api/convert?format=${encodeURIComponent(format)}`, {
			method: 'POST',
			headers: { 'Content-Type': file.type || 'application/octet-stream' },
			body: file
		});
	} catch {
		throw new ConversionError('server');
	}

	if (!response.ok) throw new ConversionError('server');

	const blob = await response.blob();
	if (blob.size === 0) throw new ConversionError('server');
	// Sunucu ciktisinda piksel olculerini olcmuyoruz: ICO ve PDF icin anlamli
	// bir tek olcu yok, GIF icin de kaynakla ayni kaliyor.
	return { blob, width: 0, height: 0 };
}

async function convertWithCanvas(
	file: File,
	format: CanvasFormat,
	quality: number
): Promise<ConversionResult> {
	let source: ImageBitmap | HTMLImageElement;
	try {
		source = await decode(file);
	} catch {
		throw new ConversionError('decode');
	}

	const { width, height } = dimensions(source);
	if (!width || !height) {
		if ('close' in source) source.close();
		throw new ConversionError('decode');
	}

	const canvas = document.createElement('canvas');
	canvas.width = width;
	canvas.height = height;
	const ctx = canvas.getContext('2d');
	if (!ctx) throw new ConversionError('encode');

	if (needsOpaqueBackground(format)) {
		ctx.fillStyle = '#ffffff';
		ctx.fillRect(0, 0, width, height);
	}
	ctx.drawImage(source, 0, 0);
	if ('close' in source) source.close();

	const mime = MIME_BY_FORMAT[format];
	const blob = await toBlob(canvas, mime, quality);

	// Tarayici istenen kodlayiciya sahip degilse toBlob sessizce PNG dondurur.
	// Yanlis formatli bir cikti indirtmek yerine acik hata veriliyor.
	if (!blob || blob.type !== mime) throw new ConversionError('encode');

	return { blob, width, height };
}
