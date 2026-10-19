// Galleria "Primo incontro con Padre Roberto sulla spiritualità carmelitana" (Chiesa di San Giuseppe) + copertina card in evidenza.
const fs = require('fs');
const path = require('path');
const sharp = require('C:/workspace/social-image-generator/node_modules/sharp');
const SRC = path.join(__dirname, 'images', 'Primo Incontro con Padre Roberto sulla Spiritualità Carmelitana');
const OUT = path.join(__dirname, 'assets', 'img', 'gallery', 'carmelitana');
// ordine: Padre Roberto all'ambone (orizzontale, copertina) → catechesi → presentazione con P. Marco → santa Messa → omelia
const ORDER = ['1be5824a-14bb-42f5-ba79-061433a34596.jpg', 'b8654a20-3eeb-49ba-95b8-60ac5ef1d953.jpg',
  'b672d3e3-60d8-47e3-9573-4ab86d50da3b.jpg', '8bf90418-aafe-48d4-beca-fc337ec3c945.jpg',
  '8c5233c8-6fe1-4c43-9c05-ccf8459bfe9a.jpg', 'b8f5ca83-6169-4910-9fbf-84b596c50436.jpg',
  'd7d2a48a-6a0b-4c14-801c-6ac14938858b.jpg', '345efb43-1183-412e-988d-e0b9052075fd.jpg',
  'a7d12d28-341b-4fcb-9a14-060f54774b4b.jpg'];
(async () => {
  fs.rmSync(OUT, { recursive: true, force: true }); fs.mkdirSync(OUT, { recursive: true });
  let i = 0;
  for (const f of ORDER) {
    i++; const nn = String(i).padStart(2, '0');
    const img = sharp(path.join(SRC, f)).rotate();
    await img.clone().resize({ width: 1400, height: 1400, fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 80, mozjpeg: true, progressive: true }).toFile(path.join(OUT, `${nn}.jpg`));
    await img.clone().resize({ width: 260, height: 195, fit: 'cover', position: 'attention' })
      .jpeg({ quality: 70, mozjpeg: true }).toFile(path.join(OUT, `${nn}-t.jpg`));
  }
  // copertina card in evidenza (larga): Padre Roberto all'ambone davanti all'altare di San Giuseppe
  await sharp(path.join(SRC, ORDER[0])).rotate().resize({ width: 1600, height: 900, fit: 'cover', position: 'centre' })
    .jpeg({ quality: 78, mozjpeg: true, progressive: true }).toFile(path.join(__dirname, 'assets', 'img', 'evento-carmelitana.jpg'));
  console.log('ok carmelitana:', i, 'foto');
})().catch(e => { console.error(e); process.exit(1); });
