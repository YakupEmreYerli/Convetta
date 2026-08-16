/** Canvas ile dogrudan tarayicida uretilen formatlar; dosya cihazdan cikmaz. */
export const CANVAS_FORMATS = ['jpeg', 'png', 'webp'] as const;
export type CanvasFormat = (typeof CANVAS_FORMATS)[number];

/**
 * Tarayicinin uretemedigi formatlar. `canvas.toBlob('image/gif')` hicbir buyuk
 * tarayicida desteklenmiyor ve sessizce PNG dondurur; ICO ve PDF icin de
 * kodlayici yok. Bunlar /api/convert uzerinden ImageMagick ile uretiliyor:
 * dosya sunucuya gidiyor, cikti dondukten sonra hicbir yerde saklanmiyor.
 */
export const SERVER_FORMATS = ['gif', 'ico', 'pdf'] as const;
export type ServerFormat = (typeof SERVER_FORMATS)[number];

export const TARGET_FORMATS = [...CANVAS_FORMATS, ...SERVER_FORMATS] as const;
export type TargetFormat = CanvasFormat | ServerFormat;

export const MIME_BY_FORMAT: Record<TargetFormat, string> = {
	jpeg: 'image/jpeg',
	png: 'image/png',
	webp: 'image/webp',
	gif: 'image/gif',
	ico: 'image/x-icon',
	pdf: 'application/pdf'
};

export const EXTENSION_BY_FORMAT: Record<TargetFormat, string> = {
	jpeg: 'jpg',
	png: 'png',
	webp: 'webp',
	gif: 'gif',
	ico: 'ico',
	pdf: 'pdf'
};

export function isCanvasFormat(format: TargetFormat): format is CanvasFormat {
	return (CANVAS_FORMATS as readonly string[]).includes(format);
}

export function isServerFormat(format: TargetFormat): format is ServerFormat {
	return (SERVER_FORMATS as readonly string[]).includes(format);
}

/** Kalite ayari yalnizca kayipli canvas kodlayicilarinda anlamli. */
export function supportsQuality(format: TargetFormat): boolean {
	return format === 'jpeg' || format === 'webp';
}

/** JPEG'in alfa kanali yok: saydam alanlar once beyazla doldurulur. */
export function needsOpaqueBackground(format: TargetFormat): boolean {
	return format === 'jpeg';
}

export const ACCEPTED_INPUT_TYPES = [
	'image/jpeg',
	'image/png',
	'image/webp',
	'image/gif',
	'image/bmp',
	'image/avif'
];

export const MAX_FILE_BYTES = 20 * 1024 * 1024;
