<script lang="ts">
	import Converter from '$components/Converter.svelte';
	import Faq from '$components/Faq.svelte';
	import { getLocale } from '$lib/state/locale.svelte';

	const locale = getLocale();

	// SSS yapisal verisi arama motorlarina zengin sonuc icin veriliyor; icerik
	// gorunur metnin birebir aynisi.
	let faqSchema = $derived(
		JSON.stringify({
			'@context': 'https://schema.org',
			'@type': 'FAQPage',
			mainEntity: locale.dict.faq.items.map((item) => ({
				'@type': 'Question',
				name: item.q,
				acceptedAnswer: { '@type': 'Answer', text: item.a }
			}))
		})
	);
</script>

<svelte:head>
	{@html `<script type="application/ld+json">${faqSchema}</script>`}
</svelte:head>

<Converter />
<Faq />
