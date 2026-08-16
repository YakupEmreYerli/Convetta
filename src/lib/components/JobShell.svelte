<script lang="ts">
	import type { Snippet } from 'svelte';
	import DropZone from './DropZone.svelte';
	import SelectedFiles from './FileList.svelte';
	import ResultList from './ResultList.svelte';
	import { isEditableTarget } from '$lib/clipboard';
	import { getLocale } from '$lib/state/locale.svelte';
	import type { FileJobState } from '$lib/state/fileJob.svelte';

	const locale = getLocale();

	interface Props {
		state: FileJobState;
		title: string;
		subtitle: string;
		resultsTitle: string;
		resultsSubtitle: string;
		/** Islem duzeyine ozel ayarlar ve ana buton. */
		controls?: Snippet;
		/** Dosya listesi degistiginde cagrilir (ekleme, kaldirma, temizleme). */
		onfiles?: () => void;
	}

	let { state, title, subtitle, resultsTitle, resultsSubtitle, controls, onfiles }: Props =
		$props();

	// Ekranda yer kaplamayan, ekran okuyuculara duyurulan durum metni.
	let status = $derived.by(() => {
		if (state.phase === 'working') {
			return locale.t((d) => d.results.progress, { done: state.done, total: state.files.length });
		}
		if (state.phase === 'zipping') return locale.dict.actions.zipping;
		if (state.error) {
			return state.error === 'invalidSize'
				? locale.dict.resizer.invalidSize
				: locale.dict.errors[state.error];
		}
		if (state.pastedCount > 0) {
			return locale.t((d) => d.drop.pasted, { count: state.pastedCount });
		}
		if (state.results.length === 0) return '';

		const parts: string[] = [];
		if (state.successes.length > 0) {
			parts.push(locale.t((d) => d.results.done, { count: state.successes.length }));
		}
		if (state.failures.length > 0) {
			parts.push(locale.t((d) => d.results.failed, { count: state.failures.length }));
		}
		return parts.join(' ');
	});

	$effect(() => {
		// Bilesen kaldirilirken tum blob adresleri serbest birakilir; aksi halde
		// sayfa gecislerinde bellek birikir.
		return () => state.dispose();
	});

	function handleFiles(files: FileList | File[]) {
		state.add(files);
		onfiles?.();
	}

	function onPaste(event: ClipboardEvent) {
		// Bir metin alanina yapistiriliyorsa olay o alana aittir.
		if (isEditableTarget(event.target)) return;
		const before = state.files.length;
		state.paste(event.clipboardData);
		// Yalnizca gorsel aldiysak varsayilan davranisi engelliyoruz; metin
		// yapistirmasi sayfanin geri kalanini etkilemeden gecer.
		if (state.files.length > before) {
			event.preventDefault();
			onfiles?.();
		}
	}
</script>

<!--
	Pano dinleyicisi window uzerinde: Svelte bu baglantiyi bilesen kaldirilirken
	kendisi kaldirir, elle removeEventListener gerekmez.
-->
<svelte:window onpaste={onPaste} />

<main class="mx-auto w-full max-w-7xl flex-grow px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
	<div class="flex flex-col gap-8 rounded-2xl bg-white p-8 shadow-xl lg:flex-row dark:bg-slate-800">
		<div class="flex flex-col lg:w-1/2">
			<div class="mb-8 text-center">
				<h1 class="text-3xl font-bold text-gray-800 dark:text-white">{title}</h1>
				<p class="mt-2 text-gray-500 dark:text-slate-400">{subtitle}</p>
			</div>

			<DropZone onfiles={handleFiles} disabled={state.busy} />

			{#if state.files.length > 0}
				<SelectedFiles
					files={state.files}
					disabled={state.busy}
					onremove={(id) => {
						state.remove(id);
						onfiles?.();
					}}
					onclear={() => {
						state.clearFiles();
						onfiles?.();
					}}
				/>
			{/if}

		{@render controls?.()}

			{#if state.error}
				<p class="mt-3 text-sm font-medium text-red-600 dark:text-red-400" role="alert">
					{state.error === 'invalidSize'
						? locale.dict.resizer.invalidSize
						: locale.dict.errors[state.error]}
				</p>
			{/if}
		</div>

		<div class="flex flex-col lg:w-1/2">
			<div class="mb-8 text-center lg:text-left">
				<h2 class="text-3xl font-bold text-gray-800 dark:text-white">{resultsTitle}</h2>
				<p class="mt-2 text-gray-500 dark:text-slate-400">{resultsSubtitle}</p>
			</div>

			<p class="sr-only" role="status" aria-live="polite">{status}</p>

			<!-- Sonuc paneli, eski surumde oldugu gibi yalnizca cikti varken gorunur. -->
			{#if state.results.length > 0}
				<div class="flex-grow">
					<div class="mb-4 flex flex-col gap-4 sm:flex-row">
						<button
							type="button"
							class="flex-1 rounded-lg bg-blue-500 px-6 py-3 font-medium text-white shadow-md transition-transform duration-300 hover:scale-105 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
							disabled={state.busy || state.successes.length === 0}
							onclick={() => state.downloadEach()}
						>
							{locale.dict.actions.downloadSeparate}
						</button>
						<button
							type="button"
							class="flex-1 rounded-lg bg-green-500 px-6 py-3 font-medium text-white shadow-md transition-transform duration-300 hover:scale-105 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
							disabled={state.busy || state.successes.length === 0}
							onclick={() => state.downloadZip()}
						>
							{state.phase === 'zipping'
								? locale.dict.actions.zipping
								: locale.dict.actions.downloadAll}
						</button>
					</div>
					<ResultList results={state.results} />
				</div>
			{/if}
		</div>
	</div>
</main>
