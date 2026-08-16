<script lang="ts">
	import type { Snippet } from 'svelte';

	/**
	 * Ana sayfadaki bilgi bolumlerinin ortak kabugu.
	 *
	 * Dis sarmalayicinin olculeri dönüştürücünün <main> etiketiyle birebir ayni
	 * (max-w-7xl + yatay bosluk), boylece butun kartlar ayni dikeyde hizalanir.
	 */
	interface Props {
		id: string;
		title: string;
		intro?: string;
		children: Snippet;
	}

	let { id, title, intro, children }: Props = $props();
</script>

<div class="mx-auto w-full max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
	<section
		class="rounded-2xl bg-white p-8 shadow-xl sm:p-10 dark:bg-slate-800"
		aria-labelledby="{id}-title"
	>
		<h2 id="{id}-title" class="text-center text-3xl font-bold text-gray-800 dark:text-white">
			{title}
		</h2>
		{#if intro}
			<p class="mx-auto mt-3 max-w-3xl text-center leading-7 text-gray-600 dark:text-slate-300">
				{intro}
			</p>
		{/if}
		<div class="mt-8">
			{@render children()}
		</div>
	</section>
</div>
