<script lang="ts">
	import { getLocale } from '$lib/state/locale.svelte';

	/**
	 * Boyutlandiriciya ozgu guven seridi. Ucunun de kodda karsiligi var:
	 * $lib/resize tamamen canvas uzerinde calisiyor, oran kilidi varsayilan
	 * olarak acik (bkz. ResizerState.lockRatio) ve toplu is + ZIP indirme
	 * FileJobState'ten geliyor.
	 */
	const locale = getLocale();
</script>

<section
	class="mx-auto w-full max-w-7xl px-4 pt-8 sm:px-6 lg:px-8"
	aria-labelledby="resizer-trust-title"
>
	<!--
		Baslik H1'i tekrar etmemeli: gorsel olarak gizli olsa da belge yapisinda
		ve ekran okuyucuda ayni metin iki kez gecerdi.
	-->
	<h2 id="resizer-trust-title" class="sr-only">{locale.dict.resizer.trustTitle}</h2>
	<ul class="grid gap-4 sm:grid-cols-3">
		{#each locale.dict.resizer.trust as item (item.title)}
			<li class="rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-800">
				<h3 class="text-base font-semibold text-gray-800 dark:text-white">{item.title}</h3>
				<p class="mt-2 text-sm leading-6 text-gray-600 dark:text-slate-300">{item.body}</p>
			</li>
		{/each}
	</ul>
</section>
