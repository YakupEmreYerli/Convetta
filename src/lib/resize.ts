import { ConversionError, validateFile } from './convert';
import { baseName } from './filename';

export const MIN_DIMENSION = 1;
export const MAX_DIMENSION = 10_000;

export interface Dimensions {
	width: number;
	height: number;
}

export function isValidDimension(value: number): boolean {
	return Number.isFinite(value) && value >= MIN_DIMENSION && value <= MAX_DIMENSION;
}

/**
 * En-boy orani kilitliyken diger kenari hesaplar. Sonuc en az 1 piksel olur:
 * cok ince goruntularde yuvarlama sifira dusebilir ve canvas 0 genisligi kabul
 * etmez.
 */
export function matchAspect(value: number, ratio: number, edge: 'width' | 'height'): number {
	if (!Number.isFinite(ratio) || ratio <= 0) return value;
	const other = edge === 'width' ? value / ratio : value * ratio;
	return Math.max(1, Math.round(other));
}

/** Cikti adina yeni olculeri ekler: photo.png -> photo_800x600.png */
export function resizedName(fileName: string, { width, height }: Dimensions): string {
	const extension = fileName.includes('.') ? fileName.slice(fileName.lastIndexOf('.') + 1) : 'png';
	return `${baseName(fileName)}_${width}x${height}.${extension}`;
}

/**
 * Görseli verilen olculere yeniden cizer. Kaynak formati korunur: PNG girdi PNG
 * cikar, boylece saydamlik da korunmus olur.
 */
export async function resizeImage(file: File, target: Dimensions): Promise<Blob> {
	const invalid = validateFile(file);
	if (invalid) throw new ConversionError(invalid);
	if (!isValidDimension(target.width) || !isValidDimension(target.height)) {
		throw new ConversionError('encode');
	}

	const bitmap = await createImageBitmap(file).catch(() => {
		throw new ConversionError('decode');
	});

	const canvas = document.createElement('canvas');
	canvas.width = target.width;
	canvas.height = target.height;
	const ctx = canvas.getContext('2d');
	if (!ctx) throw new ConversionError('encode');

	// Kucultmede varsayilan orneklemeden belirgin sekilde daha temiz sonuc verir.
	ctx.imageSmoothingEnabled = true;
	ctx.imageSmoothingQuality = 'high';
	ctx.drawImage(bitmap, 0, 0, target.width, target.height);
	bitmap.close();

	// JPEG disinda kalite parametresi yok sayilir; kaynak tipini korumak
	// dosyanin uzantisiyla iceriginin tutarli kalmasini saglar.
	const mime = file.type === 'image/jpeg' || file.type === 'image/webp' ? file.type : 'image/png';
	const blob = await new Promise<Blob | null>((resolve) =>
		canvas.toBlob(resolve, mime, 0.92)
	);
	if (!blob) throw new ConversionError('encode');
	return blob;
}
