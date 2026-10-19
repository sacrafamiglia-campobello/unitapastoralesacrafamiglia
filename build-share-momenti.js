// Condivisione dei "Momenti di comunità" (vita-parrocchiale.html).
// Per ogni card con barra di condivisione (data-share-bar, link /momento/<id>.html) genera:
//  - assets/img/momenti/og/<id>.jpg → anteprima 1200×630 (foto di copertina + titolo) per WhatsApp/Facebook
//  - momento/<id>.html              → pagina ponte con i meta Open Graph, che porta subito alla card
//                                     (vita-parrocchiale.html#<id>)
// Da rilanciare dopo ogni modifica alle card condivisibili:  node build-share-momenti.js
const fs = require('fs');
const path = require('path');
const puppeteer = require('C:/workspace/social-image-generator/node_modules/puppeteer-core');
const sharp = require('C:/workspace/social-image-generator/node_modules/sharp');

const SITE = 'https://www.unitapastoralesacrafamiglia.it';
const ROOT = __dirname;
const OG_DIR = path.join(ROOT, 'assets', 'img', 'momenti', 'og');
const STUB_DIR = path.join(ROOT, 'momento');

const html = fs.readFileSync(path.join(ROOT, 'vita-parrocchiale.html'), 'utf8');
const strip = s => s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const unesc = s => s.replace(/&quot;/g, '"').replace(/&amp;/g, '&');
const cut = (s, n) => s.length <= n ? s : s.slice(0, s.lastIndexOf(' ', n - 1)) + '…';

