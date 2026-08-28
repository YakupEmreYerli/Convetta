# CLAUDE.md

Bu dosya, bu depoda çalışan Claude Code'a (claude.ai/code) yön verir.

## Proje

Convetta — ücretsiz online görsel dönüştürücü ve boyutlandırıcı
([www.convetta.com](https://www.convetta.com)). SvelteKit 2 + Svelte 5 (rune'lar),
`adapter-node`, TypeScript, Tailwind. Docker imajı Dokploy üzerinde çalışıyor.

Depo bir zamanlar hem statik HTML siteyi hem de SvelteKit yeniden yazımını
barındırıyordu; **taşıma tamamlandı**. Kökteki `*.html`, `tr/`, `assets/`,
`server.cjs`, `layout/` artık yok. Eski dosyalara atıfta bulunan bir yönerge ya da
yorumla karşılaşırsan güncel karşılığını `src/` altında ara.

## Komutlar

```bash
npm run dev          # Vite gelistirme sunucusu -> http://localhost:5173
npm run build        # adapter-node -> build/
npm start            # server/index.js (build/ gerektirir) -> http://localhost:3000
npm run preview      # SvelteKit'in kendi onizleme sunucusu
npm run check        # svelte-kit sync + svelte-check
npm test             # vitest run  (10 dosya, 71 test)

npx vitest run src/lib/convert.test.ts     # tek dosya
npx vitest run -t "test adi"               # tek test

docker build -t convetta . && docker run --rm -p 8787:8787 convetta
```

`package-lock.json` bilinçli olarak `.gitignore`'da. Bu yüzden hem Dockerfile hem
CI `npm ci` değil `npm install --no-audit --no-fund` kullanıyor; birini `npm ci`'ye
çevirirsen kilit dosyası olmadığı için kırılır.

## Dönüştürme mimarisi

Dönüşüm, formatın **tarayıcıda üretilebilirliğine** göre ikiye ayrılmış:

- **Tarayıcıda (canvas):** JPG, PNG, WEBP — `src/lib/convert.ts`. Dosya cihazdan çıkmaz.
- **Sunucuda (ImageMagick):** GIF, ICO, PDF — `src/lib/server/magick.ts`,
  `POST /api/convert?format=<...>`. Gövde **ham ikili veri**, multipart değil.

`canvas.toBlob` desteklemediği bir MIME istendiğinde hata vermez, **sessizce PNG
döndürür**. `convert.ts` bu yüzden çıktının `blob.type` değerini doğrulayıp
uyuşmazsa `ConversionError('encode')` atar. Yeni bir hedef format eklerken
`src/lib/formats.ts` içindeki `CANVAS_FORMATS` / `SERVER_FORMATS` ayrımını bu
tuzağa göre koru — ayrım tam da bunun için var.

Sunucu tarafı sınırlar: 20 MB gövde, 20 sn zaman aşımı, IP başına dakikada 30
istek (`src/lib/server/rateLimit.ts`), sınırlı eşzamanlı dönüşüm yuvası. Girdi türü
**dosya adına değil ilk baytlara** bakılarak doğrulanır (`sniffImageType`), böylece
ImageMagick'e yalnızca raster görsel ulaşır — imajda Ghostscript kurulu olduğu için
PDF/PS girdisini engellemek güvenlik açısından zorunlu.

`magick` kabuktan geçmeden `spawn` ile çalıştırılır; bellek/alan/boyut limitleri ve
`-limit disk 0` sıkıştırma bombalarına karşı. ICO stdout'a yazamayan derlemeler
yüzünden `/tmp`'e yazılıp okunur ve hemen silinir.

## Kendi sunucu girdisi

Üretimde `build/index.js` değil `server/index.js` çalışıyor. Tek sebebi: **non-www →
www yönlendirmesinin, önceden üretilmiş dosyalar sunulmadan önce yapılması
gerekmesi.** adapter-node'un hazır girdisi isteği doğrudan handler'a verir ve statik
dosya handler'ın içinden, hook'lardan önce çıkar.

Aynı sebeple güvenlik başlıkları **iki yerde birden** uygulanıyor:
`server/index.js` (önceden üretilmiş sayfaları kapsar) ve `src/hooks.server.ts`
(geliştirme sunucusunu kapsar). Tek kaynak `server/security.js`; yalnızca birini
güncellemek sessiz bir boşluk bırakır. Node `writeHead` değerini `setHeader`'ın
üzerine yazdığı için başlık iki kez gönderilmez.

Traefik HTTPS'i sonlandırıp `X-Forwarded-Proto` gönderdiği için uygulama konteyner
içinde düz HTTP dinler; yönlendirmelerde şema bu başlıktan okunur.

CSP `unsafe-inline` içeriyor çünkü SvelteKit hydration verisini ve `app.html`'deki
FOUC önleyen tema betiğini satır içi çalıştırıyor; asıl koruma `default-src 'self'`
+ `object-src 'none'`.

## Yönlendirme ve i18n

- Rotalar `src/routes/[[lang=locale]]/` altında; eşleştirici `src/params/locale.ts`.
- Varsayılan dil **Türkçe** ve önek almaz: `/`, `/resizer/`. İngilizce `/en/` önekli.
- **Adres ile dil arasındaki tek dönüşüm noktası `src/lib/i18n/paths.ts`.** Kanonik
  adres, hreflang etiketleri ve dil seçici hep oradaki fonksiyonları kullanır.
- `src/lib/i18n/en.ts` sözlük **şemasını** tanımlar; `Dictionary` tipi ondan
  türetildiği için yeni bir anahtar `tr.ts` güncellenmeden derlenmez.
- Çeviri metinleri HTML olarak değil metin olarak basılıyor — `fill()` kaçışlama
  yapmaz, bu varsayımı bozma.
- Sayfalar önceden üretiliyor (`+layout.ts` içinde `prerender`); yalnızca
  `/api/convert` çalışma zamanı gerektiriyor ve `prerender = false` ile işaretli.

Yönlendirme, kanonik adres ya da yol yapısını değiştirirken `paths.ts`,
`server/canonical.js` ve `static/sitemap*.xml` arasındaki tutarlılığı koru.

## Dikkat edilecekler

**Dockerfile build sırasında ImageMagick kodlayıcılarını doğruluyor.** Eksik
kodlayıcı hata vermez, sessizce boş çıktı üretir — bu yüzden `PNG JPEG WEBP GIF ICO
PDF` kontrolü var ve biri eksikse imaj hiç üretilmez. Yeni format eklersen ilgili
`imagemagick-<format>` apk paketini ve bu listeyi güncelle. `magick.ts` ayrıca
açılışta kodlayıcıları yoklar ve eksik formatı 500 yerine açık bir 501 ile reddeder.

**Tailwind yapılandırması `tailwind.app.config.js`, PostCSS zinciri
`vite.config.ts` içinden veriliyor.** Kökte bilerek `postcss.config.js` yok. JS
içinde dinamik atanan sınıflar `safelist`'e eklenmeli.

**Durum `*.svelte.ts` dosyalarında, rune'larla tutuluyor** (`src/lib/state/`). Dil
tercihi `localStorage`'da `convetta:lang`, tema `convetta:theme` anahtarıyla; ikisi
de `localStorage` erişimi hata verdiğinde (gizli sekme, kapalı site verisi) sessizce
varsayılana düşmeli.

**Saf mantık `src/lib/` altında ve testleri yanında** (`convert.test.ts`,
`resize.test.ts`, `filename.test.ts`, ...). Davranış değiştiren bir mantık
eklediğinde testini de aynı düzende yaz.

## Dil

Kod yorumları ve dokümantasyon Türkçe yazılıyor. Bazı eski yorumlarda ASCII
karşılıklar var (`donusum`, `gorsel`); yeni yazdığın yorumlarda düzgün Türkçe
karakter kullan, eski satırları sırf bunun için düzenleme. Commit mesajları da
Türkçe ve emir kipinde.
