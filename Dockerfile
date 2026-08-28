# Convetta - SvelteKit (adapter-node) + /api/convert ucu
#
# Iki asamali build: npm agaci ve derleme builder katmaninda kalir, calisan
# imajda yalnizca uretim bagimliliklari ve build/ ciktisi bulunur.
FROM node:25-alpine AS builder

WORKDIR /src

# Bagimliliklar once kopyalanir: kaynak degistiginde npm katmani onbellekten gelir.
COPY package.json package-lock.json* ./
RUN npm install --no-audit --no-fund

COPY . .
RUN npm run build \
 && npm prune --omit=dev

# ---------------------------------------------------------------------------

FROM node:25-alpine

# imagemagick: GIF/ICO/PDF donusumleri icin (bkz. src/lib/server/magick.ts).
#   JPG/PNG/WEBP tarayicida canvas ile donusturuluyor, sunucuya hic gelmiyor.
# imagemagick-jpeg / -webp: alpine'da JPEG ve WEBP cozuculeri ayri paketlerde;
#   bunlar olmadan girdi olarak gelen JPG/WEBP dosyalari okunamaz.
# ghostscript: ImageMagick'in PDF *yazmasi* icin gerekli degil, ama alpine'in
#   imagemagick paketi PDF delegesini gs uzerinden tanimliyor. PDF *okuma*
#   istemedigimiz icin girdi turu sniffImageType ile raster formatlarla
#   sinirlandirilmistir - gs'e hicbir zaman PDF/PS girdisi ulasmaz.
# tini: PID 1 olarak zombi surecleri toplar. magick child_process ile
#   calistirildigi ve zaman asiminda SIGKILL ile oldurulebildigi icin gerekli.
RUN apk add --no-cache \
      imagemagick \
      imagemagick-jpeg \
      imagemagick-webp \
      ghostscript \
      tini \
 && rm -rf /var/cache/apk/*

# Eksik bir kodlayici hata vermez, sessizce BOS cikti uretir - yani bozukluk
# ancak kullanici ICO indirmeye calistiginda ortaya cikar. Kodlayicilarin
# varligi burada, build sirasinda dogrulaniyor: biri eksikse imaj hic
# uretilmiyor. Bir format eksik cikarsa ilgili apk paketini yukaridaki listeye
# ekleyin (alpine bazi kodlayicilari imagemagick-<format> alt paketlerine ayirir).
RUN for f in PNG JPEG WEBP GIF ICO PDF; do \
      magick -list format | grep -qE "^ +${f}\*? +[A-Z]+ +[-r]*w" \
        || { echo "HATA: ImageMagick '${f}' formatini YAZAMIYOR (kodlayici eksik)"; \
             echo "Mevcut yazilabilir formatlar:"; magick -list format | grep -E "rw|-w"; \
             exit 1; }; \
    done \
 && echo "ImageMagick kodlayici dogrulamasi gecti: PNG JPEG WEBP GIF ICO PDF"

WORKDIR /app

# Yalnizca calismak icin gerekenler: sunucu ciktisi, uretim bagimliliklari ve
# package.json (adapter-node ESM cozumlemesi icin "type": "module" gerekli).
COPY --from=builder --chown=node:node /src/build ./build
COPY --from=builder --chown=node:node /src/node_modules ./node_modules
COPY --from=builder --chown=node:node /src/package.json ./package.json
# Kendi sunucu girdimiz: adapter-node'un build/index.js'i yerine bu calisiyor,
# cunku non-www -> www yonlendirmesinin prerender edilmis dosyalar sunulmadan
# once yapilmasi gerekiyor (bkz. server/canonical.js).
COPY --from=builder --chown=node:node /src/server ./server

# Uygulama dosyalarina yazma izni yok: calisma zamaninda hicbir sey diske
# yazmiyor (ICO gecici dosyasi /tmp'e gidiyor).
RUN chmod -R a-w /app

# Root olmayan kullanici. node:alpine imajinda hazir gelen 'node' kullanicisi.
USER node

# BODY_SIZE_LIMIT: /api/convert 20 MB'a kadar dosya kabul ediyor; adapter-node'un
# varsayilan 512 KB siniri bu istekleri sunucuya hic ulasmadan reddederdi.
ENV NODE_ENV=production \
    PORT=8787 \
    BODY_SIZE_LIMIT=21M

EXPOSE 8787

# Saglik kontrolu Node ile yapiliyor: imajda curl/wget yok ve eklemek yalnizca
# saldiri yuzeyi buyutur.
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||8787)+'/').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "server/index.js"]