const items = [...html.matchAll(/<article class="church-card event[^"]*" id="([^"]+)"[^>]*>([\s\S]*?)<\/article>/g)]
  .filter(m => m[2].includes('data-share-bar')).map(m => {
    const body = m[2];
    const bar = body.match(/<div class="fv-share[^"]*" data-share-bar[^>]*>/)[0];
    const attr = n => unesc((bar.match(new RegExp(n + '="([^"]*)"')) || [])[1] || '');
    const n = (body.match(/<span class="count-badge">[\s\S]*?<\/svg>(\d+)<\/span>/) || [, ''])[1];
    return {
      id: m[1], title: attr('data-title-it'), when: attr('data-when-it'), photo: attr('data-img'), n,
      desc: cut(strip((body.match(/<p data-lang-it>([\s\S]*?)<\/p>/) || [, ''])[1]), 180),
    };
  });

const crest = fs.readFileSync(path.join(ROOT, 'assets', 'img', 'crest.svg'), 'utf8');

function card(it) {
  const photo = 'data:image/jpeg;base64,' + fs.readFileSync(path.join(ROOT, it.photo)).toString('base64');
  return `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Inter:wght@500;600;700&display=swap">
<style>
*{box-sizing:border-box;margin:0}
body{width:1200px;height:630px;overflow:hidden;font-family:Inter,sans-serif;color:#fff;background:#151b3c;position:relative}
.bg{position:absolute;inset:0;background:url(${photo}) center 40%/cover}
.shade{position:absolute;inset:0;background:linear-gradient(to right,rgba(17,22,52,.96) 0%,rgba(17,22,52,.84) 44%,rgba(17,22,52,.25) 76%,rgba(17,22,52,.05) 100%),
  linear-gradient(to top,rgba(17,22,52,.7),transparent 45%)}
.frame{position:absolute;inset:18px;border:1px solid rgba(196,160,82,.4);border-radius:26px}
.txt{position:absolute;left:64px;top:56px;bottom:56px;width:640px;display:flex;flex-direction:column;justify-content:center}
.brand{display:flex;align-items:center;gap:14px;margin-bottom:34px}
.brand svg{width:40px;height:49px}
.brand b{display:block;font:600 27px/1 'Cormorant Garamond',serif;letter-spacing:.01em}
.brand small{display:block;margin-top:5px;font-size:12px;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:#dcc082}
.chip{align-self:flex-start;font-size:14px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:#2a2109;
  background:linear-gradient(135deg,#e7cd8c,#c4a052);padding:9px 18px;border-radius:100px;margin-bottom:22px}
h1{font:600 ${it.title.length > 44 ? 52 : 60}px/1.08 'Cormorant Garamond',serif;letter-spacing:-.005em;margin-bottom:24px}
.when{display:flex;gap:12px;font-size:20px;line-height:1.4;font-weight:500;color:#dfe2f2}
.when svg{flex:none;width:24px;height:24px;margin-top:2px;color:#dcc082}
.site{margin-top:38px;font-size:15px;font-weight:600;letter-spacing:.08em;color:#b9bedd}
</style></head><body><div class="bg"></div><div class="shade"></div><div class="frame"></div>
<div class="txt">
  <div class="brand">${crest.replace(/<\?xml[^>]*>/, '')}<div><b>Unità Pastorale Sacra Famiglia</b><small>Campobello di Licata</small></div></div>
  <span class="chip">Momenti di comunità${it.n && !/foto/.test(it.when) ? ' · ' + it.n + ' foto' : ''}</span>
  <h1>${esc(it.title)}</h1>
  <div class="when"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.5"/></svg><span>${esc(cut(it.when, 120))}</span></div>
  <div class="site">unitapastoralesacrafamiglia.it · Vita parrocchiale</div>
</div></body></html>`;
}

function stub(it) {
  const page = `${SITE}/momento/${it.id}.html`, target = `../vita-parrocchiale.html#${it.id}`, img = `${SITE}/assets/img/momenti/og/${it.id}.jpg`;
  const t = esc(it.title), dsc = esc(`${it.when} — ${it.desc}`);
  return `<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<!-- Pagina ponte generata da build-share-momenti.js: anteprima social del momento di comunità, poi rimanda alla galleria. -->
<title>${t} · Unità Pastorale Sacra Famiglia</title>
<meta name="description" content="${dsc}">
<meta name="robots" content="noindex, follow">
<link rel="canonical" href="${SITE}/vita-parrocchiale.html">
<meta property="og:type" content="article">
<meta property="og:site_name" content="Unità Pastorale Sacra Famiglia">
<meta property="og:locale" content="it_IT">
<meta property="og:title" content="${t}">
<meta property="og:description" content="${dsc}">
<meta property="og:url" content="${page}">
<meta property="og:image" content="${img}">
<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${t}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${t}">
<meta name="twitter:description" content="${dsc}">
<meta name="twitter:image" content="${img}">
<meta name="theme-color" content="#151b3c">
<link rel="icon" href="../favicon.svg" type="image/svg+xml">
<script>location.replace(${JSON.stringify(target)});</script>
<style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#151b3c;color:#fff;font:16px/1.5 system-ui,sans-serif;text-align:center;padding:24px}a{color:#dcc082}</style>
</head>
<body>
<p>${t}<br><a href="${target}">Guarda le foto sul sito dell'Unità Pastorale Sacra Famiglia</a></p>
</body>
</html>
`;
}

(async () => {
  fs.mkdirSync(OG_DIR, { recursive: true });
  fs.mkdirSync(STUB_DIR, { recursive: true });
  const keep = new Set(items.map(i => i.id));
  for (const f of fs.readdirSync(STUB_DIR)) if (!keep.has(f.replace(/\.html$/, ''))) fs.unlinkSync(path.join(STUB_DIR, f));
  for (const f of fs.readdirSync(OG_DIR)) if (!keep.has(f.replace(/\.jpg$/, ''))) fs.unlinkSync(path.join(OG_DIR, f));

  const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new' });
  const p = await b.newPage();
  await p.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
  for (const it of items) {
    await p.setContent(card(it), { waitUntil: 'load', timeout: 60000 });
    await p.evaluate(async () => { await document.fonts.ready; });
    const over = await p.evaluate(() => { const t = document.querySelector('.txt'); return t.scrollHeight > t.clientHeight + 1 || t.scrollWidth > t.clientWidth + 1; });
    const png = await p.screenshot({ type: 'png' });
    await sharp(Buffer.from(png)).jpeg({ quality: 84, mozjpeg: true, progressive: true }).toFile(path.join(OG_DIR, it.id + '.jpg'));
    fs.writeFileSync(path.join(STUB_DIR, it.id + '.html'), stub(it));
    console.log((over ? 'OVERFLOW ' : 'ok ') + it.id + ' — ' + it.title + ' (' + it.n + ' foto)');
  }
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
