/**
 * Pano (Ctrl+V / Cmd+V) icerigini dosyaya cevirir.
 *
 * DataTransferItem'lar yalnizca paste olayinin senkron akisinda okunabilir:
 * await sonrasi liste bosalir. Bu yuzden ayiklama burada senkron yapiliyor.
 */

export interface ClipboardExtraction {
	/** Panodan alinan gorseller; her biri adlandirilmis bir File. */
	files: File[];
	/** Panoda dosya vardi ama hicbiri gorsel degildi. */
	rejectedNonImage: boolean;
}

/** Panodan gelen gorsellerin cogu adsiz gelir; tekrar etmeyen bir ad uretilir. */
function clipboardFileName(type: string, index: number, now = Date.now()): string {
	const extension = type.split('/')[1]?.split('+')[0] || 'png';
	return `pasted-${now}${index > 0 ? `-${index + 1}` : ''}.${extension}`;
}

export function extractClipboardImages(
	data: DataTransfer | null | undefined,
	now = Date.now()
): ClipboardExtraction {
	const result: ClipboardExtraction = { files: [], rejectedNonImage: false };
	if (!data) return result;

	const items = Array.from(data.items ?? []);
	for (const item of items) {
		// Metin yapistirildiginda kind 'string' olur ve hicbir sey yapilmaz.
		if (item.kind !== 'file') continue;

		if (!item.type.startsWith('image/')) {
			result.rejectedNonImage = true;
			continue;
		}

		const file = item.getAsFile();
		if (!file) {
			result.rejectedNonImage = true;
			continue;
		}

		// Tarayicilarin cogu pano gorselini "image.png" adiyla verir; birden
		// fazla gorsel yapistirildiginda hepsi ayni adi tasiyacagi icin
		// yeniden adlandiriliyor.
		const named =
			file.name && file.name !== 'image.png'
				? file
				: new File([file], clipboardFileName(file.type || item.type, result.files.length, now), {
						type: file.type || item.type,
						lastModified: file.lastModified || now
					});

		result.files.push(named);
	}

	return result;
}

/**
 * Yapistirma, metin girisi icindeyken uygulamaya degil o alana ait olmalidir.
 */
export function isEditableTarget(target: EventTarget | null): boolean {
	if (!(target instanceof HTMLElement)) return false;
	if (target.isContentEditable) return true;
	const tag = target.tagName;
	return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';
}
