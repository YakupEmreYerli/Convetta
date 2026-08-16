<script lang="ts">
	import PageSection from './PageSection.svelte';
	import { localizePath } from '$lib/i18n/paths';
	import { getLocale } from '$lib/state/locale.svelte';

	/**
	 * Boyutlandirma / donusturme / sikistirma ayrimi. Ic baglanti yalnizca
	 * dönüştürücüye veriliyor; sikistirma araci yok, dolayisiyla olmayan bir
	 * sayfaya baglanti uretilmiyor.
	 */
	const locale = getLocale();
</script>

<PageSection id="dimensions" title={locale.dict.resizer.dimensions.title}>
	<p class="mx-auto max-w-4xl leading-7 text-gray-600 dark:text-slate-300">
		{locale.dict.resizer.dimensions.body}
	</p>

	<div class="mt-8 grid gap-4 sm:grid-cols-2">
		{#each locale.dict.resizer.dimensions.sections as section (section.heading)}
			<div
				class="h-full rounded-xl border border-gray-200 bg-gray-50 p-6 dark:border-slate-700 dark:bg-slate-900/40"
			>
				<h3 class="font-semibold text-gray-800 dark:text-white">{section.heading}</h3>
				<p class="mt-2 text-sm leading-6 text-gray-600 dark:text-slate-300">{section.body}</p>
			</div>
		{/each}
	</div>

	<p class="mt-8 text-center">
		<a
			href={localizePath('/', locale.current)}
			class="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50 hover:text-blue-700 dark:text-blue-400 dark:hover:bg-slate-700/60 dark:hover:text-blue-300"
		>
			{locale.dict.resizer.dimensions.convertLink}
			<span aria-hidden="true">→</span>
		</a>
	</p>
</PageSection>
