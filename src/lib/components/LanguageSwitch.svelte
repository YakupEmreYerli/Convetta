<script lang="ts">
	import { page } from '$app/state';
	import { LOCALES, type Locale } from '$lib/i18n';
	import { localizePath } from '$lib/i18n/paths';
	import { getLocale } from '$lib/state/locale.svelte';

	const locale = getLocale();

	const names: Record<Locale, string> = { tr: 'Türkçe', en: 'English' };

	// Dil degisimi bir gezinme: ayni sayfanin oteki dildeki adresine gidilir.
	// Boylece adres, <html lang> ve icerik her zaman tutarli kalir ve secim
	// paylasilan baglantida da korunur.
	let links = $derived(
		LOCALES.map((code) => ({
			code,
			href: localizePath(page.url.pathname, code),
			active: locale.current === code
		}))
	);
</script>

<div
	class="flex items-center space-x-2 border-l border-gray-300 pl-3 dark:border-slate-600"
	role="group"
	aria-label={locale.dict.nav.language}
>
	{#each links as link (link.code)}
		<a
			href={link.href}
			hreflang={link.code}
			lang={link.code}
			title={names[link.code]}
			aria-current={link.active ? 'true' : undefined}
			class="uppercase {link.active
				? 'font-bold text-gray-900 dark:text-white'
				: 'font-medium text-gray-500 hover:text-gray-900 dark:text-slate-400 dark:hover:text-white'}"
		>
			{link.code}
		</a>
	{/each}
</div>
