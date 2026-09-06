import sharp from "sharp";

const { data, info } = await sharp("public/bird-fiorella.png").ensureAlpha().raw().toBuffer({ resolveWithObject: true });
for (let i = 0; i < data.length; i += 4) {
  const r = data[i], g = data[i + 1], b = data[i + 2];
  const isGreenSprig = g > r * 1.12 && g > b * 1.08;
  const isDarkDetail = r < 92 && g < 92 && b < 92;
  const isWarmCream = r > b + 20 && r > g + 5;
  if (!isGreenSprig && !isDarkDetail && !isWarmCream) {
    const light = (r + g + b) / 3;
    const shade = Math.max(0, Math.min(1, (light - 82) / 173));
    // Rosa empolvado cálido tomado del papel de la sección “¿Venís?”.
    data[i] = Math.round(201 + 47 * shade);
    data[i + 1] = Math.round(151 + 78 * shade);
    data[i + 2] = Math.round(151 + 72 * shade);
  }
}
await sharp(data, { raw: info }).png().toFile("public/bird-pink-white.png");
await sharp(data, { raw: info }).flatten({ background: "#d5c5b7" }).png().toFile("public/bird-pink-preview.png");
