<script lang="ts">
	import { formatBytes } from '$lib/bytes';
	import { getLocale } from '$lib/state/locale.svelte';
	import type { SelectedFile } from '$lib/state/fileJob.svelte';

	const locale = getLocale();

	interface Props {
		files: SelectedFile[];
		disabled?: boolean;
		onremove: (id: string) => void;
		onclear: () => void;
	}

	let { files, disabled = false, onremove, onclear }: Props = $props();
</script>

<div id="fileList" class="mt-6">
	<div class="mb-2 flex items-baseline justify-between gap-3">
		<h3 class="font-semibold text-gray-700 dark:text-slate-200">
			{locale.dict.files.heading}
		</h3>
		<button
			type="button"
			class="text-sm font-medium text-gray-500 underline-offset-2 hover:text-red-600 hover:underline disabled:cursor-not-allowed disabled:opacity-60 dark:text-slate-400 dark:hover:text-red-400"
			{disabled}
			onclick={onclear}
		>
			{locale.dict.files.clear}
		</button>
	</div>

	<ul class="flex flex-col gap-2">
		{#each files as item (item.id)}
			<li
				class="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-2 dark:border-slate-700 dark:bg-slate-900/40"
			>
				<img
					src={item.previewUrl}
					alt={locale.t((d) => d.files.preview, { name: item.file.name })}
					class="h-10 w-10 flex-none rounded object-cover"
				/>
				<span class="min-w-0 flex-grow">
					<span class="block truncate text-sm text-gray-700 dark:text-slate-200">
						{item.file.name}
					</span>
					<span class="block text-xs text-gray-500 dark:text-slate-400">
						{formatBytes(item.file.size)}
					</span>
				</span>
				<button
					type="button"
					class="tap-target flex flex-none items-center justify-center rounded-md text-gray-400 transition-colors hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60 dark:text-slate-500 dark:hover:text-red-400"
					aria-label={locale.t((d) => d.files.remove, { name: item.file.name })}
					{disabled}
					onclick={() => onremove(item.id)}
				>
					<svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
						<path
							fill-rule="evenodd"
							d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
							clip-rule="evenodd"
						/>
					</svg>
				</button>
			</li>
		{/each}
	</ul>

	<p class="mt-2 text-xs text-gray-500 dark:text-slate-400">
		{locale.t((d) => d.files.count, { count: files.length })}
	</p>
</div>
