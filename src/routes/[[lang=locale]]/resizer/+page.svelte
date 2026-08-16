<script lang="ts">
	import Resizer from '$components/Resizer.svelte';
	import ResizerTrust from '$components/ResizerTrust.svelte';
	import ResizeHowTo from '$components/ResizeHowTo.svelte';
	import AspectRatio from '$components/AspectRatio.svelte';
	import Dimensions from '$components/Dimensions.svelte';
	import Faq from '$components/Faq.svelte';
	import { localizePath } from '$lib/i18n/paths';
	import { getLocale } from '$lib/state/locale.svelte';

	const locale = getLocale();

	const SITE_ORIGIN = 'https://www.convetta.com';

	// Sorular bu sayfaya ozel: dönüştürücünün SSS'si burada gorunmemeli, cunku
	// ziyaretci format degil olcu degistirmeye geldi.
	let schema = $derived(
		JSON.stringify({
			'@context': 'https://schema.org',
			'@graph': [
				{
					'@type': 'WebApplication',
					'@id': `${SITE_ORIGIN}/#resizer`,
					name: 'Convetta Image Resizer',
					url: SITE_ORIGIN + localizePath('/resizer', locale.current),
					applicationCategory: 'MultimediaApplication',
					operatingSystem: 'Any modern web browser',
					browserRequirements: 'Requires JavaScript',
					inLanguage: locale.current,
					description: locale.dict.resizer.metaDescription,
					featureList: locale.dict.resizer.trust.map((item) => item.title),
					isPartOf: { '@id': `${SITE_ORIGIN}/#website` },
					offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
				},
				{
					'@type': 'FAQPage',
					'@id': `${SITE_ORIGIN}/#resizer-faq`,
					mainEntity: locale.dict.resizer.faq.items.map((item) => ({
						'@type': 'Question',
						name: item.q,
						acceptedAnswer: { '@type': 'Answer', text: item.a }
					}))
				}
			]
		}).replace(/</g, '\\u003c')
	);
</script>

<svelte:head>
	<title>{locale.dict.resizer.metaTitle}</title>
	<meta name="description" content={locale.dict.resizer.metaDescription} />
	<meta property="og:title" content={locale.dict.resizer.metaTitle} />
	<meta property="og:description" content={locale.dict.resizer.metaDescription} />
	{@html `<script type="application/ld+json">${schema}</script>`}
</svelte:head>

<Resizer />
<ResizerTrust />
<ResizeHowTo />
<AspectRatio />
<Dimensions />
<Faq title={locale.dict.resizer.faq.title} items={locale.dict.resizer.faq.items} />
