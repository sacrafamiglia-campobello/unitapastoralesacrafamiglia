// Galleria "Messa nella Cappella gentilizia di Gesù e Maria" (4 novembre 2026, cimitero) + copertina card in evidenza.
const fs = require('fs');
const path = require('path');
const sharp = require('C:/workspace/social-image-generator/node_modules/sharp');
const SRC = path.join(__dirname, 'images', 'Messa nella Cappella Gentilizia di Gesù e Maria.  04 novembre 2026');
const OUT = path.join(__dirname, 'assets', 'img', 'gallery', 'cappella-gesu-e-maria');
// ordine: l'assemblea nella cappella (orizzontale, copertina) → benedizione → canti con la chitarra → elevazione → foto di gruppo
const ORDER = ['13a211af-a3f9-4a98-9ad3-fbcc26cc1232.jpg', '795c606c-b234-4650-92fe-d27960b6aa14.jpg',
  '06f25cd6-a46a-45b6-a0e9-c54e836c2276.jpg', '0a82736a-bd6f-4d3e-b13c-fa7c705c2963.jpg',
  'fdaa6626-8cc0-4f48-bd9a-7f5c47d1d742.jpg'];
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
  // copertina card in evidenza (larga): l'assemblea raccolta tra i loculi fiorati, il sacerdote all'altare in fondo
  await sharp(path.join(SRC, ORDER[0])).rotate().resize({ width: 1600, height: 900, fit: 'cover', position: 'centre' })
    .jpeg({ quality: 78, mozjpeg: true, progressive: true }).toFile(path.join(__dirname, 'assets', 'img', 'evento-cappella-gesu-e-maria.jpg'));
  console.log('ok cappella-gesu-e-maria:', i, 'foto');
})().catch(e => { console.error(e); process.exit(1); });
