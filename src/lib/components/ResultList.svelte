<script lang="ts">
	import { getLocale } from '$lib/state/locale.svelte';
	import type { JobEntry } from '$lib/state/fileJob.svelte';

	const locale = getLocale();

	interface Props {
		results: JobEntry[];
	}

	let { results }: Props = $props();
</script>

<div id="result-list" class="grid grid-cols-1 gap-4 sm:grid-cols-2">
	{#each results as entry (entry.id)}
		{#if entry.kind === 'success'}
			<div
				class="flex items-center justify-between rounded-lg bg-gray-50 p-4 dark:bg-slate-900/40"
			>
				<p class="truncate font-medium text-gray-700 dark:text-slate-200">{entry.name}</p>
				<a
					class="ml-4 flex-none rounded-md bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-600"
					href={entry.url}
					download={entry.name}
					aria-label={locale.t((d) => d.actions.downloadFile, { name: entry.name })}
				>
					{locale.dict.actions.download}
				</a>
			</div>
		{:else}
			<div class="rounded-lg bg-red-50 p-4 dark:bg-red-500/10">
				<p class="font-medium text-red-700 dark:text-red-300">
					{entry.sourceName} - {locale.dict.errors[entry.code]}
				</p>
			</div>
		{/if}
	{/each}
</div>
