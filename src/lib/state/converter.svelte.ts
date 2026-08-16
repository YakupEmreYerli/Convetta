import { convertImage } from '$lib/convert';
import { outputName } from '$lib/filename';
import { CANVAS_FORMATS, type TargetFormat } from '$lib/formats';
import { FileJobState, type ProcessedFile } from './fileJob.svelte';

export class ConverterState extends FileJobState {
	format = $state<TargetFormat>(CANVAS_FORMATS[0]);
	quality = $state(92);

	protected async process(file: File): Promise<ProcessedFile> {
		const { blob, width, height } = await convertImage(file, this.format, this.quality / 100);
		return { blob, name: outputName(file.name, this.format), width, height };
	}

	protected zipName() {
		return 'convetta-images.zip';
	}
}
