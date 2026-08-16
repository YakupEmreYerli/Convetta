<script lang="ts">
	import JobShell from './JobShell.svelte';
	import { getLocale } from '$lib/state/locale.svelte';
	import { ResizerState } from '$lib/state/resizer.svelte';
	import { MAX_DIMENSION, MIN_DIMENSION } from '$lib/resize';

	const locale = getLocale();
	const state = new ResizerState();

	const inputClass =
		'mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-2 text-base shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-900/40 dark:text-slate-100';
</script>

<JobShell
	{state}
	title={locale.dict.resizer.title}
	subtitle={locale.dict.resizer.subtitle}
	resultsTitle={locale.dict.resizer.results}
	resultsSubtitle={locale.dict.resizer.resultsSubtitle}
	onfiles={() => state.syncRatioFromFirstFile()}
>
	{#snippet controls()}
		<div class="mt-6 flex flex-col gap-4">
			<div class="flex items-center justify-between gap-3">
				<div class="w-full">
					<label
						for="widthInput"
						class="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-200"
					>
						{locale.dict.resizer.width}
					</label>
					<input
						id="widthInput"
						type="number"
						inputmode="numeric"
						min={MIN_DIMENSION}
						max={MAX_DIMENSION}
						class={inputClass}
						value={state.width}
						disabled={state.busy}
						oninput={(e) => state.setWidth(Number(e.currentTarget.value))}
						onchange={() => state.commitWidth()}
					/>
				</div>

				<div class="flex-shrink-0 pt-6">
					<button
						type="button"
						class="rounded-md p-2 text-white transition-colors duration-200 {state.lockRatio
							? 'bg-blue-600'
							: 'bg-gray-300 text-gray-700 dark:bg-slate-600 dark:text-slate-100'}"
						title={locale.dict.resizer.lockRatio}
						aria-label={locale.dict.resizer.lockRatio}
						aria-describedby="lockHint"
						aria-pressed={state.lockRatio}
						disabled={state.busy}
						onclick={() => state.toggleLock()}
					>
						{#if state.lockRatio}
							<svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
								<path
									fill-rule="evenodd"
									d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
									clip-rule="evenodd"
								/>
							</svg>
						{:else}
							<svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
								<path
									fill-rule="evenodd"
									d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6zM10 12a1 1 0 100-2 1 1 0 000 2z"
									clip-rule="evenodd"
								/>
							</svg>
						{/if}
					</button>
				</div>

				<div class="w-full">
					<label
						for="heightInput"
						class="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-200"
					>
						{locale.dict.resizer.height}
					</label>
					<input
						id="heightInput"
						type="number"
						inputmode="numeric"
						min={MIN_DIMENSION}
						max={MAX_DIMENSION}
						class={inputClass}
						value={state.height}
						disabled={state.busy}
						oninput={(e) => state.setHeight(Number(e.currentTarget.value))}
						onchange={() => state.commitHeight()}
					/>
				</div>
			</div>

			<!--
				Kilit dugmesi tek basina bir ikondu ve ne yaptigi anlasilmiyordu;
				durumu artik yazili olarak da bildiriliyor. Orijinal olcu ise
				kullanici hedef genisligi neye gore sectigini bilsin diye var.
			-->
			<div class="-mt-2 flex flex-col gap-1 text-xs leading-5 text-gray-500 dark:text-slate-400">
				<p id="lockHint">
					{state.lockRatio ? locale.dict.resizer.lockRatioOn : locale.dict.resizer.lockRatioOff}
				</p>
				{#if state.originalWidth > 0}
					<p class="font-medium text-gray-600 dark:text-slate-300">
						{locale.t((d) => d.resizer.originalSize, {
							width: state.originalWidth,
							height: state.originalHeight
						})}
					</p>
				{/if}
			</div>

			<button
				type="button"
				class="mt-4 w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white shadow-md transition-transform duration-300 hover:scale-105 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
				disabled={state.busy || state.files.length === 0}
				onclick={() => state.run()}
			>
				{state.phase === 'working' ? locale.dict.resizer.resizing : locale.dict.resizer.resize}
			</button>
		</div>
	{/snippet}
</JobShell>
