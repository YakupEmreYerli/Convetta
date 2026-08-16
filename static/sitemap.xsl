<?xml version="1.0" encoding="UTF-8"?>
<!--
  Convetta - XML sitemap görünüm şablonu.
  sitemap.xml / sitemap-tr.xml / sitemap-en.xml dosyalarına
  <?xml-stylesheet ...?> satırıyla bağlanır (bkz. generate_sitemap()).

  Bu dosya elle yazılır, üretilmez: içinde tek bir mutlak adres yok (bütün
  bağlantılar sitemap'in kendi <loc> değerlerinden geliyor), o yüzden
  canonicalize_site_urls()'in düzeltmesi gereken bir şey de yok.

  Tarayıcılar yalnızca XSLT 1.0 destekler; aşağısı 1.0 uyumlu.
  Arama kutusu ilerlemeli geliştirme: JS yoksa gizli kalır, tablo çalışır.
-->
<xsl:stylesheet version="1.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:s="http://www.sitemaps.org/schemas/sitemap/0.9"
                xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
                xmlns:xhtml="http://www.w3.org/1999/xhtml"
                exclude-result-prefixes="s image xhtml">

  <xsl:output method="html" encoding="UTF-8" indent="yes"/>

  <xsl:variable name="lower" select="'abcdefghijklmnopqrstuvwxyz'"/>
  <xsl:variable name="upper" select="'ABCDEFGHIJKLMNOPQRSTUVWXYZ'"/>
  <xsl:variable name="isIndex" select="count(s:sitemapindex/s:sitemap) &gt; 0"/>

  <!-- Arayüz dili dosyanın kendi içeriğinden: bir kaydın <loc>'u, o kaydın
       hreflang="en" bağlantısıyla aynıysa bu İngilizce sitemap'tir. Dosya
       adına ("-en.xml") bakmak da olurdu ama XSLT dönüştürdüğü belgenin
       adresini bilmez; hreflang zaten her kayıtta var ve yanılmaz.
       Dizin dosyası iki dili birden listelediği için Türkçe kalır. -->
  <xsl:variable name="isEn"
    select="count(s:urlset/s:url[1]/xhtml:link[@hreflang='en']) &gt; 0
            and string(s:urlset/s:url[1]/s:loc)
                = string(s:urlset/s:url[1]/xhtml:link[@hreflang='en']/@href)"/>
  <xsl:variable name="total">
    <xsl:choose>
      <xsl:when test="$isIndex"><xsl:value-of select="count(s:sitemapindex/s:sitemap)"/></xsl:when>
      <xsl:otherwise><xsl:value-of select="count(s:urlset/s:url)"/></xsl:otherwise>
    </xsl:choose>
  </xsl:variable>

  <!-- Arayüz metinleri. XSLT 1.0'da dil dosyası diye bir şey yok; tek yerde
       toplanan bu değişkenler onun yerine geçiyor, şablonun gövdesinde artık
       çıplak metin yok. -->
  <xsl:variable name="L_lang"><xsl:choose><xsl:when test="$isEn">en</xsl:when><xsl:otherwise>tr</xsl:otherwise></xsl:choose></xsl:variable>
  <xsl:variable name="L_title"><xsl:choose><xsl:when test="$isEn">XML Sitemap · Convetta</xsl:when><xsl:otherwise>XML Site Haritası · Convetta</xsl:otherwise></xsl:choose></xsl:variable>
  <xsl:variable name="L_h1_index"><xsl:choose><xsl:when test="$isEn">XML Sitemap Index</xsl:when><xsl:otherwise>XML Site Haritası Dizini</xsl:otherwise></xsl:choose></xsl:variable>
  <xsl:variable name="L_h1_urls"><xsl:choose><xsl:when test="$isEn">XML Sitemap</xsl:when><xsl:otherwise>XML Site Haritası</xsl:otherwise></xsl:choose></xsl:variable>
  <xsl:variable name="L_lede_index"><xsl:choose>
    <xsl:when test="$isEn">This file points search engines to the site's per-language sitemaps. Each row is a separate sitemap file; open one to see the addresses it contains.</xsl:when>
    <xsl:otherwise>Bu dosya, arama motorlarına sitenin dil bazında ayrılmış site haritalarını gösterir. Her satır ayrı bir site haritası dosyasıdır; içindeki adresleri görmek için üstüne tıklayın.</xsl:otherwise>
  </xsl:choose></xsl:variable>
  <xsl:variable name="L_lede_urls"><xsl:choose>
    <xsl:when test="$isEn">Every address search engines read from this file is listed below. The languages column shows the same page in the other language (hreflang).</xsl:when>
    <xsl:otherwise>Arama motorlarının bu dosyadan okuduğu adreslerin tamamı aşağıda. Diller sütunu, aynı sayfanın diğer dildeki karşılığını (hreflang) gösterir.</xsl:otherwise>
  </xsl:choose></xsl:variable>
  <xsl:variable name="L_search_index"><xsl:choose><xsl:when test="$isEn">Search sitemaps...</xsl:when><xsl:otherwise>Site haritalarında ara...</xsl:otherwise></xsl:choose></xsl:variable>
  <xsl:variable name="L_search_urls"><xsl:choose><xsl:when test="$isEn">Search URLs...</xsl:when><xsl:otherwise>Adreslerde ara...</xsl:otherwise></xsl:choose></xsl:variable>
  <xsl:variable name="L_count_sep"><xsl:choose><xsl:when test="$isEn"> of </xsl:when><xsl:otherwise> / </xsl:otherwise></xsl:choose></xsl:variable>
  <xsl:variable name="L_count_suffix"><xsl:choose><xsl:when test="$isEn"> shown</xsl:when><xsl:otherwise> adres gösteriliyor</xsl:otherwise></xsl:choose></xsl:variable>
  <xsl:variable name="L_col_sitemap"><xsl:choose><xsl:when test="$isEn">Sitemap</xsl:when><xsl:otherwise>Site Haritası</xsl:otherwise></xsl:choose></xsl:variable>
  <xsl:variable name="L_col_lang1"><xsl:choose><xsl:when test="$isEn">Language</xsl:when><xsl:otherwise>Dil</xsl:otherwise></xsl:choose></xsl:variable>
  <xsl:variable name="L_col_url"><xsl:choose><xsl:when test="$isEn">URL</xsl:when><xsl:otherwise>Adres</xsl:otherwise></xsl:choose></xsl:variable>
  <xsl:variable name="L_col_type"><xsl:choose><xsl:when test="$isEn">Page type</xsl:when><xsl:otherwise>Sayfa Türü</xsl:otherwise></xsl:choose></xsl:variable>
  <xsl:variable name="L_col_langs"><xsl:choose><xsl:when test="$isEn">Languages</xsl:when><xsl:otherwise>Diller</xsl:otherwise></xsl:choose></xsl:variable>
  <xsl:variable name="L_col_updated"><xsl:choose><xsl:when test="$isEn">Updated</xsl:when><xsl:otherwise>Güncelleme</xsl:otherwise></xsl:choose></xsl:variable>
  <xsl:variable name="L_col_images"><xsl:choose><xsl:when test="$isEn">Images</xsl:when><xsl:otherwise>Görsel</xsl:otherwise></xsl:choose></xsl:variable>
  <xsl:variable name="L_empty"><xsl:choose><xsl:when test="$isEn">This file contains no entries.</xsl:when><xsl:otherwise>Bu dosyada kayıtlı adres yok.</xsl:otherwise></xsl:choose></xsl:variable>
  <xsl:variable name="L_footnote"><xsl:choose>
    <xsl:when test="$isEn">This page is a human-friendly view; search engines read the raw XML.</xsl:when>
    <xsl:otherwise>Bu sayfa insanlar için hazırlanmış bir görünümdür; arama motorları ham XML'i okur.</xsl:otherwise>
  </xsl:choose></xsl:variable>
  <!-- Ana sayfa bağlantısı İngilizce sitemap'te /en'e gider: oradan gelen
       ziyaretçiyi Türkçe anasayfaya atmanın anlamı yok. -->
  <xsl:variable name="L_home_href"><xsl:choose><xsl:when test="$isEn">/en/</xsl:when><xsl:otherwise>/</xsl:otherwise></xsl:choose></xsl:variable>
  <xsl:variable name="L_type_home"><xsl:choose><xsl:when test="$isEn">Home</xsl:when><xsl:otherwise>Ana Sayfa</xsl:otherwise></xsl:choose></xsl:variable>
  <xsl:variable name="L_type_product"><xsl:choose><xsl:when test="$isEn">Product</xsl:when><xsl:otherwise>Ürün</xsl:otherwise></xsl:choose></xsl:variable>
  <xsl:variable name="L_type_info"><xsl:choose><xsl:when test="$isEn">Knowledge base</xsl:when><xsl:otherwise>Bilgi Bankası</xsl:otherwise></xsl:choose></xsl:variable>
  <xsl:variable name="L_type_gallery"><xsl:choose><xsl:when test="$isEn">Gallery</xsl:when><xsl:otherwise>Galeri</xsl:otherwise></xsl:choose></xsl:variable>
  <xsl:variable name="L_type_category"><xsl:choose><xsl:when test="$isEn">Category</xsl:when><xsl:otherwise>Kategori</xsl:otherwise></xsl:choose></xsl:variable>
  <xsl:variable name="L_type_corp"><xsl:choose><xsl:when test="$isEn">Corporate</xsl:when><xsl:otherwise>Kurumsal</xsl:otherwise></xsl:choose></xsl:variable>

  <xsl:template match="/">
    <html lang="{$L_lang}">
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <meta name="robots" content="noindex, follow"/>
        <title><xsl:value-of select="$L_title"/></title>
        <style type="text/css">
          :root{
            --accent:#2864ec;
            --accent-ink:#1d4ed8;
            --accent-soft:#eff6ff;
            --ink:#111827;
            --ink-2:#4b5563;
            --ink-3:#9ca3af;
            --line:#e5e7eb;
            --line-soft:#f3f4f6;
            --surface:#ffffff;
            --surface-2:#f9fafb;
            --mono:ui-monospace,SFMono-Regular,"SF Mono",Menlo,Consolas,"Liberation Mono",monospace;
          }
          *{box-sizing:border-box}
          html,body{margin:0;padding:0}
          body{
            min-height:100vh;
            font-family:"Inter","Segoe UI",Arial,sans-serif;
            font-size:14px;line-height:1.55;color:var(--ink-2);
            background:linear-gradient(180deg,#f5f8ff 0%,#ffffff 46%);
            -webkit-font-smoothing:antialiased;
          }
          .wrap{max-width:1180px;margin:0 auto;padding:32px 20px 64px}

          .topbar{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:22px}
          .brand{display:inline-flex;align-items:center;text-decoration:none}
          .logo{display:block;height:32px;width:auto}
          .home-link{
            display:inline-flex;align-items:center;padding:9px 18px;border-radius:999px;
            border:1px solid var(--line);background:var(--surface);
            color:var(--ink-2);text-decoration:none;font-size:12px;font-weight:600;
            transition:border-color .2s ease,color .2s ease;
          }
          .home-link:hover{color:var(--accent-ink);border-color:var(--accent)}

          h1{margin:0 0 4px;font-size:20px;font-weight:700;color:var(--ink)}
          .lede{margin:0 0 22px;font-size:13px;color:var(--ink-2);max-width:70ch}

          .tools{display:flex;align-items:center;flex-wrap:wrap;gap:14px}
          /* Arama yalnızca JS varsa görünür; sayaç her durumda kalır. */
          .search{
            display:none;flex:1 1 auto;max-width:420px;padding:11px 18px;border-radius:999px;
            border:1px solid var(--line);background:var(--surface);
            color:var(--ink);font-family:inherit;font-size:13px;outline:none;
          }
          .js .search{display:block}
          .search::placeholder{color:var(--ink-3)}
          .search:focus{border-color:var(--accent);box-shadow:0 0 0 3px rgba(40,100,236,.14)}
          .counter{font-size:12px;color:var(--ink-2);font-variant-numeric:tabular-nums;white-space:nowrap}
          .counter b{color:var(--ink);font-weight:700}

          .card{
            position:relative;margin-top:16px;border-radius:14px;overflow:hidden;
            border:1px solid var(--line);background:var(--surface);
          }
          .card:before{content:"";position:absolute;top:0;left:0;right:0;height:3px;background:var(--accent);z-index:3}
          table{width:100%;border-collapse:collapse}
          th{
            position:sticky;top:0;z-index:2;text-align:left;padding:14px 20px;
            font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--ink-2);
            background:var(--surface-2);border-bottom:1px solid var(--line);
          }
          td{padding:11px 20px;border-bottom:1px solid var(--line-soft);vertical-align:middle}
          tr:last-child td{border-bottom:none}
          tbody tr:hover td{background:#f5f8ff}
          .c-num{width:56px;color:var(--ink-3);font-size:12px;font-variant-numeric:tabular-nums}
          .c-type{width:140px;white-space:nowrap}
          .c-lang{width:130px;white-space:nowrap}
          .c-date{width:120px;white-space:nowrap;font-size:12px;color:var(--ink-2);font-variant-numeric:tabular-nums}
          .c-img{width:88px;white-space:nowrap;font-size:12px;color:var(--ink-2);font-variant-numeric:tabular-nums;text-align:right}

          /* Adres her zaman tek satır. Uzun ürün adresleri ("…/perfect-duo-
             highland-and-chestnut-honey-970g") iki satıra düşünce satır
             yüksekliği bozuluyor ve tablo taranamaz hâle geliyordu. Taşan
             adres üç noktayla kesiliyor; tam hâli bağlantının kendisinde ve
             title'da duruyor. max-width:0 hücreyi kalan genişliğe sığmaya
             zorlayan tablo kalıbı — onsuz hücre içeriğine göre büyüyüp
             text-overflow'u etkisiz bırakır. */
          td.c-url{max-width:0;width:100%}
          .url{display:block;font-family:var(--mono);font-size:12.5px;color:var(--ink);text-decoration:none;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
          .url .host{color:var(--ink-3)}
          .url:hover{color:var(--accent-ink);text-decoration:underline}

          .chip{
            display:inline-flex;align-items:center;gap:6px;margin:2px 6px 2px 0;padding:3px 10px;
            border-radius:999px;border:1px solid var(--line);background:var(--surface-2);
            font-size:10.5px;font-weight:700;letter-spacing:.04em;color:var(--ink-2);
            text-decoration:none;
          }
          .chip:before{content:"";width:6px;height:6px;border-radius:50%;background:currentColor;opacity:.8}
          a.chip:hover{border-color:var(--accent);color:var(--accent-ink)}
          .lang-tr{color:var(--accent-ink);background:var(--accent-soft);border-color:#bfdbfe}
          .lang-en{color:#1d4ed8;background:#eff6ff;border-color:#bfdbfe}
          .t-home{color:var(--accent-ink)}
          .t-product{color:#b45309}
          .t-category{color:#1d4ed8}
          .t-info{color:#7c3aed}
          .t-gallery{color:#be185d}
          .t-corp{color:var(--ink-2)}
          .muted{color:var(--ink-3)}
          .empty{padding:34px 20px;text-align:center;color:var(--ink-3);font-size:13px}

          footer{margin-top:22px;display:flex;flex-wrap:wrap;gap:8px 16px;align-items:center;color:var(--ink-3);font-size:12px}
          footer a{color:var(--ink-2);text-decoration:none}
          footer a:hover{color:var(--accent-ink)}
          .dot{width:4px;height:4px;border-radius:50%;background:#d1d5db;display:inline-block}

          @media (max-width:900px){
            .c-img,th.c-img{display:none}
          }
          @media (max-width:768px){
            .wrap{padding:24px 14px 48px}
            th,td{padding:11px 13px}
            th.c-num,td.c-num{display:none}
            .logo{height:28px}
          }
          @media (max-width:640px){
            th.c-date,td.c-date{display:none}
          }
          @media (max-width:520px){
            th.c-type,td.c-type{display:none}
            .home-link{display:none}
            .url{font-size:11.5px}
          }
        </style>
      </head>
      <body>
        <div class="wrap">
          <div class="topbar">
            <a class="brand" href="{$L_home_href}" title="Convetta">
              <img class="logo" src="/images/Convetta.png"
                   width="400" height="66" alt="Convetta"/>
            </a>
            <a class="home-link" href="{$L_home_href}">convetta.com &#8594;</a>
          </div>

          <xsl:choose>
            <xsl:when test="$isIndex">
              <h1><xsl:value-of select="$L_h1_index"/></h1>
              <p class="lede"><xsl:value-of select="$L_lede_index"/></p>
            </xsl:when>
            <xsl:otherwise>
              <h1><xsl:value-of select="$L_h1_urls"/></h1>
              <p class="lede"><xsl:value-of select="$L_lede_urls"/></p>
            </xsl:otherwise>
          </xsl:choose>

          <div class="tools">
            <input type="search" id="q" class="search" autocomplete="off">
              <xsl:attribute name="placeholder">
                <xsl:choose>
                  <xsl:when test="$isIndex"><xsl:value-of select="$L_search_index"/></xsl:when>
                  <xsl:otherwise><xsl:value-of select="$L_search_urls"/></xsl:otherwise>
                </xsl:choose>
              </xsl:attribute>
            </input>
            <span class="counter">
              <b id="shown"><xsl:value-of select="$total"/></b>
              <xsl:value-of select="$L_count_sep"/>
              <xsl:value-of select="$total"/>
              <xsl:value-of select="$L_count_suffix"/>
            </span>
          </div>

          <div class="card">
            <xsl:choose>
              <xsl:when test="$isIndex">
                <table>
                  <thead>
                    <tr>
                      <th class="c-num">#</th>
                      <th><xsl:value-of select="$L_col_sitemap"/></th>
                      <th class="c-lang"><xsl:value-of select="$L_col_lang1"/></th>
                    </tr>
                  </thead>
                  <tbody>
                    <xsl:for-each select="s:sitemapindex/s:sitemap">
                      <xsl:variable name="loc" select="string(s:loc)"/>
                      <xsl:variable name="file" select="substring-after(substring-after($loc,'//'),'/')"/>
                      <tr data-s="{translate($loc,$upper,$lower)}">
                        <td class="c-num"><xsl:value-of select="position()"/></td>
                        <td class="c-url">
                          <a class="url" href="{$loc}" title="{$loc}">
                            <span class="host"><xsl:value-of select="substring-before(substring-after($loc,'//'),'/')"/>/</span>
                            <xsl:value-of select="$file"/>
                          </a>
                        </td>
                        <td class="c-lang">
                          <xsl:choose>
                            <xsl:when test="contains($file,'-en.')"><span class="chip lang-en">EN</span></xsl:when>
                            <xsl:otherwise><span class="chip lang-tr">TR</span></xsl:otherwise>
                          </xsl:choose>
                        </td>
                      </tr>
                    </xsl:for-each>
                  </tbody>
                </table>
              </xsl:when>
              <xsl:otherwise>
                <table>
                  <thead>
                    <tr>
                      <th class="c-num">#</th>
                      <th><xsl:value-of select="$L_col_url"/></th>
                      <th class="c-type"><xsl:value-of select="$L_col_type"/></th>
                      <th class="c-lang"><xsl:value-of select="$L_col_langs"/></th>
                      <th class="c-date"><xsl:value-of select="$L_col_updated"/></th>
                      <th class="c-img"><xsl:value-of select="$L_col_images"/></th>
                    </tr>
                  </thead>
                  <tbody>
                    <xsl:for-each select="s:urlset/s:url">
                      <xsl:variable name="loc" select="string(s:loc)"/>
                      <xsl:variable name="path" select="substring-after(substring-after($loc,'//'),'/')"/>
                      <tr data-s="{translate($loc,$upper,$lower)}">
                        <td class="c-num"><xsl:value-of select="position()"/></td>
                        <td class="c-url">
                          <a class="url" href="{$loc}" title="{$loc}">
                            <span class="host">
                              <xsl:choose>
                                <xsl:when test="contains(substring-after($loc,'//'),'/')">
                                  <xsl:value-of select="substring-before(substring-after($loc,'//'),'/')"/>
                                </xsl:when>
                                <xsl:otherwise><xsl:value-of select="substring-after($loc,'//')"/></xsl:otherwise>
                              </xsl:choose>
                              <xsl:text>/</xsl:text>
                            </span>
                            <xsl:value-of select="$path"/>
                          </a>
                        </td>
                        <td class="c-type">
                          <xsl:call-template name="type-chip">
                            <xsl:with-param name="path" select="$path"/>
                          </xsl:call-template>
                        </td>
                        <td class="c-lang">
                          <xsl:for-each select="xhtml:link[@hreflang!='x-default'][@href!=$loc]">
                            <a class="chip lang-{translate(@hreflang,$upper,$lower)}" href="{@href}" title="{@href}">
                              <xsl:value-of select="translate(@hreflang,$lower,$upper)"/>
                            </a>
                          </xsl:for-each>
                          <xsl:if test="count(xhtml:link[@hreflang!='x-default'][@href!=$loc]) = 0">
                            <span class="muted">&#8212;</span>
                          </xsl:if>
                        </td>
                        <td class="c-date">
                          <xsl:choose>
                            <xsl:when test="s:lastmod"><xsl:value-of select="s:lastmod"/></xsl:when>
                            <xsl:otherwise><span class="muted">&#8212;</span></xsl:otherwise>
                          </xsl:choose>
                        </td>
                        <td class="c-img">
                          <xsl:choose>
                            <xsl:when test="count(image:image) &gt; 0"><xsl:value-of select="count(image:image)"/></xsl:when>
                            <xsl:otherwise><span class="muted">&#8212;</span></xsl:otherwise>
                          </xsl:choose>
                        </td>
                      </tr>
                    </xsl:for-each>
                  </tbody>
                </table>
              </xsl:otherwise>
            </xsl:choose>
            <xsl:if test="$total = 0">
              <div class="empty"><xsl:value-of select="$L_empty"/></div>
            </xsl:if>
          </div>

          <footer>
            <span>Convetta</span>
            <span class="dot"></span>
            <a href="/sitemap.xml">sitemap.xml</a>
            <span class="dot"></span>
            <a href="/robots.txt">robots.txt</a>
            <span class="dot"></span>
            <span><xsl:value-of select="$L_footnote"/></span>
          </footer>
        </div>

        <script type="text/javascript">
          (function () {
            var root = document.documentElement;
            root.className = root.className ? root.className + ' js' : 'js';

            var box = document.getElementById('q');
            var out = document.getElementById('shown');
            if (!box || !out) { return; }

            var body = document.getElementsByTagName('tbody')[0];
            if (!body) { return; }
            var rows = body.getElementsByTagName('tr');

            function filter() {
              var q = box.value.toLowerCase();
              var n = 0;
              for (var i = 0; i &lt; rows.length; i++) {
                var key = rows[i].getAttribute('data-s') || '';
                var hit = !q || key.indexOf(q) !== -1;
                rows[i].style.display = hit ? '' : 'none';
                if (hit) { n++; }
              }
              out.innerHTML = n;
            }

            box.oninput = filter;
            box.onkeyup = filter;
          })();
        </script>
      </body>
    </html>
  </xsl:template>

  <!-- Sayfa türü rozeti, adresin kendisinden. Sıra önemli: ürün yolu
       (/bal/…) kategori adlarından (…-bali) önce sınanıyor. -->
  <xsl:template name="type-chip">
    <xsl:param name="path"/>
    <xsl:choose>
      <xsl:when test="$path = '' or $path = 'en'"><span class="chip t-home"><xsl:value-of select="$L_type_home"/></span></xsl:when>
      <xsl:when test="starts-with($path,'bal/') or starts-with($path,'en/honey/')">
        <span class="chip t-product"><xsl:value-of select="$L_type_product"/></span>
      </xsl:when>
      <xsl:when test="starts-with($path,'bilgi-bankasi') or starts-with($path,'en/honey-guide')">
        <span class="chip t-info"><xsl:value-of select="$L_type_info"/></span>
      </xsl:when>
      <xsl:when test="starts-with($path,'galeri') or starts-with($path,'en/gallery')">
        <span class="chip t-gallery"><xsl:value-of select="$L_type_gallery"/></span>
      </xsl:when>
      <xsl:when test="$path = 'tum-urunler' or $path = 'cicek-bali' or $path = 'kestane-bali'
                      or $path = 'karakovan-bali' or $path = 'petek-bali'
                      or $path = 'en/all-honey' or $path = 'en/flower-honey'
                      or $path = 'en/chestnut-honey' or $path = 'en/natural-comb-honey'
                      or $path = 'en/comb-honey'">
        <span class="chip t-category"><xsl:value-of select="$L_type_category"/></span>
      </xsl:when>
      <xsl:otherwise><span class="chip t-corp"><xsl:value-of select="$L_type_corp"/></span></xsl:otherwise>
    </xsl:choose>
  </xsl:template>

</xsl:stylesheet>
