<script lang="ts">
	import { formatBytes } from '$lib/bytes';
	import { getLocale } from '$lib/state/locale.svelte';
	import type { JobEntry, JobSuccess } from '$lib/state/fileJob.svelte';

	const locale = getLocale();

	interface Props {
		results: JobEntry[];
	}

	let { results }: Props = $props();

	/**
	 * "Dosya cok buyuk" hatasi tek basina eyleme donusmuyor: kullanici dosyanin
	 * ne kadar buyuk oldugunu bilmiyor. Boyut elimizdeyken sinirla birlikte
	 * soyluyoruz; diger hatalarda sozlukteki duz metin yeterli.
	 */
	function errorText(entry: Extract<JobEntry, { kind: 'error' }>): string {
		if (entry.code === 'tooLarge' && entry.sourceSize > 0) {
			return locale.t((d) => d.errors.tooLargeDetail, { size: formatBytes(entry.sourceSize) });
		}
		return locale.dict.errors[entry.code];
	}

	/**
	 * PDF ciktisi <img> ile gosterilemez; ICO'yu tarayicilarin cogu gosterir ama
	 * hepsi degil. Gosterilemeyen turlerde kirik gorsel yerine uzanti rozeti
	 * cikiyor.
	 */
	function previewable(entry: JobSuccess): boolean {
		return entry.mime.startsWith('image/') && entry.mime !== 'image/x-icon';
	}

	/** Rozet metni: dosya adinin uzantisi, yoksa turun alt tipi. */
	function badge(entry: JobSuccess): string {
		const dot = entry.name.lastIndexOf('.');
		if (dot > -1) return entry.name.slice(dot + 1).toUpperCase();
		return (entry.mime.split('/')[1] ?? '?').toUpperCase();
	}
</script>

<ul id="result-list" class="flex flex-col gap-2">
	{#each results as entry (entry.id)}
		<li>
			{#if entry.kind === 'success'}
				<div
					class="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-2 dark:border-slate-700 dark:bg-slate-900/40"
				>
					{#if previewable(entry)}
						<img
							src={entry.url}
							alt={locale.t((d) => d.files.preview, { name: entry.name })}
							class="h-10 w-10 flex-none rounded object-cover"
						/>
					{:else}
						<span
							class="flex h-10 w-10 flex-none items-center justify-center rounded bg-gray-200 text-[10px] font-semibold text-gray-600 dark:bg-slate-700 dark:text-slate-300"
							aria-hidden="true"
						>
							{badge(entry)}
						</span>
					{/if}

					<span class="min-w-0 flex-grow">
						<span class="block truncate text-sm text-gray-700 dark:text-slate-200">
							{entry.name}
						</span>
						<span class="block text-xs text-gray-500 dark:text-slate-400">
							<!-- Kaynak -> cikti boyutu; olculer yalnizca tarayicida uretilen
							     ciktilar icin biliniyor (sunucu yolunda 0 kaliyor). -->
							{formatBytes(entry.sourceSize)} → {formatBytes(entry.size)}
							{#if entry.width > 0 && entry.height > 0}
								· {entry.width} × {entry.height}
							{/if}
						</span>
					</span>

					<a
						class="tap-target flex flex-none items-center rounded-md bg-blue-500 px-4 text-sm font-semibold text-white transition-colors hover:bg-blue-600"
						href={entry.url}
						download={entry.name}
						aria-label={locale.t((d) => d.actions.downloadFile, { name: entry.name })}
					>
						{locale.dict.actions.download}
					</a>
				</div>
			{:else}
				<div
					class="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-2 dark:border-red-500/30 dark:bg-red-500/10"
				>
					<span
						class="flex h-10 w-10 flex-none items-center justify-center rounded bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-300"
						aria-hidden="true"
					>
						<svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
							<path
								fill-rule="evenodd"
								d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
								clip-rule="evenodd"
							/>
						</svg>
					</span>
					<span class="min-w-0 flex-grow">
						<span class="block truncate text-sm font-medium text-red-700 dark:text-red-300">
							{entry.sourceName}
						</span>
						<span class="block text-xs text-red-600 dark:text-red-400">
							{errorText(entry)}
						</span>
					</span>
				</div>
			{/if}
		</li>
	{/each}
</ul>
