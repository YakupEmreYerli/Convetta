# Katkı Rehberi

Convetta'ya katkıda bulunmak istediğin için teşekkürler. Bu dosya, bir değişikliğin
kabul edilebilmesi için nelerin gerektiğini kısaca anlatır.

## Ortamı kurmak

Gereksinim: **Node ≥ 20**.

```bash
npm install
npm run dev          # http://localhost:5173
```

GIF, ICO ve PDF dönüşümleri sunucuda **ImageMagick** ile yapılır. `magick` komutu
sistemde yoksa bu üç format `501` döner; geri kalan her şey (JPG, PNG, WEBP,
boyutlandırıcı, arayüz) sorunsuz çalışır. Bu üçünü de yerelde denemek istersen:

```bash
# Arch / CachyOS
sudo pacman -S imagemagick ghostscript
# Debian / Ubuntu
sudo apt install imagemagick ghostscript
```

Ya da doğrudan konteyneri kullan: `docker build -t convetta . && docker run --rm -p 8787:8787 convetta`

## Değişiklik göndermeden önce

```bash
npm run check    # svelte-check — 0 hata olmalı
npm test         # vitest
```

İkisi de yeşil olmalı; CI zaten aynı komutları Node 20 ve 22 üzerinde çalıştırıyor.

## Yazım kuralları

- **Dil:** kod yorumları ve dokümantasyon **Türkçe** yazılır. Yeni yorumlarda düzgün
  Türkçe karakter kullan (`dönüşüm`, `görsel`); eski satırlardaki ASCII karşılıkları
  sırf bunun için düzenleme.
- **Biçim:** sekme ile girinti, tek tırnak — mevcut dosyaların düzenini takip et.
- **Yorumlar** *ne* yaptığını değil *neden* öyle yapıldığını anlatsın. Bu depodaki
  yorumların çoğu bir tuzağı kayda geçiriyor; aynı çizgide kal.
- **Commit mesajları** Türkçe ve emir kipinde: `Tema algılamasını localStorage
  hatasından bağımsızlaştır`.

## Bilmen gereken tuzaklar

**Sessiz PNG.** `canvas.toBlob`, desteklemediği bir MIME için hata vermez —
sessizce PNG döndürür. Bu yüzden `src/lib/convert.ts` çıktının `blob.type`
değerini doğrular. Yeni bir tarayıcı formatı eklerken bu doğrulamayı atlama.

**Format ayrımı.** `src/lib/formats.ts` içindeki `CANVAS_FORMATS` /
`SERVER_FORMATS` ayrımı, formatın tarayıcıda üretilebilirliğine dayanır. Bir format
buraya yanlış tarafa yazılırsa ya sessizce PNG üretir ya da gereksiz yere sunucuya
iner.

**Sunucu formatı eklemek.** Yeni bir sunucu formatı üç yeri birden ilgilendirir:
`src/lib/formats.ts`, `src/lib/server/magick.ts` ve `Dockerfile` içindeki
kodlayıcı doğrulama listesi (`PNG JPEG WEBP GIF ICO PDF`). Alpine bazı kodlayıcıları
`imagemagick-<format>` alt paketlerine ayırır; onu da eklemen gerekir. Eksik bir
kodlayıcı hata vermez, **boş çıktı** üretir — doğrulama listesi tam da bunun için var.

**Çeviriler.** `src/lib/i18n/en.ts` sözlük şemasını tanımlar; `tr.ts` ondan
türetildiği için yeni bir anahtar eklediğinde Türkçesi yazılmadan derleme geçmez.
Çeviri metinleri HTML olarak değil metin olarak basılır — `fill()` kaçışlama
yapmaz, bu varsayımı bozma.

**Güvenlik başlıkları.** Tek kaynak `server/security.js`. Başlıklar iki yerde
uygulanır (sunucu girdisi ve SvelteKit hook'u) çünkü önceden üretilmiş sayfalar
hook'a hiç uğramaz. Yalnızca birini güncellemek sessiz bir boşluk bırakır.

**Adresler ve SEO.** Yönlendirme, kanonik adres ya da yol yapısını değiştirirken
`src/lib/i18n/paths.ts`, `server/canonical.js` ve `static/sitemap*.xml` arasındaki
tutarlılığı koru.

## Pull request

- Tek bir konuya odaklan; ilgisiz düzeltmeleri ayrı PR'a al.
- Arayüzü etkileyen değişikliklerde ekran görüntüsü ekle (açık ve koyu tema).
- Davranış değiştiren mantık için test yaz — saf mantık `src/lib/` altında
  ve testleri yanına konuluyor (`convert.test.ts` gibi).
- Büyük bir değişiklik düşünüyorsan önce issue aç; boşa emek harcamayalım.

## Güvenlik açıkları

Güvenlik açıklarını **issue olarak açma**. [SECURITY.md](SECURITY.md) dosyasındaki
adımları izle.
