import { isValidDimension, matchAspect, resizeImage, resizedName } from '$lib/resize';
import { FileJobState, type ProcessedFile } from './fileJob.svelte';

export class ResizerState extends FileJobState {
	width = $state(1280);
	height = $state(720);
	lockRatio = $state(true);
	/** Ilk secilen gorselin en-boy orani; kilit aciksa kenarlar buna gore eslenir. */
	ratio = $state(0);

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
	 * Ilk gorselin gercek olculeri okunur; kullanici hedef genisligi
	 * yazdiginda yukseklik dogru oranla kendiliginden hesaplansin diye.
	 */
	async syncRatioFromFirstFile() {
		const first = this.files[0];
		if (!first) return;
		try {
			const bitmap = await createImageBitmap(first.file);
			this.ratio = bitmap.width / bitmap.height;
			bitmap.close();
			if (this.lockRatio) this.height = matchAspect(this.width, this.ratio, 'width');
		} catch {
			// Cozulemeyen dosyada oran bilinmiyor; kullanicinin girdigi olculer
			// oldugu gibi kullanilir ve hata isleme sirasinda raporlanir.
			this.ratio = 0;
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
		return { blob, name: resizedName(file.name, target), ...target };
	}

	protected zipName() {
		return 'convetta-resized.zip';
	}
}
