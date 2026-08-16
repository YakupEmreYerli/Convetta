<script lang="ts">
	import PageSection from './PageSection.svelte';
	import { getLocale } from '$lib/state/locale.svelte';

	const locale = getLocale();
</script>

<PageSection id="how" title={locale.dict.how.title}>
	<ol class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
		{#each locale.dict.how.steps as step, index (step.title)}
			<li class="flex gap-4">
				<span
					class="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-brand-600 text-sm font-semibold text-white"
					aria-hidden="true"
				>
					{index + 1}
				</span>
				<div>
					<h3 class="font-semibold text-gray-800 dark:text-white">{step.title}</h3>
					<p class="mt-1 text-sm leading-6 text-gray-600 dark:text-slate-300">{step.body}</p>
				</div>
			</li>
		{/each}
	</ol>
</PageSection>
