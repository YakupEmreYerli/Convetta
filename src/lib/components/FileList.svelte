<script lang="ts">
	import { getLocale } from '$lib/state/locale.svelte';
	import type { SelectedFile } from '$lib/state/fileJob.svelte';

	const locale = getLocale();

	interface Props {
		files: SelectedFile[];
	}

	let { files }: Props = $props();

	function sizeInKilobytes(bytes: number) {
		return `${(bytes / 1024).toFixed(2)} KB`;
	}
</script>

<div id="fileList" class="mt-6">
	<h3 class="mb-2 font-semibold text-gray-700 dark:text-slate-200">
		{locale.dict.files.heading}
	</h3>
	<ul class="list-inside list-disc text-gray-600 dark:text-slate-300">
		{#each files as item (item.id)}
			<li>{item.file.name} ({sizeInKilobytes(item.file.size)})</li>
		{/each}
	</ul>
</div>
