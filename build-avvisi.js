// Locandine della pagina "Fede e vita": versione grande (lato max 1600) + miniatura (560w)
// in assets/img/avvisi/. Sorgenti in images/avvisi/ (gitignored).
const fs = require('fs');
const path = require('path');
const sharp = require('C:/workspace/social-image-generator/node_modules/sharp');
const SRC = path.join(__dirname, 'images', 'avvisi');
const OUT = path.join(__dirname, 'assets', 'img', 'avvisi');
// «Avvisi e celebrazioni» 31/10–2/11/2026 (896×1190): una colonna per giornata
const CROPS = [
  { src: 'celebrazioni-santi-defunti-2026.jpg', out: 'celebrazioni-santi-defunti-2026-31ott', box: { left: 40, top: 430, width: 252, height: 690 } },
  { src: 'celebrazioni-santi-defunti-2026.jpg', out: 'celebrazioni-santi-defunti-2026-1nov', box: { left: 290, top: 430, width: 320, height: 690 } },
  { src: 'celebrazioni-santi-defunti-2026.jpg', out: 'celebrazioni-santi-defunti-2026-2nov', box: { left: 608, top: 430, width: 252, height: 690 } },
];
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  for (const f of fs.readdirSync(SRC).filter(f => /\.jpe?g$/i.test(f))) {
    const base = f.replace(/\.jpe?g$/i, '');
    const img = sharp(path.join(SRC, f)).rotate();
    const m = await img.metadata();
    await img.clone().resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 82, mozjpeg: true, progressive: true }).toFile(path.join(OUT, `${base}.jpg`));
    await img.clone().resize({ width: 560, withoutEnlargement: true })
      .jpeg({ quality: 76, mozjpeg: true, progressive: true }).toFile(path.join(OUT, `${base}-t.jpg`));
    console.log('ok', base, m.width + 'x' + m.height);
  }
  // Miniature ritagliate da una locandina con più giornate: una per avviso (la locandina intera resta quella che si apre).
  for (const c of CROPS) {
    await sharp(path.join(SRC, c.src)).extract(c.box).resize({ width: 560, withoutEnlargement: true })
      .jpeg({ quality: 82, mozjpeg: true, progressive: true }).toFile(path.join(OUT, `${c.out}-t.jpg`));
    console.log('ok crop', c.out);
  }
})().catch(e => { console.error(e); process.exit(1); });
