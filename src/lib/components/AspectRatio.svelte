<script lang="ts">
	import PageSection from './PageSection.svelte';
	import { getLocale } from '$lib/state/locale.svelte';

	const locale = getLocale();
</script>

<PageSection id="aspect" title={locale.dict.resizer.aspect.title}>
	<p class="mx-auto max-w-4xl leading-7 text-gray-600 dark:text-slate-300">
		{locale.dict.resizer.aspect.body}
	</p>

	<h3 class="mt-8 font-semibold text-gray-800 dark:text-white">
		{locale.dict.resizer.aspect.exampleTitle}
	</h3>

	<!--
		Tablo yalnizca kendi kutusunda kayar; sayfa yatay kaymaz. Kayan alanin
		klavyeyle de gezilebilmesi icin tabindex sart (WCAG 2.1.1).
	-->
	<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
	<div
		class="-mx-4 mt-3 overflow-x-auto px-4 sm:mx-0 sm:px-0"
		tabindex="0"
		role="region"
		aria-labelledby="aspect-title"
	>
		<table class="w-full min-w-[36rem] border-collapse text-left text-sm">
			<thead>
				<tr class="border-b border-gray-200 dark:border-slate-700">
					<th scope="col" class="py-3 pr-4 font-semibold text-gray-800 dark:text-white">
						{locale.dict.resizer.aspect.columns.original}
					</th>
					<th scope="col" class="py-3 pr-4 font-semibold text-gray-800 dark:text-white">
						{locale.dict.resizer.aspect.columns.resized}
					</th>
					<th scope="col" class="py-3 pr-4 font-semibold text-gray-800 dark:text-white">
						{locale.dict.resizer.aspect.columns.ratio}
					</th>
					<th scope="col" class="py-3 font-semibold text-gray-800 dark:text-white">
						{locale.dict.resizer.aspect.columns.use}
					</th>
				</tr>
			</thead>
			<tbody>
				{#each locale.dict.resizer.aspect.rows as row (row.original)}
					<tr class="border-b border-gray-100 last:border-0 dark:border-slate-700/60">
						<th
							scope="row"
							class="whitespace-nowrap py-4 pr-4 align-top font-medium text-gray-800 dark:text-white"
						>
							{row.original}
						</th>
						<td class="whitespace-nowrap py-4 pr-4 align-top text-gray-600 dark:text-slate-300">
							{row.resized}
						</td>
						<td class="py-4 pr-4 align-top">
							<span
								class="inline-block whitespace-nowrap rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/40 dark:text-blue-200"
							>
								{row.ratio}
							</span>
						</td>
						<td class="py-4 align-top text-gray-600 dark:text-slate-300">{row.use}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</PageSection>
