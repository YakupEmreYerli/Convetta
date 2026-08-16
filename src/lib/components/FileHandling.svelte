<script lang="ts">
	import PageSection from './PageSection.svelte';
	import { localizePath } from '$lib/i18n/paths';
	import { getLocale } from '$lib/state/locale.svelte';

	/**
	 * Dosyalarin nereye gittigini anlatan bolum. Metinlerdeki her sayi ve her
	 * istisna kodla ayni olmali: sinirlar $lib/formats ve $lib/server icinde,
	 * ICO'nun gecici dosyasi ise $lib/server/magick icinde tanimli.
	 *
	 * Ilk iki madde dosyanin cihazda kalip kalmadigini anlatiyor; kenar cizgisi
	 * format tablosundaki yesil/kehribar rozetlerle ayni anlami tasiyor. Sira
	 * sozlukte sabit oldugu icin vurgu dizinden veriliyor.
	 */
	const locale = getLocale();

	const ACCENTS = [
		'border-l-green-500 dark:border-l-green-400',
		'border-l-amber-500 dark:border-l-amber-400',
		'border-l-gray-300 dark:border-l-slate-600',
		'border-l-gray-300 dark:border-l-slate-600'
	];
</script>

<PageSection id="processing" title={locale.dict.processing.title}>
	<!-- Kartlar satir yuksekligine yayilir; boylece kisa ve uzun metinler
	     arasinda bosluk kalmaz. -->
	<div class="grid gap-4 sm:grid-cols-2">
		{#each locale.dict.processing.sections as section, index (section.heading)}
			<div
				class="h-full rounded-xl border border-gray-200 border-l-4 bg-gray-50 p-6 dark:border-slate-700 dark:bg-slate-900/40 {ACCENTS[
					index
				] ?? ACCENTS[2]}"
			>
				<h3 class="font-semibold text-gray-800 dark:text-white">{section.heading}</h3>
				<p class="mt-2 text-sm leading-6 text-gray-600 dark:text-slate-300">{section.body}</p>
			</div>
		{/each}
	</div>

	<p class="mt-8 text-center">
		<a
			href={localizePath('/privacy', locale.current)}
			class="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50 hover:text-blue-700 dark:text-blue-400 dark:hover:bg-slate-700/60 dark:hover:text-blue-300"
		>
			{locale.dict.processing.privacyLink}
			<span aria-hidden="true">→</span>
		</a>
	</p>
</PageSection>
