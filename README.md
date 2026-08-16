# Convetta - Ücretsiz Online Resim Dönüştürücü

Convetta, kullanıcıların JPG, PNG, WEBP ve GIF dosyalarını çevrimiçi olarak ücretsiz dönüştürmesini sağlayan bir web uygulamasıdır. Dosyalarınız doğrudan tarayıcınızda işlenir, böylece gizliliğiniz korunur ve internete yüklenmez.

## Özellikler

- **Çevrimiçi Resim Dönüştürme**: JPG, PNG, WEBP ve GIF formatları arasında anında dönüştürme
- **%100 Ücretsiz**: Abonelik veya gizli ücret yok
- **Gizlilik Odaklı**: Dosyalarınız sunucuya yüklenmez, tüm işlemler tarayıcınızda gerçekleşir
- **Toplu Dönüştürme**: Aynı anda birden fazla resmi dönüştürme
- **ZIP İndirme**: Tüm dönüştürülen dosyaları tek bir ZIP dosyası olarak indirme
- **Tamamen Tarayıcı Tabanlı**: Hiçbir yazılım yüklemesi gerekmez
- **Duyarlı Tasarım**: Mobil cihazlar ve masaüstü bilgisayarlarda çalışır

## Desteklenen Formatlar

- JPEG/JPG
- PNG
- WEBP
- GIF
- ICO (sunucu tabanlı dönüştürme)
- PDF (sunucu tabanlı dönüştürme)

## Nasıl Kullanılır

1. Web sitemizi ziyaret edin: [https://convetta.com](https://convetta.com)
2. Dönüştürmek istediğiniz resim dosyalarını seçin
   - Dosyaları "Sürükle ve Bırak" yöntemiyle yükleyin
   - Veya "Gözat" butonuna tıklayarak dosyaları seçin
3. Hedef formatı seçin (JPG, PNG, WEBP, GIF, ICO veya PDF)
4. "Dönüştür" butonuna tıklayın
5. Dönüştürülen dosyaları ayrı ayrı veya ZIP dosyası olarak indirin

## Gizlilik ve Güvenlik

- **İstemci Tarafı İşleme**: JPG'den PNG'ye gibi basit dönüşümler doğrudan tarayıcınızda gerçekleşir
- **Sunucu Üzerinde Geçici İşleme**: ICO ve PDF gibi karmaşık formatlar için dosyalar sunucuda işlenir ve işlem tamamlandıktan hemen sonra silinir
- **Dosya Saklama Yok**: Dosyalarınızı asla saklamaz veya paylaşmayız
- **İzleme Yok**: Resimlerinizi kaydetmeyiz veya görüntülemeyiz

## Teknik Detaylar

- Modern web teknolojileri kullanılarak geliştirilmiştir
- Tailwind CSS ile tasarlanmıştır
- Tamamen duyarlı ve mobil uyumlu tasarım
- Koyu tema desteği
- Hızlı ve güvenli dosya işleme

## İletişim

Sorularınız veya geri bildirimleriniz için lütfen destek@convetta.com adresine e-posta gönderin.

---

© 2025 Convetta. Tüm hakları saklıdır.
## Geliştirme

Site statiktir; derleme adımı yalnızca Tailwind CSS için gereklidir.

```bash
npm install          # tailwindcss (yalnizca gelistirme bagimliligi)
npm run build:css    # assets/css/tailwind.css dosyasini uretir
npm run watch:css    # gelistirme sirasinda otomatik yeniden uretim
npm start            # http://localhost:8787
```

HTML dosyalarına yeni bir Tailwind sınıfı eklediğinizde `npm run build:css`
komutunu tekrar çalıştırın; aksi halde yeni sınıf üretilmiş CSS'e girmez.
JavaScript içinde dinamik olarak atanan sınıflar `tailwind.config.js`
dosyasındaki `safelist` dizisine eklenmelidir.

## Dosya Yapısı

```
index.html              EN dönüştürücü      /
tr/index.html           TR dönüştürücü      /tr/
resizer/index.html      EN boyutlandırıcı   /resizer/
tr/resizer/index.html   TR boyutlandırıcı   /tr/resizer/
privacy/index.html      EN gizlilik         /privacy/
tr/privacy/index.html   TR gizlilik         /tr/privacy/
robots.txt, sitemap.xml
404.html, tr/404.html   hata gövdeleri (server.cjs okur, sayfa değil)
robots.txt, sitemap.xml
server.cjs               Node statik sunucu + /api/convert
Dockerfile              Dokploy dağıtımı
assets/css/             tailwind.css (üretilmiş) + style.css (elle yazılmış)
assets/fonts/           Poppins woff2 (self-host)
layout/                 KULLANIM DIŞI - header artık her sayfaya gömülü
```

**Kanonik alan adı:** `https://www.convetta.com` — tüm canonical, hreflang,
og:url ve sitemap girdileri www sürümünü kullanır.

## Dağıtım (Docker / Dokploy)

Site `server.cjs` üzerinden sunulur: statik dosyalar + `/api/convert` ucu.

```bash
docker build -t convetta .
docker run --rm -p 8787:8787 convetta
```

Dokploy'da **Application → Docker (Dockerfile)** tipini seçin:

| Ayar | Değer |
|---|---|
| Build type | Dockerfile |
| Dockerfile path | `Dockerfile` |
| Port | `8787` |
| Health check path | `/healthz` |
| Domain | `www.convetta.com` **ve** `convetta.com` (ikisi de aynı uygulamaya) |

`convetta.com` alan adının da uygulamaya bağlanması gerekir: non-www → www 301'i
`server.cjs` içinde yapılıyor (`CANONICAL_HOST`). Alan adı Dokploy'a bağlı
değilse yönlendirme hiç çalışmaz.

Traefik HTTPS'i sonlandırıp `X-Forwarded-Proto` gönderdiği için uygulama
konteyner içinde düz HTTP dinler; yönlendirmelerde şema bu başlıktan okunur.

### Dönüştürme ucu

`POST /api/convert?format=<ico|pdf|gif|png|jpeg|webp>` — gövde ham ikili görsel
verisi (multipart değil). JPG/PNG/WEBP çıktıları tarayıcıda canvas ile üretilir
ve bu uca hiç gelmez; yalnızca tarayıcının üretemediği formatlar (GIF, ICO, PDF)
sunucuya iner.

Sınırlar: 20 MB gövde, 20 sn zaman aşımı, IP başına dakikada 30 istek. Girdi
türü dosya adına değil içeriğin ilk baytlarına bakılarak doğrulanır, böylece
ImageMagick'e yalnızca raster görseller ulaşır.
