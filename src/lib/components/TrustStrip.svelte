<script lang="ts">
	import { getLocale } from '$lib/state/locale.svelte';

	/**
	 * Aracin hemen altindaki guven seridi. Buradaki uc iddianin da kodda
	 * karsiligi var: canvas yolu (JPG/PNG/WEBP), toplu isleme + ZIP indirme ve
	 * hesapsiz/kurulumsuz kullanim. Dogrulanamayan bir iddia eklenmemeli.
	 *
	 * Baslik gorsel olarak gizli: serit zaten kendini anlatiyor, ama belge
	 * yapisinda basliksiz bir bolum birakmak istemiyoruz.
	 */
	const locale = getLocale();
</script>

<section
	class="mx-auto w-full max-w-7xl px-4 pt-8 sm:px-6 lg:px-8"
	aria-labelledby="trust-title"
>
	<h2 id="trust-title" class="sr-only">{locale.dict.trust.title}</h2>
	<ul class="grid gap-4 sm:grid-cols-3">
		{#each locale.dict.trust.items as item (item.title)}
			<li class="rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-800">
				<h3 class="text-base font-semibold text-gray-800 dark:text-white">{item.title}</h3>
				<p class="mt-2 text-sm leading-6 text-gray-600 dark:text-slate-300">{item.body}</p>
			</li>
		{/each}
	</ul>
</section>
