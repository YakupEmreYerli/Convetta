import { extractClipboardImages } from '$lib/clipboard';
import { ConversionError, type ConversionErrorCode } from '$lib/convert';
import { uniqueName } from '$lib/filename';

/**
 * Donusturucu ve boyutlandiricinin paylastigi dosya akisi: secme, pano,
 * onizleme, sirali isleme, sonuclar ve ZIP. Iki sayfa arasindaki tek fark her
 * dosyaya uygulanan islem oldugu icin alt siniflar yalnizca `process` ve
 * `zipName` tanimlar.
 */

export interface SelectedFile {
	id: string;
	file: File;
	previewUrl: string;
}

export interface JobSuccess {
	id: string;
	kind: 'success';
	name: string;
	sourceName: string;
	url: string;
	/** Ciktinin gercek turu; onizlemenin gosterilebilirligi buna bakiyor. */
	mime: string;
	size: number;
	sourceSize: number;
	width: number;
	height: number;
}

export interface JobFailure {
	id: string;
	kind: 'error';
	sourceName: string;
	code: ConversionErrorCode;
	/** Kaynak dosyanin boyutu: "cok buyuk" hatasi kac MB oldugunu soyleyebilsin. */
	sourceSize: number;
}

export type JobEntry = JobSuccess | JobFailure;

export type Phase = 'idle' | 'working' | 'zipping';

/** Alt sinifin tek bir dosya icin uretmesi gereken sonuc. */
export interface ProcessedFile {
	blob: Blob;
	/** Cikti dosya adi; tekrar edenler ZIP'te otomatik numaralandirilir. */
	name: string;
	width?: number;
	height?: number;
}

let counter = 0;
const nextId = () => `f${(counter += 1)}`;

export abstract class FileJobState {
	files = $state<SelectedFile[]>([]);
	results = $state<JobEntry[]>([]);
	phase = $state<Phase>('idle');
	done = $state(0);
	error = $state<'noFiles' | 'zip' | 'clipboard' | 'invalidSize' | null>(null);
	/** Panodan eklenen son gorsel sayisi; aria-live bildirimi icin. */
	pastedCount = $state(0);

	protected abstract process(file: File): Promise<ProcessedFile>;
	protected abstract zipName(): string;

	get busy() {
		return this.phase !== 'idle';
	}

	get successes(): JobSuccess[] {
		return this.results.filter((r): r is JobSuccess => r.kind === 'success');
	}

	get failures(): JobFailure[] {
		return this.results.filter((r): r is JobFailure => r.kind === 'error');
	}

	/**
	 * @param dedupe Ayni dosyanin iki kez eklenmesini engeller. Panodan gelen
	 *   gorsellerde kapatilir: ayni goruntuyu bilerek iki kez yapistirmak
	 *   gecerli bir kullanim ve pano dosyalari cogu tarayicida ayni adi tasir.
	 */
	add(incoming: FileList | File[], dedupe = true): number {
		const list = Array.from(incoming);
		if (list.length === 0) return 0;

		const known = new Set(
			this.files.map((f) => `${f.file.name}:${f.file.size}:${f.file.lastModified}`)
		);
		const added: SelectedFile[] = [];

		for (const file of list) {
			const key = `${file.name}:${file.size}:${file.lastModified}`;
			if (dedupe && known.has(key)) continue;
			known.add(key);
			added.push({ id: nextId(), file, previewUrl: URL.createObjectURL(file) });
		}

		if (added.length === 0) return 0;
		this.files = [...this.files, ...added];
		this.error = null;
		// Pano bildirimi yalnizca yapistirma isleminden hemen sonra gecerlidir;
		// paste() bu degeri kendi cagrisindan sonra yeniden atar.
		this.pastedCount = 0;
		return added.length;
	}

