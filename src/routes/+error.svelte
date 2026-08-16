<script lang="ts">
	import { page } from '$app/state';
	import { localizePath } from '$lib/i18n/paths';
	import { getLocale } from '$lib/state/locale.svelte';

	const locale = getLocale();
</script>

<svelte:head>
	<title>{page.status} — Convetta</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<main
	class="mx-auto flex w-full max-w-content flex-grow flex-col items-center justify-center px-4 py-16 text-center sm:px-6 lg:px-8"
>
	<p class="text-5xl font-bold text-brand-600">{page.status}</p>
	<h1 class="mt-4 text-2xl font-bold text-gray-800 sm:text-3xl dark:text-white">
		{locale.dict.notFound.title}
	</h1>
	<p class="mt-2 text-gray-500 dark:text-slate-400">{locale.dict.notFound.body}</p>
	<a href={localizePath('/', locale.current)} class="btn-primary mt-6">{locale.dict.notFound.home}</a>
</main>
