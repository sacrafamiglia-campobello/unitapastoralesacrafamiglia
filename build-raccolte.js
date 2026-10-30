// Raccolte fondi: ritaglio della statua del Cristo Risorto dalla locandina (images/raccolte/),
// coprendo i frammenti di testo della locandina col colore dello sfondo.
// Locandina attuale: versione completa del parroco (1024×1536, ricevuta il 30/10/2026);
// la precedente (screenshot del telefono) è conservata in images/raccolte/cristo-risorto-locandina-screenshot-2026-09.jpg.
const path = require('path');
const sharp = require('C:/workspace/social-image-generator/node_modules/sharp');
const SRC = path.join(__dirname, 'images', 'raccolte', 'cristo-risorto-locandina.jpg');
const OUT = path.join(__dirname, 'assets', 'img', 'raccolta-cristo-risorto.jpg');
// ritaglio attorno alla statua (dalla mano alzata al basamento)
const BOX = { left: 520, top: 228, width: 420, height: 930 };
// toppe [x, y, larghezza, altezza, colonna campione, sfumatura] in pixel del ritaglio:
// ogni riga della toppa prende il colore dello sfondo pulito nella colonna campione
// (tra il testo e la statua) e sfuma verso destra, così non restano bordi.
const PATCHES = [
  [0, 334, 60, 68, 72, 10],   // «…TO» di «CRISTO RISORTO»
  [0, 526, 92, 262, 104, 14], // riquadro beige «Insieme possiamo fare tanto…»
  [0, 800, 119, 62, 121, 4],  // filetto + «…oi lasciarlo»
];
(async () => {
  const { data, info } = await sharp(SRC).extract(BOX).raw().toBuffer({ resolveWithObject: true });
  const W = info.width, C = info.channels;
  for (const [x0, y0, w, h, sx, f] of PATCHES) {
    for (let y = y0; y < y0 + h; y++) {
      const si = (y * W + sx) * C;
      for (let x = x0; x < x0 + w; x++) {
        const i = (y * W + x) * C;
        const a = Math.max(0, Math.min(1, (x0 + w - x) / f, (y - y0 + 1) / 5, (y0 + h - y) / 5));
        for (let c = 0; c < 3; c++) data[i + c] = Math.round(data[i + c] * (1 - a) + data[si + c] * a);
      }
    }
  }
  const out = await sharp(data, { raw: info }).resize({ width: 620 })
    .jpeg({ quality: 82, mozjpeg: true, progressive: true }).toFile(OUT);
  console.log('ok', out.width + 'x' + out.height, out.size + ' B');
})().catch(e => { console.error(e); process.exit(1); });
