// Galleria "Adorazione eucaristica nella cappella dell'Ospedale di Canicattì" (martedì 17 novembre 2026,
// su invito del cappellano don Gioacchino Scimè) + copertina della card in evidenza.
const fs = require('fs');
const path = require('path');
const sharp = require('C:/workspace/social-image-generator/node_modules/sharp');
const SRC = path.join(__dirname, 'images', "Adorazione nella cappella dell' Ospedale di Canicattì. Invitarti dal Cappellano Don Gioacchino Scime'. Martedì 17");
const OUT = path.join(__dirname, 'assets', 'img', 'gallery', 'adorazione-canicatti');
// ordine: preghiera davanti al Santissimo (copertina) → il Santissimo esposto → benedizione tra i fedeli → l'assemblea
//         → i fedeli tra i banchi → in preghiera → l'ostensorio sull'altare → l'altare con il Sacro Cuore.
// Escluse: b3fbf30b (mossa, di spalle) e le due foto con la persona in carrozzina (2d05d76a, 345cd740):
// in un ospedale potrebbero rivelare dati sulla salute di una persona riconoscibile.
const ORDER = ['051fbf9a-2484-4c40-9f42-5b21cb65a879.jpg', '2871f37f-0716-4e2f-a780-da119f5cefcd.jpg',
  '2858b85f-2dea-4b52-8b80-17e068a2cd67.jpg', '29d527bd-7370-48a4-a7fb-0339dea8a60c.jpg',
  'f113fd49-c572-4292-85fc-1e68f30699fb.jpg', 'a2b57cbf-167a-496b-950b-61c6e84ce21c.jpg',
  'c3b784e8-9a57-4bc7-a81d-045de58e0781.jpg', 'a84bc585-c303-46a2-b9c6-3a6ac6cc8d43.jpg'];
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
  // copertina card in evidenza (larga, da foto verticale 1200×1600): il sacerdote in preghiera accanto all'ostensorio
  await sharp(path.join(SRC, ORDER[0])).rotate().extract({ left: 0, top: 60, width: 1200, height: 675 })
    .resize({ width: 1600, height: 900 })
    .jpeg({ quality: 78, mozjpeg: true, progressive: true }).toFile(path.join(__dirname, 'assets', 'img', 'evento-adorazione-canicatti.jpg'));
  console.log('ok adorazione-canicatti:', i, 'foto');
})().catch(e => { console.error(e); process.exit(1); });
