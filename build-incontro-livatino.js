// Galleria "Incontro sul Beato Rosario Livatino e presentazione dei due libri" (lunedì 16 novembre 2026,
// Chiesa di San Giuseppe, con don Angelo Chillura e don Giuseppe Livatino) + copertina della card in evidenza.
const fs = require('fs');
const path = require('path');
const sharp = require('C:/workspace/social-image-generator/node_modules/sharp');
const SRC = path.join(__dirname, 'images', 'Incontro sul giudice Livatino e presentazione dei due libri. Con don Angelo Chillura e don Giuseppe Livatino.  Lunedì 16 novembre a san Giuseppe');
const OUT = path.join(__dirname, 'assets', 'img', 'gallery', 'incontro-livatino');
// ordine: i relatori davanti all'altare (copertina) → la Messa (omelia, altare) → la chiesa durante l'incontro
//         → gli interventi al microfono → l'assemblea.
// Esclusa 96e57cb4: è la locandina, già pubblicata nell'avviso di Fede e vita.
const ORDER = ['31804bd7-d4f4-4214-8a48-e73d7a789ba0.jpg', '82b78f55-bc47-46cf-866e-8591d716cff5.jpg',
  'a8e52f38-2c38-41ff-bde3-055dc20177cf.jpg', 'ed4c4b7c-b077-4f7e-8315-3787c802f927.jpg',
  'c4a2d3f7-2a7f-4720-b7bb-6cd133eada5f.jpg', '0f4cd4ce-7028-4304-9dd6-c205ad4f143e.jpg',
  '1a2ab4e1-ae60-4dd9-a984-7cdc342f85fe.jpg', '89b2ccd5-f2b0-4b0f-ac3a-a3f6086a0a3b.jpg',
  '8f67e4f2-2321-412e-ae68-f805694b17f5.jpg', 'f659ca05-ba57-47c9-9d78-123c60319969.jpg'];
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
  // copertina card in evidenza (larga, da foto verticale 1200×1600): i tre relatori davanti all'altare maggiore
  await sharp(path.join(SRC, ORDER[0])).rotate().extract({ left: 0, top: 820, width: 1200, height: 675 })
    .resize({ width: 1600, height: 900 })
    .jpeg({ quality: 78, mozjpeg: true, progressive: true }).toFile(path.join(__dirname, 'assets', 'img', 'evento-incontro-livatino.jpg'));
  console.log('ok incontro-livatino:', i, 'foto');
})().catch(e => { console.error(e); process.exit(1); });
