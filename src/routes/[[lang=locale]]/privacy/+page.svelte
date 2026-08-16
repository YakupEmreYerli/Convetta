<script lang="ts">
	import { getLocale } from '$lib/state/locale.svelte';

	const locale = getLocale();

	// Politikanin son guncellenme tarihi; ceviriden bagimsiz tek kaynak.
	const UPDATED = '2026-08-16';

	let updatedLabel = $derived(
		new Intl.DateTimeFormat(locale.current === 'tr' ? 'tr-TR' : 'en-GB', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		}).format(new Date(UPDATED))
	);
</script>

<svelte:head>
	<title>{locale.dict.privacy.metaTitle}</title>
	<meta name="description" content={locale.dict.privacy.metaDescription} />
	<meta name="robots" content="index, follow" />
</svelte:head>

<main class="mx-auto w-full max-w-7xl flex-grow px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
	<article class="w-full">
		<h1 class="text-3xl font-bold text-gray-800 dark:text-white">
			{locale.dict.privacy.title}
		</h1>
		<p class="mt-2 text-sm text-gray-500 dark:text-slate-400">
			{locale.t((d) => d.privacy.updated, { date: updatedLabel })}
		</p>

		{#each locale.dict.privacy.sections as section (section.heading)}
			<section class="mt-7 first:mt-6">
				<h2 class="text-xl font-semibold text-gray-800 dark:text-slate-100">
					{section.heading}
				</h2>
				<p class="mt-2 max-w-5xl leading-7 text-gray-600 dark:text-slate-300">{section.body}</p>
			</section>
		{/each}
	</article>
</main>
