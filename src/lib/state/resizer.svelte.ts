import { isValidDimension, matchAspect, resizeImage, resizedName } from '$lib/resize';
import { FileJobState, type ProcessedFile } from './fileJob.svelte';

const DEFAULT_WIDTH = 1280;
const DEFAULT_HEIGHT = 720;
const DEFAULT_RATIO = DEFAULT_WIDTH / DEFAULT_HEIGHT;

export class ResizerState extends FileJobState {
	width = $state(DEFAULT_WIDTH);
	height = $state(DEFAULT_HEIGHT);
	lockRatio = $state(true);
	/**
	 * Kilit aciksa kenarlar bu orana gore eslenir. Baslangicta gorunen
	 * olculerin orani kullaniliyor: aksi halde henuz dosya secilmemisken kilit
	 * acik gorunur ama hicbir sey yapmazdi.
	 */
	ratio = $state(DEFAULT_RATIO);
	/**
	 * Ilk gorselin gercek olculeri. Yalnizca ekranda gostermek icin tutuluyor:
	 * kullanici hedef olcuyu neye gore girdigini bilmeden yaziyordu.
	 */
	originalWidth = $state(0);
	originalHeight = $state(0);

	get dimensionsValid() {
		return isValidDimension(this.width) && isValidDimension(this.height);
	}

	/** Kilit acilip kapanir; yeniden kilitlendiginde yukseklik orana uydurulur. */
	toggleLock() {
		this.lockRatio = !this.lockRatio;
		if (this.lockRatio) this.setWidth(this.width);
	}

	setWidth(value: number) {
		this.width = value;
		if (this.lockRatio && this.ratio > 0 && isValidDimension(value)) {
			this.height = matchAspect(value, this.ratio, 'width');
		}
	}

	setHeight(value: number) {
		this.height = value;
		if (this.lockRatio && this.ratio > 0 && isValidDimension(value)) {
			this.width = matchAspect(value, this.ratio, 'height');
		}
	}

	/**
	 * Yazim tamamlandiginda (odak cikisi, Enter, artirma dugmesi) iki kenari
	 * kesin olarak eslestirir.
	 *
	 * Gerekli, cunku yazim sirasinda kutu bir an bosalabiliyor: Number('') 0
	 * verir, gecerli olcu sayilmaz ve karsi kenar guncellenmeden atlanir. O anda
	 * durulursa diger kutu eski degerinde kalirdi.
	 */
	commitWidth() {
		if (isValidDimension(this.width)) this.setWidth(this.width);
	}

	commitHeight() {
		if (isValidDimension(this.height)) this.setHeight(this.height);
	}

	/**
	 * Ilk gorselin gercek olculeri okunur; kullanici hedef genisligi
	 * yazdiginda yukseklik dogru oranla kendiliginden hesaplansin diye.
	 * Dosya listesi her degistiginde cagriliyor, cunku ilk dosya kaldirilmis
	 * olabilir.
	 */
	async syncRatioFromFirstFile() {
		const first = this.files[0];
		if (!first) {
			// Liste bosaldi: oran, dosya secilmeden onceki varsayilana doner.
			this.ratio = DEFAULT_RATIO;
			this.originalWidth = 0;
			this.originalHeight = 0;
			return;
		}
		try {
			const bitmap = await createImageBitmap(first.file);
			this.ratio = bitmap.width / bitmap.height;
			this.originalWidth = bitmap.width;
			this.originalHeight = bitmap.height;
			bitmap.close();
			if (this.lockRatio) this.height = matchAspect(this.width, this.ratio, 'width');
		} catch {
			// Cozulemeyen dosyada oran bilinmiyor; kilit varsayilan orana doner ve
			// asil hata isleme sirasinda raporlanir.
			this.ratio = DEFAULT_RATIO;
			this.originalWidth = 0;
			this.originalHeight = 0;
		}
	}

	async run() {
		if (!this.dimensionsValid) {
			this.error = 'invalidSize';
			return;
		}
		await super.run();
	}

	protected async process(file: File): Promise<ProcessedFile> {
		const target = { width: Math.round(this.width), height: Math.round(this.height) };
		const blob = await resizeImage(file, target);
		// Uzanti, istenen degil gercekten uretilen turden geliyor.
		return { blob, name: resizedName(file.name, target, blob.type), ...target };
	}

	protected zipName() {
		return 'convetta-resized.zip';
	}
}
