# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Depoda iki kod tabanı var

Bu en kritik nokta: repo aynı anda **yayındaki statik siteyi** ve **devam eden SvelteKit yeniden yazımını** barındırıyor. İkisi birbirinden bağımsız derlenir ve şu an yalnızca birincisi dağıtılıyor.

| | Yayındaki site | SvelteKit yeniden yazımı |
|---|---|---|
| Kaynak | kökteki `*.html`, `tr/`, `resizer/`, `privacy/`, `assets/js/`, `assets/css/` | `src/` |
| Sunum | `server.cjs` (Docker/Dokploy) | henüz dağıtılmıyor |
| Tailwind | `tailwind.config.cjs` | `tailwind.app.config.js` |
| Komut | `npm start`, `npm run build:css` | `npm run dev:app`, `npm run build:app` |
| Durum | üretimde | `src/routes/` ve `src/lib/components/` **henüz yok** — sadece `src/lib/` altındaki saf mantık yazılmış |

Bir istek geldiğinde hangi taraf kastediliyor belirsizse sor; "dönüştürücüyü düzelt" yayındaki `assets/js/script-converter.js` de olabilir, `src/lib/convert.ts` de.

## Komutlar

```bash
npm start                # server.cjs -> http://localhost:8787 (yayındaki site)
npm run dev              # aynısı, PORT=8787 açıkça verilmiş
npm run build:css        # statik sitenin Tailwind'i -> assets/css/tailwind.css
npm run watch:css        # geliştirme sırasında izleyerek

npm run dev:app          # SvelteKit dev sunucusu
npm run build:app        # adapter-static ile build/ dizinine
npm run check            # svelte-kit sync + svelte-check (tip kontrolü)
npm test                 # vitest run

docker build -t convetta . && docker run --rm -p 8787:8787 convetta
```

`vitest` yapılandırılmış (`vite.config.ts` içinde, `jsdom` + `src/**/*.test.ts`) ama **henüz hiç test dosyası yok**. Tek test çalıştırma: `npx vitest run src/lib/convert.test.ts` veya isimle `npx vitest run -t "test adı"`.

## Dönüştürme mimarisi

Dönüşüm iki yere bölünmüş, ayrım formatın tarayıcıda üretilebilirliğine göre:

- **Tarayıcıda (canvas):** JPG, PNG, WEBP. Dosya cihazdan çıkmaz. Yayındaki tarafta `assets/js/script-converter.js`, yeni tarafta `src/lib/convert.ts`.
- **Sunucuda (ImageMagick):** GIF, ICO, PDF. `POST /api/convert?format=<...>`, gövde **ham ikili veri** (multipart değil). Yalnızca bu üç format sunucuya iner.

`canvas.toBlob` desteklemediği bir MIME istendiğinde sessizce PNG döndürür; bu yüzden `convert.ts` çıktının `blob.type`'ını doğrulayıp uyuşmazsa `ConversionError('encode')` atar. Yeni bir hedef format eklerken bu sessiz-PNG tuzağını unutma — `src/lib/formats.ts` içindeki `TARGET_FORMATS` / `PLANNED_FORMATS` ayrımı tam da bunun için var.

Sunucu tarafı sınırlar (`server.cjs`): 20 MB gövde, 20 sn zaman aşımı, IP başına dakikada 30 istek, en fazla 4 eşzamanlı dönüşüm. Girdi türü **dosya adına değil ilk baytlara** bakılarak doğrulanır (`sniffImageType`), böylece ImageMagick'e yalnızca raster görsel ulaşır — Ghostscript imajda kurulu olduğu için PDF/PS girdisini engellemek güvenlik açısından gerekli.

## server.cjs

729 satırlık tek dosya, **sıfır üretim bağımlılığı** (yalnızca Node stdlib). Statik dosya sunumu + `/api/convert` + yoğun SEO kanoniklestirmesi bir arada:

- non-www → www 301 (`CANONICAL_HOST`), şema `X-Forwarded-Proto`'dan okunur (Traefik arkasında düz HTTP dinler)
- tanınmayan sorgu parametreleri 301 ile atılır (aynı içerik sonsuz adreste yayınlanmasın diye)
- `.php/.asp/...` uzantıları 410 döner (`GONE_EXTENSIONS`)
- `404.html` / `tr/404.html` sayfa değil, sunucunun okuduğu hata gövdeleri
- brotli/gzip önbelleği bellekte, anahtar dosya yolu + ETag
- CSP `unsafe-inline` içeriyor çünkü sayfalarda FOUC önleyen satır içi tema script'i var; asıl koruma `default-src 'self'` + `object-src 'none'`

Bu kuralları değiştirirken `sitemap.xml`, sayfalardaki `<link rel="canonical">` ve hreflang etiketleriyle tutarlılığı koru.

## Dikkat edilecekler

**İki Tailwind yapılandırması birbirine karışmamalı.** Kökte bilerek `postcss.config.js` yok; olsaydı `npm run build:css` çağrısı da onu yakalar ve iki yapılandırma üst üste binerdi. SvelteKit tarafı PostCSS zincirini `vite.config.ts` içinden doğrudan alır.

**`assets/css/tailwind.css` derlenmiş haliyle repoya commit ediliyor.** Dockerfile bu yüzden tek aşamalı ve imajda ne npm ağacı ne build aracı var. HTML'e yeni bir Tailwind sınıfı eklediğinde `npm run build:css` çalıştırıp **çıktıyı da commit et**, yoksa üretimde stil kaybolur. JS içinde dinamik atanan sınıflar `tailwind.config.cjs` içindeki `safelist`'e eklenmeli.

**Sürüm damgası elle yayılıyor.** `?v=1.0.4` 8 HTML dosyasında toplam 40 yerde geçiyor ve `package.json`'daki `version` ile eşleşmeli. CSS/JS değiştirdiğinde hepsini birden güncelle; damgasız istekler bir yıl yerine her seferinde doğrulanır, damgalı olan `immutable` işaretlenir.

**Dockerfile build sırasında ImageMagick kodlayıcılarını doğruluyor.** Eksik kodlayıcı hata vermez, sessizce boş çıktı üretir — bu yüzden `PNG JPEG WEBP GIF ICO PDF` kontrolü var ve biri eksikse imaj hiç üretilmez. Yeni format eklersen ilgili `imagemagick-<format>` apk paketini ve bu listeyi güncelle.

**i18n iki tarafta farklı çalışıyor.** Yayındaki sitede her dil ayrı HTML dosyası (`/` ve `/tr/`); SvelteKit tarafında çalışma zamanında sözlük değişimi (`src/lib/i18n/`, `src/lib/state/locale.svelte.ts`, tercih `localStorage`'da `convetta:lang` anahtarıyla). Çeviri metinleri HTML olarak değil metin olarak basıldığı için `fill()` kaçışlama yapmaz — bu varsayımı bozma.

**`layout/` ve `assets/php/` kullanım dışı.** Header artık her sayfaya gömülü, PHP dönüştürücüsünün işlevi `/api/convert`'e taşındı. `assets/php` altındaki adreslerin 410 dönmesi gerekiyor, bu yüzden `PRIVATE_DIRS` listesinde değiller.

## Dil

Kod yorumları ve dokümantasyon Türkçe yazılıyor. Mevcut yorumlarda ASCII karşılıklar kullanılmış (`donusum`, `gorsel`); yeni yazdığın yorumlarda düzgün Türkçe karakter kullan, eski satırları sırf bunun için düzenleme.
