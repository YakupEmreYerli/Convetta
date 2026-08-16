<script lang="ts">
	import PageSection from './PageSection.svelte';
	import { localizePath } from '$lib/i18n/paths';
	import { getLocale } from '$lib/state/locale.svelte';
	import { EXTENSION_BY_FORMAT, isCanvasFormat, TARGET_FORMATS } from '$lib/formats';

	const locale = getLocale();

	/**
	 * "Nerede dönüşür?" sütunu çeviriden değil koddan geliyor: bir format
	 * canvas'tan sunucuya taşındığında tablo kendiliğinden düzeliyor. Eşleme
	 * satırın sırasına değil etiketine bakıyor (JPG -> jpeg).
	 */
	const FORMAT_BY_LABEL = new Map(TARGET_FORMATS.map((f) => [EXTENSION_BY_FORMAT[f], f]));

	function runsInBrowser(label: string): boolean {
		const format = FORMAT_BY_LABEL.get(label.toLowerCase());
		return format !== undefined && isCanvasFormat(format);
	}
</script>

<PageSection id="guide" title={locale.dict.guide.title} intro={locale.dict.guide.intro}>
	<!--
		Genis tablo yalnizca kendi kutusunda kayar; sayfa yatay kaymaz. Kayan
		alanin klavyeyle de gezilebilmesi icin tabindex sart (WCAG 2.1.1), bu
		yuzden uyari bilerek susturuluyor.
	-->
	<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
	<div
		class="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0"
		tabindex="0"
		role="region"
		aria-labelledby="guide-title"
	>
		<table class="w-full min-w-[46rem] border-collapse text-left text-sm">
			<thead>
				<tr class="border-b border-gray-200 dark:border-slate-700">
					<th scope="col" class="py-3 pr-4 font-semibold text-gray-800 dark:text-white">
						{locale.dict.guide.columns.format}
					</th>
					<th scope="col" class="py-3 pr-4 font-semibold text-gray-800 dark:text-white">
						{locale.dict.guide.columns.bestFor}
					</th>
					<th scope="col" class="py-3 pr-4 font-semibold text-gray-800 dark:text-white">
						{locale.dict.guide.columns.transparency}
					</th>
					<th scope="col" class="py-3 pr-4 font-semibold text-gray-800 dark:text-white">
						{locale.dict.guide.columns.compression}
					</th>
					<th scope="col" class="py-3 font-semibold text-gray-800 dark:text-white">
						{locale.dict.guide.columns.where}
					</th>
				</tr>
			</thead>
			<tbody>
				{#each locale.dict.guide.rows as row (row.format)}
					{@const inBrowser = runsInBrowser(row.format)}
					<tr class="border-b border-gray-100 last:border-0 dark:border-slate-700/60">
						<th scope="row" class="py-4 pr-4 align-top font-semibold text-gray-800 dark:text-white">
							{row.format}
						</th>
						<td class="py-4 pr-4 align-top text-gray-600 dark:text-slate-300">{row.bestFor}</td>
						<td class="py-4 pr-4 align-top text-gray-600 dark:text-slate-300">
							{row.transparency}
						</td>
						<td class="py-4 pr-4 align-top text-gray-600 dark:text-slate-300">{row.compression}</td>
						<td class="py-4 align-top">
							<span
								class="inline-block whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium {inBrowser
									? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200'
									: 'bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-100'}"
							>
								{inBrowser ? locale.dict.guide.inBrowser : locale.dict.guide.onServer}
							</span>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<p class="mt-6 text-sm leading-6 text-gray-600 dark:text-slate-300">{locale.dict.guide.note}</p>

	<!-- Boyutlandirici sayfasi da buraya geri baglaniyor; iki arac arasindaki
	     gecis her iki yonde de bir tiklamada olmali. -->
	<p class="mt-8 text-center">
		<a
			href={localizePath('/resizer', locale.current)}
			class="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50 hover:text-blue-700 dark:text-blue-400 dark:hover:bg-slate-700/60 dark:hover:text-blue-300"
		>
			{locale.dict.guide.resizeLink}
			<span aria-hidden="true">→</span>
		</a>
	</p>
</PageSection>
