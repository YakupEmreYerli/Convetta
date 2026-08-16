<script lang="ts">
	import { slide } from 'svelte/transition';
	import { prefersReducedMotion } from 'svelte/motion';
	import { getLocale } from '$lib/state/locale.svelte';

	const locale = getLocale();

	// Eski surumdeki gibi tum sorular acik baslar; kullanici istedigini kapatir.
	// Kapali baslamak, sayfadaki metnin buyuk bolumunu ilk bakista gizlerdi.
	let closed = $state<Set<number>>(new Set());

	function toggle(index: number) {
		const next = new Set(closed);
		if (next.has(index)) next.delete(index);
		else next.add(index);
		closed = next;
	}
</script>

<section
	id="faq-container"
	class="mx-auto mb-8 mt-8 w-full max-w-7xl rounded-2xl bg-white px-4 py-8 shadow-xl sm:px-6 sm:py-12 lg:px-8 dark:bg-slate-800"
	aria-labelledby="faq-title"
>
	<h2 id="faq-title" class="mb-8 text-center text-3xl font-bold text-gray-800 dark:text-white">
		{locale.dict.faq.title}
	</h2>

	<div>
		{#each locale.dict.faq.items as item, index (item.q)}
			{@const expanded = !closed.has(index)}
			<div class="mb-4 rounded-md border border-gray-200 dark:border-slate-700">
				<h3>
					<button
						type="button"
						class="flex w-full cursor-pointer items-center justify-between gap-4 p-5 text-left text-xl font-semibold text-gray-800 dark:text-slate-100"
						aria-expanded={expanded}
						aria-controls="faq-panel-{index}"
						id="faq-header-{index}"
						onclick={() => toggle(index)}
					>
						<span>{item.q}</span>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-6 w-6 flex-none transform transition-transform duration-300 {expanded
								? 'rotate-180'
								: ''}"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							stroke-width="2"
							aria-hidden="true"
						>
							<path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
						</svg>
					</button>
				</h3>
				{#if expanded}
					<div
						id="faq-panel-{index}"
						role="region"
						aria-labelledby="faq-header-{index}"
						transition:slide={{ duration: prefersReducedMotion.current ? 0 : 300 }}
					>
						<div class="p-5 pt-0">
							<p class="text-gray-800 dark:text-slate-100">{item.a}</p>
						</div>
					</div>
				{/if}
			</div>
		{/each}
	</div>
</section>
