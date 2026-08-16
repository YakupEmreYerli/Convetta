import type { Dictionary } from './en';

export const tr: Dictionary = {
	meta: {
		title: 'Convetta — Ücretsiz Çevrimiçi Görsel Dönüştürücü',
		description:
			'JPG, PNG ve WEBP görsellerini doğrudan tarayıcınızda dönüştürün. Yükleme yok, kayıt yok, tamamen ücretsiz.'
	},
	nav: {
		home: 'Ana sayfa',
		converter: 'Dönüştürücü',
		resizer: 'Boyutlandırıcı',
		themeToggle: 'Açık ve koyu tema arasında geçiş yap',
		language: 'Dil'
	},
	hero: {
		title: 'Görsellerinizi Anında Dönüştürün',
		subtitle: 'JPG, PNG, WEBP ve GIF dosyalarını saniyeler içinde dönüştürün.'
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
		zip: 'ZIP dosyası oluşturulamadı.',
		clipboard: 'Yapıştırılan içerik bir görsel değil. Bir görsel kopyalayıp tekrar deneyin.'
	},
	resizer: {
		metaTitle: 'Convetta — Ücretsiz Çevrimiçi Görsel Boyutlandırıcı',
		metaDescription:
			'JPG, PNG ve WEBP görsellerini tarayıcınızda yeniden boyutlandırın. En-boy oranını koruyun, toplu boyutlandırın, ZIP olarak indirin.',
		title: 'Görsellerinizi Yeniden Boyutlandırın',
		subtitle: 'Görsel ölçülerini saniyeler içinde ayarlayın.',
		resultsSubtitle: 'Boyutlandırdığınız dosyaları buradan indirin.',
		width: 'Genişlik (px)',
		height: 'Yükseklik (px)',
		lockRatio: 'En-boy oranını koru',
		resize: 'Yeniden Boyutlandır',
		resizing: 'Boyutlandırılıyor…',
		results: 'Boyutlandırılan Görseller',
		invalidSize: 'Genişlik ve yüksekliği 1 ile 10000 piksel arasında girin.'
	},
	privacy: {
		metaTitle: 'Gizlilik Politikası — Convetta',
		metaDescription: 'Convetta görsellerinizi ve verilerinizi nasıl işliyor?',
		title: 'Gizlilik Politikası',
		updated: 'Son güncelleme: {date}',
		sections: [
			{
				heading: 'Görselleriniz',
				body: 'JPEG, PNG ve WEBP dönüşümleri ile tüm boyutlandırma işlemleri tamamen tarayıcınızın içinde gerçekleşir. Bu dosyalar hiçbir zaman yüklenmez, saklanmaz ve bizim tarafımızdan görülmez. GIF, ICO ve PDF dönüşümleri için tarayıcıda kodlayıcı yoktur: dosya şifreli bağlantı üzerinden sunucumuza gider, bellekte dönüştürülür, size geri döner ve atılır. Hiçbir veri tabanına ya da kalıcı diske yazılmaz.'
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
	faq: {
		title: 'Sıkça Sorulan Sorular',
		items: [
			{
				q: 'Verilerim güvende mi? Dosyalarım bir sunucuya yükleniyor mu?',
				a: "Gizliliğiniz önceliğimizdir. PNG'den JPG'ye gibi çoğu dönüştürme işlemi doğrudan tarayıcınızda gerçekleşir. Tarayıcının üretemediği formatlar (GIF, ICO, PDF) için dosyanız sunucumuzda işlenir ve dönüştürmeden hemen sonra kalıcı olarak silinir. Dosyalarınızı asla saklamaz veya paylaşmayız."
			},
			{
				q: 'Hangi resim formatları destekleniyor?',
				a: 'Çevrimiçi resim dönüştürücümüz, JPG, PNG, GIF ve WEBP dahil olmak üzere en popüler formatları desteklemektedir. Dosyalarınızı bu formatlardan herhangi birine veya bu formatlardan dönüştürebilirsiniz.'
			},
			{
				q: 'Bu online resim dönüştürücü tamamen ücretsiz mi?',
				a: 'Evet, Convetta tamamen ücretsiz bir çevrimiçi araçtır. Resimlerinizi dönüştürmek için herhangi bir gizli ücret, abonelik veya kullanım limiti yoktur.'
			},
			{
				q: 'Aynı anda birden fazla resmi dönüştürebilir miyim?',
				a: 'Kesinlikle! Aynı anda birden fazla resim seçip dönüştürebilirsiniz. Bu toplu dönüştürme özelliği, resimlerinizi hızlı ve verimli bir şekilde işlemenizi sağlar.'
			},
			{
				q: 'Dönüştürme sonrası resimlerimin kalitesi düşer mi?',
				a: 'Mümkün olan en yüksek kaliteyi sağlamak için gelişmiş algoritmalar kullanıyoruz. JPG gibi bazı formatlar doğası gereği kayıplı olsa da, kalite düşüşünü en aza indiriyoruz. PNG gibi formatlarda ise dönüştürme kayıpsızdır ve orijinal kaliteyi korur.'
			},
			{
				q: 'Dönüştürebileceğim maksimum dosya boyutu nedir?',
				a: 'Tüm kullanıcılar için hızlı performans sağlamak amacıyla, yüklemeler için makul bir dosya boyutu limiti olabilir. Web kullanımı için tasarlanan çoğu resim bu limitin oldukça altındadır.'
			},
			{
				q: 'Herhangi bir yazılım veya uygulama yüklemem gerekiyor mu?',
				a: 'Hayır, hiçbir şey yüklemenize gerek yok. Convetta tamamen web tarayıcınızda çalışır. Bu, işlemi hızlı, güvenli ve her cihazdan erişilebilir kılar.'
			},
			{
				q: 'WEBP formatı nedir ve avantajları nelerdir?',
				a: "WEBP, Google tarafından geliştirilen ve web'deki resimler için üstün kayıpsız ve kayıplı sıkıştırma sağlayan modern bir resim formatıdır. WEBP resimleri, JPG ve PNG'lerden önemli ölçüde daha küçüktür, bu da web sitelerinin daha hızlı yüklenmesini sağlar."
			},
			{
				q: 'Dönüştürülen tüm dosyalarımı birlikte nasıl indirebilirim?',
				a: "Dönüştürme işlemi tamamlandıktan sonra 'Tümünü ZIP Olarak İndir' butonu sunuyoruz. Bu butona tıklamak, dönüştürülen tüm resimlerinizi kolay indirme için tek bir ZIP dosyasında sıkıştıracaktır."
			},
			{
				q: 'Dönüştürücü mobil telefon ve tabletlerde çalışıyor mu?',
				a: 'Evet, resim dönüştürücümüz tamamen duyarlıdır ve akıllı telefonlar, tabletler ve masaüstü bilgisayarlar dahil olmak üzere tüm modern cihazlarda sorunsuz çalışacak şekilde tasarlanmıştır.'
			},
			{
				q: 'Neden masaüstü yazılım yerine online dönüştürücü kullanmalıyım?',
				a: 'Çevrimiçi dönüştürücüler büyük kolaylık sunar. Kurulum veya güncelleme gerektirmezler, onlara her yerden erişebilirsiniz ve bilgisayarınızın kaynaklarını tüketmezler. Hızlı ve kolay dönüştürme görevleri için mükemmeldirler.'
			},
			{
				q: 'Dönüştürme sırasında gizliliğim nasıl korunuyor?',
				a: 'Gizliliğiniz her şeyden önemlidir. Çoğu dönüştürme işlemi istemci tarafında (tarayıcınızda) gerçekleştiği için dosyalarınız bilgisayarınızdan bile ayrılmaz. Sunucu taraflı dönüşümler için ise dosyalar işlemden sonra anında silinir. Resimlerinizi kaydetmiyor, saklamıyor veya görüntülemiyoruz.'
			}
		]
	},
	footer: {
		rights: '© {year} Convetta. Tüm hakları saklıdır.',
		support: 'Yardım mı gerekiyor?',
		privacy: 'Gizlilik Politikası'
	}
};
