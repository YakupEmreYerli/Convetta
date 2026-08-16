<script lang="ts">
	import Converter from '$components/Converter.svelte';
	import TrustStrip from '$components/TrustStrip.svelte';
	import HowTo from '$components/HowTo.svelte';
	import FormatGuide from '$components/FormatGuide.svelte';
	import FileHandling from '$components/FileHandling.svelte';
	import Faq from '$components/Faq.svelte';
	import { localizePath } from '$lib/i18n/paths';
	import { getLocale } from '$lib/state/locale.svelte';

	const locale = getLocale();

	const SITE_ORIGIN = 'https://www.convetta.com';

	// Yapisal veri tek bir @graph icinde: aracin kendisi, siteyi tanimlayan
	// kayit ve SSS. Her alanin sayfada gorunur bir karsiligi var - Google
	// gorunmeyen icerigin isaretlenmesini kabul etmiyor.
	// JSON bir script etiketinin icine basiliyor: metinlerden birinde kapanis
	// etiketi gecerse etiket erken kapanirdi, bu yuzden "<" kacisliyor.
	let schema = $derived(
		JSON.stringify({
			'@context': 'https://schema.org',
			'@graph': [
				{
					'@type': 'WebSite',
					'@id': `${SITE_ORIGIN}/#website`,
					url: SITE_ORIGIN,
					name: 'Convetta',
					inLanguage: locale.current
				},
				{
					'@type': 'WebApplication',
					'@id': `${SITE_ORIGIN}/#app`,
					name: 'Convetta',
					url: SITE_ORIGIN + localizePath('/', locale.current),
					applicationCategory: 'MultimediaApplication',
					operatingSystem: 'Any modern web browser',
					browserRequirements: 'Requires JavaScript',
					inLanguage: locale.current,
					description: locale.dict.meta.description,
					featureList: locale.dict.trust.items.map((item) => item.title),
					isPartOf: { '@id': `${SITE_ORIGIN}/#website` },
					// Ucretsiz oldugunu iddia ediyorsak fiyati da beyan etmeliyiz.
					offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
				},
				{
					'@type': 'FAQPage',
					'@id': `${SITE_ORIGIN}/#faq`,
					mainEntity: locale.dict.faq.items.map((item) => ({
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
	{@html `<script type="application/ld+json">${schema}</script>`}
</svelte:head>

<Converter />
<TrustStrip />
<HowTo />
<FormatGuide />
<FileHandling />
<Faq title={locale.dict.faq.title} items={locale.dict.faq.items} />