	/**
	 * Pano olayindan gorselleri alir. Metin yapistirildiginda hicbir sey
	 * yapmaz; dosya var ama gorsel degilse anlasilir bir hata gosterir.
	 */
	paste(data: DataTransfer | null | undefined) {
		if (this.busy) return;

		const { files, rejectedNonImage } = extractClipboardImages(data);
		if (files.length === 0) {
			// Salt metin yapistirmasi sessiz gecer: kullanicinin bu uygulamaya
			// yonelik bir niyeti yoktur.
			if (rejectedNonImage) {
				this.error = 'clipboard';
				this.pastedCount = 0;
			}
			return;
		}

		const added = this.add(files, false);
		this.pastedCount = added;
		this.error = rejectedNonImage ? 'clipboard' : null;
	}

	remove(id: string) {
		const target = this.files.find((f) => f.id === id);
		if (!target) return;
		URL.revokeObjectURL(target.previewUrl);
		this.files = this.files.filter((f) => f.id !== id);
	}

	clearFiles() {
		for (const f of this.files) URL.revokeObjectURL(f.previewUrl);
		this.files = [];
	}

	clearResults() {
		for (const r of this.results) {
			if (r.kind === 'success') URL.revokeObjectURL(r.url);
		}
		this.results = [];
		this.done = 0;
	}

	/** Sayfadan ayrilirken tum blob adreslerini serbest birakir. */
	dispose() {
		this.clearFiles();
		this.clearResults();
	}

	async run() {
		if (this.busy) return;
		if (this.files.length === 0) {
			this.error = 'noFiles';
			return;
		}

		this.error = null;
		this.pastedCount = 0;
		this.clearResults();
		this.phase = 'working';

		const taken = new Set<string>();

		// Sirali islem bilincli bir tercih: cok sayida buyuk gorsel es zamanli
		// kodlandiginda mobil tarayicilar bellek yetersizliginden sekmeyi
		// dusurebiliyor. Ayrica ilerleme sayaci boylece anlamli oluyor.
		for (const item of this.files) {
			try {
				const output = await this.process(item.file);
				this.results = [
					...this.results,
					{
						id: item.id,
						kind: 'success',
						name: uniqueName(output.name, taken),
						sourceName: item.file.name,
						url: URL.createObjectURL(output.blob),
						mime: output.blob.type,
						size: output.blob.size,
						sourceSize: item.file.size,
						width: output.width ?? 0,
						height: output.height ?? 0
					}
				];
			} catch (err) {
				const code: ConversionErrorCode = err instanceof ConversionError ? err.code : 'encode';
				this.results = [
					...this.results,
					{
						id: item.id,
						kind: 'error',
						sourceName: item.file.name,
						code,
						sourceSize: item.file.size
					}
				];
			}
			this.done += 1;
		}

		this.phase = 'idle';
	}

	/**
	 * Her ciktiyi ayri ayri indirir. Tarayicilar art arda gelen indirmeleri
	 * bogabildigi icin aralarina kisa bir bekleme konuyor.
	 */
	async downloadEach() {
		const items = this.successes;
		if (items.length === 0 || this.busy) return;

		for (const [index, item] of items.entries()) {
			if (index > 0) await new Promise((resolve) => setTimeout(resolve, 120));
			const link = document.createElement('a');
			link.href = item.url;
			link.download = item.name;
			document.body.appendChild(link);
			link.click();
			link.remove();
		}
	}

	async downloadZip() {
		const items = this.successes;
		if (items.length === 0 || this.busy) return;

		this.phase = 'zipping';
		this.error = null;
		try {
			// JSZip yalnizca gercekten ZIP istendiginde indiriliyor; ilk yukleme
			// paketinde yer kaplamiyor.
			const { default: JSZip } = await import('jszip');
			const zip = new JSZip();

			for (const item of items) {
				zip.file(item.name, await (await fetch(item.url)).blob());
			}

			triggerDownload(await zip.generateAsync({ type: 'blob' }), this.zipName());
		} catch {
			this.error = 'zip';
		} finally {
			this.phase = 'idle';
		}
	}
}

/** Blob'u indirme olarak tetikler ve gecici adresi hemen serbest birakir. */
export function triggerDownload(blob: Blob, fileName: string) {
	const url = URL.createObjectURL(blob);
	const link = document.createElement('a');
	link.href = url;
	link.download = fileName;
	document.body.appendChild(link);
	link.click();
	link.remove();
	URL.revokeObjectURL(url);
}
