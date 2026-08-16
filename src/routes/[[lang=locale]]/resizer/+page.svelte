<script lang="ts">
	import Resizer from '$components/Resizer.svelte';
	import Faq from '$components/Faq.svelte';
	import { getLocale } from '$lib/state/locale.svelte';

	const locale = getLocale();
</script>

<svelte:head>
	<title>{locale.dict.resizer.metaTitle}</title>
	<meta name="description" content={locale.dict.resizer.metaDescription} />
	<meta property="og:title" content={locale.dict.resizer.metaTitle} />
	<meta property="og:description" content={locale.dict.resizer.metaDescription} />
</svelte:head>

<Resizer />
<Faq />
