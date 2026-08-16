<script lang="ts">
	import JobShell from './JobShell.svelte';
	import { getLocale } from '$lib/state/locale.svelte';
	import { ConverterState } from '$lib/state/converter.svelte';
	import { TARGET_FORMATS, type TargetFormat } from '$lib/formats';

	const locale = getLocale();
	const converterState = new ConverterState();
	let formatOpen = $state(false);
	let formatMenu = $state<HTMLDivElement | null>(null);

	function chooseFormat(format: TargetFormat) {
		converterState.format = format;
		formatOpen = false;
	}

	function closeFormatMenu(event: MouseEvent) {
		if (formatOpen && !formatMenu?.contains(event.target as Node)) formatOpen = false;
	}

</script>

<svelte:window onclick={closeFormatMenu} onkeydown={(event) => event.key === 'Escape' && (formatOpen = false)} />

<JobShell
	state={converterState}
	title={locale.dict.hero.title}
	subtitle={locale.dict.hero.subtitle}
	resultsTitle={locale.dict.results.title}
	resultsSubtitle={locale.dict.results.subtitle}
>
	{#snippet controls()}
		<div class="mt-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
			<div class="w-full sm:w-40">
				<label
					for="formatSelect"
					class="mb-1 block whitespace-nowrap text-sm font-medium text-gray-700 dark:text-slate-200"
				>
					{locale.dict.options.format}
				</label>
				<div class="relative mt-1" bind:this={formatMenu}>
					<button
						type="button"
						id="formatSelect"
						class="flex w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-3 py-2 text-left text-sm font-medium text-gray-800 shadow-sm transition-colors hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
						aria-haspopup="listbox"
						aria-expanded={formatOpen}
						disabled={converterState.busy}
						onclick={() => (formatOpen = !formatOpen)}
					>
						<span>{converterState.format.toUpperCase()}</span>
						<svg class="h-4 w-4 text-gray-500 transition-transform {formatOpen ? 'rotate-180' : ''} dark:text-slate-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
							<path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
						</svg>
					</button>
					{#if formatOpen}
						<div class="absolute z-30 mt-2 w-full overflow-hidden rounded-lg border border-gray-200 bg-white p-1 shadow-xl dark:border-slate-600 dark:bg-slate-800" role="listbox" aria-labelledby="formatSelect">
							{#each TARGET_FORMATS as value (value)}
								<button
									type="button"
									role="option"
									aria-selected={converterState.format === value}
									class="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm font-medium transition-colors {converterState.format === value ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700 dark:text-slate-200 dark:hover:bg-slate-700 dark:hover:text-white'}"
									onclick={() => chooseFormat(value)}
								>
									{value.toUpperCase()}
									{#if converterState.format === value}<span aria-hidden="true">✓</span>{/if}
								</button>
							{/each}
						</div>
					{/if}
				</div>
			</div>

			<button
				type="button"
				class="mt-4 w-full rounded-lg bg-blue-600 px-6 py-3 font-medium text-white shadow-md transition-transform duration-300 hover:scale-105 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100 sm:mt-0 sm:w-auto"
				disabled={converterState.busy || converterState.files.length === 0}
				onclick={() => converterState.run()}
			>
				{converterState.phase === 'working' ? locale.dict.actions.converting : locale.dict.actions.convert}
			</button>
		</div>
	{/snippet}
</JobShell>
