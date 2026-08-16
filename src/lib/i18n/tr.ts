import type { Dictionary } from './en';

export const tr: Dictionary = {
	meta: {
		title: 'Ücretsiz Çevrimiçi Görsel Dönüştürücü — JPG, PNG, WEBP ve GIF | Convetta',
		description:
			'JPG, PNG, WEBP ve GIF görsellerini çevrimiçi ve ücretsiz dönüştürün. Birden çok dosyayı tek seferde dönüştürüp ZIP olarak indirin. JPG, PNG ve WEBP tarayıcınızdan hiç çıkmaz.'
	},
	nav: {
		home: 'Ana sayfa',
		converter: 'Dönüştürücü',
		resizer: 'Boyutlandırıcı',
		themeToggle: 'Açık ve koyu tema arasında geçiş yap',
		language: 'Dil'
	},
	hero: {
		title: 'Ücretsiz Çevrimiçi Görsel Dönüştürücü',
		subtitle: 'JPG, PNG, WEBP ve GIF dosyalarını saniyeler içinde dönüştürün. Kayıt yok, kurulum yok.'
	},
	drop: {
		label: 'Dönüştürülecek görselleri seçin',
		title: 'Dosyaları buraya sürükleyip bırakın veya',
		browse: 'göz atmak için tıklayın',
		paste: 'veya panodan yapıştırın',
		hint: 'Dosya başına en fazla 20 MB; JPG, PNG, WEBP ve GIF',
		pasted: 'Panodan {count} görsel eklendi.'
	},
	files: {
		heading: 'Seçilen Dosyalar:',
		remove: '{name} dosyasını kaldır',
		clear: 'Tümünü kaldır',
		count: '{count} dosya seçildi',
		preview: '{name} önizlemesi'
	},
	options: {
		format: 'Hedef Formatı Seçin:',
		quality: 'Kalite',
		qualityHint: 'JPEG ve WEBP çıktısı için geçerlidir.',
		inBrowser: 'Tarayıcınızda dönüştürülür',
		onServer: 'Sunucumuzda işlenir',
		serverNote:
			'GIF, ICO ve PDF için tarayıcıda kodlayıcı yok; bu dosyalar sunucumuzda dönüştürülür ve hemen ardından silinir.'
	},
	actions: {
		convert: 'Dönüştür',
		converting: 'Dönüştürülüyor…',
		downloadAll: 'Tümünü ZIP Olarak İndir',
		downloadSeparate: 'Ayrı Dosyalar Olarak İndir',
		zipping: 'ZIP hazırlanıyor…',
		download: 'İndir',
		downloadFile: '{name} dosyasını indir'
	},
	results: {
		title: 'Dönüştürülen Görseller',
		subtitle: 'Dönüştürdüğünüz dosyaları buradan indirin.',
		empty: 'Dönüştürdüğünüz dosyalar burada görünecek.',
		progress: '{total} dosyadan {done} tanesi dönüştürüldü…',
		done: '{count} dosya başarıyla dönüştürüldü.',
		failed: '{count} dosya dönüştürülemedi.'
	},
	errors: {
		noFiles: 'Lütfen önce en az bir dosya seçin.',
		notImage: 'Bu dosya bir görsel değil.',
		unsupported: 'Bu görsel türü desteklenmiyor.',
		tooLarge: 'Dosya çok büyük (en fazla 20 MB).',
		decode: 'Görsel okunamadı. Dosya bozuk olabilir.',
		encode: 'Tarayıcınız bu formatı üretemiyor.',
		server: 'Sunucu tarafındaki dönüşüm başarısız oldu. Lütfen tekrar deneyin.',
		unavailable: 'Sunucu şu anda yoğun. Biraz bekleyip tekrar deneyin.',
		zip: 'ZIP dosyası oluşturulamadı.',
		clipboard: 'Yapıştırılan içerik bir görsel değil. Bir görsel kopyalayıp tekrar deneyin.'
	},
	resizer: {
		metaTitle: 'Ücretsiz Çevrimiçi Görsel Boyutlandırıcı — JPG, PNG ve WEBP | Convetta',
		metaDescription:
			'JPG, PNG ve WEBP görsellerini çevrimiçi ve ücretsiz boyutlandırın. Genişlik ve yüksekliği piksel olarak girin, en-boy oranını kilitli tutarak görselin ezilmesini önleyin, tamamını tek seferde boyutlandırın — hepsi tarayıcınızın içinde.',
		title: 'Ücretsiz Çevrimiçi Görsel Boyutlandırıcı',
		subtitle: 'Yeni genişlik ve yüksekliği piksel olarak girin. Hiçbir dosya yüklenmez; işlem tarayıcınızda yapılır.',
		resultsSubtitle: 'Boyutlandırdığınız dosyaları buradan indirin.',
		width: 'Genişlik (px)',
		height: 'Yükseklik (px)',
		lockRatio: 'En-boy oranını koru',
		lockRatioOn: 'En-boy oranı kilitli — diğer kenar kendiliğinden hesaplanır.',
		lockRatioOff: 'Kilit açık — iki kenarı serbestçe girmek görseli ezebilir.',
		originalSize: 'Orijinal: {width} × {height} px',
		resize: 'Yeniden Boyutlandır',
		resizing: 'Boyutlandırılıyor…',
		results: 'Boyutlandırılan Görseller',
		invalidSize: 'Genişlik ve yüksekliği 1 ile 10000 piksel arasında girin.',
		trust: [
			{
				title: 'Hiçbir dosya yüklenmez',
				body: 'Boyutlandırmayı kendi tarayıcınız yapar. Görselleriniz bize hiç gönderilmez, dolayısıyla saklayacağımız bir şey de olmaz.'
			},
			{
				title: 'Oranlar korunur',
				body: 'En-boy oranı varsayılan olarak kilitlidir ve ilk görselinizden okunur; bir kenarı yazdığınızda diğeri kendiliğinden dolar.'
			},
			{
				title: 'Toplu iş tek seferde',
				body: 'İstediğiniz kadar görseli aynı ölçüye getirin ve tümünü tek bir ZIP olarak indirin.'
			}
		],
		how: {
			title: 'Bir görseli nasıl boyutlandırırsınız?',
			steps: [
				{
					title: 'Görselinizi ekleyin',
					body: 'Bırakma alanına sürükleyin, göz atarak seçin ya da panodan yapıştırın. Dosya başına en fazla 20 MB.'
				},
				{
					title: 'Yeni ölçüleri girin',
					body: 'Genişliği piksel olarak yazın. Kilit açıkken yükseklik, orijinal orandan sizin için hesaplanır.'
				},
				{
					title: 'Boyutlandırın ve indirin',
					body: 'Sonucu kaydedin ya da tamamını tek bir ZIP olarak alın. Yeni ölçüler dosya adına eklenir.'
				}
			]
		},
		aspect: {
			title: '“En-boy oranını koru” ne demek?',
			body: 'En-boy oranı, bir görselin genişliği ile yüksekliği arasındaki ilişkidir. Boyutlandırırken bu oranı kilitli tutmak, görselin esneyip ezilmesini önleyen şeydir: 1920 × 1080 bir görsel 16:9’dur, 1280 × 720 de aynı 16:9’dur — bu yüzden küçültüldüğünde hâlâ doğru görünür. Convetta oranı eklediğiniz ilk görselden okur ve siz kilidi açmadıkça korur.',
			exampleTitle: 'Farklı ölçüler, aynı oran',
			columns: {
				original: 'Orijinal',
				resized: 'Yeni ölçü',
				ratio: 'En-boy oranı',
				use: 'Tipik kullanım'
			},
			rows: [
				{ original: '1920 × 1080', resized: '1280 × 720', ratio: '16:9', use: 'Geniş ekran fotoğraf ve video kareleri' },
				{ original: '1200 × 1200', resized: '600 × 600', ratio: '1:1', use: 'Kare profil ve ürün görselleri' },
				{ original: '1080 × 1350', resized: '720 × 900', ratio: '4:5', use: 'Dikey sosyal medya paylaşımları' },
				{ original: '3000 × 2000', resized: '1500 × 1000', ratio: '3:2', use: 'Doğrudan fotoğraf makinesinden gelen görseller' }
			]
		},
		dimensions: {
			title: 'Görsel ölçüleri aslında nedir?',
			body: 'Ölçüler, bir görselin kaç piksel geniş ve kaç piksel yüksek olduğunu anlatır. 1920 × 1080 bir görsel yatayda 1920, dikeyde 1080 piksel demektir. Ölçüyü değiştirmek görselin taşıdığı detay miktarını değiştirir; dosya formatını değiştirmez ve dosyayı sıkıştırmakla aynı şey değildir.',
			sections: [
				{
					heading: 'Boyutlandırmak dönüştürmek değildir',
					body: 'Boyutlandırma piksel ölçülerini değiştirir. Dönüştürme ise dosya formatını değiştirir; örneğin PNG’den JPG’ye ya da JPG’den WEBP’ye. Convetta boyutlandırırken formatı korur: JPG yine JPG, WEBP yine WEBP olarak döner. Bunların dışındaki dosyalar, süreçte kalite kaybı olmasın diye PNG olarak kaydedilir.'
				},
				{
					heading: 'Boyutlandırmak sıkıştırmak değildir',
					body: 'Sıkıştırma, genişlik ve yüksekliğe dokunmadan dosyanın KB ya da MB cinsinden boyutunu küçültür. Boyutlandırma ise genişlik ve yüksekliği küçültür; dosya boyutunun küçülmesi bunun yan etkisidir. Görsel piksel olarak çok büyükse boyutlandırın. Ölçüler doğru ama dosya hâlâ ağırsa, bu bir sıkıştırma meselesidir.'
				}
			],
			convertLink: 'Farklı bir dosya formatı mı lazım? Görsel dönüştürücüyü kullanın'
		},
		faq: {
			title: 'Sıkça Sorulan Sorular',
			items: [
				{
					q: 'Boyutlandırırken görsellerim yükleniyor mu?',
					a: 'Hayır. Boyutlandırmayı tamamen kendi tarayıcınız Canvas API ile yapar; görsel cihazınızdan hiç çıkmaz. Ortada bir yükleme adımı yoktur, zaten bu yüzden zayıf bağlantıda da çalışmayı sürdürür.'
				},
				{
					q: 'Boyutlandırma kaliteyi düşürür mü?',
					a: 'Görseli küçültmek genelde sorunsuzdur; çünkü orijinalin sahip olduğundan daha az piksel istersiniz ve Convetta küçültürken yüksek kaliteli yumuşatma kullanır. Görseli orijinalinden büyütmek ise başka bir konudur: boyutlandırma, hiç kaydedilmemiş bir detayı var edemez, bu yüzden büyütülen görseller yumuşak görünme eğilimindedir.'
				},
				{
					q: 'Görseli ezmeden nasıl boyutlandırırım?',
					a: 'En-boy oranı kilidini açık bırakın; Convetta zaten öyle başlar. İstediğiniz genişliği yazın, yükseklik orijinal orandan hesaplansın. Kilidi yalnızca bilerek orijinalden farklı bir şekil istediğinizde kapatın.'
				},
				{
					q: 'Aynı anda birden fazla görsel boyutlandırabilir miyim?',
					a: 'Evet. Seçtiğiniz bütün görseller tek geçişte aynı genişlik ve yüksekliğe getirilir; sonuçları tek tek ya da tek bir ZIP olarak indirebilirsiniz. En-boy oranı kilidi eklediğiniz ilk görseli izlediği için, farklı oranlardan oluşan bir grubu kilidi kapatarak boyutlandırmak daha doğru olur.'
				},
				{
					q: 'Hangi formatları boyutlandırabilirim?',
					a: 'JPG, PNG, WEBP, GIF, BMP ve AVIF; her biri en fazla 20 MB. JPG ve WEBP dosyaları aynı formatta geri döner, diğerleri PNG olarak verilir.'
				},
				{
					q: 'Tam piksel ölçüsü verebilir miyim?',
					a: 'Evet. Genişlik ve yükseklik piksel olarak girilir; 1 ile 10000 arasındaki her tam sayı kabul edilir. İhtiyacınız olan ölçünün oranı orijinalden farklıysa önce kilidi kapatın.'
				},
				{
					q: 'Boyutlandırmakla sıkıştırmak arasındaki fark ne?',
					a: 'Boyutlandırma piksel ölçülerini değiştirir; örneğin 1920 × 1080’i 1280 × 720’ye indirir. Sıkıştırma ise bu ölçüleri koruyarak dosyanın KB veya MB cinsinden boyutunu azaltır. Bir görseli küçültmek çoğunlukla dosya boyutunu da düşürür ama bu ikisi aynı işlem değildir.'
				}
			]
		}
	},
	privacy: {
		metaTitle: 'Gizlilik Politikası — Convetta',
		metaDescription: 'Convetta görsellerinizi ve verilerinizi nasıl işliyor?',
		title: 'Gizlilik Politikası',
		updated: 'Son güncelleme: {date}',
		sections: [
			{
				heading: 'Görselleriniz',
				body: 'JPEG, PNG ve WEBP dönüşümleri ile tüm boyutlandırma işlemleri tamamen tarayıcınızın içinde gerçekleşir. Bu dosyalar hiçbir zaman yüklenmez, saklanmaz ve bizim tarafımızdan görülmez. GIF, ICO ve PDF dönüşümleri için tarayıcıda kodlayıcı yoktur: dosya şifreli bağlantı üzerinden sunucumuza gider, bellekte dönüştürülür, size geri döner ve atılır. GIF ve PDF doğrudan dönüştürücünün içinden akar, diske hiç dokunmaz. Tek istisna ICO’dur; o kodlayıcı akışa yazamadığı için sonuç geçici bir dosyaya yazılır ve indirmeniz gönderilir gönderilmez silinir. Hiçbir veri tabanına yazılmaz, istekten sonra hiçbir şey saklanmaz.'
			},
			{
				heading: 'Topladığımız veriler',
				body: 'Hesap açmanızı istemiyoruz; takip veya reklam çerezi kullanmıyoruz. Dil ve tema tercihiniz localStorage ile tarayıcınızda saklanır ve cihazınızdan çıkmaz. Sunucumuz güvenlik ve hız sınırlaması için kısa ömürlü istek kayıtları (IP adresi, zaman, istenen yol) tutar.'
			},
			{
				heading: 'Üçüncü taraflar',
				body: 'Convetta hiçbir üçüncü taraf betiği, yazı tipi veya analiz aracı yüklemez. Sayfanın ihtiyaç duyduğu her şey kendi alan adımızdan sunulur.'
			},
			{
				heading: 'İletişim',
				body: 'Bu politikayla ilgili her soru için support@convetta.com adresine yazabilirsiniz.'
			}
		]
	},
	notFound: {
		title: 'Sayfa bulunamadı',
		body: 'Aradığınız sayfa mevcut değil ya da taşınmış.',
		home: 'Dönüştürücüye dön'
	},
	trust: {
		title: 'Neden Convetta?',
		items: [
			{
				title: 'Tasarımı gereği gizli',
				body: 'JPG, PNG ve WEBP dönüşümleri tarayıcınızın içinde çalışır. Bu dosyalar hiç yüklenmediği için bizim saklayacağımız bir şey de olmaz.'
			},
			{
				title: 'Toplu işe göre yapılmış',
				body: 'İstediğiniz kadar görsel ekleyin, hepsini tek seferde dönüştürün ve tümünü tek bir ZIP olarak indirin.'
			},
			{
				title: 'Hesap yok, kurulum yok',
				body: 'Kullanımı ücretsiz; kayıt olmanız ya da bir şey indirmeniz gerekmez. Modern her masaüstü ve mobil tarayıcıda çalışır.'
			}
		]
	},
	how: {
		title: 'Bir görseli nasıl dönüştürürsünüz?',
		steps: [
			{
				title: 'Görsellerinizi ekleyin',
				body: 'Dosyaları bırakma alanına sürükleyin, göz atarak seçin ya da doğrudan panodan yapıştırın. Dosya başına en fazla 20 MB.'
			},
			{
				title: 'Hedef formatı seçin',
				body: 'JPG, PNG, WEBP, GIF, ICO veya PDF seçin. Her seçeneğin yanında tarayıcınızda mı yoksa sunucumuzda mı üretildiği yazar.'
			},
			{
				title: 'Dönüştürün',
				body: 'Seçtiğiniz bütün dosyalar tek geçişte dönüştürülür ve en-boy oranı her zaman korunur.'
			},
			{
				title: 'İndirin',
				body: 'Dosyaları tek tek kaydedin ya da tamamını tek bir ZIP olarak alın.'
			}
		]
	},
	guide: {
		title: 'Doğru görsel formatını seçin',
		intro:
			'Hedef format aslında tek bir soruya bağlı: saydamlığa mı, animasyona mı, yoksa mümkün olan en küçük dosyaya mı ihtiyacınız var? Convetta’nın ürettiği her format size şunu verir.',
		columns: {
			format: 'Format',
			bestFor: 'Ne için uygun?',
			transparency: 'Saydamlık',
			compression: 'Sıkıştırma',
			where: 'Nerede dönüşür?'
		},
		inBrowser: 'Tarayıcınızda',
		onServer: 'Sunucumuzda',
		rows: [
			{
				format: 'JPG',
				bestFor: 'Fotoğraflar ve fotoğraf ağırlıklı sayfalar',
				transparency: 'Yok — saydam alanlar beyaza döner',
				compression: 'Kayıplı'
			},
			{
				format: 'PNG',
				bestFor: 'Ekran görüntüleri, logolar, çizgiler, keskin kenarlar',
				transparency: 'Var, yumuşak geçişlerle',
				compression: 'Kayıpsız'
			},
			{
				format: 'WEBP',
				bestFor: 'Aynı kalitede daha küçük dosya isteyen siteler',
				transparency: 'Var, yumuşak geçişlerle',
				compression: 'Kayıplı'
			},
			{
				format: 'GIF',
				bestFor: 'Az renkli, çok basit grafikler',
				transparency: 'Yalnızca tam saydam ya da tam opak',
				compression: 'Kayıpsız, en fazla 256 renk'
			},
			{
				format: 'ICO',
				bestFor: 'Favicon ve Windows uygulama simgeleri',
				transparency: 'Var',
				compression: 'Kayıpsız, 256 piksele küçültülür'
			},
			{
				format: 'PDF',
				bestFor: 'Görseli belge olarak iletmek',
				transparency: 'Düzleştirilir',
				compression: 'Görsel olduğu gibi gömülür'
			}
		],
		note: 'Convetta hareketsiz görsel üretir. Hareketli bir GIF’i JPG, PNG veya WEBP’ye dönüştürdüğünüzde ilk kare alınır.',
		resizeLink: 'Yalnızca ölçüyü mü değiştirmek istiyorsunuz? Görsel boyutlandırıcıyı kullanın'
	},
	processing: {
		title: 'Convetta dosyalarınızı nasıl işliyor?',
		sections: [
			{
				heading: 'Tarayıcınızda — JPG, PNG, WEBP',
				body: 'Görseli tarayıcınız çözer ve Canvas API ile yeniden kodlar. Dosya hiçbir yere gönderilmez; bu yüzden yavaş bağlantıda da çalışmaya devam eder. Tüm boyutlandırma işlemleri de aynı şekilde yürür.'
			},
			{
				heading: 'Sunucumuzda — GIF, ICO, PDF',
				body: 'Bu üç formatı hiçbir tarayıcı kodlayamaz; bu yüzden görsel şifreli bağlantı üzerinden sunucumuza gider ve ImageMagick ile dönüştürülür. GIF ve PDF doğrudan dönüştürücünün içinden akar, diske hiç dokunmaz. Tek istisna ICO: o kodlayıcı akışa yazamadığı için sonuç geçici bir dosyaya yazılır ve indirmeniz gönderilir gönderilmez silinir. Hiçbir veri tabanına yazılmaz, elimizde kopyası kalmaz.'
			},
			{
				heading: 'Gerçekten uyguladığımız sınırlar',
				body: 'Dosya başına 20 MB; bu sınır daha hiçbir şey gönderilmeden tarayıcınızda denetlenir. Sunucu tarafındaki dönüşümler 20 saniyede kesilir, IP başına dakikada 30 istekle sınırlanır ve gelen verinin gerçekten görsel olduğu bayt düzeyinde doğrulanır.'
			},
			{
				heading: 'Yapmadıklarımız',
				body: 'Hesap yok; takip ya da reklam çerezi yok; üçüncü taraf betiği, yazı tipi veya analiz aracı yok. Dil ve tema tercihiniz kendi tarayıcınızda kalır.'
			}
		],
		privacyLink: 'Gizlilik politikasının tamamını okuyun'
	},
	faq: {
		title: 'Sıkça Sorulan Sorular',
		items: [
			{
				q: 'Dosyalarım bir sunucuya yükleniyor mu?',
				a: 'Hedef formata bağlı. JPG, PNG ve WEBP’yi kendi tarayıcınız kodlar; bu dosyalar cihazınızdan hiç çıkmaz. GIF, ICO ve PDF için tarayıcıda kodlayıcı yoktur: görsel şifreli bağlantı üzerinden sunucumuza gider, bellekte dönüştürülür, size döner ve atılır. Kopyasını saklamayız, hiçbir veri tabanına yazmayız.'
			},
			{
				q: 'En büyük dosya boyutu nedir?',
				a: 'Görsel başına 20 MB. Bu sınır daha hiçbir şey yüklenmeden tarayıcınızda denetlenir; böylece büyük dosya yarı yolda hata vermek yerine en baştan reddedilir. Kaç görsel dönüştürdüğünüz sınırlı değildir.'
			},
			{
				q: 'Hangi formatlar arasında dönüştürebilirim?',
				a: 'JPG, PNG, WEBP, GIF, BMP ve AVIF dosyaları yükleyebilir; bunları JPG, PNG, WEBP, GIF, ICO veya PDF’ye dönüştürebilirsiniz.'
			},
			{
				q: 'PNG’yi JPG’ye çevirince saydamlık kaybolur mu?',
				a: 'Evet. JPG’de saydamlık kanalı yoktur; bu yüzden kodlamadan önce saydam alanlar beyazla doldurulur. Saydamlığı korumanız gerekiyorsa PNG veya WEBP’ye dönüştürün.'
			},
			{
				q: 'Dönüştürme kaliteyi düşürür mü?',
				a: 'PNG kayıpsızdır: pikseller girdiği gibi çıkar. JPG ve WEBP ise tanımı gereği kayıplıdır, bir miktar veri atılır — Convetta bu formatları 92 kalitesiyle kodlar, yani normal görüntüleme boyutunda farkı ayırt etmek zordur. Aynı dosyayı kayıplı formatlar arasında tekrar tekrar çevirirseniz her seferinde biraz daha bozulur.'
			},
			{
				q: 'Aynı anda birden fazla görsel dönüştürebilir miyim?',
				a: 'Evet. İstediğiniz kadar görsel seçin ya da sürükleyin; hepsi tek geçişte dönüştürülür. Hazır olduklarında tek tek ya da tek bir ZIP olarak indirebilirsiniz.'
			},
			{
				q: 'Convetta ücretsiz mi?',
				a: 'Evet, üstelik hesap açmanız da gerekmiyor. Tek sınırlar teknik olanlar: dosya başına 20 MB ve sunucu tarafındaki dönüşümlerde, tek bir ziyaretçi sırayı kapatmasın diye uygulanan hız sınırı.'
			},
			{
				q: 'Telefon ve tablette çalışıyor mu?',
				a: 'Evet. Dönüştürücü modern her mobil tarayıcıda çalışır. Çok büyük görsellerde sınırı Convetta değil, telefonunuzun tarayıcıya ayırabildiği bellek belirler.'
			}
		]
	},
	footer: {
		rights: '© {year} Convetta. Tüm hakları saklıdır.',
		support: 'Yardım mı gerekiyor?',
		privacy: 'Gizlilik Politikası'
	}
};
