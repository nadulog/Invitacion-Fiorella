import sharp from "sharp";

const WIDTH = 941;
const HEIGHT = 2100;
const photos = Array.from({ length: 6 }, (_, index) =>
  `public/fiorella-gallery-0${index + 1}.jpeg`,
);

async function paperPhoto(path, width, height, angle) {
  const photo = await sharp(path)
    .rotate()
    .resize(width, height, { fit: "inside", withoutEnlargement: true })
    .modulate({ saturation: 0.92, brightness: 1.02 })
    .extend({ top: 12, right: 12, bottom: 31, left: 12, background: "#fffaf6" })
    .png()
    .toBuffer();

  const shadow = await sharp(photo)
    .ensureAlpha()
    .tint("#63494b")
    .blur(11)
    .modulate({ brightness: 0.48 })
    .png()
    .toBuffer();

  const photoMeta = await sharp(photo).metadata();
  const layer = await sharp({
    create: {
      width: photoMeta.width + 40,
      height: photoMeta.height + 40,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([
      { input: shadow, left: 20, top: 25, blend: "over" },
      { input: photo, left: 14, top: 10, blend: "over" },
    ])
    .png()
    .toBuffer();

  return sharp(layer)
    .rotate(angle, { background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
}

const background = Buffer.from(`
<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="paper"><feTurbulence baseFrequency="0.72" numOctaves="3" seed="17" type="fractalNoise"/><feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 .075 0"/></filter>
    <radialGradient id="wash" cx="50%" cy="38%" r="75%"><stop offset="0" stop-color="#fbf4ee"/><stop offset="1" stop-color="#ead5ce"/></radialGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#wash)"/>
  <rect width="100%" height="100%" filter="url(#paper)" opacity=".55"/>
  <path d="M-30 180 C150 90 155 360 30 405 M970 1180 C790 1090 790 1370 925 1430" fill="none" stroke="#c99ca0" stroke-width="2" opacity=".28"/>
</svg>`);

const layers = await Promise.all([
  paperPhoto(photos[5], 730, 560, -1.3).then((input) => ({ input, left: 92, top: 55 })),
  paperPhoto(photos[1], 325, 470, -2.8).then((input) => ({ input, left: 87, top: 650 })),
  paperPhoto(photos[2], 325, 470, 2.4).then((input) => ({ input, left: 488, top: 645 })),
  paperPhoto(photos[4], 730, 560, 1.1).then((input) => ({ input, left: 90, top: 1140 })),
  paperPhoto(photos[3], 325, 420, 2.2).then((input) => ({ input, left: 92, top: 1745 })),
  paperPhoto(photos[0], 325, 420, -2.5).then((input) => ({ input, left: 488, top: 1740 })),
]);

await sharp(background)
  .composite(layers)
  .png({ compressionLevel: 9 })
  .toFile("public/07-galeria.png");
