# Güvenlik Politikası

## Desteklenen sürüm

Yayındaki tek sürüm [www.convetta.com](https://www.convetta.com) üzerinde çalışan
`main` dalıdır. Güvenlik düzeltmeleri yalnızca `main` üzerine yapılır.

## Açık bildirimi

Bir güvenlik açığı bulduğunu düşünüyorsan **lütfen herkese açık bir issue açma.**

İki yol var:

1. **GitHub Security Advisory** (tercih edilen) —
   [Report a vulnerability](https://github.com/YakupEmreYerli/Convetta/security/advisories/new)
2. **E-posta** — destek@convetta.com

Bildirimde şunları paylaşırsan çok yardımcı olur:

- Açığın türü ve etkisi
- Etkilenen adres ya da dosya (`src/routes/api/convert/+server.ts` gibi)
- Yeniden üretme adımları — mümkünse en küçük hâliyle
- Varsa bir kavram kanıtı

**Yanıt süresi:** Bu tek kişilik bir yan proje; ilk yanıt için 72 saat, doğrulanmış
bir açığın düzeltilmesi için 30 gün hedefliyorum. Bildirimi düzeltme yayına
girene kadar gizli tutmanı rica ederim.

## Kapsam

Aşağıdakiler kapsam **içindedir**:

- `/api/convert` ucu: girdi doğrulama, ImageMagick'e komut geçirme, kaynak tüketimi
- Güvenlik başlıkları ve CSP (`server/security.js`)
- Kanonikleştirme ve yönlendirme mantığı (`server/canonical.js`)
- İstemci tarafı dönüşüm ve dosya işleme (`src/lib/`)
- Konteyner yapılandırması (`Dockerfile`)

Kapsam **dışındadır**:

- Hız sınırının yeterliliği üzerine kuramsal tartışmalar (sınır bilinçli olarak
  gevşek: amaç kötüye kullanımı tümüyle engellemek değil, tek bir istemcinin
  konteyneri doyurmasını önlemek)
- Kullanıcı etkileşimi gerektirmeyen, etkisi olmayan başlık/yapılandırma önerileri
- Üçüncü taraf altyapıdaki (Dokploy, Traefik, alan adı sağlayıcısı) sorunlar
- Otomatik tarayıcı çıktısının doğrulanmamış hâli

## Tasarım gereği alınan önlemler

Bildirim göndermeden önce şunların zaten yerinde olduğunu bilmen zaman kazandırabilir:

- Girdi türü **dosya adına değil ilk baytlara** bakılarak doğrulanır
  (`sniffImageType`), böylece imajda Ghostscript kurulu olmasına rağmen
  ImageMagick'e PDF/PS girdisi hiç ulaşmaz.
- Gövde ham ikilidir, multipart değil — sunucuda multipart ayrıştırıcısı yok.
- ImageMagick argümanları kabuktan geçmez; `child_process` ile doğrudan
  çalıştırılır ve zaman aşımında öldürülür.
- ImageMagick bellek, alan ve boyut limitleriyle çalıştırılır (`-limit area/width/height`),
  böylece sıkıştırma bombaları bellek ayrılmadan önce reddedilir; diske taşma tümüyle
  kapalıdır (`-limit disk 0`).
- Konteyner root olmayan `node` kullanıcısıyla, salt okunur uygulama dizininde çalışır.
- Dönüşüm çıktısı `no-store, private` ile döner; hiçbir dosya diske yazılıp bırakılmaz.
