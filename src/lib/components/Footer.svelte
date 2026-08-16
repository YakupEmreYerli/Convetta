<script lang="ts">
	import { localizePath } from '$lib/i18n/paths';
	import { getLocale } from '$lib/state/locale.svelte';

	const locale = getLocale();

	const year = new Date().getFullYear();
</script>

<footer id="main-footer" class="mt-auto w-full bg-white py-6 dark:bg-slate-800">
	<div
		class="mx-auto flex max-w-7xl flex-col items-center justify-center gap-3 text-center text-sm sm:flex-row"
	>
		<p class="text-gray-800 dark:text-gray-400">
			{locale.t((d) => d.footer.rights, { year })}
		</p>
		<span class="hidden text-gray-500 sm:inline dark:text-gray-600">•</span>
		<p class="text-gray-800 dark:text-gray-300">
			{locale.dict.footer.support}
			<a
				href="mailto:support@convetta.com"
				class="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
			>
				support@convetta.com
			</a>
		</p>
		<span class="hidden text-gray-500 sm:inline dark:text-gray-600">•</span>
		<p>
			<a
				href={localizePath('/privacy', locale.current)}
				class="font-medium text-gray-800 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
			>
				{locale.dict.footer.privacy}
			</a>
		</p>
	</div>
</footer>
