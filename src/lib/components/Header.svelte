<script lang="ts">
	import Logo from './Logo.svelte';
	import ThemeToggle from './ThemeToggle.svelte';
	import LanguageSwitch from './LanguageSwitch.svelte';
	import { page } from '$app/state';
	import { localizePath, stripLocale } from '$lib/i18n/paths';
	import { getLocale } from '$lib/state/locale.svelte';

	const locale = getLocale();

	// Baglantilar gecerli dilin onekini tasir: Turkce'de /resizer, Ingilizce'de
	// /en/resizer. Etkin sayfa karsilastirmasi dil onegi atilarak yapiliyor.
	let currentPath = $derived(stripLocale(page.url.pathname));
	let links = $derived(
		[
			{ path: '/', label: locale.dict.nav.converter },
			{ path: '/resizer', label: locale.dict.nav.resizer }
		].map((link) => ({
			...link,
			href: localizePath(link.path, locale.current),
			active: currentPath === link.path
		}))
	);
</script>

<header id="main-header" class="w-full bg-white shadow dark:bg-slate-800">
	<div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
		<a href={localizePath('/', locale.current)} aria-label={locale.dict.nav.home}>
			<Logo class="h-7 w-auto" />
		</a>

		<div class="flex items-center space-x-6">
			<nav class="space-x-3">
				{#each links as link (link.path)}
					<a
						href={link.href}
						aria-current={link.active ? 'page' : undefined}
						class={link.active
							? 'font-bold text-gray-900 dark:text-white'
							: 'font-medium text-gray-600 transition-colors hover:text-gray-900 dark:text-slate-400 dark:hover:text-white'}
					>
						{link.label}
					</a>
				{/each}
			</nav>
			<LanguageSwitch />
			<ThemeToggle />
		</div>
	</div>
</header>
