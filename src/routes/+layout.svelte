<script lang="ts">
	import '../app.css';
	import { untrack } from 'svelte';
	import { page } from '$app/state';
	import Header from '$components/Header.svelte';
	import Footer from '$components/Footer.svelte';
	import { LOCALES } from '$lib/i18n';
	import { localizePath } from '$lib/i18n/paths';
	import { setLocaleContext } from '$lib/state/locale.svelte';
	import { theme } from '$lib/state/theme.svelte';

	let { data, children } = $props();

	// Dil baglami burada kuruluyor; tum alt bilesenler getLocale() ile okuyor.
	// Baslangic degeri bilerek izlenmiyor: sonraki gezinmelerde dili asagidaki
	// $effect guncelliyor, boylece baglam nesnesi ayni kaliyor.
	const locale = setLocaleContext(untrack(() => data.locale));

	// Kanonik adres her zaman www'li uretim alan adi; onizleme ve gelistirme
	// sunucularinin adresi dizine gonderilmemeli.
	const SITE_ORIGIN = 'https://www.convetta.com';
	let path = $derived(page.url.pathname === '/' ? '/' : `${page.url.pathname.replace(/\/$/, '')}/`);
	let canonical = $derived(SITE_ORIGIN + path);
	let alternates = $derived(
		LOCALES.map((code) => ({ code, href: SITE_ORIGIN + localizePath(path, code) }))
	);
	let ogImage = $derived(`${SITE_ORIGIN}/images/${data.locale}-og-convert-image.png`);

	// Dil rotadan geliyor; degistiginde <html lang> ve saklanan tercih guncellenir.
	$effect(() => {
		locale.sync(data.locale);
	});

	$effect(() => {
		theme.init();
	});
</script>

<svelte:head>
	<title>{locale.dict.meta.title}</title>
	<meta name="description" content={locale.dict.meta.description} />
	<link rel="canonical" href={canonical} />
	{#each alternates as alt (alt.code)}
		<link rel="alternate" hreflang={alt.code} href={alt.href} />
	{/each}
	<link rel="alternate" hreflang="x-default" href={SITE_ORIGIN + localizePath(path, 'tr')} />
	<meta property="og:title" content={locale.dict.meta.title} />
	<meta property="og:description" content={locale.dict.meta.description} />
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="Convetta" />
	<meta property="og:url" content={canonical} />
	<meta property="og:locale" content={data.locale === 'tr' ? 'tr_TR' : 'en_US'} />
	<meta property="og:image" content={ogImage} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:image" content={ogImage} />
</svelte:head>

<Header />
{@render children?.()}
<Footer />
